"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { labs } from "@/src/lib/labs";
import { tools } from "@/src/lib/tools";
import { navigation } from "@/src/lib/site";
import { LabGlyph, ToolGlyph } from "@/components/shared/icons";
import { cn } from "@/src/lib/utils";

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const normalized = query.trim().toLowerCase();

  const labResults = useMemo(
    () =>
      labs.filter((lab) =>
        `${lab.name} ${lab.description} ${lab.skills.join(" ")}`
          .toLowerCase()
          .includes(normalized),
      ),
    [normalized],
  );

  const toolResults = useMemo(
    () =>
      tools
        .filter((tool) =>
          `${tool.name} ${tool.domain} ${tool.description}`
            .toLowerCase()
            .includes(normalized),
        )
        .slice(0, 6),
    [normalized],
  );

  const pageResults = useMemo(
    () =>
      navigation.filter((item) =>
        item.label.toLowerCase().includes(normalized),
      ),
    [normalized],
  );

  const results = useMemo(
    () => [
      ...labResults.map((lab) => ({
        key: `lab-${lab.id}`,
        href: `/playground?lab=${lab.id}`,
      })),
      ...toolResults.map((tool) => ({
        key: `tool-${tool.id}`,
        href: `/tools?tool=${tool.id}`,
      })),
      ...pageResults.map((page) => ({
        key: `page-${page.href}`,
        href: page.href,
      })),
    ],
    [labResults, toolResults, pageResults],
  );

  const hasResults = results.length > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [normalized, open]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.length) {
        setActiveIndex((index) => (index + 1) % results.length);
      }
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length) {
        setActiveIndex(
          (index) => (index - 1 + results.length) % results.length,
        );
      }
      return;
    }
    if (event.key === "Enter") {
      const target = results[activeIndex] ?? results[0];
      if (target) go(target.href);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex justify-center bg-ink/45 px-4 pt-[10vh] backdrop-blur-sm sm:pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Search Nano Playground"
        >
          <motion.div
            initial={{ y: -16, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-fit max-h-[74vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_40px_120px_-40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
              <Search className="h-5 w-5 text-ink-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search labs, tools, pages…"
                className="h-8 flex-1 border-0 bg-transparent text-[15px] outline-none placeholder:text-ink-muted/60"
              />
              <button
                onClick={onClose}
                className="rounded-full p-2 text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[58vh] overflow-y-auto px-3 py-4">
              {!normalized && (
                <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted/70">
                  Jump into the playground
                </p>
              )}

              {labResults.length > 0 && (
                <div className="mb-2">
                  {normalized && (
                    <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted/70">
                      Labs
                    </p>
                  )}
                  {labResults.map((lab, index) => (
                    <button
                      key={lab.id}
                      onClick={() => go(`/playground?lab=${lab.id}`)}
                      onMouseEnter={() => setActiveIndex(index)}
                      aria-current={activeIndex === index ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                        activeIndex === index ? "bg-warm" : "hover:bg-warm",
                      )}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-spark-yellow">
                        <LabGlyph icon={lab.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                          {lab.number} · {lab.name}
                        </span>
                        <span className="block truncate text-xs text-ink-muted">
                          {lab.tagline}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-ink-muted/50" />
                    </button>
                  ))}
                </div>
              )}

              {toolResults.length > 0 && (
                <div className="mb-2">
                  <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted/70">
                    Tools & platforms
                  </p>
                  {toolResults.map((tool, index) => {
                    const resultIndex = labResults.length + index;
                    return (
                    <button
                      key={tool.id}
                      onClick={() => go(`/tools?tool=${tool.id}`)}
                      onMouseEnter={() => setActiveIndex(resultIndex)}
                      aria-current={activeIndex === resultIndex ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                        activeIndex === resultIndex ? "bg-warm" : "hover:bg-warm",
                      )}
                    >
                      <ToolGlyph
                        monogram={tool.monogram}
                        color={tool.color}
                        className="h-9 w-9"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                          {tool.name}
                        </span>
                        <span className="block truncate text-xs text-ink-muted">
                          {tool.domain}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-ink-muted/50" />
                    </button>
                    );
                  })}
                </div>
              )}

              {pageResults.length > 0 && (
                <div>
                  <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted/70">
                    Pages
                  </p>
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                    {pageResults.map((item, index) => {
                      const resultIndex = labResults.length + toolResults.length + index;
                      return (
                        <button
                          key={item.href}
                          onClick={() => go(item.href)}
                          onMouseEnter={() => setActiveIndex(resultIndex)}
                          aria-current={
                            activeIndex === resultIndex ? "true" : undefined
                          }
                          className={cn(
                            "rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                            activeIndex === resultIndex
                              ? "bg-warm text-ink"
                              : "text-ink-muted hover:bg-warm hover:text-ink",
                          )}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {!hasResults && (
                <div className="px-3 py-12 text-center">
                  <p className="font-display text-lg font-semibold">
                    Nothing found for “{query}”
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    Try “Arduino”, “ESP32”, “rover”, “Python” or “AI”.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-ink/10 bg-warm/60 px-5 py-3 text-[10px] text-ink-muted">
              <span className="hidden sm:inline">
                <kbd className="rounded border border-ink/10 bg-white px-1.5 py-0.5 font-sans">
                  ↑ ↓
                </kbd>{" "}
                navigate ·{" "}
                <kbd className="rounded border border-ink/10 bg-white px-1.5 py-0.5 font-sans">
                  ↵
                </kbd>{" "}
                open
              </span>
              <span className={cn("flex items-center gap-1", "sm:ml-auto")}>
                <kbd className="rounded border border-ink/10 bg-white px-1.5 py-0.5 font-sans">
                  esc
                </kbd>{" "}
                close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Link };
