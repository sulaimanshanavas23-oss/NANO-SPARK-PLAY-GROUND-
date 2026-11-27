"use client";

import { motion, useReducedMotion } from "framer-motion";

function LetterReveal({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();
  const chars = Array.from(text);

  return (
    <span aria-label={text} className="inline-block">
      {chars.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          aria-hidden
          className="inline-block will-change-transform"
          style={{ transformOrigin: "50% 100%" }}
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: "0.9em", rotateX: -75 }
          }
          animate={
            reduceMotion ? undefined : { opacity: 1, y: 0, rotateX: 0 }
          }
          transition={{
            duration: 0.45,
            delay: 0.15 + index * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function CircuitBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(17,17,17,0.10) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        fill="none"
      >
        <g stroke="rgba(17,17,17,0.10)" strokeWidth="1">
          <path d="M-20 92 H220 V152 H430" />
          <path d="M980 64 H1180 V140 H1220" />
          <path d="M120 344 H360 V284 H520" />
          <path d="M760 360 H1000 V300 H1220" />
          <path className="ns-trace" d="M0 210 H300 V120 H620 V210 H900" />
        </g>
        <g fill="rgba(255,193,7,0.85)">
          <circle cx="220" cy="92" r="3" />
          <circle cx="430" cy="152" r="3" />
          <circle cx="980" cy="64" r="3" />
          <circle cx="360" cy="344" r="3" />
          <circle cx="520" cy="284" r="3" />
          <circle cx="1000" cy="360" r="3" />
          <circle cx="620" cy="120" r="3" />
        </g>
      </svg>
    </div>
  );
}

export function FeedbackHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <CircuitBackdrop />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 text-center sm:px-8 sm:py-20">
        <p className="eyebrow justify-center">
          <span className="text-[10px] text-spark-dark">&#9654;</span>
          Feedback
        </p>
        <h1 className="perspective-800 mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          <LetterReveal text="Tell us how it went" />
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/70">
          Your feedback helps us make every workshop, kit and program better for
          the next young innovator.
        </p>
      </div>
    </section>
  );
}
