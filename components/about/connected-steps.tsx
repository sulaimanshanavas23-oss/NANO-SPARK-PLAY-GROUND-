"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { AboutSectionHeading } from "@/components/about/section-heading";
import { WordReveal } from "@/components/shared/reveal";

const steps = [
  "STEM EDUCATION",
  "HANDS-ON PROJECTS",
  "ROBOTICS & TECHNOLOGY",
  "INNOVATION",
  "PROTOTYPE DEVELOPMENT",
  "ENTREPRENEURSHIP",
];

export function ConnectedSteps() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 78%", "end 58%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });

  return (
    <section className="relative overflow-hidden bg-spark-yellow/15 py-20">
      <div aria-hidden className="ns-dot-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto w-full max-w-5xl px-6 sm:px-8">
        <AboutSectionHeading
          eyebrow="THE ROAD AHEAD"
          title={
            <WordReveal text="BUILDING TOWARDS A BIGGER VISION" />
          }
          description="Nano Spark aims to grow beyond STEM kits into a broader STEM and innovation ecosystem — every stage connecting to the next, from first spark to real-world venture."
        />

        <div ref={trackRef} className="relative mt-14">
          <div
            aria-hidden
            className="absolute bottom-0 left-7 top-0 w-[3px] -translate-x-1/2 rounded-full bg-ink/10"
          />
          <motion.div
            aria-hidden
            className="ns-gold-rule absolute bottom-0 left-7 top-0 w-[3px] -translate-x-1/2 origin-top rounded-full"
            style={{ scaleY: reduceMotion ? 1 : progress }}
          />

          <ol className="space-y-5">
            {steps.map((step, index) => (
              <li key={step} className="relative flex items-center gap-5">
                <motion.div
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, scale: 0.5, rotate: -100 }
                  }
                  whileInView={
                    reduceMotion
                      ? undefined
                      : { opacity: 1, scale: 1, rotate: 0 }
                  }
                  viewport={{ once: false, margin: "-60px" }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                    delay: index * 0.08,
                  }}
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-spark-yellow bg-ink font-display text-lg font-extrabold text-spark-yellow shadow-soft"
                >
                  {index + 1}
                </motion.div>

                <motion.div
                  initial={
                    reduceMotion ? false : { opacity: 0, x: 24 }
                  }
                  whileInView={
                    reduceMotion ? undefined : { opacity: 1, x: 0 }
                  }
                  viewport={{ once: false, margin: "-60px" }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08 + 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex-1 rounded-2xl border border-ink/10 bg-warm px-5 py-4 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift sm:px-6 sm:py-5"
                >
                  <p className="font-display text-base font-extrabold tracking-wide text-ink sm:text-lg">
                    {step}
                  </p>
                </motion.div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 text-center">
          <p className="font-display text-lg font-extrabold text-ink sm:text-xl">
            S. Shanavas · Founder &amp; CEO, Nano Spark
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/60">
            TECHNOLOGY · INNOVATIONS · SOLUTIONS
          </p>
        </div>
      </div>
    </section>
  );
}
