"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ExternalLink,
  Filter,
  Search,
  Star,
  X,
} from "lucide-react";
import {
  toolCategories,
  tools,
  type Tool,
  type ToolCategoryId,
} from "@/src/lib/tools";
import { getLab } from "@/src/lib/labs";
import { buttonClass } from "@/components/shared/button";
import { CategoryGlyph, ToolGlyph } from "@/components/shared/icons";
import { useApp } from "@/src/lib/store/app-provider";
import { cn } from "@/src/lib/utils";

type FilterId = ToolCategoryId | "all";

export function ToolsExplorer() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const { isFavorite, toggleFavorite, recordToolView } = useApp();

  useEffect(() => {
    const cat = searchParams.get("category");
    if (
      cat &&
      toolCategories.some((item) => item.id === cat)
    ) {
      setCategory(cat as ToolCategoryId);
    }
    const tool = searchParams.get("tool");
    if (tool && tools.some((item) => item.id === tool)) {
      setActiveId(tool);
      recordToolView(tool);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      tools.filter((tool) => {
        const matchesCategory =
          category === "all" || tool.category === category;
        const matchesQuery =
          !normalized ||
          `${tool.name} ${tool.domain} ${tool.description} ${tool.learning}`
            .toLowerCase()
            .includes(normalized);
        return matchesCategory && matchesQuery;
      }),
    [category, normalized],
  );

  const groups = useMemo(
    () =>
      toolCategories
        .map((group) => ({
          ...group,
          tools: filtered.filter((tool) => tool.category === group.id),
        }))
        .filter((group) => group.tools.length > 0),
    [filtered],
  );

  const activeTool = tools.find((tool) => tool.id === activeId) ?? null;

  function openTool(tool: Tool) {
    setActiveId(tool.id);
    recordToolView(tool.id);
  }

  return (
    <>
      <div className="container-wide">
        <div className="flex flex-col gap-4 rounded-3xl border border-ink/[0.08] bg-white p-4 shadow-[0_20px_60px_-40px_rgba(17,17,17,0.4)] sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar lg:pb-0">
            <span className="mr-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted/60">
              <Filter className="h-3.5 w-3.5" /> Filter
            </span>
            <button
              onClick={() => setCategory("all")}
              className={cn("chip shrink-0", category === "all" && "chip-active")}
            >
              All tools
              <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[9px]">
                {tools.length}
              </span>
            </button>
            {toolCategories.map((item) => (
              <button
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={cn(
                  "chip shrink-0",
                  category === item.id && "chip-active",
                )}
              >
                <CategoryGlyph category={item.id} className="h-3.5 w-3.5" />
                {item.shortTitle}
                <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[9px]">
                  {tools.filter((tool) => tool.category === item.id).length}
                </span>
              </button>
            ))}
          </div>

          <label className="relative flex w-full items-center gap-2 rounded-full border border-ink/10 bg-warm/60 px-4 py-2.5 lg:w-64">
            <Search className="h-4 w-4 text-ink-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools…"
              className="w-full border-0 bg-transparent text-[12.5px] outline-none placeholder:text-ink-muted/60"
              aria-label="Search tools"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X className="h-3.5 w-3.5 text-ink-muted" />
              </button>
            )}
          </label>
        </div>

        {query && (
          <p className="mt-3 px-1 text-[11px] text-ink-muted">
            {filtered.length} result{filtered.length === 1 ? "" : "s"} for “
            {query}”
          </p>
        )}

        <div className="mt-10 space-y-12">
          {groups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-28">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-spark-yellow">
                    <CategoryGlyph category={group.id} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-spark-dark">
                      Category {group.number}
                    </p>
                    <h2 className="font-display text-2xl font-semibold tracking-tight">
                      {group.title}
                    </h2>
                    <p className="mt-1 max-w-xl text-[12.5px] leading-relaxed text-ink-muted">
                      {group.description}
                    </p>
                  </div>
                </div>
                <span className="chip w-fit">
                  {group.tools.length} tool{group.tools.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {group.tools.map((tool, index) => {
                  const favorite = isFavorite("tool", tool.id);
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: index * 0.04 }}
                      className="group relative flex h-full flex-col rounded-3xl border border-ink/[0.08] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-spark-dark/40 hover:shadow-card"
                    >
                      <div className="flex items-start justify-between">
                        <ToolGlyph
                          monogram={tool.monogram}
                          color={tool.color}
                          className="h-12 w-12 text-sm"
                        />
                        <div className="flex items-center gap-1">
                          {tool.featured && (
                            <span className="rounded-full bg-spark-yellow/15 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-spark-dark">
                              Popular
                            </span>
                          )}
                          <button
                            onClick={() => toggleFavorite("tool", tool.id)}
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                              favorite
                                ? "bg-spark-yellow/15 text-spark-dark"
                                : "text-ink-muted/40 hover:bg-ink/[0.04] hover:text-spark-dark",
                            )}
                            aria-label={
                              favorite
                                ? "Remove tool from favorites"
                                : "Add tool to favorites"
                            }
                          >
                            <Star
                              className={cn(
                                "h-3.5 w-3.5",
                                favorite && "fill-current",
                              )}
                            />
                          </button>
                        </div>
                      </div>

                      <h3 className="mt-4 font-display text-lg font-semibold leading-tight">
                        {tool.name}
                      </h3>
                      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-spark-dark">
                        {tool.domain}
                      </p>
                      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-muted">
                        {tool.description}
                      </p>

                      <div className="mt-4 rounded-xl border border-ink/[0.06] bg-warm/70 p-3">
                        <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-muted/70">
                          <BookOpen className="h-3 w-3" /> Learning application
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                          {tool.learning}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4">
                        <button
                          onClick={() => openTool(tool)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink transition-colors hover:text-spark-dark"
                        >
                          Explore tool <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        {tool.url && (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 text-[10px] text-ink-muted/70 transition-colors hover:text-ink"
                            aria-label={`Open official ${tool.name} website`}
                          >
                            Official <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}

          {groups.length === 0 && (
            <div className="rounded-3xl border border-dashed border-ink/15 py-16 text-center">
              <p className="font-display text-xl font-semibold">
                No tools match this search.
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Try a different term, or clear the filters.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
                className={buttonClass("outline", "sm", "mt-4")}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeTool && (
          <motion.div
            className="fixed inset-0 z-[130] flex items-end justify-center bg-ink/50 p-3 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveId(null);
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeTool.name} details`}
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-ink/10 bg-white shadow-2xl"
            >
              <div className="relative overflow-hidden bg-ink px-6 py-6 text-white">
                <div className="pointer-events-none absolute inset-0 dark-circuit opacity-70" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ToolGlyph
                      monogram={activeTool.monogram}
                      color={activeTool.color}
                      className="h-14 w-14 text-base"
                    />
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-spark-light/70">
                        {toolCategories.find((item) => item.id === activeTool.category)?.title}
                      </p>
                      <h3 className="font-display text-2xl font-semibold">
                        {activeTool.name}
                      </h3>
                      <p className="text-[11px] text-white/50">{activeTool.domain}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveId(null)}
                    className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Close tool details"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-[13px] leading-relaxed text-ink-muted">
                  {activeTool.description}
                </p>

                <div className="mt-5 rounded-2xl border border-ink/[0.07] bg-warm/70 p-4">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted/70">
                    <BookOpen className="h-3.5 w-3.5" /> How students learn with it
                  </p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink">
                    {activeTool.learning}
                  </p>
                </div>

                {activeTool.relatedLab && (
                  <Link
                    href={`/playground?lab=${activeTool.relatedLab}`}
                    onClick={() => setActiveId(null)}
                    className="mt-3 flex items-center justify-between rounded-2xl border border-spark-dark/20 bg-spark-yellow/[0.08] px-4 py-3 transition-colors hover:bg-spark-yellow/15"
                  >
                    <span>
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-spark-dark">
                        Apply it in
                      </span>
                      <span className="block text-[12.5px] font-semibold">
                        {getLab(activeTool.relatedLab)?.name}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  {activeTool.url ? (
                    <a
                      href={activeTool.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={cn(buttonClass("primary"), "flex-1")}
                    >
                      Open official tool <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <div className="flex flex-1 items-center justify-center rounded-full border border-ink/10 bg-warm px-5 py-3.5 text-center text-[11px] text-ink-muted">
                      Available inside Nano Playground learning activities
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite("tool", activeTool.id)}
                    className={cn(
                      buttonClass("outline"),
                      "sm:w-auto",
                      isFavorite("tool", activeTool.id) &&
                        "border-spark-dark/40 bg-spark-yellow/10",
                    )}
                  >
                    {isFavorite("tool", activeTool.id) ? (
                      <>
                        <Check className="h-4 w-4" /> Saved
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4" /> Save tool
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-3 text-[9.5px] text-ink-muted/60">
                  Official links open the tool&apos;s public website. Tools
                  without a verified public URL are used inside guided lab
                  activities.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
