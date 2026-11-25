"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  FileText,
  FolderOpen,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  XCircle,
} from "lucide-react";
import { buttonClass } from "@/components/shared/button";
import {
  extractSource,
  generateQuiz,
  isAnswerCorrect,
  type ExtractedSource,
  type ExtractionProgress,
  type QuizQuestion,
} from "@/src/lib/quiz";
import { cn } from "@/src/lib/utils";

type Stage = "upload" | "quiz" | "results";

const QUESTION_COUNTS = [5, 10, 15];

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function QuizGenerator() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [extracted, setExtracted] = useState<ExtractedSource[]>([]);
  const [progress, setProgress] = useState<ExtractionProgress[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [count, setCount] = useState(10);
  const [types, setTypes] = useState<("mcq" | "blank")[]>(["mcq", "blank"]);
  const [stage, setStage] = useState<Stage>("upload");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    folderInputRef.current?.setAttribute("webkitdirectory", "");
    folderInputRef.current?.setAttribute("directory", "");
  }, []);

  const totalWords = extracted.reduce((sum, source) => sum + source.words, 0);

  function addFiles(incoming: FileList | File[]) {
    const accepted = Array.from(incoming).filter((file) => {
      const name = file.name.toLowerCase();
      return (
        file.type === "application/pdf" ||
        file.type.startsWith("image/") ||
        file.type.startsWith("text/") ||
        /\.(pdf|png|jpe?g|webp|bmp|txt|md|markdown|csv)$/.test(name)
      );
    });
    if (!accepted.length) {
      setError("Add a PDF, image, text or markdown file to generate a quiz.");
      return;
    }
    setError(null);
    setFiles((current) => {
      const keys = new Set(current.map(fileKey));
      return [...current, ...accepted.filter((file) => !keys.has(fileKey(file)))];
    });
    setExtracted([]);
    setProgress([]);
    setStage("upload");
  }

  function removeFile(file: File) {
    setFiles((current) => current.filter((item) => fileKey(item) !== fileKey(file)));
    setExtracted([]);
    setProgress([]);
  }

  async function readAll() {
    if (!files.length) {
      setError("Add at least one document first.");
      return;
    }
    setBusy(true);
    setError(null);
    const results: ExtractedSource[] = [];
    const states: ExtractionProgress[] = files.map((file) => ({
      file: file.name,
      status: "reading",
    }));
    setProgress(states);

    for (const file of files) {
      const source = await extractSource(file, (update) => {
        setProgress((current) =>
          current.map((item) =>
            item.file === update.file ? { ...item, ...update } : item,
          ),
        );
      });
      if (source) results.push(source);
    }

    setExtracted(results);
    setBusy(false);
    if (!results.length) {
      setError(
        "We could not read any text. Scanned PDFs need to be OCR'd first — or upload the page as an image.",
      );
    }
  }

  async function buildQuiz() {
    if (types.length === 0) {
      setError("Choose at least one question type.");
      return;
    }
    setBusy(true);
    setError(null);
    let pool = extracted;
    if (!pool.length) {
      const results: ExtractedSource[] = [];
      for (const file of files) {
        const source = await extractSource(file);
        if (source) results.push(source);
      }
      pool = results;
      setExtracted(results);
    }
    if (!pool.length) {
      setBusy(false);
      setError("We could not read any text from these files.");
      return;
    }
    const generated = generateQuiz(pool, count, types);
    setBusy(false);
    if (!generated.length) {
      setError(
        "This document is too short to build questions. Try a longer document or add another file.",
      );
      return;
    }
    setQuestions(generated);
    setAnswers({});
    setSubmitted(false);
    setStage("quiz");
  }

  function restart() {
    setStage("upload");
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setError(null);
  }

  const score = questions.filter(
    (question) => isAnswerCorrect(question, answers[question.id] ?? ""),
  ).length;

  return (
    <div className="container-wide">
      <div className="mx-auto max-w-5xl">
        {stage === "upload" && (
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                addFiles(event.dataTransfer.files);
              }}
              className={cn(
                "rounded-[28px] border-2 border-dashed bg-white p-6 transition-colors sm:p-8",
                dragging
                  ? "border-spark-dark bg-spark-yellow/10"
                  : "border-ink/15",
              )}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-spark-yellow text-ink">
                <Upload className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold">
                Drop your notes here
              </h2>
              <p className="mt-2 max-w-md text-[13px] leading-relaxed text-ink-muted">
                Upload a PDF, an image of a page, a text file — or a whole
                folder. The generator reads the source, then builds multiple
                choice and fill-in-the-blank questions from it.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={buttonClass("primary", "sm")}
                >
                  <FileText className="h-3.5 w-3.5" /> Choose files
                </button>
                <button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  className={buttonClass("outline", "sm")}
                >
                  <FolderOpen className="h-3.5 w-3.5" /> Choose folder
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.md,.markdown,.csv,image/*,application/pdf"
                className="hidden"
                onChange={(event) => {
                  if (event.target.files) addFiles(event.target.files);
                  event.target.value = "";
                }}
              />
              <input
                ref={folderInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.md,.markdown,.csv,image/*,application/pdf"
                className="hidden"
                onChange={(event) => {
                  if (event.target.files) addFiles(event.target.files);
                  event.target.value = "";
                }}
              />
              <p className="mt-4 text-[10.5px] text-ink-muted/70">
                Files stay in your browser. Nothing is uploaded to a server.
              </p>
            </div>

            <div className="flex flex-col rounded-[28px] border border-ink/10 bg-white p-5 sm:p-6">
              <h3 className="font-display text-lg font-semibold">Quiz settings</h3>
              <p className="mt-1 text-[11.5px] text-ink-muted">
                Choose how many questions to generate.
              </p>
              <div className="mt-4 flex gap-2">
                {QUESTION_COUNTS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCount(value)}
                    className={cn(
                      "flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
                      count === value
                        ? "border-ink bg-ink text-white"
                        : "border-ink/10 text-ink-muted hover:border-ink/30",
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted/70">
                Question types
              </p>
              <div className="mt-2 grid gap-2">
                {[
                  { id: "mcq" as const, label: "Multiple choice (MCQ)" },
                  { id: "blank" as const, label: "Fill in the blanks" },
                ].map((option) => {
                  const active = types.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setTypes((current) =>
                          current.includes(option.id)
                            ? current.filter((item) => item !== option.id)
                            : [...current, option.id],
                        )
                      }
                      className={cn(
                        "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[12px] font-medium transition-colors",
                        active
                          ? "border-spark-dark/50 bg-spark-yellow/10 text-ink"
                          : "border-ink/10 text-ink-muted hover:border-ink/25",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded border",
                          active
                            ? "border-spark-dark bg-spark-dark text-white"
                            : "border-ink/20",
                        )}
                      >
                        {active && <CheckCircle2 className="h-3 w-3" />}
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {files.length > 0 && (
                <button
                  type="button"
                  onClick={buildQuiz}
                  disabled={busy}
                  className={cn(buttonClass("primary", "md"), "mt-5 w-full")}
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Reading…
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" /> Generate quiz
                    </>
                  )}
                </button>
              )}
              {extracted.length > 0 && (
                <p className="mt-2 text-center text-[10.5px] text-ink-muted">
                  {totalWords.toLocaleString()} words read from {files.length}{" "}
                  file{files.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>
        )}

        {stage === "upload" && files.length > 0 && (
          <div className="mt-4 rounded-[24px] border border-ink/10 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted/70">
                Sources · {files.length}
              </p>
              <button
                type="button"
                onClick={readAll}
                disabled={busy}
                className="text-[11px] font-semibold text-ink-muted hover:text-ink"
              >
                Re-read text
              </button>
            </div>
            <ul className="mt-3 grid gap-2">
              {files.map((file) => {
                const state = progress.find((item) => item.file === file.name);
                return (
                  <li
                    key={fileKey(file)}
                    className="flex items-center gap-3 rounded-xl border border-ink/[0.07] bg-warm/50 px-3 py-2.5"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-ink-muted" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-medium">
                        {file.name}
                      </span>
                      <span className="block text-[10px] text-ink-muted">
                        {(file.size / 1024).toFixed(0)} KB
                        {state?.status === "done" && ` · ${state.message}`}
                        {state?.status === "ocr" && " · reading image text…"}
                        {state?.status === "reading" && " · queued"}
                      </span>
                      {state?.status === "error" && (
                        <span className="mt-0.5 flex items-center gap-1 text-[10px] text-red-500">
                          <CircleAlert className="h-3 w-3" /> {state.message}
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(file)}
                      className="rounded-full p-1.5 text-ink-muted/60 transition-colors hover:bg-white hover:text-ink"
                      aria-label={`Remove ${file.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
            {totalWords > 0 && (
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Ready · {totalWords.toLocaleString()}{" "}
                words extracted
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} aria-label="Dismiss">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}

        {stage === "quiz" && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark-dark" />
                  Generated from {extracted.length} source
                  {extracted.length === 1 ? "" : "s"}
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold">
                  Your quiz · {questions.length} questions
                </h2>
                <p className="mt-1 text-[12px] text-ink-muted">
                  {questions.filter((question) => question.type === "mcq").length} multiple
                  choice ·{" "}
                  {questions.filter((question) => question.type === "blank").length}{" "}
                  fill in the blanks
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={buildQuiz}
                  disabled={busy}
                  className={buttonClass("outline", "sm")}
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                </button>
                <button
                  type="button"
                  onClick={restart}
                  className={buttonClass("ghost", "sm")}
                >
                  <Plus className="h-3.5 w-3.5" /> New source
                </button>
              </div>
            </div>

            <ol className="mt-6 space-y-3">
              {questions.map((question, index) => {
                const response = answers[question.id] ?? "";
                const correct = submitted && isAnswerCorrect(question, response);
                return (
                  <li
                    key={question.id}
                    className={cn(
                      "rounded-2xl border bg-white p-4 transition-colors sm:p-5",
                      submitted
                        ? correct
                          ? "border-emerald-300"
                          : "border-red-300"
                        : "border-ink/[0.08]",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink text-[11px] font-bold text-spark-yellow">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-medium leading-relaxed">
                          {question.prompt}
                        </p>

                        {question.type === "mcq" && question.options ? (
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {question.options.map((option) => {
                              const selected = response === option;
                              const isRight = option === question.answer;
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  disabled={submitted}
                                  onClick={() =>
                                    setAnswers((current) => ({
                                      ...current,
                                      [question.id]: option,
                                    }))
                                  }
                                  className={cn(
                                    "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[12px] transition-colors disabled:cursor-default",
                                    submitted && isRight
                                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                      : submitted && selected
                                        ? "border-red-300 bg-red-50 text-red-700"
                                        : selected
                                          ? "border-spark-dark bg-spark-yellow/15 text-ink"
                                          : "border-ink/10 text-ink-muted hover:border-ink/25 hover:text-ink",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                      selected
                                        ? "border-spark-dark bg-spark-dark"
                                        : "border-ink/20",
                                    )}
                                  >
                                    {selected && (
                                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    )}
                                  </span>
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <input
                            value={response}
                            disabled={submitted}
                            onChange={(event) =>
                              setAnswers((current) => ({
                                ...current,
                                [question.id]: event.target.value,
                              }))
                            }
                            placeholder="Type the missing word or phrase"
                            className="mt-3 w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-[12.5px] outline-none transition-colors placeholder:text-ink-muted/50 focus:border-spark-dark"
                          />
                        )}

                        {submitted && (
                          <p className="mt-2.5 text-[11px]">
                            {correct ? (
                              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                              </span>
                            ) : (
                              <span className="inline-flex flex-wrap items-center gap-1.5 text-red-600">
                                <XCircle className="h-3.5 w-3.5" />
                                Answer: <strong>{question.answer}</strong>
                              </span>
                            )}
                            <span className="ml-2 text-ink-muted/60">
                              from {question.source}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="sticky bottom-3 z-10 mt-5">
              {!submitted ? (
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(true);
                    setStage("results");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={cn(buttonClass("dark", "lg"), "w-full shadow-card")}
                >
                  Check answers <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-spark-yellow text-ink">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display text-lg font-bold">
                        Score: {score} / {questions.length}
                      </p>
                      <p className="text-[11px] text-ink-muted">
                        {Math.round((score / questions.length) * 100)}% · review
                        the answers above
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAnswers({});
                        setSubmitted(false);
                        setStage("quiz");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={buttonClass("outline", "sm")}
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Try again
                    </button>
                    <button
                      type="button"
                      onClick={restart}
                      className={buttonClass("primary", "sm")}
                    >
                      <Plus className="h-3.5 w-3.5" /> New quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/[0.07] bg-warm/60 px-4 py-3 text-[11px] text-ink-muted">
          <p className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-spark-dark" />
            Questions are generated locally from your own documents — no account
            needed.
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-1 font-semibold text-ink hover:text-spark-dark"
          >
            Keep learning <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
