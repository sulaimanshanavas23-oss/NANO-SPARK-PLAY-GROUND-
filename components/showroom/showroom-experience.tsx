"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Rotate3D,
  RotateCcw,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { tools, toolCategories, type Tool, type ToolCategoryId } from "@/src/lib/tools";
import { assets } from "@/src/lib/assets";
import { getLab } from "@/src/lib/labs";
import { buttonClass } from "@/components/shared/button";
import { CategoryGlyph, ToolGlyph } from "@/components/shared/icons";
import { useWebGLAvailable } from "@/components/shared/webgl";
import { useApp } from "@/src/lib/store/app-provider";
import { cn } from "@/src/lib/utils";

const ShowroomCanvas = dynamic(
  () => import("@/components/showroom/showroom-canvas"),
  { ssr: false },
);

type FilterId = ToolCategoryId | "all";
const PAGE_SIZE = 8;

export function ShowroomExperience() {
  const webgl = useWebGLAvailable();
  const reduceMotion = useReducedMotion() ?? false;
  const [category, setCategory] = useState<FilterId>("all");
  const [page, setPage] = useState(0);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const { isFavorite, toggleFavorite, recordToolView } = useApp();

  const filtered = useMemo(
    () =>
      category === "all"
        ? tools
        : tools.filter((tool) => tool.category === category),
    [category],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  function selectCategory(next: FilterId) {
    setCategory(next);
    setPage(0);
    setActiveTool(null);
    setResetSignal((value) => value + 1);
  }

  function selectTool(tool: Tool) {
    setActiveTool(tool);
    recordToolView(tool.id);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-3xl border border-ink/[0.08] bg-white p-3 shadow-[0_20px_60px_-40px_rgba(17,17,17,0.4)] sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar lg:pb-0">
          <span className="mr-1 inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted/60">
            <Boxes className="h-3.5 w-3.5" /> Floor
          </span>
          <button
            onClick={() => selectCategory("all")}
            className={cn("chip shrink-0", category === "all" && "chip-active")}
          >
            All exhibits
          </button>
          {toolCategories.map((item) => (
            <button
              key={item.id}
              onClick={() => selectCategory(item.id)}
              className={cn("chip shrink-0", category === item.id && "chip-active")}
            >
              <CategoryGlyph category={item.id} className="h-3.5 w-3.5" />
              {item.shortTitle}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <span className="text-[10.5px] text-ink-muted">
            {filtered.length} exhibits · floor {page + 1} / {pages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((value) => Math.max(0, value - 1))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition-colors hover:bg-warm disabled:opacity-30"
              aria-label="Previous showroom floor"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((value) => Math.min(pages - 1, value + 1))}
              disabled={page >= pages - 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition-colors hover:bg-warm disabled:opacity-30"
              aria-label="Next showroom floor"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-4 h-[560px] overflow-hidden rounded-[28px] border border-ink/10 bg-[#f5f5f2] shadow-[0_30px_90px_-50px_rgba(17,17,17,0.5)] sm:h-[640px] lg:h-[720px]">
        {webgl === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-spark-yellow">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </span>
            <p className="font-display text-sm font-semibold">
              Preparing the showroom floor…
            </p>
          </div>
        )}

        {webgl === false && (
          <div className="absolute inset-0">
            <Image
              src={assets.images.toolsPlatforms}
              alt="The Nano Spark tools and platforms showroom reference"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-spark-yellow" />
                Static showroom preview · WebGL unavailable
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {visible.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => selectTool(tool)}
                    className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-left text-[11px] text-white backdrop-blur transition-colors hover:border-spark-yellow/60 hover:bg-white/20"
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {webgl === true && (
          <ShowroomCanvas
            key={`${category}-${page}`}
            items={visible}
            onSelect={selectTool}
            autoRotate={autoRotate}
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
                Technology showroom · live 3D
              </span>
            </div>

            <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-ink/90 p-1.5 text-white shadow-2xl backdrop-blur-md">
              <button
                onClick={() => setAutoRotate((value) => !value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-medium transition-colors",
                  autoRotate
                    ? "bg-spark-yellow text-ink"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
                aria-pressed={autoRotate}
              >
                <Rotate3D className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Auto-rotate</span>
              </button>
              <span className="h-4 w-px bg-white/15" />
              <button
                onClick={() => setResetSignal((value) => value + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Reset showroom camera"
                title="Reset camera"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="pointer-events-none absolute bottom-4 right-4 z-20 hidden items-center gap-2 rounded-full border border-ink/10 bg-white/85 px-3 py-1.5 text-[10px] text-ink-muted shadow-sm backdrop-blur lg:flex">
              Drag to orbit · Scroll to zoom · Click an exhibit
            </div>

            <AnimatePresence>
              {activeTool && (
                <motion.aside
                  key={activeTool.id}
                  initial={{ opacity: 0, x: 24, y: 8 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-3 bottom-16 z-30 max-h-[55%] overflow-y-auto rounded-2xl border border-white/10 bg-ink/95 p-4 text-white shadow-2xl backdrop-blur sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-16 sm:max-h-[calc(100%-160px)] sm:w-[310px] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <ToolGlyph
                        monogram={activeTool.monogram}
                        color={activeTool.color}
                        className="h-9 w-9"
                      />
                      <div>
                        <p className="text-[8.5px] font-semibold uppercase tracking-[0.2em] text-spark-light/80">
                          {toolCategories.find((item) => item.id === activeTool.category)?.shortTitle}
                        </p>
                        <p className="font-display text-lg font-semibold leading-tight">
                          {activeTool.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTool(null)}
                      className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Close exhibit details"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-white/60">
                    {activeTool.description}
                  </p>
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-[8.5px] font-semibold uppercase tracking-[0.16em] text-spark-light/70">
                      Learning application
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/60">
                      {activeTool.learning}
                    </p>
                  </div>
                  {activeTool.relatedLab && (
                    <Link
                      href={`/playground?lab=${activeTool.relatedLab}`}
                      className="mt-2 flex items-center justify-between rounded-xl border border-spark-yellow/20 bg-spark-yellow/[0.08] px-3 py-2.5 text-[11px] transition-colors hover:bg-spark-yellow/15"
                    >
                      <span>
                        Apply in{" "}
                        <span className="font-semibold">
                          {getLab(activeTool.relatedLab)?.name}
                        </span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  <div className="mt-4 flex gap-2">
                    {activeTool.url ? (
                      <a
                        href={activeTool.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={cn(buttonClass("primary", "sm"), "flex-1 text-[11px]")}
                      >
                        Open tool <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="flex flex-1 items-center justify-center rounded-full border border-white/15 px-3 py-2.5 text-center text-[10px] text-white/50">
                        Used in guided lab activities
                      </span>
                    )}
                    <button
                      onClick={() => toggleFavorite("tool", activeTool.id)}
                      className={cn(
                        buttonClass("outline", "sm"),
                        "border-white/20 bg-transparent px-3 text-white hover:bg-white/10 hover:text-white",
                      )}
                      aria-label="Toggle tool favorite"
                    >
                      <Star
                        className={cn(
                          "h-3.5 w-3.5",
                          isFavorite("tool", activeTool.id) &&
                            "fill-spark-yellow text-spark-yellow",
                        )}
                      />
                    </button>
                  </div>
                  <a
                    href={activeTool.url ?? "/tools"}
                    target={activeTool.url ? "_blank" : undefined}
                    rel={activeTool.url ? "noreferrer noopener" : undefined}
                    className="mt-3 inline-flex items-center gap-1 text-[9.5px] text-white/35 transition-colors hover:text-white/70"
                  >
                    {activeTool.url ? "Official website" : "View in tool library"}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </motion.aside>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-ink-muted">
        <p className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
          Every exhibit is a real 3D object on a walkable floor.
        </p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-1 font-semibold text-ink transition-colors hover:text-spark-dark"
        >
          Browse the full tool library <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
