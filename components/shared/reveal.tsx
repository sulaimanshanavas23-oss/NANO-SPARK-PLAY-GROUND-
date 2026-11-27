"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export function Reveal({
  children,
  delay = 0,
  y = 28,
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
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function isHighlighted(word: string, highlight: string[]) {
  const clean = word.replace(/[.,!?;:"]/g, "").toLowerCase();
  return highlight.some((item) => item.toLowerCase() === clean);
}

export function WordReveal({
  text,
  highlight = [],
  highlightWords,
  className,
  delay = 0,
  once = false,
}: {
  text: string;
  highlight?: string[];
  highlightWords?: string[];
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  const marks = highlightWords ?? highlight;

  return (
    <span
      className={cn("inline-flex flex-wrap", className)}
      data-ns-reveal="off"
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="mr-[0.26em] inline-block overflow-hidden pb-[0.12em] [margin-bottom:-0.12em]"
        >
          <motion.span
            className={cn(
              "inline-block will-change-transform",
              isHighlighted(word, marks) && "text-spark-dark",
            )}
            initial={
              reduceMotion ? false : { y: "115%", rotate: 4, opacity: 0 }
            }
            whileInView={
              reduceMotion ? undefined : { y: "0%", rotate: 0, opacity: 1 }
            }
            viewport={{ once, margin: "-60px 0px -12% 0px" }}
            transition={{
              duration: 0.7,
              delay: delay + index * 0.09,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function LetterReveal({
  text,
  highlightWords = [],
  className,
  delay = 0,
}: {
  text: string;
  highlightWords?: string[];
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  let letterIndex = 0;

  return (
    <span
      aria-label={text}
      data-ns-reveal="off"
      className={cn("inline-block", className)}
    >
      {words.map((word, wordIndex) => {
        const highlighted = isHighlighted(word, highlightWords);
        return (
          <span key={`${word}-${wordIndex}`} className="inline-block">
            <span
              aria-hidden
              className={cn(
                "inline-block whitespace-nowrap perspective-800",
                highlighted && "text-spark-yellow",
              )}
            >
              {Array.from(word).map((char, charIndex) => {
                const index = letterIndex++;
                return (
                  <motion.span
                    key={`${char}-${charIndex}`}
                    className="inline-block will-change-transform"
                    style={{ transformOrigin: "50% 100%" }}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: "0.9em", rotateX: -80 }
                    }
                    animate={
                      reduceMotion
                        ? undefined
                        : { opacity: 1, y: 0, rotateX: 0 }
                    }
                    transition={{
                      duration: 0.55,
                      delay: delay + index * 0.028,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 && " "}
          </span>
        );
      })}
    </span>
  );
}
