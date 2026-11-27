"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import type { LabHotspot } from "@/src/data/labComponents";
import { cn } from "@/src/lib/utils";

export function HotspotMarker({
  hotspot,
  active,
  onSelect,
}: {
  hotspot: LabHotspot;
  active: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={hotspot.position}>
      <Html center distanceFactor={7} zIndexRange={[40, 20]}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          className="group/hotspot relative flex items-center justify-center outline-none"
          aria-label={`Inspect ${hotspot.label}`}
          aria-pressed={active}
        >
          <span
            className={cn(
              "relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow-[0_0_0_4px_rgba(0,0,0,0.18)] transition-all duration-200",
              active
                ? "scale-125 bg-spark-yellow ring-2 ring-spark-yellow/80 ring-offset-1 ring-offset-ink/40"
                : "bg-ink/85 group-hover/hotspot:scale-125 group-hover/hotspot:bg-spark-yellow",
            )}
          >
            {(hovered || active) && (
              <span className="absolute inset-0 animate-ping rounded-full bg-spark-yellow/60" />
            )}
          </span>
          <span
            className={cn(
              "pointer-events-none absolute left-5 whitespace-nowrap rounded-full border border-white/10 bg-ink/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white shadow-xl transition-all duration-200",
              hovered || active
                ? "translate-x-0 opacity-100"
                : "-translate-x-1 opacity-0",
            )}
          >
            {hotspot.label}
          </span>
        </button>
      </Html>
    </group>
  );
}
