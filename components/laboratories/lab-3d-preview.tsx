"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Info, Star } from "lucide-react";
import * as THREE from "three";
import { LabModel } from "@/components/campus/lab-models";
import { ModelHoverController } from "@/components/laboratories/model-hover-controller";
import { LabGlyph } from "@/components/shared/icons";
import { useWebGLAvailable } from "@/components/shared/webgl";
import { getLabModelConfig } from "@/src/lib/lab-model-config";
import type { Lab } from "@/src/lib/labs";
import { cn } from "@/src/lib/utils";

function Platform({ hovered }: { hovered: boolean }) {
  const rim = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (!rim.current) return;
    const k = 1 - Math.exp(-delta * 6);
    rim.current.emissiveIntensity = THREE.MathUtils.lerp(
      rim.current.emissiveIntensity,
      hovered ? 3.4 : 1.6,
      k,
    );
  });

  return (
    <group position={[0, -0.44, 0]}>
      <mesh position={[0, -0.07, 0]} receiveShadow>
        <cylinderGeometry args={[0.98, 1.05, 0.14, 64]} />
        <meshStandardMaterial color="#e6d9b8" roughness={0.85} metalness={0.02} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.98, 64]} />
        <meshStandardMaterial color="#f4ecd8" roughness={0.82} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.84, 0.97, 72]} />
        <meshStandardMaterial
          ref={rim}
          color="#FFC107"
          emissive="#FFB900"
          emissiveIntensity={1.6}
          metalness={0.3}
          roughness={0.35}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.84, 64]} />
        <meshStandardMaterial
          color="#faf5e8"
          roughness={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

function GlowLight({ hovered }: { hovered: boolean }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame((_, delta) => {
    if (!light.current) return;
    const k = 1 - Math.exp(-delta * 6);
    light.current.intensity = THREE.MathUtils.lerp(
      light.current.intensity,
      hovered ? 22 : 9,
      k,
    );
  });
  return (
    <pointLight
      ref={light}
      position={[0, 0.9, 1.4]}
      intensity={9}
      distance={6.5}
      color="#FFD54F"
      decay={2}
    />
  );
}

function PreviewScene({
  lab,
  hovered,
  pointer,
  reducedMotion,
}: {
  lab: Lab;
  hovered: boolean;
  pointer: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  const config = getLabModelConfig(lab.id);
  return (
    <>
      <ambientLight intensity={0.8} />
      <hemisphereLight args={["#ffffff", "#e4decd", 1.1]} />
      <directionalLight position={[3.5, 5, 4]} intensity={2.3} castShadow />
      <directionalLight position={[-3, 2.5, -3.5]} intensity={0.85} color="#FFD54F" />

      <ModelHoverController
        hovered={hovered}
        pointer={pointer}
        baseRotation={config.rotation}
        idleRotation={config.idleRotation}
        hoverRotation={config.hoverRotation}
        hoverScale={config.hoverScale}
        reducedMotion={reducedMotion}
      >
        <LabModel id={lab.id} />
      </ModelHoverController>

      <Platform hovered={hovered} />
      <GlowLight hovered={hovered} />
    </>
  );
}

function PreviewFallback({ lab }: { lab: Lab }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="absolute bottom-6 left-1/2 h-10 w-40 -translate-x-1/2 rounded-[50%] bg-spark-yellow/25 blur-xl" />
      <div className="absolute bottom-8 left-1/2 h-16 w-48 -translate-x-1/2 rounded-[50%] border border-spark-dark/25 bg-[#f4ecd8]" />
      <span className="relative -mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-spark-yellow shadow-card">
        <LabGlyph icon={lab.icon} className="h-7 w-7" />
      </span>
      <span className="relative mt-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
        3D preview
      </span>
    </div>
  );
}

export function Lab3DPreview({
  lab,
  className,
  onExpand,
  showHint = true,
}: {
  lab: Lab;
  className?: string;
  onExpand?: () => void;
  showHint?: boolean;
}) {
  const config = getLabModelConfig(lab.id);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const webgl = useWebGLAvailable();
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
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
      { rootMargin: "200px 0px" },
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

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    if (!hovered) setHovered(true);
  }

  function handlePointerLeave() {
    setHovered(false);
    pointer.current.x = 0;
    pointer.current.y = 0;
  }

  const renderScene =
    mounted && webgl === true && inView && !lowPower;
  const running = renderScene && (visible || hovered);

  return (
    <div
      ref={containerRef}
      className={cn("group/preview relative isolate", className)}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={handlePointerLeave}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl border border-ink/[0.08] bg-gradient-to-br from-[#fcfaf4] via-[#f7f2e4] to-[#f0e2b4]">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-25" />
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 left-1/2 h-24 w-[78%] -translate-x-1/2 translate-y-1/3 rounded-[50%] blur-2xl transition-opacity duration-500",
            hovered ? "opacity-90" : "opacity-50",
          )}
          style={{ backgroundColor: `${config.accent}66` }}
        />
        <div className="pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full bg-white/60 blur-2xl" />
      </div>

      {renderScene ? (
        <div className="pointer-events-none absolute -inset-2 z-10 sm:-inset-3">
          <Canvas
            className="!absolute inset-0"
            shadows
            dpr={[1, 1.5]}
            camera={{
              position: config.previewCamera.position,
              fov: config.previewCamera.fov,
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            frameloop={running ? "always" : "demand"}
            resize={{ debounce: 150 }}
          >
            <PreviewScene
              lab={lab}
              hovered={hovered}
              pointer={pointer}
              reducedMotion={reducedMotion}
            />
          </Canvas>
        </div>
      ) : (
        <PreviewFallback lab={lab} />
      )}

      <span className="pointer-events-none absolute left-2.5 top-2.5 z-30 inline-flex items-center gap-1 rounded-full bg-ink px-2 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] text-white shadow-sm">
        <Star className="h-3 w-3 fill-spark-yellow text-spark-yellow" />
        3D Preview
      </span>

      {showHint && (
        <span className="pointer-events-none absolute bottom-2.5 left-2.5 z-30 hidden whitespace-nowrap rounded-full border border-white/60 bg-white/80 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-ink-muted backdrop-blur sm:inline-flex">
          {onExpand ? "Click to inspect" : "Live 3D model"}
        </span>
      )}

      {onExpand && (
        <button
          type="button"
          onClick={onExpand}
          className="absolute inset-0 z-20 cursor-zoom-in rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-spark-dark focus-visible:ring-offset-2"
          aria-label={`Open ${lab.name} in an interactive 3D viewer`}
        />
      )}

      {renderScene && hovered && onExpand && (
        <span className="pointer-events-none absolute right-2.5 top-2.5 z-30 hidden items-center gap-1 rounded-full bg-ink/85 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-spark-light backdrop-blur lg:inline-flex">
          <Info className="h-3 w-3" /> 360° view
        </span>
      )}
    </div>
  );
}
