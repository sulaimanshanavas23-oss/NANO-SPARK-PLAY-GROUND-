import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Layers, Loader2, Play, ShieldCheck } from "lucide-react";
import { PlaygroundWorkspace } from "@/components/workspace/playground-workspace";
import { buttonClass } from "@/components/shared/button";
import { labs } from "@/src/lib/labs";

export const metadata: Metadata = {
  title: "Playground Workspace",
  description:
    "One workspace for all seven Nano Spark interactive labs — Arduino, ESP32, protocols, electronics, RoverKit, 3D vehicle and robotics.",
};

export default function PlaygroundPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 dark-circuit opacity-90" />
        <div className="container-wide relative py-10 sm:py-14">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow text-spark-light/80">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark-yellow" />
                Playground · live lab workspace
              </p>
              <h1 className="mt-4 text-balance text-[2.4rem] leading-[1.03] sm:text-[3.2rem]">
                Seven labs.{" "}
                <span className="text-spark-yellow">One workspace.</span>
              </h1>
              <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/55">
                Switch between the full Nano Spark applications without losing
                your place. Each lab opens live, records your visit and links
                back to the 3D campus.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  7 verified live apps
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[10px] text-white/60">
                  <ShieldCheck className="h-3 w-3" /> Secure cross-origin frames
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[10px] text-white/60">
                  <GraduationCap className="h-3 w-3" /> Progress tracked
                </span>
              </div>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link
                href="/explore#campus"
                className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[11px] font-semibold text-white/80 transition-colors hover:bg-white/10"
              >
                <Layers className="h-4 w-4 text-spark-yellow" /> Campus
              </Link>
              <Link href="/learn" className={buttonClass("primary")}>
                <Play className="h-4 w-4 fill-current" /> Learning paths
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7">
            {labs.map((lab) => (
              <Link
                key={lab.id}
                href={`/playground?lab=${lab.id}`}
                className="group flex items-center justify-between border-l border-white/10 pl-3 text-[11px] text-white/50 transition-colors hover:text-white"
              >
                <span className="min-w-0">
                  <span className="block text-[9px] uppercase tracking-[0.14em] text-white/25">
                    {lab.number}
                  </span>
                  <span className="block truncate">{lab.name}</span>
                </span>
                <ArrowRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <Suspense
          fallback={
            <div className="container-wide flex min-h-[420px] flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-spark-dark" />
              <p className="text-[11px] text-ink-muted">
                Preparing the playground workspace…
              </p>
            </div>
          }
        >
          <PlaygroundWorkspace />
        </Suspense>
      </section>

      <section className="bg-warm pb-16">
        <div className="container-wide">
          <div className="rounded-3xl border border-ink/[0.07] bg-white p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-xl font-semibold sm:text-2xl">
                  Workspace tips
                </h2>
                <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-ink-muted">
                  Every lab is a live external application. If a host restricts
                  embedding, the workspace gives you a one-click launch card
                  instead of a broken frame. Keep this tab open and labs open
                  alongside it.
                </p>
              </div>
              <Link href="/dashboard" className={buttonClass("outline", "sm")}>
                View my progress <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: "Switch without losing context",
                  body: "The lab switcher keeps every application one click away and preserves the selected lab in the URL.",
                },
                {
                  title: "Embedded where permitted",
                  body: "Six of seven hosts allow secure framing. Protocol Explorer requires a new tab by design.",
                },
                {
                  title: "Visits become progress",
                  body: "Opening a lab records your visit locally and syncs to Supabase when accounts are enabled.",
                },
              ].map((tip) => (
                <div
                  key={tip.title}
                  className="rounded-2xl border border-ink/[0.06] bg-warm/60 p-4"
                >
                  <p className="font-display text-[13px] font-semibold">
                    {tip.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                    {tip.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
