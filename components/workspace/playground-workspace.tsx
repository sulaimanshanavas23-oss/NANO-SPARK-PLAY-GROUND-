"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Info,
  Loader2,
  Maximize2,
  Play,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Wifi,
} from "lucide-react";
import { labs, getLab, type Lab } from "@/src/lib/labs";
import { assets } from "@/src/lib/assets";
import { buttonClass } from "@/components/shared/button";
import { LabGlyph } from "@/components/shared/icons";
import { useApp } from "@/src/lib/store/app-provider";
import { cn } from "@/src/lib/utils";

type FrameState = "loading" | "ready" | "blocked";

function LaunchCard({
  lab,
  reason,
  onRetry,
}: {
  lab: Lab;
  reason: "blocked" | "external";
  onRetry?: () => void;
}) {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden p-5 sm:p-8">
      <Image
        src={assets.images.labsCampus}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 900px"
        className="object-cover opacity-[0.14]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7f7f4] via-[#f7f7f4]/80 to-[#f3e6bd]/50" />
      <div className="relative w-full max-w-md rounded-3xl border border-ink/10 bg-white/90 p-6 text-center shadow-card backdrop-blur sm:p-8">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-spark-yellow">
          <LabGlyph icon={lab.icon} className="h-7 w-7" />
        </span>
        <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-spark-dark">
          Lab {lab.number}
        </p>
        <h3 className="mt-1 font-display text-2xl font-semibold">{lab.name}</h3>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
          {reason === "blocked"
            ? "This lab has loaded its own security policy that prevents it from being embedded. Open it in a new tab to use the full application — your campus selection is kept here."
            : "This application is designed to run in its own full-screen environment. Launch it below — the workspace will keep your place in the campus."}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {lab.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-ink/[0.08] bg-warm px-2.5 py-1 text-[10px] text-ink-muted"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <a
            href={lab.url}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonClass("primary")}
          >
            <Play className="h-4 w-4 fill-current" /> Open lab in new tab
            <ArrowUpRight className="h-4 w-4" />
          </a>
          {reason === "blocked" && onRetry && (
            <button onClick={onRetry} className={buttonClass("outline")}>
              <RefreshCw className="h-4 w-4" /> Retry embed
            </button>
          )}
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-ink-muted/60">
          <ShieldAlert className="h-3 w-3" />
          {reason === "blocked"
            ? "Host blocks iframe embedding (X-Frame-Options / CSP)"
            : "Runs best in a dedicated browser tab"}
        </p>
      </div>
    </div>
  );
}

