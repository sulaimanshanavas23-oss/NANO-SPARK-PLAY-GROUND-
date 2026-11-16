import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Cpu,
  Lightbulb,
  Play,
  Target,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { LearningPathway } from "@/components/learning-journey/learning-pathway";
import { buttonClass } from "@/components/shared/button";
import { LabGlyph } from "@/components/shared/icons";
import { assets } from "@/src/lib/assets";
import { labs } from "@/src/lib/labs";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "The Nano Spark learning approach: curiosity first, simulation before hardware, and a pathway from first circuit to connected intelligent systems.",
};

const habits = [
  {
    icon: Compass,
    title: "Explore before you memorise",
    body: "Every topic starts in a live lab. You see the behaviour first, then unpack the theory behind it.",
  },
  {
    icon: Cpu,
    title: "Simulate before you solder",
    body: "Prototype in Tinkercad Circuits or Wokwi, debug safely, then move the same design onto real hardware.",
  },
  {
    icon: Target,
    title: "Build something that works",
    body: "Each stage ends with a small, demonstrable build — not a quiz. Working artefacts make progress visible.",
  },
  {
    icon: Lightbulb,
    title: "Explain it to someone else",
    body: "Peer teaching is part of the method. If you can walk a classmate through your circuit, you own the idea.",
  },
];

const sessionFlow = [
  {
    step: "01",
    title: "Pick a lab",
    body: "Choose a board, protocol, circuit or robot that matches the question you are curious about.",
  },
  {
    step: "02",
    title: "Observe the system",
    body: "Use the interactive lab to manipulate inputs and watch how the system responds in real time.",
  },
  {
    step: "03",
    title: "Build a variation",
    body: "Change one thing, predict the result, test it and record what actually happened.",
  },
  {
    step: "04",
    title: "Document the build",
    body: "Capture the wiring, code and result so the experiment becomes a reusable project note.",
  },
];

export default function LearnPage() {
  return (
    <>
      <PageHero
        eyebrow="Learning approach"
        title={
          <>
            Learn by{" "}
            <span className="text-spark-dark">touching the technology.</span>
          </>
        }
        description="Nano Spark is built around doing. Our pathway moves from guided curiosity to independent building, with real tools and live labs at every step."
        image={assets.images.toolsLearning}
        imageAlt="Nano Spark students learning with hands-on technology tools"
        actions={
          <>
            <Link href="/playground" className={buttonClass("primary")}>
              <Play className="h-4 w-4 fill-current" /> Enter the playground
            </Link>
            <Link href="/projects" className={buttonClass("outline")}>
              See student projects <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <div className="grid max-w-lg grid-cols-3 gap-3">
          {[
            { value: "07", label: "Live labs" },
            { value: "03", label: "Stages" },
            { value: "16", label: "Tools" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-ink/[0.08] bg-white/70 p-3 backdrop-blur"
            >
              <p className="font-display text-2xl font-extrabold text-ink">
                {stat.value}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeading
            eyebrow="The pathway"
            title={
              <>
                Three stages.{" "}
                <span className="text-spark-dark">One continuous build.</span>
              </>
            }
            description="The stages are an illustrative map of how skills connect. You are free to enter anywhere — curiosity is a valid starting point."
            action={
              <Link href="/explore" className={buttonClass("outline", "sm")}>
                Browse the labs <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="mt-10">
            <LearningPathway />
          </div>
        </div>
      </section>

      <section className="bg-warm section-pad">
        <div className="container-wide">
          <SectionHeading
            eyebrow="How we teach"
            title="Four habits that make the learning stick."
            description="These are not rules imposed on students. They are the behaviours we consistently model, practise and celebrate."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {habits.map((habit, index) => (
              <Reveal key={habit.title} delay={index * 0.07}>
                <div className="group flex h-full gap-4 rounded-3xl border border-ink/[0.07] bg-white p-5 transition-colors hover:border-spark-dark/40">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-spark-yellow/15 text-spark-dark transition-colors group-hover:bg-spark-yellow group-hover:text-ink">
                    <habit.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-[16px] font-semibold">
                      {habit.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
                      {habit.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] border border-ink/10">
              <div className="relative aspect-[4/3]">
                <Image
                  src={assets.images.classroom}
                  alt="A Nano Spark classroom session with students building circuits"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 pt-16">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-spark-light/80">
                  In the room
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-white">
                  Guided sessions, real components.
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
              A typical session
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.06] sm:text-[2.5rem]">
              From question to working build in four moves.
            </h2>
            <div className="mt-7 space-y-1">
              {sessionFlow.map((item) => (
                <div
                  key={item.step}
                  className="group flex gap-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-warm"
                >
                  <span className="font-display text-[13px] font-extrabold text-spark-dark">
                    {item.step}
                  </span>
                  <div className="border-l border-ink/10 pl-4">
                    <h3 className="font-display text-[15px] font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink section-pad text-white">
        <div className="container-wide">
          <SectionHeading
            tone="dark"
            eyebrow="Skills by lab"
            title="Every lab maps to real capabilities."
            description="Not a list of features — a map of what a student can actually do after spending time in each application."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {labs.map((lab, index) => (
              <Reveal key={lab.id} delay={index * 0.05}>
                <Link
                  href={`/playground?lab=${lab.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-spark-yellow/40 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-spark-yellow text-ink">
                      <LabGlyph icon={lab.icon} className="h-4 w-4" />
                    </span>
                    <span className="text-[9px] font-semibold tracking-[0.16em] text-white/30">
                      {lab.number}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-[15px] font-semibold">
                    {lab.name}
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {lab.skills.slice(0, 3).map((skill) => (
                      <li
                        key={skill}
                        className="flex items-start gap-1.5 text-[10.5px] text-white/50"
                      >
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-spark-yellow/70" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto flex items-center gap-1 pt-4 text-[10px] font-semibold text-spark-light">
                    Open lab
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={labs.length * 0.05}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-spark-yellow/25 bg-spark-yellow/[0.07] p-4">
                <div>
                  <BookOpen className="h-5 w-5 text-spark-yellow" />
                  <h3 className="mt-3 font-display text-[15px] font-semibold">
                    Want a guided route?
                  </h3>
                  <p className="mt-1.5 text-[10.5px] leading-relaxed text-white/50">
                    Start with Arduino and Electronics, then add connectivity and
                    robotics.
                  </p>
                </div>
                <Link
                  href="/playground?lab=arduino-lab"
                  className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold text-spark-yellow"
                >
                  Start with Arduino <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-[32px] bg-spark-yellow p-7 sm:p-10">
            <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/50">
                  Ready when you are
                </p>
                <h2 className="mt-2 text-[2rem] leading-[1.05] text-ink sm:text-[2.6rem]">
                  Pick a lab. Break something. Fix it.
                </h2>
                <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-ink/65">
                  The fastest way to understand technology is to use it. All
                  seven labs are live, and your progress is saved as you explore.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link href="/playground" className={buttonClass("dark")}>
                  <Play className="h-4 w-4 fill-current" /> Open playground
                </Link>
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-white/40 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:bg-white/70"
                >
                  Create a profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
