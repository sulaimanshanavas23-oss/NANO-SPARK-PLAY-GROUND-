"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function FeedbackSectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="text-center">
      <p className="eyebrow justify-center">
        <span className="text-[10px] text-spark-dark">&#9654;</span>
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1.5 w-16 overflow-hidden rounded-full">
        <motion.div
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={reduceMotion ? undefined : { scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full origin-left rounded-full bg-gradient-to-r from-spark-dark to-spark-light"
        />
      </div>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-ink/65">
          {description}
        </p>
      )}
    </div>
  );
}
