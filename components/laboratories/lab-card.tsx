"use client";

import Link from "next/link";
import { ArrowUpRight, Play, Star } from "lucide-react";
import type { Lab } from "@/src/lib/labs";
import { LabGlyph } from "@/components/shared/icons";
import { Lab3DPreview } from "@/components/laboratories/lab-3d-preview";
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
  const external = !lab.embeddable;
  const detailHref = `/playground?lab=${lab.id}`;

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/[0.08] bg-white p-4 transition-all duration-500 hover:-translate-y-1.5 hover:border-spark-dark/40 hover:shadow-card sm:p-5",
        className,
      )}
    >
      <Lab3DPreview lab={lab} className="h-40 w-full sm:h-44" />

      <div className="mt-4 flex items-start justify-between">
        <Link
          href={detailHref}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-spark-yellow transition-transform duration-500 group-hover:scale-105"
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

      <Link href={detailHref} className="mt-4 block">
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
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              external ? "bg-spark-dark" : "bg-emerald-500",
            )}
          />
          {external ? "Opens in a new tab" : "Lab online"}
        </span>
        {external ? (
          <a
            href={lab.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink transition-colors group-hover:text-spark-dark"
          >
            <Play className="h-3 w-3 fill-current" />
            Open lab
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ) : (
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink transition-colors group-hover:text-spark-dark"
          >
            <Play className="h-3 w-3 fill-current" />
            Enter lab
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
