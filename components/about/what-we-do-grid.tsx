"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CircuitBoard,
  Cpu,
  School,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import { CircuitBackground } from "@/components/about/circuit-background";
import { AboutSectionHeading } from "@/components/about/section-heading";
import { Reveal, WordReveal } from "@/components/shared/reveal";

const offerings = [
  {
    icon: Cpu,
    title: "STEM Kits",
    description:
      "Curated electronics, Arduino, robotics, IoT and innovation kits.",
  },
  {
    icon: School,
    title: "School STEM Labs",
    description:
      "Full lab setup with equipment, curriculum support and teacher training.",
  },
  {
    icon: Wrench,
    title: "Workshops",
    description:
      "Interactive electronics, coding, robotics, IoT and AI sessions.",
  },
  {
    icon: Trophy,
    title: "Innovation Programs",
    description:
      "Challenges, hackathons, competitions and tech exhibitions.",
  },
  {
    icon: CircuitBoard,
    title: "Technology Solutions",
    description: "Custom robotics, IoT and embedded solutions.",
  },
  {
    icon: Users,
    title: "Young Innovators",
    description:
      "A community where students build, share and showcase projects.",
  },
];

export function WhatWeDoGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white">
      <CircuitBackground tone="dark" className="opacity-60" />
      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-8">
        <AboutSectionHeading
          tone="dark"
          eyebrow="WHAT WE DO"
          title={
            <WordReveal
              text="Everything a young innovator needs"
              highlightWords={["needs"]}
            />
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06} y={26}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.08] hover:shadow-lift">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-spark-yellow text-ink transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-extrabold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-11 flex justify-center">
          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          >
            <Link href="/contact" className="ns-btn ns-btn-yellow">
              Partner with Nano Spark
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
