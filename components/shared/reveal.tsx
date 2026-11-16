"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function WordReveal({
  text,
  highlight = [],
  className,
  delay = 0,
}: {
  text: string;
  highlight?: string[];
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      {words.map((word, index) => {
        const isHighlighted = highlight.includes(
          word.replace(/[.,!]/g, "").toLowerCase(),
        );
        return (
          <span key={`${word}-${index}`} className="mr-[0.26em] inline-block overflow-hidden py-[0.06em]">
            <motion.span
              className={cn(
                "inline-block",
                isHighlighted && "text-spark-dark",
              )}
              initial={reduceMotion ? false : { y: "110%", opacity: 0 }}
              animate={reduceMotion ? undefined : { y: "0%", opacity: 1 }}
              transition={{
                duration: 0.7,
                delay: delay + index * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
