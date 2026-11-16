import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  FlaskConical,
  GitBranch,
  Hammer,
  Play,
  Rocket,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { buttonClass } from "@/components/shared/button";
import { assets } from "@/src/lib/assets";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Nano Spark build ideas and student-style projects — smart rovers, IoT weather stations, vision robots, drones and more, each linked to a live lab.",
};

const buildSteps = [
  {
    icon: ClipboardList,
    title: "Frame the problem",
    body: "Write one sentence describing what the build should do and who it helps.",
  },
  {
    icon: FlaskConical,
    title: "Prototype in simulation",
    body: "Test the circuit and logic in Tinkercad Circuits or Wokwi before touching hardware.",
  },
  {
    icon: Hammer,
    title: "Build and debug",
    body: "Move to real components, log every failure and fix one variable at a time.",
  },
  {
    icon: GitBranch,
    title: "Document and share",
    body: "Record wiring, code and evidence. A build anyone can reproduce is a finished build.",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Project studio"
        title={
          <>
            Build ideas worth{" "}
            <span className="text-spark-dark">getting your hands dirty.</span>
          </>
        }
        description="Every build here starts in a live lab. Use these project briefs as starting points, then change them, break them and make them yours."
        image={assets.images.droneLab}
        imageAlt="Aerial view of a Nano Spark drone and robotics learning session"
        actions={
          <>
            <Link href="/playground" className={buttonClass("primary")}>
              <Play className="h-4 w-4 fill-current" /> Start building
            </Link>
            <Link href="/community" className={buttonClass("outline")}>
              Share your build <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          {["Rovers", "IoT", "Vision", "Drones", "Electronics"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-[10px] font-medium text-ink-muted backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Build gallery"
            title="Six starter briefs. Infinite variations."
            description="Filter by discipline, open the linked lab and begin. These briefs are deliberately open-ended — the interesting part is what you change."
          />
          <div className="mt-9">
            <ProjectGallery />
          </div>
        </div>
      </section>

      <section className="bg-warm section-pad">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
              How a build works
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.06] sm:text-[2.5rem]">
              A repeatable process, not a one-off demo.
            </h2>
            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-ink-muted">
              Students follow the same four-step loop for every project. It is
              deliberately simple so attention goes into the engineering, not the
              paperwork.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {buildSteps.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.06}>
                  <div className="h-full rounded-2xl border border-ink/[0.07] bg-white p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-spark-yellow/15 text-spark-dark">
                        <step.icon className="h-4 w-4" />
                      </span>
                      <span className="font-display text-lg font-extrabold text-ink/[0.08]">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-[14px] font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-ink/10">
                <Image
                  src={assets.images.students}
                  alt="Nano Spark students collaborating on a technology build"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-spark-yellow px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink">
                    <Users className="h-3 w-3" /> Built together
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                    The best projects start as a question.
                  </h3>
                  <p className="mt-2 max-w-sm text-[12px] leading-relaxed text-white/60">
                    Bring a problem from your classroom, home or campus. We will
                    help you turn it into a build you can test.
                  </p>
                </div>
              </div>
              <div className="absolute -right-3 -top-3 hidden h-20 w-20 items-center justify-center rounded-2xl border border-spark-dark/30 bg-white/80 backdrop-blur sm:flex">
                <Rocket className="h-7 w-7 text-spark-dark" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <div className="overflow-hidden rounded-[32px] border border-ink/[0.08] bg-ink p-7 text-white sm:p-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-spark-light/70">
                  Project challenge
                </p>
                <h2 className="mt-2 text-[2rem] leading-[1.05] sm:text-[2.6rem]">
                  One build. One week. One real problem.
                </h2>
                <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-white/55">
                  Pick any brief from the gallery, document the full process and
                  present it to the community. Working evidence beats a perfect
                  slide deck every time.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link href="/playground" className={buttonClass("primary")}>
                  Open a lab <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/community"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Join the community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
