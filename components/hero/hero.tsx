"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Play, Sparkles } from "lucide-react";
import { CampusExplorer } from "@/components/campus/campus-explorer";
import { buttonClass } from "@/components/shared/button";
import { cn } from "@/src/lib/utils";

function LetterReveal({
  text,
  className,
  delay = 0,
  reduced,
}: {
  text: string;
  className?: string;
  delay?: number;
  reduced: boolean;
}) {
  return (
    <span className={cn("inline-flex flex-wrap justify-center", className)} aria-label={text}>
      {text.split("").map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          aria-hidden="true"
          initial={reduced ? false : { y: "0.7em", opacity: 0, rotate: 4 }}
          animate={reduced ? undefined : { y: 0, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.7,
            delay: delay + index * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-spark-light/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-52 h-72 w-72 rounded-full bg-spark-yellow/15 blur-3xl" />

      <div className="container-wide relative pt-8 sm:pt-14 lg:pt-16">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={reduced ? false : { y: 14, opacity: 0 }}
            animate={reduced ? undefined : { y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-spark-dark/25 bg-spark-yellow/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-spark-yellow">
              <Sparkles className="h-3 w-3" />
            </span>
            Nano Playground · Nano Spark
          </motion.div>

          <h1 className="text-display-hero mt-6 text-balance font-display font-extrabold">
            <motion.span
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="block text-ink"
            >
              Welcome to
            </motion.span>
            <span className="relative mt-1 block text-spark-dark">
              <LetterReveal
                text="Nano Playground"
                delay={0.22}
                reduced={reduced}
              />
            </span>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mx-auto mt-6 max-w-3xl font-display text-[clamp(1.05rem,0.85vw+0.85rem,1.7rem)] font-semibold leading-tight text-ink sm:mt-8"
          >
            Learn. Build. Experiment. Debug.{" "}
            <span className="relative inline-block text-spark-dark">
              Innovate.
              <span className="absolute inset-x-0 bottom-0.5 -z-10 h-2.5 bg-spark-yellow/40" />
            </span>{" "}
            Solve.
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.84 }}
            className="mx-auto mt-4 max-w-2xl text-pretty text-[clamp(0.875rem,0.25vw+0.8rem,1.05rem)] leading-relaxed text-ink-muted"
          >
            One platform. Seven interactive labs. Endless learning. Explore
            electronics, microcontrollers, networking, robotics, AI and
            real-world technology experiments.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.92 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/playground"
              className={buttonClass("primary", "lg", "w-full sm:w-auto")}
            >
              <Play className="h-4 w-4 fill-current" />
              EXPLORE PLAYGROUND
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tools"
              className={buttonClass("outline", "lg", "w-full sm:w-auto")}
            >
              DISCOVER TOOLS
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10.5px] text-ink-muted"
          >
            {["7 labs live", "No setup required", "Official Nano Spark platform"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-spark-dark" />
                  {item}
                </span>
              ),
            )}
          </motion.div>
        </div>

        <motion.div
          id="campus"
          initial={reduced ? false : { opacity: 0, y: 34 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-10 sm:mt-12"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-spark-dark" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
                The interactive campus
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-ink-muted/60">
              Isometric · Real-time 3D
            </span>
          </div>
          <CampusExplorer />
        </motion.div>
      </div>
    </section>
  );
}
