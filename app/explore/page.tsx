import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ExternalLink,
  Play,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Marquee } from "@/components/shared/marquee";
import { CampusExplorer } from "@/components/campus/campus-explorer";
import { LabCard } from "@/components/laboratories/lab-card";
import { buttonClass } from "@/components/shared/button";
import { LabGlyph } from "@/components/shared/icons";
import { assets } from "@/src/lib/assets";
import { labs } from "@/src/lib/labs";

export const metadata: Metadata = {
  title: "Explore the Labs",
  description:
    "Explore the seven interactive Nano Playground labs: Arduino, ESP32, Protocol Explorer, Electronics 101, RoverKit, 3D Vehicle Explorer and Robotics.",
};

export default function ExplorePage() {
  return (
    <>
      <PageHero
        eyebrow="Explore labs · 7 interactive stations"
        title={
          <>
            One campus. Seven ways to{" "}
            <span className="text-spark-dark">start building.</span>
          </>
        }
        description="Every Nano Spark laboratory is a real working application with a dedicated station on the 3D campus. Inspect the stations, open the exploded view and step into any lab."
        image={assets.images.labsCampus}
        imageAlt="The Nano Spark Interactive Learning Labs campus with seven illuminated laboratory platforms"
        actions={
          <>
            <Link href="#campus" className={buttonClass("primary")}>
              <Boxes className="h-4 w-4" /> Explore the campus
            </Link>
            <Link href="/playground" className={buttonClass("outline")}>
              <Play className="h-4 w-4" /> Open the workspace
            </Link>
          </>
        }
      >
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-ink-muted">
          {["Real applications", "Assembly & exploded views", "Touch friendly"].map(
            (item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-spark-dark" />
                {item}
              </span>
            ),
          )}
        </div>
      </PageHero>

      <Marquee
        tone="yellow"
        items={labs.map((lab) => `Lab ${lab.number} — ${lab.name}`)}
      />

      <section id="campus" className="section-pad scroll-mt-24">
        <div className="container-wide">
          <SectionHeading
            eyebrow="The interactive campus"
            title={
              <>
                Inspect. Explode.{" "}
                <span className="text-spark-dark">Enter.</span>
              </>
            }
            description="Hover a station to raise it, click to focus the camera, then use the controls to assemble or explode the whole campus. Everything below is rendered live in Three.js."
            action={
              <div className="flex flex-wrap gap-2">
                <span className="chip">
                  <Boxes className="h-3.5 w-3.5" /> 7 stations
                </span>
                <span className="chip">
                  <Sparkles className="h-3.5 w-3.5" /> Real-time WebGL
                </span>
              </div>
            }
          />
          <div className="mt-8">
            <CampusExplorer height="h-[580px] sm:h-[680px] lg:h-[780px]" />
          </div>
        </div>
      </section>

      <section className="bg-warm section-pad">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Laboratory index"
            title={
              <>
                Seven labs.{" "}
                <span className="text-spark-dark">Every one live.</span>
              </>
            }
            description="Each card opens the lab inside the Playground workspace, where you can use the embedded view or launch the application in a new tab."
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {labs.map((lab, index) => (
              <Reveal key={lab.id} delay={(index % 3) * 0.05}>
                <LabCard lab={lab} />
              </Reveal>
            ))}
            <Reveal delay={0.1}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-ink/10 bg-white p-6">
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-spark-yellow text-ink">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">
                    Every lab includes
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-[12.5px] text-ink-muted">
                    {[
                      "A dedicated 3D campus station",
                      "Skills and concepts covered",
                      "Embedded or external launch",
                      "Favorites and recent activity",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-spark-dark" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink hover:text-spark-dark"
                >
                  See your progress <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] border border-ink/10">
              <Image
                src={assets.images.labsCampus}
                alt="Overhead view of the seven Nano Spark lab stations"
                width={1256}
                height={1256}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <p className="font-display text-lg font-semibold">
                  The Nano Spark campus
                </p>
                <span className="rounded-full bg-spark-yellow px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-ink">
                  7 labs
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <SectionHeading
              eyebrow="Built for exploration"
              title={
                <>
                  Every station has a{" "}
                  <span className="text-spark-dark">real destination.</span>
                </>
              }
              description="The campus is a navigation layer, not a mock-up. Selecting a laboratory focuses the camera and gives you a direct route into the real application."
            />
            <div className="mt-6 space-y-2">
              {labs.map((lab) => (
                <a
                  key={lab.id}
                  href={lab.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-3 rounded-2xl border border-ink/[0.07] bg-white px-4 py-3 transition-colors hover:border-spark-dark/40 hover:bg-warm/60"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-spark-yellow">
                    <LabGlyph icon={lab.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-semibold">
                      {lab.number} · {lab.name}
                    </span>
                    <span className="block text-[10px] text-ink-muted">
                      {lab.tagline}
                    </span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-ink-muted/40 transition-colors group-hover:text-spark-dark" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-ink-muted">
              Every lab launches live from a single polished workspace.
            </p>
            <Link
              href="/playground"
              className={buttonClass("dark", "md", "mt-5")}
            >
              Open all labs in the workspace <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
