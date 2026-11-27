"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Boxes, Play, Star } from "lucide-react";
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
  const router = useRouter();
  const reduceMotion = useReducedMotion() ?? false;
  const { isFavorite, toggleFavorite } = useApp();
  const favorite = isFavorite("lab", lab.id);
  const detailHref = `/playground?lab=${lab.id}`;
  const [viewerOpen, setViewerOpen] = useState(false);
  const [entering, setEntering] = useState(false);

  function enterLab() {
    if (reduceMotion) {
      router.push(detailHref);
      return;
    }
    setEntering(true);
    window.setTimeout(() => router.push(detailHref), 720);
  }

  return (
    <div
      className={cn(
        "lab-card-group group/card relative grid h-full gap-3 rounded-[26px] border border-ink/[0.08] bg-white p-3 transition-all duration-500 hover:-translate-y-1 hover:border-spark-dark/40 hover:shadow-card xl:grid-cols-[42%_minmax(0,1fr)] xl:gap-4 xl:p-3.5",
        className,
      )}
    >
      <div className="relative h-[210px] sm:h-[240px] xl:h-full xl:min-h-[248px]">
        <Lab3DPreview
          lab={lab}
          onExpand={() => setViewerOpen(true)}
          className="relative h-full w-full"
        />
        <button
          onClick={() => toggleFavorite("lab", lab.id)}
          className="absolute right-1.5 top-1.5 z-40 flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-white/85 text-ink-muted/60 backdrop-blur transition-colors hover:text-ink"
          aria-label={
            favorite ? "Remove lab from favorites" : "Add lab to favorites"
          }
        >
          <Star
            className={cn(
              "h-3.5 w-3.5",
              favorite && "fill-current text-spark-dark",
            )}
          />
        </button>
      </div>

      <div className="flex min-w-0 flex-col px-1 pb-1 xl:py-1 xl:pl-0 xl:pr-1.5">
        <div className="flex items-start gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink text-spark-yellow">
            <LabGlyph icon={lab.icon} className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-tight sm:text-[16px]">
              {lab.name}
            </h3>
            <Link
              href={detailHref}
              className="mt-0.5 inline-flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-muted/70 transition-colors hover:text-ink"
              aria-label={`Open ${lab.name}`}
            >
              LAB {lab.number}
              <ArrowUpRight className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>

        <p className="mt-2.5 line-clamp-2 text-[9.5px] font-semibold uppercase leading-snug tracking-[0.12em] text-spark-dark">
          {lab.tagline}
        </p>
        <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-ink/65">
          {lab.description}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {lab.skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="whitespace-nowrap rounded-full border border-ink/[0.08] bg-warm px-2 py-1 text-[9px] text-ink-muted"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          <span className="flex items-center gap-1.5 whitespace-nowrap text-[9.5px] font-semibold text-ink-muted">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            {lab.embeddable ? "Lab online" : "Opens in a new tab"}
          </span>
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewerOpen(true)}
              className="lab-btn-secondary"
              aria-label={`Open 3D preview of ${lab.name}`}
            >
              <Boxes className="lab-btn-secondary__icon h-3.5 w-3.5" />
              3D
            </button>
            {lab.embeddable ? (
              <button
                type="button"
                onClick={enterLab}
                className="lab-btn-primary"
              >
                <Play className="lab-btn-primary__icon h-3 w-3 fill-current" />
                Enter Lab
              </button>
            ) : (
              <a
                href={lab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lab-btn-primary"
              >
                <Play className="lab-btn-primary__icon h-3 w-3 fill-current" />
                Open lab
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

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {entering && (
              <motion.div
                className="fixed inset-0 z-[250] flex items-center justify-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                role="status"
                aria-live="polite"
              >
                <motion.div
                  className="absolute inset-0 bg-ink/85 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                />
                <motion.div
                  className="absolute h-[70vmin] w-[70vmin] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,193,7,0.55) 0%, rgba(255,193,7,0.12) 42%, transparent 68%)",
                  }}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1.6, opacity: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
                {[0, 1, 2].map((ring) => (
                  <motion.span
                    key={ring}
                    className="absolute rounded-full border border-spark-yellow/50"
                    style={{ width: 180, height: 180 }}
                    initial={{ scale: 0.4, opacity: 0.8 }}
                    animate={{ scale: 3 + ring, opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: ring * 0.09,
                      ease: "easeOut",
                    }}
                  />
                ))}
                <motion.div
                  className="relative flex flex-col items-center text-center text-white"
                  initial={{ scale: 0.6, y: 18, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.span
                    className="flex h-20 w-20 items-center justify-center rounded-3xl bg-spark-yellow text-ink shadow-[0_0_60px_rgba(255,193,7,0.6)]"
                    initial={{ rotate: -8 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LabGlyph icon={lab.icon} className="h-9 w-9" />
                  </motion.span>
                  <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-spark-light/80">
                    Lab {lab.number}
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold">
                    {lab.name}
                  </p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                    Entering the campus…
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
