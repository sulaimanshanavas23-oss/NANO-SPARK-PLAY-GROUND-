"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { learningStages } from "@/src/lib/site";
import { cn } from "@/src/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function LearningPathway({ compact = false }: { compact?: boolean }) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const element = scope.current;
    if (!element || reduced) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".js-pathway-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top 78%",
            end: "bottom 65%",
            scrub: 0.6,
          },
        },
      );
      gsap.fromTo(
        ".js-stage-dot",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.2,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: element,
            start: "top 72%",
          },
        },
      );
    }, element);
    return () => context.revert();
  }, [reduced]);

  return (
    <div ref={scope} className="relative">
      <div className="relative mb-8 hidden lg:block">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-ink/10" />
        <div className="js-pathway-line absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 origin-left bg-[linear-gradient(90deg,#FFD54F,#FFC107,#F7B500)]" />
        <div className="relative grid grid-cols-3">
          {learningStages.map((stage, index) => (
            <div
              key={stage.stage}
              className={cn(
                "flex",
                index === 0 && "justify-start",
                index === 1 && "justify-center",
                index === 2 && "justify-end",
              )}
            >
              <span className="js-stage-dot flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-ink text-[10px] font-bold text-spark-yellow shadow">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {learningStages.map((stage, index) => (
          <motion.div
            key={stage.stage}
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/[0.08] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-card",
              compact ? "p-5" : "p-6 lg:p-7",
            )}
          >
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
              style={{ backgroundColor: stage.color }}
            />
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-spark-light">
                <Route className="h-3 w-3" />
                {stage.stage}
              </span>
              <span className="font-display text-4xl font-extrabold text-ink/[0.07]">
                0{index + 1}
              </span>
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
              {stage.title}
            </h3>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-spark-dark">
              {stage.subtitle}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
              {stage.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {stage.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-ink/[0.08] bg-warm px-2.5 py-1 text-[10px] text-ink-muted"
                >
                  {tool}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 pt-6 text-[11px] font-semibold text-ink/60">
              <span className="h-1 w-6 rounded-full" style={{ backgroundColor: stage.color }} />
              {index === 0
                ? "Get curious"
                : index === 1
                  ? "Go hands-on"
                  : "Ship something real"}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-spark-dark/20 bg-spark-yellow/[0.08] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-relaxed text-ink-muted">
          <span className="font-semibold text-ink">This is an illustrative pathway, not a gate.</span>{" "}
          Explore any lab or tool independently — the stages simply show how skills connect.
        </p>
        <Link
          href="/tools"
          className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-ink transition-colors hover:text-spark-dark"
        >
          Browse all tools <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
