"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Expand,
  Minus,
  MousePointerClick,
  PackageOpen,
  Plus,
  RotateCcw,
  Rotate3D,
  Sparkles,
} from "lucide-react";
import { labs } from "@/src/lib/labs";
import { assets } from "@/src/lib/assets";
import { LabModelViewer } from "@/components/laboratories/lab-model-viewer";
import { useWebGLAvailable } from "@/components/shared/webgl";
import { cn } from "@/src/lib/utils";

const CampusCanvas = dynamic(() => import("@/components/campus/campus-canvas"), {
  ssr: false,
});

function SceneLoading({ height }: { height: string }) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-[28px] border border-ink/10 bg-[#f3f3ee]",
        height,
      )}
    >
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="relative flex flex-col items-center gap-4">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-spark-yellow shadow-card">
          <Sparkles className="h-6 w-6 animate-pulse" />
          <span className="absolute inset-0 -z-10 animate-ping rounded-2xl bg-spark-yellow/30" />
        </span>
        <p className="font-display text-sm font-semibold">Booting the 3D campus…</p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-muted/70">
          Seven stations · real-time WebGL
        </p>
      </div>
    </div>
  );
}

export function CampusFallback({ height }: { height: string }) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[28px] border border-ink/10 bg-[#f3f3ee]",
        height,
      )}
    >
      <Image
        src={assets.images.labsCampus}
        alt="The seven Nano Spark interactive learning labs arranged on illuminated campus platforms"
        fill
        sizes="(max-width: 1024px) 100vw, 1400px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-spark-yellow" />
          Static campus preview · WebGL unavailable
        </p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {labs.map((lab) => (
            <Link
              key={lab.id}
              href={`/playground?lab=${lab.id}`}
              className="shrink-0 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur transition-colors hover:border-spark-yellow/60 hover:bg-white/20"
            >
              {lab.number} · {lab.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CampusExplorer({
  height = "h-[540px] sm:h-[620px] lg:h-[700px]",
  defaultExploded = false,
  showInstructions = true,
}: {
  height?: string;
  defaultExploded?: boolean;
  showInstructions?: boolean;
}) {
  const webgl = useWebGLAvailable();
  const reduceMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [exploded, setExploded] = useState(defaultExploded);
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);

  const selectedLab = useMemo(
    () => labs.find((lab) => lab.id === selectedId) ?? null,
    [selectedId],
  );

  function clearOpenTimer() {
    if (openTimer.current === null) return;
    window.clearTimeout(openTimer.current);
    openTimer.current = null;
  }

  useEffect(
    () => () => {
      if (openTimer.current !== null) {
        window.clearTimeout(openTimer.current);
      }
    },
    [],
  );

  function handleSelect(id: string | null) {
    clearOpenTimer();
    setSelectedId(id);

    if (!id) {
      setViewerOpen(false);
      return;
    }

    setViewerOpen(false);
    openTimer.current = window.setTimeout(
      () => {
        setViewerOpen(true);
        openTimer.current = null;
      },
      reduceMotion ? 0 : 950,
    );
  }

  function reset() {
    clearOpenTimer();
    setSelectedId(null);
    setViewerOpen(false);
    setExploded(false);
    setAutoRotate(false);
    setZoom(0);
    setResetSignal((value) => value + 1);
  }

  async function enterFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await containerRef.current?.requestFullscreen();
      }
    } catch {
      /* Fullscreen is a progressive enhancement. */
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "group relative w-full overflow-hidden rounded-[28px] border border-ink/10 bg-[#f3f3ee] shadow-[0_30px_90px_-50px_rgba(17,17,17,0.5)]",
          height,
        )}
      >
        {webgl === null && <SceneLoading height={height} />}
        {webgl === false && <CampusFallback height={height} />}
        {webgl === true && (
          <CampusCanvas
            selectedId={selectedId}
            onSelect={handleSelect}
            exploded={exploded}
            autoRotate={autoRotate}
            zoom={zoom}
            resetSignal={resetSignal}
            reduceMotion={reduceMotion}
          />
        )}

        {webgl !== false && (
          <>
            <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink shadow-sm backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                3D Campus · 7 stations
              </span>
              <span className="hidden rounded-full border border-ink/10 bg-white/85 px-3 py-1.5 text-[10px] font-medium text-ink-muted shadow-sm backdrop-blur sm:inline-flex">
                {exploded ? "Exploded view" : "Assembled"}
              </span>
            </div>

            <div className="absolute right-4 top-4 z-20 hidden items-center gap-2 sm:flex">
              <button
                onClick={enterFullscreen}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/85 text-ink-muted shadow-sm backdrop-blur transition-colors hover:text-ink"
                aria-label="Toggle fullscreen campus"
              >
                <Expand className="h-4 w-4" />
              </button>
            </div>



            <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-ink/90 p-1.5 text-white shadow-2xl backdrop-blur-md">
              <button
                onClick={() => setExploded((value) => !value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-medium transition-colors",
                  exploded
                    ? "bg-spark-yellow text-ink"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                {exploded ? (
                  <PackageOpen className="h-3.5 w-3.5" />
                ) : (
                  <Boxes className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {exploded ? "Assemble" : "Explode"}
                </span>
              </button>
              <span className="h-4 w-px bg-white/15" />
              <button
                onClick={reset}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Recenter view"
                title="Recenter view"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setAutoRotate((value) => !value)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  autoRotate
                    ? "bg-spark-yellow/20 text-spark-yellow"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
                aria-label="Toggle auto-rotate"
                aria-pressed={autoRotate}
                title="Auto-rotate"
              >
                <Rotate3D className="h-3.5 w-3.5" />
              </button>
              <span className="h-4 w-px bg-white/15" />
              <button
                onClick={() => setZoom((value) => Math.max(0, value - 1))}
                disabled={zoom === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                aria-label="Zoom out"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoom((value) => Math.min(4, value + 1))}
                disabled={zoom === 4}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                aria-label="Zoom in"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {showInstructions && !selectedLab && (
              <div className="pointer-events-none absolute bottom-4 right-4 z-20 hidden items-center gap-2 rounded-full border border-ink/10 bg-white/85 px-3 py-1.5 text-[10px] text-ink-muted shadow-sm backdrop-blur lg:flex">
                <MousePointerClick className="h-3.5 w-3.5" />
                Drag to rotate · Scroll to zoom · Click a lab
              </div>
            )}
          </>
        )}
      </div>

      {selectedLab && (
        <LabModelViewer
          lab={selectedLab}
          open={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setSelectedId(null);
          }}
        />
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-ink-muted">
        <p className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
          Real-time Three.js campus · assembled and exploded states
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 font-semibold text-ink transition-colors hover:text-spark-dark"
        >
          Explore all labs <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
