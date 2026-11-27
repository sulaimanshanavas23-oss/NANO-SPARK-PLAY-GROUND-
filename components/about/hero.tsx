"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CircuitBackground } from "@/components/about/circuit-background";
import { LetterReveal } from "@/components/shared/reveal";

const pills = ["MSME Registered", "StartupTN Recognized"];

export function AboutHero() {
  const reduceMotion = useReducedMotion();
  const hover = reduceMotion ? undefined : { scale: 1.02 };
  const tap = reduceMotion ? undefined : { scale: 0.97 };

  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <CircuitBackground tone="dark" className="opacity-60" dense />
      <div className="relative mx-auto w-full max-w-6xl px-6 text-center sm:px-8">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="ns-eyebrow justify-center text-spark-light/90"
        >
          <span aria-hidden className="text-[10px] text-spark-yellow">
            &#9654;
          </span>
          ABOUT US
        </motion.p>

        <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
          <LetterReveal
            text="About Nano Spark"
            highlightWords={["Nano", "Spark"]}
            delay={0.12}
          />
        </h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base"
        >
          Nano Spark — TECHNOLOGY · INNOVATIONS · SOLUTIONS. A technology and
          STEM innovation startup from Chennai, making hands-on tech education
          real for students and schools.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          {pills.map((pill) => (
            <span key={pill} className="ns-trust-pill">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-spark-yellow" />
              {pill}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <motion.a
            href="#founder"
            whileHover={hover}
            whileTap={tap}
            className="ns-btn ns-btn-yellow w-full sm:w-auto"
          >
            Meet the Founder
            <ArrowRight className="h-4 w-4" />
          </motion.a>
          <motion.a
            href="#vision"
            whileHover={hover}
            whileTap={tap}
            className="ns-btn ns-btn-outline-light w-full sm:w-auto"
          >
            Founder&apos;s Vision
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
