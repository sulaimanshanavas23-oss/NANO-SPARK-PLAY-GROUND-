"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ElementRef,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Info,
  Loader2,
  Move3D,
  Play,
  Rotate3D,
  RotateCcw,
  Star,
  X,
  ZoomIn,
} from "lucide-react";
import { LabModel } from "@/components/campus/lab-models";
import { ComponentHotspot } from "@/components/laboratories/component-hotspot";
import { LabGlyph } from "@/components/shared/icons";
import { getLabModelConfig } from "@/src/lib/lab-model-config";
import { useDeviceQuality } from "@/src/lib/use-device-quality";
import { useApp } from "@/src/lib/store/app-provider";
import type { Lab } from "@/src/lib/labs";
import { cn } from "@/src/lib/utils";

function ViewerScene({
  lab,
  activeHotspot,
  onHotspot,
}: {
  lab: Lab;
  activeHotspot: string | null;
  onHotspot: (id: string) => void;
}) {
  const config = getLabModelConfig(lab.id);
  return (
    <>
      <ambientLight intensity={0.8} />
      <hemisphereLight args={["#ffffff", "#e3ddcc", 1.1]} />
      <directionalLight
        position={[4.5, 6.5, 4.5]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />
      <directionalLight position={[-4, 3, -4]} intensity={0.95} color="#FFD54F" />
      <pointLight
        position={[0, 2, 3.5]}
        intensity={20}
        distance={12}
        color="#FFD54F"
        decay={2}
      />

      <group position={[0, -0.22, 0]}>
        <LabModel id={lab.id}>
          {config.hotspots.map((hotspot) => (
            <ComponentHotspot
              key={hotspot.id}
              label={hotspot.label}
              position={hotspot.position}
              active={activeHotspot === hotspot.id}
              onSelect={() => onHotspot(hotspot.id)}
            />
          ))}
        </LabModel>
      </group>

      <ContactShadows
        position={[0, -0.58, 0]}
        opacity={0.42}
        scale={9}
        blur={2.6}
        far={3.2}
      />
    </>
  );
}

export function LabModelViewer({
  lab,
  open,
  onClose,
}: {
  lab: Lab;
  open: boolean;
  onClose: () => void;
}) {
  const config = getLabModelConfig(lab.id);
  const quality = useDeviceQuality();
  const controls = useRef<ElementRef<typeof OrbitControls>>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { isFavorite, toggleFavorite } = useApp();
  const favorite = isFavorite("lab", lab.id);
  const [mounted, setMounted] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setActiveHotspot(null);
    setAutoRotate(true);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  const hotspot = config.hotspots.find((item) => item.id === activeHotspot);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/60 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${lab.name} interactive 3D viewer`}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-[min(94vh,920px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/30 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-spark-yellow">
                  <LabGlyph icon={lab.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-spark-dark">
                    Lab {lab.number} · 3D Viewer
                  </p>
                  <h2 className="truncate font-display text-lg font-semibold sm:text-xl">
                    {lab.name}
                  </h2>
                </div>
                {config.placeholder && (
                  <span className="ml-1 hidden items-center gap-1.5 rounded-full border border-ink/10 bg-warm px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-muted lg:inline-flex">
                    <Info className="h-3 w-3" /> Procedural preview
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-full border border-ink/10 bg-warm px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-muted sm:inline-flex">
                  <Boxes className="h-3 w-3" /> {config.hotspots.length} components
                </span>
                <button
                  type="button"
                  onClick={() => setAutoRotate((value) => !value)}
                  className={cn(
                    "hidden h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold transition-colors sm:inline-flex",
                    autoRotate
                      ? "border-spark-dark/40 bg-spark-yellow/15 text-ink"
                      : "border-ink/10 text-ink-muted hover:bg-warm hover:text-ink",
                  )}
                  aria-pressed={autoRotate}
                  aria-label="Toggle auto-rotate"
                >
                  <Rotate3D className={cn("h-4 w-4", autoRotate && "text-spark-dark")} />
                  Auto-rotate
                </button>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition-colors hover:bg-warm hover:text-ink"
                  aria-label="Close 3D viewer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 bg-[#f5f2e8]">
              <Canvas
                shadows
                dpr={quality === "low" ? [1, 1.25] : [1, 1.75]}
                camera={{
                  position: config.viewerCamera.position,
                  fov: config.viewerCamera.fov,
                }}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: "high-performance",
                }}
                className="!absolute inset-0"
              >
                <Suspense
                  fallback={
                    <Html center>
                      <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-ink-muted shadow">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Loading model…
                      </div>
                    </Html>
                  }
                >
                  <ViewerScene
                    lab={lab}
                    activeHotspot={activeHotspot}
                    onHotspot={(id) =>
                      setActiveHotspot((current) =>
                        current === id ? null : id,
                      )
                    }
                  />
                </Suspense>
                <OrbitControls
                  ref={controls}
                  makeDefault
                  enableDamping
                  dampingFactor={0.08}
                  enablePan
                  enableZoom
                  autoRotate={autoRotate}
                  autoRotateSpeed={1.4}
                  minDistance={2.2}
                  maxDistance={9}
                  minPolarAngle={0.35}
                  maxPolarAngle={1.52}
                />
              </Canvas>

              <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
                {[
                  { icon: Move3D, label: "Drag to rotate" },
                  { icon: ZoomIn, label: "Scroll to zoom" },
                  { icon: Move3D, label: "Right-drag to pan" },
                ].map((hint) => (
                  <span
                    key={hint.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/85 px-2.5 py-1 text-[9px] font-medium text-ink-muted shadow-sm backdrop-blur"
                  >
                    <hint.icon className="h-3 w-3" />
                    {hint.label}
                  </span>
                ))}
              </div>

              <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setAutoRotate((value) => !value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold shadow-sm backdrop-blur transition-colors sm:hidden",
                    autoRotate
                      ? "border-spark-dark/40 bg-spark-yellow/90 text-ink"
                      : "border-ink/10 bg-white/85 text-ink-muted",
                  )}
                  aria-pressed={autoRotate}
                >
                  <Rotate3D className="h-3.5 w-3.5" /> Auto
                </button>
                <button
                  onClick={() => controls.current?.reset()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/85 px-3 py-1.5 text-[10px] font-semibold text-ink shadow-sm backdrop-blur transition-colors hover:bg-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset view
                </button>
              </div>

              <AnimatePresence mode="wait">
                {hotspot ? (
                  <motion.div
                    key={hotspot.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute inset-x-3 bottom-3 z-10 max-w-sm rounded-2xl border border-ink/10 bg-white/95 p-4 shadow-card backdrop-blur sm:inset-x-auto sm:left-4 sm:bottom-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-spark-dark">
                        Component
                      </p>
                      <button
                        onClick={() => setActiveHotspot(null)}
                        className="rounded-full p-0.5 text-ink-muted transition-colors hover:text-ink"
                        aria-label="Close component details"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-1 font-display text-sm font-semibold">
                      {hotspot.label}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                      {hotspot.detail}
                    </p>
                  </motion.div>
                ) : (
                  <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-center gap-2 rounded-full border border-ink/10 bg-white/85 px-3 py-1.5 text-[9.5px] text-ink-muted shadow-sm backdrop-blur sm:inset-x-auto sm:left-4 sm:bottom-4">
                    <Info className="h-3.5 w-3.5 text-spark-dark" />
                    Click a marker to inspect a component
                  </div>
                )}
              </AnimatePresence>

              <div
                className={cn(
                  "pointer-events-none absolute bottom-3 right-3 z-10 rounded-full border border-ink/10 bg-white/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-muted backdrop-blur",
                  "hidden sm:block",
                )}
              >
                {lab.tagline}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-ink/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="min-w-0">
                <p className="line-clamp-2 text-[11.5px] leading-relaxed text-ink-muted sm:max-w-xl">
                  {lab.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {lab.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-warm px-2.5 py-1 text-[9.5px] text-ink-muted"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite("lab", lab.id)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
                    favorite
                      ? "border-spark-dark/40 bg-spark-yellow/15 text-spark-dark"
                      : "border-ink/10 text-ink-muted hover:bg-warm hover:text-ink",
                  )}
                  aria-label={
                    favorite ? "Remove lab from favorites" : "Add lab to favorites"
                  }
                >
                  <Star className={cn("h-4 w-4", favorite && "fill-current")} />
                </button>
                {lab.embeddable ? (
                  <Link
                    href={`/playground?lab=${lab.id}`}
                    onClick={onClose}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-spark-yellow px-4 text-[12px] font-bold text-ink transition-transform hover:-translate-y-0.5"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> Enter lab
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <a
                    href={lab.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-spark-yellow px-4 text-[12px] font-bold text-ink transition-transform hover:-translate-y-0.5"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> Open lab
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
