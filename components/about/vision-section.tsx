"use client";

import Image from "next/image";
import { CircuitBackground } from "@/components/about/circuit-background";
import { Reveal } from "@/components/shared/reveal";

export function VisionSection() {
  return (
    <section
      id="vision"
      className="relative scroll-mt-24 overflow-hidden bg-ink py-20 text-white"
    >
      <CircuitBackground tone="dark" className="opacity-60" dense />
      <div className="relative mx-auto w-full max-w-4xl px-6 text-center sm:px-8">
        <p className="ns-eyebrow justify-center text-spark-light/85">
          <span aria-hidden className="text-[9px] text-spark-yellow">
            &#9654;
          </span>
          FOUNDER&apos;S VISION
        </p>

        <Reveal className="mt-7">
          <blockquote className="font-display text-2xl font-extrabold leading-snug text-white text-balance sm:text-3xl sm:leading-snug">
            &ldquo;I believe every student has the potential to become an
            innovator when they are given the right tools, guidance, and
            opportunity. Nano Spark aims to create that opportunity by making
            hands-on technology education more accessible and helping students
            turn their curiosity into real-world innovation.&rdquo;
          </blockquote>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:text-left">
            <Image
              src="/founder.jpeg"
              alt="S. Shanavas, Founder and CEO of Nano Spark"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border-2 border-spark-yellow object-cover"
            />
            <div>
              <p className="font-display text-base font-bold text-spark-yellow">
                S. Shanavas
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-white/70">
                Founder &amp; CEO — Nano Spark | Pre-Final Year ECE Student | SIH
                Finalist 2025 (Software Edition)
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
