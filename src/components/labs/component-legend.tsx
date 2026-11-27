"use client";

import { Boxes } from "lucide-react";
import type { LabHotspot } from "@/src/data/labComponents";
import { cn } from "@/src/lib/utils";

const categoryTone: Record<string, string> = {
  Power: "bg-amber-400",
  Control: "bg-sky-400",
  Connectivity: "bg-violet-400",
  Interface: "bg-emerald-400",
  Sensor: "bg-cyan-400",
  Mechanical: "bg-orange-400",
  Passive: "bg-rose-400",
  Safety: "bg-red-400",
};

export function ComponentLegend({
  hotspots,
  activeId,
  onSelect,
}: {
  hotspots: LabHotspot[];
  activeId: string | null;
  onSelect: (hotspot: LabHotspot) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-spark-yellow">
            Component map
          </p>
          <p className="mt-0.5 text-[11px] text-white/45">
            Click a part to inspect and focus
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/50">
          <Boxes className="h-3 w-3" /> {hotspots.length}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {hotspots.map((hotspot) => {
            const active = activeId === hotspot.id;
            return (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => onSelect(hotspot)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-colors",
                  active
                    ? "border-spark-yellow/45 bg-spark-yellow/10"
                    : "border-transparent hover:border-white/10 hover:bg-white/[0.04]",
                )}
                aria-pressed={active}
              >
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    categoryTone[hotspot.category] ?? "bg-spark-yellow",
                    active && "ring-2 ring-spark-yellow/30",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-[11.5px] font-medium",
                      active ? "text-spark-yellow" : "text-white/75",
                    )}
                  >
                    {hotspot.label}
                  </span>
                  <span className="block text-[9px] uppercase tracking-[0.12em] text-white/30">
                    {hotspot.category}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
