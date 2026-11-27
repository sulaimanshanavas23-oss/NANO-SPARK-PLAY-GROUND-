"use client";

import { Crosshair, X } from "lucide-react";
import type { LabHotspot } from "@/src/data/labComponents";

export function ComponentInfoPanel({
  hotspot,
  onClose,
  onFocus,
}: {
  hotspot: LabHotspot;
  onClose: () => void;
  onFocus?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-spark-yellow">
            {hotspot.category}
          </p>
          <h3 className="mt-1 font-display text-base font-semibold leading-tight text-white">
            {hotspot.label}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close component details"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <p className="text-[11.5px] leading-relaxed text-white/60">
          {hotspot.description}
        </p>

        <div className="mt-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
            Key specs
          </p>
          <ul className="mt-2 space-y-1.5">
            {hotspot.specs.map((spec) => (
              <li
                key={spec}
                className="flex items-start gap-2 text-[11px] leading-snug text-white/70"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-spark-yellow" />
                {spec}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-xl border border-spark-yellow/20 bg-spark-yellow/[0.06] p-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-spark-yellow/80">
            Used for
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/70">
            {hotspot.usedFor}
          </p>
        </div>
      </div>

      {onFocus && (
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onFocus}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border border-spark-yellow/40 bg-spark-yellow/10 text-[10px] font-semibold text-spark-yellow transition-colors hover:bg-spark-yellow/20"
          >
            <Crosshair className="h-3.5 w-3.5" /> Focus camera
          </button>
        </div>
      )}
    </div>
  );
}
