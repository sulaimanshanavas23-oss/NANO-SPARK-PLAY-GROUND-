"use client";

import { useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#FFC107", "#F7B500", "#FFD54F", "#111111", "#FFFFFF"];

export function Confetti({ onDone }: { onDone?: () => void }) {
  const reduceMotion = useReducedMotion();

  const pieces = useMemo(
    () =>
      Array.from({ length: 42 }).map((_, index) => ({
        id: index,
        left: Math.random() * 100,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.6,
        drift: (Math.random() - 0.5) * 180,
        rotate: Math.random() * 720 - 360,
        color: COLORS[index % COLORS.length],
        rounded: Math.random() > 0.5,
      })),
    [],
  );

  useEffect(() => {
    if (reduceMotion) {
      onDone?.();
      return;
    }
    const timer = window.setTimeout(() => onDone?.(), 4200);
    return () => window.clearTimeout(timer);
  }, [reduceMotion, onDone]);

  if (reduceMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      aria-hidden
    >
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-[-6%] block"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.4,
            backgroundColor: piece.color,
            borderRadius: piece.rounded ? "9999px" : "2px",
          }}
          initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: piece.drift,
            opacity: [0, 1, 1, 0],
            rotate: piece.rotate,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
