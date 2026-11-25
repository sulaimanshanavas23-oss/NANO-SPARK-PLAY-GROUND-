import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpenCheck, FileText, Layers, Sparkles } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Marquee } from "@/components/shared/marquee";
import { QuizGenerator } from "@/components/quiz/quiz-generator";
import { buttonClass } from "@/components/shared/button";
import { assets } from "@/src/lib/assets";

export const metadata: Metadata = {
  title: "Quiz Generator",
  description:
    "Turn a PDF, image or folder of notes into a multiple-choice and fill-in-the-blank quiz in one click. Generated in your browser from your own source material.",
};

const steps = [
  {
    icon: FileText,
    title: "Add a source",
    body: "PDF, image, text or a whole folder of class notes.",
  },
  {
    icon: Sparkles,
    title: "Generate",
    body: "The text is read locally and turned into questions with answers.",
  },
  {
    icon: BookOpenCheck,
    title: "Practise",
    body: "Answer, check your score and review every explanation.",
  },
];

export default function QuizPage() {
  return (
    <>
      <PageHero
        eyebrow="Quiz generator · from your own notes"
        title={
          <>
            Turn any document into a{" "}
            <span className="text-spark-dark">quiz.</span>
          </>
        }
        description="Upload a PDF, a photo of a page or a folder of notes. Nano Playground reads the source and builds multiple-choice and fill-in-the-blank questions you can practise immediately."
        image={assets.images.classroom}
        imageAlt="A Nano Spark classroom session used as a study source"
        compact
        actions={
          <>
            <Link href="#generator" className={buttonClass("primary")}>
              <Layers className="h-4 w-4" /> Start generating
            </Link>
            <Link href="/learn" className={buttonClass("outline")}>
              See the learning pathway
            </Link>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-ink/[0.07] bg-white/80 p-3.5 backdrop-blur"
            >
              <step.icon className="h-4 w-4 text-spark-dark" />
              <p className="mt-2 font-display text-[13px] font-semibold">
                {step.title}
              </p>
              <p className="mt-0.5 text-[10.5px] leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </PageHero>

      <Marquee
        tone="yellow"
        items={[
          "PDF",
          "JPG",
          "PNG",
          "TXT",
          "Markdown",
          "Folders",
          "Multiple choice",
          "Fill in the blanks",
          "Instant score",
        ]}
      />

      <section id="generator" className="section-pad scroll-mt-24">
        <QuizGenerator />
      </section>

      <section className="bg-warm section-pad">
        <div className="container-wide mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-ink/10">
              <Image
                src={assets.images.toolsLearning}
                alt="Students working with notes and technology in their hands"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="eyebrow">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark-dark" />
                How it reads your files
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight">
                Your notes never leave the browser.
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">
                PDF text is extracted page by page, images are read with
                on-device optical character recognition, and plain text files are
                read directly. The quiz is then built from the sentences and key
                terms the document actually contains.
              </p>
              <ul className="mt-5 space-y-2 text-[12.5px] text-ink-muted">
                {[
                  "Scanned pages work through image OCR",
                  "Add several files or a folder to cover a whole unit",
                  "Every answer points back to the file it came from",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-spark-dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