export function PlaygroundWorkspace() {
  const params = useSearchParams();
  const router = useRouter();
  const { recordLabVisit, progress, favorites } = useApp();
  const initial = getLab(params.get("lab") ?? "") ?? labs[0];
  const [selectedId, setSelectedId] = useState(initial.id);
  const [frameKey, setFrameKey] = useState(0);
  const [frameState, setFrameState] = useState<FrameState>("loading");
  const frameRef = useRef<HTMLDivElement>(null);
  const visited = useRef<Set<string>>(new Set());

  const selected = useMemo(
    () => getLab(selectedId) ?? labs[0],
    [selectedId],
  );

  useEffect(() => {
    const fromQuery = getLab(params.get("lab") ?? "");
    if (fromQuery && fromQuery.id !== selectedId) {
      setSelectedId(fromQuery.id);
    }
  }, [params, selectedId]);

  useEffect(() => {
    if (visited.current.has(selected.id)) return;
    visited.current.add(selected.id);
    recordLabVisit(selected.id);
  }, [selected.id, recordLabVisit]);

  useEffect(() => {
    setFrameState(selected.embeddable ? "loading" : "blocked");
    setFrameKey((value) => value + 1);
    const timer = window.setTimeout(() => {
      setFrameState((state) => (state === "loading" ? "blocked" : state));
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [selected.id, selected.embeddable]);

  const selectLab = useCallback(
    (id: string) => {
      setSelectedId(id);
      setFrameKey((value) => value + 1);
      router.replace(`/playground?lab=${id}`, { scroll: false });
    },
    [router],
  );

  const reload = useCallback(() => {
    if (!selected.embeddable) return;
    setFrameState("loading");
    setFrameKey((value) => value + 1);
    window.setTimeout(() => {
      setFrameState((state) => (state === "loading" ? "blocked" : state));
    }, 10000);
  }, [selected.embeddable]);

  async function fullscreen() {
    try {
      await frameRef.current?.requestFullscreen();
    } catch {
      /* progressive enhancement */
    }
  }

  return (
    <div className="container-wide">
      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-ink/[0.08] bg-white p-3 shadow-[0_20px_60px_-45px_rgba(17,17,17,0.4)]">
            <div className="flex items-center justify-between px-2 pb-2 pt-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted/70">
                Lab switcher
              </p>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[8.5px] font-semibold uppercase tracking-[0.1em] text-emerald-700">
                7 online
              </span>
            </div>
            <nav className="flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:grid lg:gap-1 lg:overflow-visible lg:pb-0">
              {labs.map((lab) => {
                const active = lab.id === selected.id;
                const visitedLab = Boolean(progress[lab.id]);
                return (
                  <button
                    key={lab.id}
                    onClick={() => selectLab(lab.id)}
                    className={cn(
                      "group flex min-w-[185px] items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors lg:min-w-0",
                      active
                        ? "bg-ink text-white"
                        : "text-ink-muted hover:bg-warm hover:text-ink",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                        active
                          ? "bg-spark-yellow text-ink"
                          : "bg-warm text-ink/70 group-hover:bg-white",
                      )}
                    >
                      <LabGlyph icon={lab.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[9px] font-semibold opacity-50">
                          {lab.number}
                        </span>
                        <span className="truncate text-[12px] font-semibold">
                          {lab.name}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 flex items-center gap-1 text-[9px]",
                          active ? "text-white/45" : "text-ink-muted/60",
                        )}
                      >
                        {visitedLab ? (
                          <>
                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                            Visited
                          </>
                        ) : lab.embeddable ? (
                          <>
                            <Wifi className="h-2.5 w-2.5" />
                            Embeddable
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-2.5 w-2.5" />
                            External app
                          </>
                        )}
                      </span>
                    </span>
                    {active && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-spark-yellow" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-3 rounded-2xl bg-warm/80 p-3.5">
              <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted/70">
                Session progress
                <span className="text-ink">
                  {Object.keys(progress).length}/7
                </span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-spark-yellow transition-all duration-500"
                  style={{
                    width: `${(Object.keys(progress).length / 7) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Link
                  href="/dashboard"
                  className="text-[10px] font-semibold text-ink hover:text-spark-dark"
                >
                  Open dashboard
                </Link>
                <span className="text-[9px] text-ink-muted/60">
                  {favorites.labs.length} saved
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/explore#campus"
            className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-ink/[0.08] bg-white px-4 py-3 text-[11px] font-semibold text-ink-muted transition-colors hover:border-spark-dark/30 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to campus
          </Link>
        </aside>

        <div className="min-w-0">
          <div className="rounded-3xl border border-ink/[0.08] bg-white p-4 shadow-[0_20px_60px_-45px_rgba(17,17,17,0.35)] sm:p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink text-spark-yellow">
                  <LabGlyph icon={selected.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-spark-dark">
                      Lab {selected.number}
                    </p>
                    <span className="h-1 w-1 rounded-full bg-ink/20" />
                    <p className="text-[9px] uppercase tracking-[0.14em] text-ink-muted/60">
                      {selected.tagline}
                    </p>
                  </div>
                  <h2 className="truncate font-display text-xl font-semibold sm:text-2xl">
                    {selected.name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {selected.embeddable && (
                  <button
                    onClick={reload}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition-colors hover:bg-warm hover:text-ink"
                    aria-label="Reload embedded lab"
                    title="Reload"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                )}
                {frameState === "ready" && (
                  <button
                    onClick={fullscreen}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition-colors hover:bg-warm hover:text-ink"
                    aria-label="Fullscreen lab"
                    title="Fullscreen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                )}
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={buttonClass("dark", "sm")}
                >
                  Open in new tab <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div
              ref={frameRef}
              className="relative mt-4 h-[62vh] min-h-[480px] overflow-hidden rounded-2xl border border-ink/10 bg-[#f6f6f2] lg:h-[70vh]"
            >
              {selected.embeddable && frameState !== "blocked" && (
                <iframe
                  key={frameKey}
                  src={selected.url}
                  title={`${selected.name} interactive lab`}
                  className="h-full w-full border-0 bg-white"
                  allow="fullscreen; clipboard-read; clipboard-write; autoplay"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setFrameState("ready")}
                />
              )}

              <AnimatePresence mode="wait">
                {frameState === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#f6f6f2]"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-spark-yellow">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </span>
                    <p className="font-display text-sm font-semibold">
                      Connecting to {selected.name}…
                    </p>
                    <p className="max-w-xs text-center text-[10.5px] leading-relaxed text-ink-muted">
                      If this host blocks embedding, a launch card will appear
                      automatically.
                    </p>
                    <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-ink/10 bg-white/80 px-3 py-1.5 text-[9px] text-ink-muted">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-spark-dark" />
                      Cross-origin secure frame
                    </span>
                  </motion.div>
                )}

                {frameState === "blocked" && (
                  <motion.div
                    key="blocked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0"
                  >
                    <LaunchCard
                      lab={selected}
                      reason="blocked"
                      onRetry={selected.embeddable ? reload : undefined}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-ink/[0.06] bg-warm/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-spark-dark" />
                <p className="max-w-xl text-[10.5px] leading-relaxed text-ink-muted">
                  Some lab hosts apply security headers that block framing. In
                  that case use <strong className="text-ink">Open in new tab</strong>{" "}
                  — every one of the seven applications is verified and live.
                </p>
              </div>
              <a
                href={selected.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex shrink-0 items-center gap-1 text-[10.5px] font-semibold text-ink hover:text-spark-dark"
              >
                {new URL(selected.url).hostname}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {selected.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-ink/[0.08] bg-white px-2.5 py-1 text-[10px] text-ink-muted"
                >
                  {skill}
                </span>
              ))}
              <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-ink-muted">
                <Sparkles className="h-3 w-3 text-spark-dark" />
                {progress[selected.id]?.percent ?? 0}% explored
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink/[0.07] bg-white p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-muted/60">
                What you will learn
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
                {selected.longDescription}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-ink/[0.07] bg-white p-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-muted/60">
                  Keep exploring
                </p>
                <p className="mt-1 font-display text-sm font-semibold">
                  Move to the next protocol, board or robot.
                </p>
              </div>
              <button
                onClick={() => {
                  const index = labs.findIndex((lab) => lab.id === selected.id);
                  const next = labs[(index + 1) % labs.length];
                  selectLab(next.id);
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-spark-yellow text-ink transition-transform hover:translate-x-0.5"
                aria-label="Next lab"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {labs.slice(0, 4).map((lab) => (
          <button
            key={lab.id}
            onClick={() => selectLab(lab.id)}
            className="group flex items-center gap-3 rounded-2xl border border-ink/[0.07] bg-white p-3 text-left transition-colors hover:border-spark-dark/40 hover:bg-warm/60"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warm text-ink/70 group-hover:bg-spark-yellow group-hover:text-ink">
              <LabGlyph icon={lab.icon} className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[11.5px] font-semibold">
                {lab.name}
              </span>
              <span className="block truncate text-[9.5px] text-ink-muted">
                {lab.tagline}
              </span>
            </span>
            <Play className="ml-auto h-3 w-3 shrink-0 fill-current text-ink-muted/40 group-hover:text-spark-dark" />
          </button>
        ))}
      </div>
    </div>
  );
}
