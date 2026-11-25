"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Boxes, Star } from "lucide-react";
import type { Lab } from "@/src/lib/labs";
import { LabGlyph } from "@/components/shared/icons";
import { Lab3DPreview } from "@/components/laboratories/lab-3d-preview";
import { LabModelViewer } from "@/components/laboratories/lab-model-viewer";
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
  const detailHref = `/playground?lab=${lab.id}`;
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <div
      className={cn(
        "group relative rounded-3xl border border-ink/[0.08] bg-white p-4 sm:p-5 xl:p-6 transition-all duration-500 hover:-translate-y-1 border-spark-dark/40 hover:shadow-card xl:flex xl:items-stretch xl:gap-3",
        className,
      )}
    >
      <Lab3DPreview
        lab={lab}
        onExpand={() => setViewerOpen(true)}
        className="relative h-48 w-full sm:h-[260px] xl:h-[320px] xl:w-[42%] xl:self-stretch object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col sm:pl-4 xl:pl-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-spark-yellow">
              <LabGlyph icon={lab.icon} className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold truncate">
                {lab.name}
              </h3>
              <Link
                href={detailHref}
                className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted/60 hover:text-ink"
                aria-label={`Open ${lab.name}`}
              >
                LAB {lab.number} <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <button
            onClick={() => toggleFavorite("lab", lab.id)}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
            aria-label={
              favorite ? "Remove lab from favorites" : "Add lab to favorites"
            }
          >
            <Star className={cn("h-3 w-3", favorite && "fill-current")} />
          </button>
        </div>

        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-spark-dark">
          {lab.tagline}
        </p>
        <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-ink/70 xl:line-clamp-4">
          {lab.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {lab.skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-ink/[0.08] bg-warm px-2 py-1 text-[9px] text-ink-muted"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {lab.embeddable ? "Lab online" : "Opens in a new tab"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewerOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-ink/[0.12] bg-white px-3 py-2 text-[11px] font-semibold text-ink transition-colors hover:border-ink/30"
              aria-label={`Open 3D preview of ${lab.name}`}
            >
              <Boxes className="h-3.5 w-3.5" />
              3D
            </button>
            {lab.embeddable ? (
              <Link
                href={detailHref}
                className="flex items-center gap-1.5 rounded-full bg-spark-yellow px-3.5 py-2 text-[11px] font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                Enter Lab
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <a
                href={lab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-spark-yellow px-3.5 py-2 text-[11px] font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                Open lab
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <LabModelViewer
        lab={lab}
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
}