"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import { Reveal, WordReveal } from "@/components/shared/reveal";

const approach = [
  "LEARN",
  "BUILD",
  "EXPERIMENT",
  "DEBUG",
  "INNOVATE",
  "SOLVE",
];

const paragraphs = [
  "S. Shanavas is an ECE student, young entrepreneur, technology enthusiast, and innovator with a strong interest in robotics, electronics, embedded systems, IoT, and STEM education.",
  "He founded Nano Spark with a vision to make technology learning more practical, accessible, and innovation-focused for students. The idea comes from a simple belief: students should not only learn technology from textbooks — they should have the opportunity to build, experiment, fail, improve, and create their own solutions.",
  "Through Nano Spark, Shanavas is developing a growing ecosystem that brings together STEM learning kits, robotics and electronics programs, hands-on innovation activities, school STEM lab solutions, and project-based learning.",
  "His focus is on creating learning experiences where students can progress from understanding basic concepts to building working prototypes and eventually solving real-world problems.",
];

const WHATSAPP = "https://wa.me/918148774546";

export function FounderSection() {
  const reduceMotion = useReducedMotion();
  const hover = reduceMotion ? undefined : { scale: 1.02 };
  const tap = reduceMotion ? undefined : { scale: 0.97 };

  return (
    <section
      id="founder"
      className="relative scroll-mt-24 overflow-hidden bg-white py-20"
    >
      <div aria-hidden className="ns-dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <p className="ns-eyebrow text-ink-muted">
            <span aria-hidden className="text-[9px] text-spark-dark">
              &#9654;
            </span>
            ABOUT THE FOUNDER
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[2.65rem]">
            <WordReveal text="MEET THE FOUNDER" />
          </h2>
          <div className="ns-gold-rule mt-5 h-1.5 w-16 rounded-full" />
        </div>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="relative">
              <div
                aria-hidden
                className="ns-dot-grid absolute -left-4 -top-4 h-full w-full rounded-3xl bg-spark-yellow/10"
              />
              <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border-4 border-spark-yellow shadow-lift transition-transform duration-500 hover:scale-[1.02]">
                <Image
                  src="/founder.jpeg"
                  alt="S. Shanavas, Founder and CEO of Nano Spark"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 38vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-5 pt-20">
                  <p className="font-display text-2xl font-extrabold text-spark-yellow">
                    S. Shanavas
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-white/80">
                    Founder &amp; CEO — Nano Spark | Pre-Final Year ECE Student |
                    SIH Finalist 2025 (Software Edition)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <motion.a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer noopener"
                whileHover={hover}
                whileTap={tap}
                className="ns-btn ns-btn-yellow w-full"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to the Founder
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={hover}
                whileTap={tap}
                className="ns-btn ns-btn-outline w-full"
              >
                <CalendarDays className="h-4 w-4" />
                Book a Session
              </motion.a>
            </div>
          </Reveal>

          <div className="lg:col-span-3">
            <Reveal>
              <h3 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
                S. Shanavas
              </h3>
              <p className="mt-2 text-[11px] font-bold uppercase leading-relaxed tracking-[0.12em] text-spark-dark">
                Founder &amp; CEO — Nano Spark | Pre-Final Year ECE Student | SIH
                Finalist 2025 (Software Edition)
              </p>
            </Reveal>

            <div className="mt-6 space-y-4">
              {paragraphs.map((paragraph, index) => (
                <Reveal key={index} delay={index * 0.08} y={24}>
                  <p className="text-[14.5px] leading-relaxed text-ink/75">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1} className="mt-7">
              <div className="rounded-2xl border border-ink/10 bg-warm p-6">
                <p className="font-display text-lg font-extrabold text-ink">
                  His Approach
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3">
                  {approach.map((step, index) => (
                    <span key={step} className="inline-flex items-center gap-2">
                      <motion.span
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, scale: 0.6, y: 10 }
                        }
                        whileInView={
                          reduceMotion
                            ? undefined
                            : { opacity: 1, scale: 1, y: 0 }
                        }
                        viewport={{ once: false, margin: "-60px" }}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 18,
                          delay: index * 0.09,
                        }}
                        className="inline-flex rounded-lg bg-spark-yellow px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide text-ink shadow-soft"
                      >
                        {step}
                      </motion.span>
                      {index < approach.length - 1 && (
                        <motion.span
                          aria-hidden
                          animate={
                            reduceMotion
                              ? undefined
                              : { x: [0, 4, 0], opacity: [0.55, 1, 0.55] }
                          }
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.12,
                          }}
                        >
                          <ArrowRight className="h-4 w-4 text-spark-dark" />
                        </motion.span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/65">
                As a student entrepreneur, Shanavas is also focused on
                understanding the real needs of schools and students, validating
                Nano Spark&apos;s products through practical programs, and
                building sustainable partnerships with educational institutions.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
