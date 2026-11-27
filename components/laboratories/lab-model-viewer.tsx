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
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Info,
  Layers,
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
import { LabGlyph } from "@/components/shared/icons";
import { getLabComponents, type LabHotspot } from "@/src/data/labComponents";
import { protocols } from "@/src/data/protocols";
import { useDeviceQuality } from "@/src/lib/use-device-quality";
import { useApp } from "@/src/lib/store/app-provider";
import type { Lab } from "@/src/lib/labs";
import { cn } from "@/src/lib/utils";
import { ComponentInfoPanel } from "@/src/components/labs/component-info-panel";
import { ComponentLegend } from "@/src/components/labs/component-legend";
import { ProtocolExplorerPanel } from "@/src/components/labs/protocol-explorer-panel";
import { ElectronicsToolsPanel } from "@/src/components/labs/electronics-tools-panel";
import { BoardComparisonPanel } from "@/src/components/labs/board-comparison-panel";
import { useHotspotFocus } from "@/src/components/labs/use-hotspot-focus";

function SceneCleanup() {
  const { gl, scene } = useThree();

  useEffect(() => {
    return () => {
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((material) => material?.dispose());
      });
      gl.dispose();
    };
  }, [gl, scene]);

  return null;
}

function CameraFocusController({
  target,
  requestKey,
  controls,
  reducedMotion,
}: {
  target: [number, number, number] | null;
  requestKey: number;
  controls: React.RefObject<ElementRef<typeof OrbitControls> | null>;
  reducedMotion: boolean;
}) {
  const { focus, cancel } = useHotspotFocus(
    controls as React.RefObject<OrbitControlsImpl | null>,
    reducedMotion,
  );

  useEffect(() => {
    if (target) {
      focus(target);
    } else {
      cancel();
    }
  }, [cancel, focus, requestKey, target]);

  return null;
}

