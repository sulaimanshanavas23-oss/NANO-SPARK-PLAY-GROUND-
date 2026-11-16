import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  Layers,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ToolsExplorer } from "@/components/tool-stations/tools-explorer";
import { LearningPathway } from "@/components/learning-journey/learning-pathway";
import { buttonClass } from "@/components/shared/button";
import { assets } from "@/src/lib/assets";
import { tools } from "@/src/lib/tools";

export const metadata: Metadata = {
  title: "Tools & Platforms",
  description:
    "Explore the programming, simulation, hardware, IoT and AI tools Nano Spark students use — Arduino IDE, VS Code, Python, GitHub, Tinkercad, Wokwi, Scratch, Seeed Studio, Blynk and more.",
};

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools & platforms · 16 tools"
        title={
          <>
            Tools &amp; Platforms You{" "}
            <span className="text-spark-dark">Will Use</span>
          </>
        }
        description="From beginner-friendly learning tools to advanced programming, AI and hardware development platforms — explore the technologies behind real-world innovation."
        image={assets.images.toolsPlatforms}
        imageAlt="Logos and interfaces of the tools and platforms used by Nano Spark students"
        actions={
          <>
            <Link href="#tool-library" className={buttonClass("primary")}>
              <Layers className="h-4 w-4" /> Browse the tool library
            </Link>
            <Link href="/showroom" className={buttonClass("outline")}>
              <Boxes className="h-4 w-4" /> 3D technology showroom
            </Link>
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          {["Programming", "Simulation", "Hardware & IoT", "AI"].map((item) => (
            <span key={item} className="chip">
              <Check className="h-3 w-3 text-spark-dark" /> {item}
            </span>
          ))}
        </div>
      </PageHero>

      <section id="tool-library" className="section-pad scroll-mt-24">
        <div className="container-wide">
          <SectionHeading
            eyebrow="The tool library"
            title={
              <>
                Every tool,{" "}
                <span className="text-spark-dark">mapped to a purpose.</span>
              </>
            }
            description="Browse by category, search by name and open any tool to see its description, learning application and verified official link. Save tools to your dashboard as you explore."
            action={
              <span className="chip">
                <Sparkles className="h-3.5 w-3.5" /> {tools.length} tools · 4 categories
              </span>
            }
            className="mb-8"
          />
          <Suspense
            fallback={
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-72 animate-pulse rounded-3xl border border-ink/[0.06] bg-warm/60"
                  />
                ))}
              </div>
            }
          >
            <ToolsExplorer />
          </Suspense>
        </div>
      </section>

      <section className="bg-ink py-12 text-white sm:py-16">
        <div className="container-wide grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-white/10">
              <Image
                src={assets.images.toolsBox}
                alt="The Nano Spark tools box showing the hardware students learn with"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow text-spark-light/80">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark-yellow" />
              Inside the kit
            </p>
            <h2 className="mt-4 text-balance text-[2rem] leading-tight sm:text-[2.6rem]">
              Hardware, software and the{" "}
              <span className="text-spark-yellow">space to experiment.</span>
            </h2>
            <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-white/55">
              The Nano Spark tools box brings the physical side of the
              curriculum together — boards, components, sensors and the tools
              needed to take an idea from simulation to a working device.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/showroom" className={buttonClass("primary")}>
                Enter technology showroom
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore the labs <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Tools learning journey"
            title={
              <>
                The Toolbox{" "}
                <span className="text-spark-dark">Students Learn With</span>
              </>
            }
            description="From Scratch for absolute beginners to Python and VS Code for advanced AI projects — every tool has a place in the journey. Explore independently; the pathway is illustrative, not a gate."
            action={
              <Link href="/learn" className={buttonClass("outline")}>
                Go to the learning hub <ArrowRight className="h-4 w-4" />
              </Link>
            }
            className="mb-9"
          />
          <LearningPathway />
        </div>
      </section>

      <section className="relative overflow-hidden bg-warm py-14">
        <div className="container-wide flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-spark-yellow">
              <Boxes className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-spark-dark">
                Immersive showroom
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                Walk the floor. Inspect every podium.
              </h2>
              <p className="mt-1 max-w-xl text-[12.5px] text-ink-muted">
                A real 3D showroom presents the tools as physical exhibits —
                laptops, boards, circuits, IoT nodes and AI objects.
              </p>
            </div>
          </div>
          <Link href="/showroom" className={buttonClass("dark", "lg")}>
            Enter showroom <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
