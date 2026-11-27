"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, GraduationCap, Loader2, Play } from "lucide-react";
import { useWebGLAvailable } from "@/components/shared/webgl";
import { cn } from "@/src/lib/utils";

function GraduationScene({ animated }: { animated: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (animated) group.current.rotation.y += delta * 0.28;
    group.current.position.y = animated
      ? Math.sin(state.clock.elapsedTime * 0.9) * 0.045
      : 0;
  });

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[1.02, 1.08, 0.1, 48]} />
        <meshStandardMaterial color="#1b1b1b" roughness={0.6} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.86, 1, 64]} />
        <meshStandardMaterial
          color="#FFC107"
          emissive="#FFB900"
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>

      {/* Books */}
      <RoundedBox args={[1.1, 0.16, 0.78]} radius={0.03} position={[-0.04, 0.13, 0]}>
        <meshStandardMaterial color="#f4ecd8" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[1.02, 0.15, 0.72]} radius={0.03} position={[0.04, 0.28, 0.01]} rotation={[0, 0.12, 0]}>
        <meshStandardMaterial color="#FFC107" roughness={0.5} metalness={0.15} />
      </RoundedBox>
      <RoundedBox args={[0.94, 0.15, 0.66]} radius={0.03} position={[-0.02, 0.42, 0]} rotation={[0, -0.08, 0]}>
        <meshStandardMaterial color="#242424" roughness={0.55} />
      </RoundedBox>

      {/* Mortarboard */}
      <group position={[0, 0.62, 0]} rotation={[0, 0.35, 0]}>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.52, 0.16, 0.52]} />
          <meshStandardMaterial color="#151515" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.13, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.86, 0.045, 0.86]} />
          <meshStandardMaterial color="#111111" roughness={0.42} metalness={0.12} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial
            color="#FFC107"
            emissive="#FFC107"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0.44, 0.08, 0.44]} rotation={[0.2, 0.6, 0.1]}>
          <cylinderGeometry args={[0.012, 0.012, 0.34, 8]} />
          <meshStandardMaterial color="#FFC107" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.5, -0.1, 0.52]}>
          <sphereGeometry args={[0.05, 14, 14]} />
          <meshStandardMaterial color="#FFC107" metalness={0.7} roughness={0.25} />
        </mesh>
      </group>

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.45}
        scale={5}
        blur={2.4}
        far={2.4}
        color="#000000"
      />
    </group>
  );
}

export function CampusBanner({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion() ?? false;
  const webgl = useWebGLAvailable();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => setMounted(true), []);

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

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] bg-ink text-white shadow-card",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 dark-circuit opacity-95" />
      <div
        className="pointer-events-none absolute -right-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,193,7,0.45), transparent 68%)",
        }}
      />

      <div className="relative grid items-center gap-4 p-5 sm:grid-cols-[1fr_auto] sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
        <div className="flex items-start gap-4">
          <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full bg-spark-yellow text-ink shadow-[0_0_40px_rgba(255,193,7,0.35)] sm:flex">
            <GraduationCap className="h-8 w-8" />
          </span>
          <div className="min-w-0">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-spark-yellow text-ink sm:hidden">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h3 className="font-display text-xl font-bold leading-tight sm:text-2xl lg:text-[26px]">
              Not sure where to{" "}
              <span className="text-spark-yellow">begin?</span>
            </h3>
            <p className="mt-1.5 max-w-sm text-[11.5px] leading-relaxed text-white/55 sm:text-[12px]">
              Start at the campus, hopscotch each station and follow the road
              that matches your curiosity.
            </p>
            <Link
              href="/playground"
              className={cn("lab-btn-primary", "mt-4 font-bold")}
            >
              <Play className="lab-btn-primary__icon h-3 w-3 fill-current" />
              Enter playground <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative h-[190px] w-full sm:h-[210px] lg:h-[230px]"
        >
          {mounted && webgl === true && inView ? (
            <Canvas
              className="!absolute inset-0"
              shadows
              dpr={[1, 1.5]}
              camera={{ position: [2.6, 1.9, 3.1], fov: 34 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.9} />
              <directionalLight position={[3, 5, 4]} intensity={2.6} castShadow />
              <pointLight
                position={[0, 1.4, 1.6]}
                intensity={14}
                distance={8}
                color="#FFC107"
                decay={2}
              />
              <GraduationScene animated={!reduceMotion} />
            </Canvas>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-spark-yellow/15 text-spark-yellow">
                {mounted && webgl === null ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <GraduationCap className="h-9 w-9" />
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