function ViewerScene({
  lab,
  explode,
}: {
  lab: Lab;
  explode: number;
}) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#ffffff", "#e3ddcc", 1.15]} />
      <directionalLight
        position={[4.5, 6.5, 4.5]}
        intensity={2.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />
      <directionalLight position={[-4, 3, -4]} intensity={1.05} color="#FFD54F" />
      <pointLight
        position={[0, 2, 3.5]}
        intensity={24}
        distance={12}
        color="#FFD54F"
        decay={2}
      />

      <group position={[0, -0.22, 0]}>
        <LabModel id={lab.id} explode={explode} />
      </group>

      <group position={[0, -0.6, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.94, 72]} />
          <meshStandardMaterial color="#3a3016" roughness={0.7} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.06, 72]} />
          <meshStandardMaterial
            color="#FFC107"
            emissive="#FFB900"
            emissiveIntensity={2.6}
            metalness={0.3}
            roughness={0.35}
            toneMapped={false}
          />
        </mesh>
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
  const config = getLabComponents(lab.id);
  const quality = useDeviceQuality();
  const reducedMotion = useReducedMotion() ?? false;
  const controls = useRef<ElementRef<typeof OrbitControls>>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { isFavorite, toggleFavorite } = useApp();
  const favorite = isFavorite("lab", lab.id);
  const [mounted, setMounted] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [explode, setExplode] = useState(0);
  const [focusTarget, setFocusTarget] = useState<
    [number, number, number] | null
  >(null);
  const [focusKey, setFocusKey] = useState(0);
  const [mobilePanel, setMobilePanel] = useState<"legend" | "info" | null>(null);
  const [sidebarTab, setSidebarTab] = useState<"components" | "boards">(
    "components",
  );
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches,
  );
  const panelStateRef = useRef({ activeHotspot, mobilePanel });
  const onCloseRef = useRef(onClose);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    panelStateRef.current = { activeHotspot, mobilePanel };
  }, [activeHotspot, mobilePanel]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isDesktop) setMobilePanel(null);
  }, [isDesktop]);

  useEffect(() => {
    if (!open) return;
    setActiveHotspot(null);
    setAutoRotate(true);
    setExplode(0);
    setFocusTarget(null);
    setMobilePanel(null);
    setSidebarTab("components");
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const state = panelStateRef.current;
      if (state.activeHotspot) {
        setActiveHotspot(null);
        setFocusTarget(null);
        setMobilePanel(null);
        return;
      }
      if (state.mobilePanel) {
        setMobilePanel(null);
        return;
      }
      onCloseRef.current();
    };

    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open]);

  const selectedHotspot =
    config.hotspots.find((item) => item.id === activeHotspot) ?? null;

  const focusHotspot = (hotspot: LabHotspot) => {
    setActiveHotspot(hotspot.id);
    setFocusTarget(hotspot.cameraTarget);
    setFocusKey((value) => value + 1);
    if (!isDesktop) setMobilePanel("info");
  };

  const closePanel = () => {
    setActiveHotspot(null);
    setFocusTarget(null);
    setMobilePanel(null);
  };

  const resetView = () => {
    closePanel();
    setExplode(0);
    controls.current?.reset();
  };

  const componentCount =
    config.kind === "protocol"
      ? `${protocols.length} protocols`
      : `${config.hotspots.length} components`;

  const panelLabel =
    config.kind === "protocol"
      ? "Protocol explorer"
      : config.kind === "robotics" && sidebarTab === "boards"
        ? "Board comparison"
        : selectedHotspot
          ? "Component details"
          : "Components";

  const renderPanel = () => {
    if (config.kind === "protocol") {
      return <ProtocolExplorerPanel />;
    }

    return (
      <div className="flex h-full flex-col">
        {config.kind === "robotics" && (
          <div className="flex gap-1 border-b border-white/10 p-2">
            {(["components", "boards"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSidebarTab(tab)}
                className={cn(
                  "flex-1 rounded-full border px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.06em] transition-colors",
                  sidebarTab === tab
                    ? "border-spark-yellow/45 bg-spark-yellow/12 text-spark-yellow"
                    : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/65",
                )}
                aria-pressed={sidebarTab === tab}
              >
                {tab === "components" ? "Components" : "Compare boards"}
              </button>
            ))}
          </div>
        )}

        {config.kind === "robotics" && sidebarTab === "boards" ? (
          <BoardComparisonPanel />
        ) : selectedHotspot ? (
          <ComponentInfoPanel
            hotspot={selectedHotspot}
            onClose={closePanel}
            onFocus={() => focusHotspot(selectedHotspot)}
          />
        ) : (
          <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1">
              <ComponentLegend
                hotspots={config.hotspots}
                activeId={activeHotspot}
                onSelect={focusHotspot}
              />
            </div>
            {config.kind === "electronics" && <ElectronicsToolsPanel />}
          </div>
        )}
      </div>
    );
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-2 backdrop-blur-md sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${config.title} interactive 3D component explorer`}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-[min(94vh,940px)] w-full max-w-7xl flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#141414] text-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-spark-yellow text-ink shadow-[0_0_30px_rgba(255,193,7,0.35)]">
                  <LabGlyph icon={lab.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-spark-yellow">
                    Lab {config.labNumber}
                  </p>
                  <h2 className="truncate font-display text-lg font-bold text-white sm:text-2xl">
                    {config.title}
                  </h2>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <span className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/60 lg:inline-flex">
                  <Boxes className="h-3 w-3" /> {componentCount}
                </span>
                <button
                  type="button"
                  onClick={() => setAutoRotate((value) => !value)}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold transition-colors",
                    autoRotate
                      ? "border-spark-yellow/50 bg-spark-yellow/15 text-spark-yellow"
                      : "border-white/15 text-white/60 hover:bg-white/10 hover:text-white",
                  )}
                  aria-pressed={autoRotate}
                  aria-label="Toggle auto-rotate"
                >
                  <Rotate3D
                    className={cn("h-4 w-4", autoRotate && "text-spark-yellow")}
                  />
                  <span className="hidden sm:inline">Auto-rotate</span>
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  className="hidden h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-[10px] font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close 3D viewer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 overflow-hidden">
              <div className="relative min-w-0 flex-1 overflow-hidden bg-[#1b1a16]">
                <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.06]" />
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${lab.accent}33, transparent 70%)`,
                  }}
                />
                <Canvas
                  shadows
                  dpr={quality === "low" ? [1, 1.25] : [1, 1.75]}
                  camera={{
                    position: config.cameraStart,
                    fov: config.cameraFov,
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
                      explode={explode}
                    />
                  </Suspense>
                  <OrbitControls
                    ref={controls}
                    makeDefault
                    enableDamping
                    dampingFactor={0.08}
                    enablePan
                    enableZoom
                    autoRotate={autoRotate && !selectedHotspot}
                    autoRotateSpeed={1.4}
                    minDistance={2.2}
                    maxDistance={9}
                    minPolarAngle={0.35}
                    maxPolarAngle={1.52}
                  />
                  <CameraFocusController
                    target={focusTarget}
                    requestKey={focusKey}
                    controls={controls}
                    reducedMotion={reducedMotion}
                  />
                  <SceneCleanup />
                </Canvas>

                <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
                  {[
                    { icon: Move3D, label: "Drag to rotate" },
                    { icon: ZoomIn, label: "Scroll to zoom" },
                    { icon: Move3D, label: "Right-drag to pan" },
                  ].map((hint) => (
                    <span
                      key={hint.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-black/40 px-2.5 py-1 text-[9px] font-medium text-white/60 shadow-sm backdrop-blur"
                    >
                      <hint.icon className="h-3 w-3" />
                      {hint.label}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={resetView}
                  className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-semibold text-white/70 shadow-sm backdrop-blur transition-colors hover:bg-white/10 hover:text-white sm:hidden"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>

                {config.kind === "vehicle" && (
                  <div className="absolute right-3 top-14 z-10 w-44 rounded-2xl border border-white/12 bg-black/55 p-2.5 shadow-xl backdrop-blur sm:top-3 sm:right-3 sm:w-52">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45">
                        Explode view
                      </span>
                      <span className="text-[9px] font-semibold text-spark-yellow">
                        {Math.round(explode * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={explode}
                      onChange={(event) => setExplode(Number(event.target.value))}
                      className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-[#FFC107]"
                      aria-label="Explode vehicle view"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setMobilePanel(selectedHotspot ? "info" : "legend")
                  }
                  className="absolute bottom-3 left-3 z-20 inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-3 text-[10px] font-semibold text-white/75 shadow-lg backdrop-blur transition-colors hover:bg-white/10 hover:text-white lg:hidden"
                >
                  <Layers className="h-3.5 w-3.5 text-spark-yellow" />
                  {config.kind === "protocol" ? "Protocols" : "Components"}
                </button>

                {!selectedHotspot && (
                  <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden items-center gap-2 rounded-full border border-white/12 bg-[#1f1f1f]/90 px-3 py-1.5 text-[9.5px] text-white/55 shadow-sm backdrop-blur sm:flex">
                    <Info className="h-3.5 w-3.5 text-spark-yellow" />
                    {config.kind === "protocol"
                      ? "Choose a protocol to trace the data flow"
                      : "Click a marker to inspect a component"}
                  </div>
                )}

                <div className="pointer-events-none absolute bottom-3 right-3 z-10 hidden rounded-full border border-white/12 bg-[#1f1f1f]/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50 backdrop-blur sm:block">
                  {lab.tagline}
                </div>
              </div>

              {isDesktop && (
                <aside className="flex w-[340px] shrink-0 flex-col border-l border-white/10 bg-[#171717]">
                  {renderPanel()}
                </aside>
              )}

              <AnimatePresence>
                {!isDesktop && mobilePanel && (
                  <>
                    <motion.div
                      className="absolute inset-0 z-20 bg-black/45 backdrop-blur-[2px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setMobilePanel(null)}
                    />
                    <motion.div
                      className="absolute inset-x-0 bottom-0 z-30 flex max-h-[68%] flex-col overflow-hidden rounded-t-3xl border-t border-white/12 bg-[#171717] shadow-2xl"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      role="dialog"
                      aria-label={panelLabel}
                    >
                      <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/20" />
                      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">
                          {panelLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => setMobilePanel(null)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                          aria-label="Close component panel"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="min-h-0 flex-1 overflow-hidden">
                        {renderPanel()}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-white/10 bg-[#141414] px-4 py-3.5 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-[12px] leading-relaxed text-white/55 sm:max-w-2xl">
                    {lab.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {lab.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/15 px-2.5 py-1 text-[9.5px] font-medium text-white/60"
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
                      "flex h-11 w-11 items-center justify-center rounded-full border transition-colors",
                      favorite
                        ? "border-spark-yellow/60 bg-spark-yellow/15 text-spark-yellow"
                        : "border-white/15 text-white/60 hover:bg-white/10 hover:text-white",
                    )}
                    aria-label={
                      favorite
                        ? "Remove lab from favorites"
                        : "Add lab to favorites"
                    }
                  >
                    <Star className={cn("h-4 w-4", favorite && "fill-current")} />
                  </button>
                  {lab.embeddable ? (
                    <Link
                      href={`/playground?lab=${lab.id}`}
                      onClick={onClose}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-spark-yellow px-6 text-[13px] font-bold text-ink shadow-[0_10px_30px_-10px_rgba(255,193,7,0.8)] transition-transform hover:-translate-y-0.5"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" /> Enter lab
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <a
                      href={lab.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-spark-yellow px-6 text-[13px] font-bold text-ink shadow-[0_10px_30px_-10px_rgba(255,193,7,0.8)] transition-transform hover:-translate-y-0.5"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" /> Open lab
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
