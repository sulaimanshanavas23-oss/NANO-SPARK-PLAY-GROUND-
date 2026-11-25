"use client";

import { Html } from "@react-three/drei";
import { cn } from "@/src/lib/utils";

export function ComponentHotspot({
  label,
  position,
  active = false,
  onSelect,
}: {
  label: string;
  position: [number, number, number];
  active?: boolean;
  onSelect: () => void;
}) {
  return (
    <group position={position}>
      <Html center distanceFactor={7} zIndexRange={[40, 20]}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          className="group/hotspot relative flex items-center justify-center outline-none"
          aria-label={`Inspect ${label}`}
          aria-pressed={active}
        >
          <span
            className={cn(
              "relative flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform duration-200 group-hover/hotspot:scale-125",
              active ? "bg-spark-dark" : "bg-ink/85",
            )}
          >
            {active && (
              <span className="absolute inset-0 animate-ping rounded-full bg-spark-yellow/60" />
            )}
          </span>
          <span
            className={cn(
              "pointer-events-none absolute left-5 whitespace-nowrap rounded-full bg-ink/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white shadow-lg transition-opacity duration-200",
              active ? "opacity-100" : "opacity-0 group-hover/hotspot:opacity-100",
            )}
          >
            {label}
          </span>
        </button>
      </Html>
    </group>
  );
}
