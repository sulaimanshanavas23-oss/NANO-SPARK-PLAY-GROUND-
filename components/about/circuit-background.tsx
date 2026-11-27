"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/src/lib/utils";

const darkPaths = [
  "M-20 96 H210 V158 H430",
  "M1180 64 H980 V138 H760",
  "M120 344 H348 V284 H520",
  "M760 372 H1000 V300 H1220",
  "M0 212 H300 V120 H620 V210 H900",
  "M1100 470 H860 V540 H620",
];

const lightPaths = [
  "M-20 120 H240 V190 H470",
  "M1220 90 H1000 V160 H820",
  "M160 380 H400 V310 H600",
  "M780 400 H1020 V330 H1220",
  "M0 240 H260 V160 H540 V240 H860",
];

export function CircuitBackground({
  tone = "dark",
  className,
  dense = false,
}: {
  tone?: "dark" | "light";
  className?: string;
  dense?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const isDark = tone === "dark";
  const paths = isDark ? darkPaths : lightPaths;
  const nodes = isDark
    ? [
        [210, 96],
        [430, 158],
        [980, 64],
        [760, 138],
        [348, 344],
        [520, 284],
        [1000, 372],
        [620, 120],
        [900, 210],
        [860, 470],
      ]
    : [
        [240, 120],
        [470, 190],
        [1000, 90],
        [820, 160],
        [400, 380],
        [600, 310],
        [1020, 400],
        [540, 160],
        [860, 240],
      ];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(255,193,7,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,193,7,0.035) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(17,17,17,0.10) 1px, transparent 1px)",
          backgroundSize: isDark ? "52px 52px" : "26px 26px",
          opacity: isDark ? 1 : 0.7,
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
        fill="none"
      >
        <g
          stroke={
            isDark ? "rgba(247,181,0,0.28)" : "rgba(17,17,17,0.10)"
          }
          strokeWidth={isDark ? 2 : 1}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isDark ? 0.9 : 1}
        >
          {paths.map((d, index) => (
            <path
              key={d}
              d={d}
              className={index % 2 === 0 ? "ns-trace" : undefined}
            />
          ))}
        </g>
        {dense && (
          <g
            stroke={
              isDark ? "rgba(247,181,0,0.16)" : "rgba(17,17,17,0.07)"
            }
            strokeWidth="1"
          >
            <path d="M180 620 H420 V560 H660" />
            <path d="M900 620 H1100 V560 H1220" />
            <path d="M60 500 H260 V450" />
          </g>
        )}
        <g fill={isDark ? "rgba(255,193,7,0.55)" : "rgba(247,181,0,0.75)"}>
          {nodes.map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={isDark ? 5 : 4}
              className={reduceMotion ? undefined : "ns-node"}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
