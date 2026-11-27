"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { AboutSectionHeading } from "@/components/about/section-heading";
import { Reveal, WordReveal } from "@/components/shared/reveal";
import { cn } from "@/src/lib/utils";

function CountUp({
  value,
  suffix = "",
  format,
}: {
  value: number;
  suffix?: string;
  format?: (current: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    if (!inView) {
      setDisplay(0);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 1300;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {format ? format(display) : display}
      {suffix}
    </span>
  );
}

const stats = [
  {
    value: <CountUp value={2000} suffix="+" format={(n) => n.toLocaleString("en-US")} />,
    label: "students trained",
    tone: "bg-spark-yellow text-ink",
    labelTone: "text-ink/70",
    numberTone: "text-ink",
  },
  {
    value: <CountUp value={6} />,
    label: "focus areas & counting",
    tone: "bg-ink text-white",
    labelTone: "text-white/70",
    numberTone: "text-spark-yellow",
  },
  {
    value: <CountUp value={100} suffix="%" />,
    label: "hands-on learning",
    tone: "bg-warm text-ink",
    labelTone: "text-ink/65",
    numberTone: "text-ink",
  },
  {
    value: "A-Z",
    label: "concepts to working prototypes",
    tone: "bg-spark-yellow/50 text-ink",
    labelTone: "text-ink/65",
    numberTone: "text-ink",
  },
];

export function StoryStats() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-2">
        <div>
          <AboutSectionHeading
            align="left"
            eyebrow="OUR STORY"
            title={
              <WordReveal
                text="Born from a simple belief"
                highlightWords={["belief"]}
              />
            }
            description="Nano Spark is a technology and STEM innovation startup making practical technology education accessible to students, schools, and aspiring innovators. Led by founder S. Shanavas, we combine STEM, robotics, electronics, embedded systems, IoT and emerging tech for hands-on, project-based learning."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} y={24}>
              <div
                className={cn(
                  "h-full rounded-2xl p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
                  stat.tone,
                )}
              >
                <p
                  className={cn(
                    "font-display text-4xl font-extrabold leading-none",
                    stat.numberTone,
                  )}
                >
                  {stat.value}
                </p>
                <p className={cn("mt-2 text-sm font-semibold", stat.labelTone)}>
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
