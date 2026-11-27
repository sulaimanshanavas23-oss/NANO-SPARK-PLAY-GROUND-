"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export function AboutSectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
  maxWidth = "max-w-3xl",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  maxWidth?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <p
        className={cn(
          "ns-eyebrow",
          tone === "dark" ? "text-spark-light/85" : "text-ink-muted",
        )}
      >
        <span aria-hidden className="text-[9px] text-spark-dark">
          &#9654;
        </span>
        {eyebrow}
      </p>
      <h2
        data-ns-reveal="off"
        className={cn(
          "mt-4 font-display text-3xl font-extrabold leading-[1.06] tracking-tight text-balance sm:text-4xl lg:text-[2.65rem]",
          tone === "dark" ? "text-white" : "text-ink",
          maxWidth,
        )}
      >
        {title}
      </h2>
      <motion.div
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={reduceMotion ? undefined : { scaleX: 1 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="ns-gold-rule mt-5 h-1.5 w-16 origin-left rounded-full"
      />
      {description && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-[15px] leading-relaxed text-pretty",
            align === "center" && "mx-auto",
            tone === "dark" ? "text-white/65" : "text-ink/70",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
