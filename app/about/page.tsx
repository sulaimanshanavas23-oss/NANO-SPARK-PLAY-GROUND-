import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Cpu,
  Globe2,
  Heart,
  Layers,
  Lightbulb,
  Minus,
  Play,
  Plus,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { buttonClass } from "@/components/shared/button";
import { assets } from "@/src/lib/assets";
import { faqs, site, stats } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nano Spark — technology, innovations and solutions. Learn about the mission behind Nano Playground and the design system that powers it.",
};

const values = [
  {
    icon: Compass,
    title: "Curiosity first",
    body: "We start with questions, not syllabi. A student who wants to know why will outlearn one who is told to memorise.",
  },
  {
    icon: Cpu,
    title: "Real technology",
    body: "The tools are the same ones professionals use. We simplify the entry point, never the substance.",
  },
  {
    icon: Heart,
    title: "Learning with dignity",
    body: "No one is shamed for a basic question or a failed circuit. Beginners are the point, not an inconvenience.",
  },
  {
    icon: Globe2,
    title: "Built for the real world",
    body: "Projects should touch classrooms, homes and campuses. If it does not solve something, it is a rehearsal.",
  },
];

const palette = [
  { name: "Primary Yellow", hex: "#FFC107" },
  { name: "Light Yellow", hex: "#FFD54F" },
  { name: "Deep Yellow", hex: "#F7B500" },
  { name: "Ink", hex: "#111111" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Warm Grey", hex: "#F7F7F5" },
  { name: "Gold", hex: "#FFB900" },
];

const approach = [
  {
    icon: Layers,
    title: "Explore",
    body: "Seven live labs and a 3D campus make abstract technology tangible.",
  },
  {
    icon: Target,
    title: "Practice",
    body: "Simulation, hardware and small builds turn observation into skill.",
  },
  {
    icon: Sparkles,
    title: "Create",
    body: "Open project briefs and a community rhythm push ideas into working artefacts.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="About Nano Spark"
        title={
          <>
            Small ideas.{" "}
            <span className="text-spark-yellow">Big impact.</span>
          </>
        }
        description="Nano Spark builds interactive technology learning experiences. Nano Playground is our campus: seven live labs, the tools students actually use and a community that learns by making."
        image={assets.images.brandSystem}
        imageAlt="Nano Spark brand system reference with colours and typography"
        imageClassName="border-white/10"
        actions={
          <>
            <Link href="/playground" className={buttonClass("primary")}>
              <Play className="h-4 w-4 fill-current" /> Explore the playground
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Meet the community <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <div className="grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
            >
              <p className="font-display text-xl font-extrabold text-spark-yellow">
                {stat.value}
              </p>
              <p className="text-[8.5px] font-semibold uppercase tracking-[0.12em] text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="section-pad">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-ink/10">
                <Image
                  src={assets.images.classroom}
                  alt="A Nano Spark teaching session in a classroom"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 hidden w-48 rounded-2xl border border-ink/10 bg-white p-4 shadow-card sm:block">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-muted/60">
                  The work
                </p>
                <p className="mt-1 font-display text-[15px] font-semibold leading-snug">
                  Technology • Innovations • Solutions
                </p>
                <p className="mt-1 text-[9.5px] text-ink-muted">
                  {site.company}
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
              Why we built this
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.06] sm:text-[2.5rem]">
              Technology learning should feel like a workshop, not a lecture.
            </h2>
            <div className="mt-5 space-y-4 text-[13.5px] leading-relaxed text-ink-muted">
              <p>
                Most students meet technology as a list of definitions. They can
                recite what a microcontroller is long before they have seen one
                respond to their own code. That gap between knowing and doing is
                where curiosity goes to die.
              </p>
              <p>
                Nano Playground closes that gap. Every concept is attached to a
                live application, a real tool or a build brief. Students move
                between observing, simulating and making — in the same session.
              </p>
              <p>
                We do not pretend every learner needs the same route. The
                campus is open: enter anywhere, go deep on what holds your
                attention and come back for the rest when you need it.
              </p>
            </div>
            <div className="mt-7 grid grid-cols-3 gap-3">
              {approach.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-ink/[0.07] bg-warm/60 p-3.5"
                >
                  <item.icon className="h-4 w-4 text-spark-dark" />
                  <p className="mt-2 font-display text-[13px] font-semibold">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-warm section-pad">
        <div className="container-wide">
          <SectionHeading
            eyebrow="What we value"
            title="Four principles behind every decision."
            description="These values shape the labs we build, the language we use and the way the community is allowed to behave."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06}>
                <div className="flex h-full flex-col rounded-3xl border border-ink/[0.07] bg-white p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-spark-yellow/15 text-spark-dark">
                    <value.icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 font-display text-[15px] font-semibold">
                    {value.title}
                  </h3>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-muted">
                    {value.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
              Design language
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.06] sm:text-[2.5rem]">
              Yellow for energy. Ink for focus. Warmth for welcome.
            </h2>
            <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-ink-muted">
              The Nano Playground interface is built on the supplied Nano Spark
              brand system: a confident yellow, a near-black canvas for depth and
              a warm neutral that keeps long learning sessions comfortable.
              Typography pairs the rounded Baloo 2 display face with the highly
              readable Inter text face.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {palette.map((color) => (
                <div key={color.hex} className="group">
                  <div
                    className="relative h-16 overflow-hidden rounded-xl border border-ink/10"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className="absolute bottom-1.5 right-2 text-[8px] font-semibold uppercase tracking-[0.1em] text-ink/50">
                      {color.hex}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[9.5px] font-medium text-ink-muted">
                    {color.name}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[10px] text-ink-muted">
                Display · Baloo 2
              </span>
              <span className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[10px] text-ink-muted">
                Body · Inter
              </span>
              <span className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[10px] text-ink-muted">
                Motion · purposeful, reduced-motion aware
              </span>
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-ink/10 bg-white">
              <Image
                src={assets.images.brandSystem}
                alt="Nano Spark brand colour and typography system"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-warm section-pad">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
              Questions
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.06] sm:text-[2.5rem]">
              Straight answers.
            </h2>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-ink-muted">
              Still unsure where to begin? The fastest route is to open a lab and
              try something small.
            </p>
            <Link href="/learn" className={buttonClass("outline", "sm", "mt-5")}>
              See the learning approach <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-ink/[0.07] bg-white px-5 py-4 open:shadow-[0_16px_40px_-32px_rgba(17,17,17,0.4)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-[14px] font-semibold [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition-colors group-open:border-ink group-open:bg-ink group-open:text-white">
                    <Plus className="h-3 w-3 group-open:hidden" />
                    <Minus className="hidden h-3 w-3 group-open:block" />
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[12px] leading-relaxed text-ink-muted">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-[32px] bg-ink p-7 text-white sm:p-10">
            <div className="pointer-events-none absolute inset-0 dark-circuit opacity-70" />
            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-spark-light/70">
                  <Lightbulb className="h-3.5 w-3.5" /> Start small
                </p>
                <h2 className="mt-2 text-[2rem] leading-[1.05] sm:text-[2.6rem]">
                  One circuit. One idea. One afternoon.
                </h2>
                <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-white/55">
                  You do not need permission to start learning. Open a lab, change
                  one thing and see what happens.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link href="/playground" className={buttonClass("primary")}>
                  <Play className="h-4 w-4 fill-current" /> Open playground
                </Link>
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Users className="h-4 w-4" /> Create profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
