export type QuizQuestion = {
  id: string;
  type: "mcq" | "blank";
  prompt: string;
  options?: string[];
  answer: string;
  source: string;
};

const STOPWORDS = new Set(
  `a an the and or but if then than that this these those of in on at to for from with within without by as is are was were be been being it its their there here we you they he she i not no can could should would must may might will do does did doing have has had having about into over under between across per each other such only also more most some any all both few many much very just so while when where which who whom whose what how why because however therefore thus using used use through during before after above below up down out off again further once same own too s t don now`.split(
    /\s+/,
  ),
);

export type ExtractionProgress = {
  file: string;
  status: "reading" | "ocr" | "done" | "error";
  message?: string;
};

export type ExtractedSource = {
  name: string;
  text: string;
  words: number;
};

function clean(text: string) {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

async function extractPdf(file: File) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
  const buffer = await file.arrayBuffer();
  const document = await pdfjs.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(line);
    page.cleanup();
  }
  await document.destroy();
  return clean(pages.join("\n\n"));
}

async function extractImage(file: File) {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  try {
    const { data } = await worker.recognize(file);
    return clean(data.text);
  } finally {
    await worker.terminate();
  }
}

export async function extractSource(
  file: File,
  onProgress?: (progress: ExtractionProgress) => void,
): Promise<ExtractedSource | null> {
  const isPdf =
    file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  const isImage =
    file.type.startsWith("image/") || /\.(png|jpe?g|webp|bmp)$/i.test(file.name);
  const isText =
    file.type.startsWith("text/") ||
    /\.(txt|md|markdown|csv|json)$/i.test(file.name);

  try {
    const text = isPdf
      ? await extractPdf(file)
      : isImage
        ? (onProgress?.({ file: file.name, status: "ocr" }),
          await extractImage(file))
        : isText
          ? await file.text()
          : "";

    const normalized = clean(text);
    const words = countWords(normalized);
    if (!normalized) {
      onProgress?.({
        file: file.name,
        status: "error",
        message: isImage
          ? "No readable text found in this image."
          : "No selectable text found — the document may be scanned.",
      });
      return null;
    }
    onProgress?.({
      file: file.name,
      status: "done",
      message: `${words.toLocaleString()} words`,
    });
    return { name: file.name, text: normalized, words };
  } catch (error) {
    onProgress?.({
      file: file.name,
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not read this file.",
    });
    return null;
  }
}

export function countWords(text: string) {
  return (text.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g) ?? []).length;
}

function normaliseAnswer(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isAnswerCorrect(question: QuizQuestion, response: string) {
  if (!response.trim()) return false;
  const expected = normaliseAnswer(question.answer);
  const given = normaliseAnswer(response);
  return given === expected || (given.length > 3 && expected.includes(given));
}

function tokenise(text: string) {
  return text.match(/[A-Za-z][A-Za-z0-9'-]+/g) ?? [];
}

function keywordsFrom(text: string) {
  const scores = new Map<string, { display: string; score: number }>();
  const tokens = tokenise(text);
  tokens.forEach((token, index) => {
    const word = token.toLowerCase();
    if (word.length < 4 || STOPWORDS.has(word) || /^\d+$/.test(word)) return;
    const capitalised = index === 0 || /[A-Z]/.test(token[0]);
    const existing = scores.get(word);
    const score = (existing?.score ?? 0) + 1 + (capitalised ? 0.4 : 0);
    scores.set(word, {
      display: existing?.display ?? token,
      score,
    });
  });
  return [...scores.entries()]
    .map(([word, value]) => ({ word, display: value.display, score: value.score }))
    .sort((a, b) => b.score - a.score);
}

function splitSentences(text: string) {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter(
      (sentence) =>
        sentence.length >= 60 &&
        sentence.length <= 320 &&
        countWords(sentence) >= 9 &&
        !sentence.endsWith(":"),
    );
}

function stemWithAnswer(sentence: string, answer: string) {
  const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escaped}\\b`, "i");
  if (!pattern.test(sentence)) return null;
  const stem = sentence.replace(pattern, "_____");
  if (stem === sentence) return null;
  return stem;
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function generateQuiz(
  sources: ExtractedSource[],
  count: number,
  types: ("mcq" | "blank")[],
): QuizQuestion[] {
  if (!sources.length) return [];
  const combined = sources.map((source) => source.text).join("\n\n");
  const keywords = keywordsFrom(combined);
  const keywordPool = keywords.map((item) => item.word);
  const sentences = shuffle(splitSentences(combined));

  const questions: QuizQuestion[] = [];
  const seen = new Set<string>();

  for (const sentence of sentences) {
    if (questions.length >= count) break;
    const candidates = keywords.filter(
      (item) =>
        item.word.length >= 4 &&
        new RegExp(`\\b${item.word}\\b`, "i").test(sentence),
    );
    if (!candidates.length) continue;

    const chosen = candidates[Math.floor(Math.random() * Math.min(3, candidates.length))];
    const stem = stemWithAnswer(sentence, chosen.display);
    if (!stem || seen.has(stem)) continue;

    const type =
      types.length === 0
        ? "mcq"
        : types[Math.floor(Math.random() * types.length)];
    const sourceMatch = sources.find((source) =>
      source.text.includes(sentence.slice(0, 40)),
    );

    if (type === "mcq") {
      const distractors = keywordPool
        .filter(
          (word) =>
            word !== chosen.word &&
            Math.abs(word.length - chosen.word.length) <= 5,
        )
        .slice(0, 12);
      const picked = shuffle(distractors).slice(0, 3);
      if (picked.length < 3) continue;
      const options = shuffle([
        chosen.display,
        ...picked.map(
          (word) =>
            candidates.find((item) => item.word === word)?.display ?? word,
        ),
      ]);
      questions.push({
        id: `q-${questions.length + 1}`,
        type: "mcq",
        prompt: `Which term completes this statement? “${stem}”`,
        options,
        answer: chosen.display,
        source: sourceMatch?.name ?? "Your document",
      });
    } else {
      questions.push({
        id: `q-${questions.length + 1}`,
        type: "blank",
        prompt: `Fill in the blank: “${stem}”`,
        answer: chosen.display,
        source: sourceMatch?.name ?? "Your document",
      });
    }
    seen.add(stem);
  }

  return questions;
}
