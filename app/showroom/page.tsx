import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Boxes, ExternalLink, Layers, Sparkles } from "lucide-react";
import { ShowroomExperience } from "@/components/showroom/showroom-experience";
import { Reveal } from "@/components/shared/reveal";
import { buttonClass } from "@/components/shared/button";
import { assets } from "@/src/lib/assets";
import { toolCategories, tools } from "@/src/lib/tools";

export const metadata: Metadata = {
  title: "Technology Showroom",
  description:
    "Enter the immersive 3D Nano Spark technology showroom. Inspect development boards, laptops, circuits, IoT nodes and AI exhibits on a walkable floor.",
};

export default function ShowroomPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 dark-circuit opacity-90" />
        <div className="container-wide relative py-12 sm:py-16">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow text-spark-light/80">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark-yellow" />
                Technology showroom · immersive 3D
              </p>
              <h1 className="mt-4 text-balance text-[2.5rem] leading-[1.02] sm:text-[3.4rem]">
                Walk the{" "}
                <span className="text-spark-yellow">technology floor.</span>
              </h1>
              <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/55">
                A physical-style showroom of the software, hardware and AI
                tools Nano Spark students learn with. Inspect every podium,
                orbit the room and open an exhibit to see how it fits into a
                real learning path.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {toolCategories.map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[10px] text-white/60"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-center">
                <p className="font-display text-3xl font-extrabold text-spark-yellow">
                  {tools.length}
                </p>
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/45">
                  Exhibits
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-center">
                <p className="font-display text-3xl font-extrabold text-spark-yellow">
                  04
                </p>
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/45">
                  Floors
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-spark-dark">
                <Layers className="mr-1.5 inline h-3.5 w-3.5" />
                Showroom floor
              </p>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                Three.js exhibits, not screenshots.
              </h2>
            </div>
            <Link href="/tools" className={buttonClass("outline", "sm")}>
              Open the tool library <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ShowroomExperience />
        </div>
      </section>

      <section className="bg-warm section-pad">
        <div className="container-wide grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-[28px] border border-ink/10">
              <Image
                src={assets.images.toolsPlatforms}
                alt="The complete Nano Spark tool ecosystem reference"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-spark-yellow px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink">
                  <Sparkles className="h-3 w-3" /> The full ecosystem
                </span>
                <h2 className="mt-3 max-w-md font-display text-2xl font-semibold text-white sm:text-3xl">
                  From first block to connected product.
                </h2>
                <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-white/60">
                  The showroom mirrors the supplied Nano Spark tools and
                  platforms reference — every exhibit belongs to a real
                  learning workflow.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col gap-4">
              <div className="relative flex-1 overflow-hidden rounded-[28px] border border-ink/10 bg-white">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={assets.images.toolsBox}
                    alt="Nano Spark tools box used in the technology showroom"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold">
                    Floor guide · the physical kit
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">
                    Boards, components and sensors from the Nano Spark tools
                    box sit behind the digital exhibits. Simulation becomes real
                    hardware in the same learning flow.
                  </p>
                </div>
              </div>
              <Link
                href="/playground"
                className="flex items-center justify-between rounded-2xl bg-ink px-5 py-4 text-white transition-colors hover:bg-black"
              >
                <span>
                  <span className="block text-[9px] uppercase tracking-[0.16em] text-spark-light/70">
                    Put the tools to work
                  </span>
                  <span className="font-display text-lg font-semibold">
                    Open the Playground workspace
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 text-spark-yellow" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="container-wide mt-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {toolCategories.map((category, index) => (
              <Reveal key={category.id} delay={index * 0.06}>
                <div className="flex h-full flex-col rounded-2xl border border-ink/[0.07] bg-white p-4">
                  <p className="font-display text-2xl font-extrabold text-ink/[0.08]">
                    {category.number}
                  </p>
                  <h3 className="mt-1 font-display text-[15px] font-semibold">
                    {category.title}
                  </h3>
                  <p className="mt-1 flex-1 text-[11px] leading-relaxed text-ink-muted">
                    {category.description}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-spark-dark">
                    <Boxes className="h-3 w-3" />
                    {tools.filter((tool) => tool.category === category.id).length} exhibits
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-[10.5px] text-ink-muted">
            Official tool links open public third-party websites.{" "}
            <Link
              href="/tools"
              className="inline-flex items-center gap-0.5 font-semibold text-ink hover:text-spark-dark"
            >
              See the full tool directory <ExternalLink className="h-3 w-3" />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
