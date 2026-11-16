"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Filter, Wrench } from "lucide-react";
import { projectIdeas } from "@/src/lib/site";
import { getLab } from "@/src/lib/labs";
import { cn } from "@/src/lib/utils";

const allTags = Array.from(
  new Set(projectIdeas.flatMap((project) => project.tags)),
);

export function ProjectGallery() {
  const [active, setActive] = useState("All");
  const reduced = useReducedMotion() ?? false;

  const filtered = useMemo(
    () =>
      active === "All"
        ? projectIdeas
        : projectIdeas.filter((project) => project.tags.includes(active)),
    [active],
  );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="flex shrink-0 items-center gap-1.5 pr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted/60">
            <Filter className="h-3.5 w-3.5" /> Filter
          </span>
          {["All", ...allTags].map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors",
                active === tag
                  ? "border-ink bg-ink text-white"
                  : "border-ink/10 bg-white text-ink-muted hover:border-spark-dark/50 hover:text-ink",
              )}
              aria-pressed={active === tag}
            >
              {tag}
            </button>
          ))}
        </div>
        <p className="shrink-0 text-[10.5px] text-ink-muted/60">
          {filtered.length} of {projectIdeas.length} builds
        </p>
      </div>

      <motion.div layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => {
            const lab = getLab(project.lab);
            return (
              <motion.article
                layout
                key={project.title}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/[0.08] bg-white transition-all duration-500 hover:-translate-y-1 hover:border-spark-dark/40 hover:shadow-card"
              >
                <Link
                  href={`/playground?lab=${project.lab}`}
                  className="relative block aspect-[16/10] overflow-hidden"
                >
                  <Image
                    src={project.image}
                    alt={`${project.title} student project`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold text-ink backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {lab?.name ?? "Nano lab"}
                  </span>
                  <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-spark-yellow text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-ink/[0.08] bg-warm px-2 py-0.5 text-[9.5px] text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[11.5px] leading-relaxed text-ink-muted">
                    {project.summary}
                  </p>
                  <Link
                    href={`/playground?lab=${project.lab}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-ink transition-colors hover:text-spark-dark"
                  >
                    <Wrench className="h-3 w-3" /> Build in {lab?.shortName ?? "lab"}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-ink/15 p-10 text-center">
          <p className="text-[12px] text-ink-muted">
            No builds match that filter yet.
          </p>
        </div>
      )}
    </div>
  );
}
