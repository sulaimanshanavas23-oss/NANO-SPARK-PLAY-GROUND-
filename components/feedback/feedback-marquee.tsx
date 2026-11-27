"use client";

import { FeedbackSectionHeading } from "@/components/feedback/feedback-section-heading";
import { cn } from "@/src/lib/utils";

type Voice = {
  quote: string;
  name: string;
  role: "TEACHER" | "STUDENT" | "PARENT";
  detail: string;
};

const voices: Voice[] = [
  {
    quote:
      "The Arduino session turned a boring theory class into something my students actually look forward to.",
    name: "Priya Raman",
    role: "TEACHER",
    detail: "Robotics Workshop · Grade 8",
  },
  {
    quote:
      "I built my first blinking circuit in one afternoon. I did not know I could do that.",
    name: "Arjun K.",
    role: "STUDENT",
    detail: "Intro to Electronics · Age 14",
  },
  {
    quote:
      "My daughter came home talking about sensors and breadboards. That never happens.",
    name: "Meena S.",
    role: "PARENT",
    detail: "STEM Lab Program · Chennai",
  },
  {
    quote:
      "Clear instructions, real kits and mentors who actually answer questions. A rare combination.",
    name: "Vikram N.",
    role: "TEACHER",
    detail: "IoT Bootcamp · Higher Secondary",
  },
  {
    quote:
      "The ESP32 project was hard, but finishing it felt amazing.",
    name: "Sneha P.",
    role: "STUDENT",
    detail: "IoT Bootcamp · Age 16",
  },
  {
    quote:
      "Watching my son explain a circuit to me was worth every rupee.",
    name: "Ravi M.",
    role: "PARENT",
    detail: "Weekend Robotics Club · Chennai",
  },
];

const roleStyles: Record<Voice["role"], string> = {
  TEACHER: "bg-spark-yellow text-ink",
  STUDENT: "bg-ink text-spark-yellow",
  PARENT: "bg-ink/10 text-ink",
};

function VoiceChip({ voice }: { voice: Voice }) {
  return (
    <figure className="flex w-[280px] max-w-[360px] shrink-0 flex-col rounded-2xl border border-ink/10 bg-white p-5 shadow-soft sm:w-[320px]">
      <blockquote className="text-[13px] italic leading-relaxed text-ink/80">
        &ldquo;{voice.quote}&rdquo;
      </blockquote>
      <div className="mt-4 border-t border-ink/10 pt-3">
        <p className="font-display text-[14px] font-bold text-ink">
          {voice.name}
        </p>
        <span
          className={cn(
            "mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em]",
            roleStyles[voice.role],
          )}
        >
          {voice.role}
        </span>
        <p className="mt-1.5 text-[10.5px] text-ink-muted">{voice.detail}</p>
      </div>
    </figure>
  );
}

function VoiceGroup({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex gap-4 pr-4"
      aria-hidden={ariaHidden || undefined}
    >
      {voices.map((voice) => (
        <VoiceChip key={`${voice.name}-${ariaHidden ? "b" : "a"}`} voice={voice} />
      ))}
    </div>
  );
}

export function FeedbackMarquee() {
  return (
    <section className="bg-spark-yellow/15 py-14">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <FeedbackSectionHeading
          eyebrow="Voices from our workshops"
          title="Feedback that floats in from students & parents"
          highlight={["students", "parents"]}
          description="We've attended Nano Spark workshops and gained valuable experience — from our first introduction to electronics to building complete projects."
        />
      </div>

      <div className="mask-fade-x relative mt-10 overflow-hidden">
        <div className="ns-marquee-track flex w-max will-change-transform">
          <VoiceGroup />
          <VoiceGroup ariaHidden />
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-6xl px-6 text-center font-display text-xl font-bold text-ink sm:px-8 sm:text-2xl">
        2,000+ <span className="text-spark-dark">students trained</span> and
        counting!
      </p>
    </section>
  );
}
