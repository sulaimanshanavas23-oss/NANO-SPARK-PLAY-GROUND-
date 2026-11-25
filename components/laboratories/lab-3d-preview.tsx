"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Boxes } from "lucide-react";
import * as THREE from "three";
import { LabModel } from "@/components/campus/lab-models";
import { LabGlyph } from "@/components/shared/icons";
import { useWebGLAvailable } from "@/components/shared/webgl";
import type { Lab } from "@/src/lib/labs";
import { cn } from "@/src/lib/utils";

function Spin({ id, paused }: { id: string; paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!group.current || paused) return;
    group.current.rotation.y += delta * 0.5;
  });
  return (
    <group ref={group} position={[0, -0.4, 0]}>
      <LabModel id={id} />
    </group>
  );
}

function PreviewScene({ lab, paused }: { lab: Lab; paused: boolean }) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#ffffff", "#e6e0cf", 1.15]} />
      <directionalLight position={[3.5, 5, 4]} intensity={2.6} />
      <directionalLight position={[-3, 2.5, -3.5]} intensity={0.9} color="#FFD54F" />
      <pointLight position={[0, 2.4, 1.5]} intensity={12} distance={8} color="#FFD54F" decay={2} />
      <Spin id={lab.id} paused={paused} />
    </>
  );
}

function PreviewFallback({ lab }: { lab: Lab }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2"
      style={{
        background: `radial-gradient(circle at 50% 36%, ${lab.accent}38, transparent 62%)`,
      }}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-spark-yellow shadow-card">
        <LabGlyph icon={lab.icon} className="h-6 w-6" />
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
        3D preview
      </span>
    </div>
  );
}

export function Lab3DPreview({
  lab,
  className,
  showHint = true,
}: {
  lab: Lab;
  className?: string;
  showHint?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const webgl = useWebGLAvailable();
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setPaused(motion.matches);
    updateMotion();
    motion.addEventListener("change", updateMotion);

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    setLowPower(
      Boolean(nav.connection?.saveData) || (nav.deviceMemory ?? 4) <= 2,
    );

    return () => motion.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: "180px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () =>
      setVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const renderScene = mounted && webgl === true && inView && !lowPower;
  const running = renderScene && visible && !paused;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-ink/[0.08] bg-gradient-to-br from-[#fbfaf4] via-[#f6f2e6] to-[#f2e5ba]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-25" />
      <div
        className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-40 -translate-x-1/2 rounded-[50%] blur-2xl"
        style={{ backgroundColor: `${lab.accent}55` }}
      />

      {renderScene ? (
        <Canvas
          className="!absolute inset-0 !pointer-events-none"
          dpr={[1, 1.5]}
          camera={{ position: [2.4, 1.85, 2.9], fov: 34 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={running ? "always" : "demand"}
          resize={{ debounce: 150 }}
        >
          <PreviewScene lab={lab} paused={paused} />
        </Canvas>
      ) : (
        <PreviewFallback lab={lab} />
      )}

      <span className="pointer-events-none absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-ink/90 px-2 py-1 text-[8.5px] font-bold uppercase tracking-[0.16em] text-spark-yellow shadow-sm">
        <Boxes className="h-3 w-3" /> 3D
      </span>

      {showHint && renderScene && (
        <span className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/60 bg-white/80 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-ink-muted backdrop-blur">
          Live 3D model
        </span>
      )}
    </div>
  );
}
