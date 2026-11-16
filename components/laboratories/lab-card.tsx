"use client";

import Link from "next/link";
import { ArrowUpRight, Play, Star } from "lucide-react";
import type { Lab } from "@/src/lib/labs";
import { LabGlyph } from "@/components/shared/icons";
import { useApp } from "@/src/lib/store/app-provider";
import { cn } from "@/src/lib/utils";

export function LabCard({
  lab,
  className,
}: {
  lab: Lab;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useApp();
  const favorite = isFavorite("lab", lab.id);

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/[0.08] bg-white p-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-spark-dark/40 hover:shadow-card sm:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-spark-yellow/0 blur-2xl transition-colors duration-500 group-hover:bg-spark-yellow/25" />
      <div className="flex items-start justify-between">
        <Link
          href={`/playground?lab=${lab.id}`}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-spark-yellow transition-transform duration-500 group-hover:scale-105"
          aria-label={`Open ${lab.name}`}
        >
          <LabGlyph icon={lab.icon} className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="font-display text-[11px] font-semibold tracking-[0.18em] text-ink-muted/50">
            LAB {lab.number}
          </span>
          <button
            onClick={() => toggleFavorite("lab", lab.id)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              favorite
                ? "bg-spark-yellow/15 text-spark-dark"
                : "text-ink-muted/40 hover:bg-ink/[0.04] hover:text-spark-dark",
            )}
            aria-label={
              favorite ? "Remove lab from favorites" : "Add lab to favorites"
            }
          >
            <Star className={cn("h-3.5 w-3.5", favorite && "fill-current")} />
          </button>
        </div>
      </div>

      <Link href={`/playground?lab=${lab.id}`} className="mt-5 block">
        <h3 className="font-display text-xl font-semibold tracking-tight">
          {lab.name}
        </h3>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-spark-dark">
          {lab.tagline}
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
          {lab.description}
        </p>
      </Link>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {lab.skills.slice(0, 2).map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-ink/[0.08] bg-warm px-2.5 py-1 text-[10px] text-ink-muted"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-ink/[0.06] pt-4">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-ink-muted/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Lab online
        </span>
        <Link
          href={`/playground?lab=${lab.id}`}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink transition-colors group-hover:text-spark-dark"
        >
          <Play className="h-3 w-3 fill-current" />
          Enter lab
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
