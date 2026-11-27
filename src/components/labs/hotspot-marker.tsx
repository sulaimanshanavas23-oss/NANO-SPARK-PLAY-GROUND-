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
          className={cn(
            "whitespace-nowrap rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] shadow-xl outline-none transition-all duration-200",
            active
              ? "border-spark-yellow bg-spark-yellow text-ink"
              : hovered
                ? "border-spark-yellow/60 bg-ink text-white"
                : "border-white/15 bg-ink/90 text-white",
          )}
          aria-label={`Inspect ${hotspot.label}`}
          aria-pressed={active}
        >
          {hotspot.label}
        </button>
      </Html>
    </group>
  );
}
