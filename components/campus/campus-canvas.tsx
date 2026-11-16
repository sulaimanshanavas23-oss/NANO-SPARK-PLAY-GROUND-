"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sparkles, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { labs, type Lab } from "@/src/lib/labs";
import { LabModel } from "@/components/campus/lab-models";
import { StationLabel } from "@/components/shared/station-label";
import {
  QUALITY_SETTINGS,
  useDeviceQuality,
  useSceneActivity,
  type SceneQuality,
} from "@/src/lib/use-device-quality";

export const LAB_POSITIONS: Record<string, [number, number, number]> = {
  "arduino-lab": [-3.4, 0, -2.75],
  "esp32-lab": [0, 0, -3.7],
  "protocol-explorer": [3.4, 0, -2.75],
  "electronics-101": [-4.35, 0, 0.35],
  "roverkit-lab": [0, 0, 0.15],
  "vehicle-explorer": [4.35, 0, 0.35],
  "robotics-lab": [0, 0, 3.5],
};

type ControlsLike = {
  target: THREE.Vector3;
  update: () => void;
  autoRotate: boolean;
};

function CameraRig({
  selectedId,
  exploded,
  zoom,
  resetSignal,
  reduceMotion,
}: {
  selectedId: string | null;
  exploded: boolean;
  zoom: number;
  resetSignal: number;
  reduceMotion: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as ControlsLike | null;
  const size = useThree((state) => state.size);
  const transition = useRef<{
    start: number;
    duration: number;
    fromPosition: THREE.Vector3;
    toPosition: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
  } | null>(null);

  useEffect(() => {
    if (!controls) return;
    const base = selectedId ? LAB_POSITIONS[selectedId] : null;
    const mobile = size.width < 640;
    const largeFrame =
      size.width >= 2560 ? 1.34 : size.width >= 1920 ? 1.18 : 1;
    const target = base
      ? new THREE.Vector3(
          base[0] * (exploded ? 1.5 : 1),
          (exploded ? 1.85 : 1.25) + 0.1,
          base[2] * (exploded ? 1.55 : 1),
        )
      : new THREE.Vector3(0, exploded ? 1.0 : 0.6, 0);

    const distance =
      (base
        ? (mobile ? 13 : 9.5) + zoom * 1.1
        : (mobile ? 25 : 19.5) + zoom * 1.6) * (base ? 1 : largeFrame);
    const direction = (base
      ? new THREE.Vector3(0.5, 0.62, 1)
      : new THREE.Vector3(0.72, 0.66, 1)
    ).normalize();
    const goalPosition = target.clone().add(direction.multiplyScalar(distance));

    transition.current = {
      start: performance.now(),
      duration: reduceMotion ? 0 : 950,
      fromPosition: camera.position.clone(),
      toPosition: goalPosition,
      fromTarget: controls.target.clone(),
      toTarget: target,
    };
  }, [selectedId, exploded, zoom, resetSignal, controls, camera, size.width, reduceMotion]);

  useFrame(() => {
    if (!controls || !transition.current) return;
    const { start, duration, fromPosition, toPosition, fromTarget, toTarget } =
      transition.current;
    const raw = duration === 0 ? 1 : Math.min(1, (performance.now() - start) / duration);
    const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
    camera.position.lerpVectors(fromPosition, toPosition, eased);
    controls.target.lerpVectors(fromTarget, toTarget, eased);
    controls.update();
    if (raw >= 1) transition.current = null;
  });

  return null;
}

function Ground({ quality }: { quality: SceneQuality }) {
  const gridSegments = quality === "low" ? 28 : quality === "medium" ? 40 : 56;
  const ringSegments = quality === "low" ? 48 : 96;
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.035, 0]}
        receiveShadow
      >
        <circleGeometry args={[30, 72]} />
        <meshStandardMaterial color="#f6f6f1" roughness={0.92} metalness={0.02} />
      </mesh>
      <gridHelper
        args={[42, gridSegments, "#e0c98a", "#dedbd2"]}
        position={[0, -0.025, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[8.15, 8.22, ringSegments]} />
        <meshBasicMaterial color="#FFB900" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[8.3, 8.32, ringSegments]} />
        <meshBasicMaterial color="#FFC107" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function Pathways({ exploded }: { exploded: boolean }) {
  const materials = useRef<THREE.MeshBasicMaterial[]>([]);
  const glowMaterials = useRef<THREE.MeshBasicMaterial[]>([]);

  const tubes = useMemo(
    () =>
      labs
        .map((lab) => {
          const position = LAB_POSITIONS[lab.id];
          const length = Math.hypot(position[0], position[2]);
          if (length < 1) return null;
          const start = new THREE.Vector3(0, 0.01, 0);
          const end = new THREE.Vector3(position[0], 0.03, position[2]);
          const mid = end.clone().multiplyScalar(0.5);
          mid.y = 0.11;
          const curve = new THREE.CatmullRomCurve3([start, mid, end]);
          return {
            id: lab.id,
            geometry: new THREE.TubeGeometry(curve, 36, 0.012, 6, false),
          };
        })
        .filter(Boolean) as { id: string; geometry: THREE.TubeGeometry }[],
    [],
  );

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-delta * 5);
    materials.current.forEach((material) => {
      if (!material) return;
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        exploded ? 0.03 : 0.55,
        k,
      );
    });
    glowMaterials.current.forEach((material) => {
      if (!material) return;
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        exploded ? 0.01 : 0.13,
        k,
      );
    });
  });

  return (
    <group>
      {tubes.map((tube, index) => (
        <group key={tube.id}>
          <mesh geometry={tube.geometry}>
            <meshBasicMaterial
              ref={(material) => {
                if (material) materials.current[index] = material;
              }}
              color="#FFC107"
              transparent
              opacity={0.55}
              toneMapped={false}
            />
          </mesh>
          <mesh geometry={tube.geometry} scale={[1.8, 1.8, 1.8]}>
            <meshBasicMaterial
              ref={(material) => {
                if (material) glowMaterials.current[index] = material;
              }}
              color="#FFB900"
              transparent
              opacity={0.13}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const BITS = [
  { angle: 0, radius: 1.05, y: 0.55, kind: "cube", color: "#FFC107" },
  { angle: 1.1, radius: 0.95, y: 0.75, kind: "chip", color: "#1a1a1a" },
  { angle: 2.2, radius: 1.15, y: 0.45, kind: "pin", color: "#d8a13a" },
  { angle: 3.2, radius: 0.9, y: 0.8, kind: "cube", color: "#1a1a1a" },
  { angle: 4.3, radius: 1.1, y: 0.6, kind: "chip", color: "#FFB900" },
  { angle: 5.3, radius: 0.98, y: 0.9, kind: "pin", color: "#FFD54F" },
] as const;

function ExplodedBits({ exploded }: { exploded: boolean }) {
  const groups = useRef<THREE.Group[]>([]);
  const amount = useRef(0);

  useFrame((_, delta) => {
    amount.current = THREE.MathUtils.damp(
      amount.current,
      exploded ? 1 : 0,
      4.5,
      delta,
    );
    groups.current.forEach((group, index) => {
      if (!group) return;
      const bit = BITS[index];
      const t = amount.current;
      group.position.set(
        Math.cos(bit.angle) * bit.radius * (0.5 + t * 1.3),
        bit.y + t * 1.0,
        Math.sin(bit.angle) * bit.radius * (0.5 + t * 1.3),
      );
      group.scale.setScalar(0.001 + t);
      group.rotation.y += delta * 0.6;
      group.rotation.x += delta * 0.2;
    });
  });

  return (
    <group>
      {BITS.map((bit, index) => (
        <group
          key={index}
          ref={(element) => {
            if (element) groups.current[index] = element;
          }}
          scale={0.001}
        >
          {bit.kind === "cube" && (
            <mesh>
              <boxGeometry args={[0.16, 0.16, 0.16]} />
              <meshStandardMaterial
                color={bit.color}
                metalness={0.6}
                roughness={0.3}
                emissive="#FFB900"
                emissiveIntensity={0.25}
              />
            </mesh>
          )}
          {bit.kind === "chip" && (
            <mesh>
              <boxGeometry args={[0.2, 0.04, 0.14]} />
              <meshStandardMaterial color={bit.color} metalness={0.7} roughness={0.3} />
            </mesh>
          )}
          {bit.kind === "pin" && (
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
              <meshStandardMaterial
                color={bit.color}
                metalness={0.9}
                roughness={0.2}
                emissive="#FFB900"
                emissiveIntensity={0.4}
              />
            </mesh>
          )}
          <mesh>
            <sphereGeometry args={[0.024, 8, 8]} />
            <meshBasicMaterial color="#FFC107" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LabStation({
  lab,
  selected,
  exploded,
  onSelect,
  reduceMotion,
  index,
}: {
  lab: Lab;
  selected: boolean;
  exploded: boolean;
  onSelect: (id: string | null) => void;
  reduceMotion: boolean;
  index: number;
}) {
  const group = useRef<THREE.Group>(null);
  const model = useRef<THREE.Group>(null);
  const ring = useRef<THREE.MeshStandardMaterial>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const floorRing = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const base = LAB_POSITIONS[lab.id];

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const k = 1 - Math.exp(-delta * 6);
    const targetX = base[0] * (exploded ? 1.5 : 1);
    const targetZ = base[2] * (exploded ? 1.55 : 1);
    const targetY =
      (exploded ? 0.72 : 0) + (hovered ? 0.1 : 0) + (selected ? 0.18 : 0);

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      targetX,
      k,
    );
    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      targetZ,
      k,
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      targetY,
      k,
    );

    const highlight = hovered || selected ? 1 : 0;
    if (ring.current) {
      ring.current.emissiveIntensity = THREE.MathUtils.lerp(
        ring.current.emissiveIntensity,
        1.2 + highlight * 3.2,
        k,
      );
    }
    if (glow.current) {
      glow.current.opacity = THREE.MathUtils.lerp(
        glow.current.opacity,
        0.18 + highlight * 0.32,
        k,
      );
    }
    if (floorRing.current) {
      floorRing.current.opacity = THREE.MathUtils.lerp(
        floorRing.current.opacity,
        selected ? 0.75 : hovered ? 0.5 : 0.16,
        k,
      );
    }
    if (light.current) {
      light.current.intensity = THREE.MathUtils.lerp(
        light.current.intensity,
        5 + highlight * 14,
        k,
      );
    }
    if (model.current) {
      const float = reduceMotion
        ? 0
        : Math.sin(clock.elapsedTime * 1.1 + index) * 0.015;
      model.current.position.y = THREE.MathUtils.lerp(
        model.current.position.y,
        0.5 + (exploded ? 0.3 : 0) + float,
        k,
      );
      if (!reduceMotion) {
        const speed = hovered || selected ? 0.55 : 0.14;
        model.current.rotation.y += delta * speed;
      }
    }
  });

  return (
    <group
      ref={group}
      position={[base[0], 0, base[2]]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(lab.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.32, 1.37, 72]} />
        <meshBasicMaterial
          ref={floorRing}
          color="#FFB900"
          transparent
          opacity={0.16}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.12, 1.2, 0.4, 56]} />
        <meshStandardMaterial color="#0f0f10" metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.315, 0]} castShadow>
        <cylinderGeometry args={[1.16, 1.16, 0.045, 56]} />
        <meshStandardMaterial color="#1b1b1d" metalness={0.75} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.205, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.155, 0.012, 10, 96]} />
        <meshStandardMaterial
          ref={ring}
          color="#FFC107"
          emissive="#FFB900"
          emissiveIntensity={1.4}
          metalness={0.5}
          roughness={0.22}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.09, 1.33, 72]} />
        <meshBasicMaterial
          ref={glow}
          color="#FFC107"
          transparent
          opacity={0.18}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.06, 1.11]}>
        <boxGeometry args={[0.36, 0.025, 0.03]} />
        <meshStandardMaterial
          color="#FFC107"
          emissive="#FFB900"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={light}
        position={[0, 0.6, 0]}
        color="#FFD54F"
        intensity={6}
        distance={4.2}
        decay={2}
      />

      <group ref={model}>
        <LabModel id={lab.id} />
      </group>

      <ExplodedBits exploded={exploded} />

      <StationLabel
        position={[0, 0.62, 1.35]}
        meta={`LAB ${lab.number}`}
        title={lab.name}
        subtitle={lab.tagline}
        footer={
          selected ? "Focus active" : hovered ? "Click to focus" : "Interactive lab"
        }
        active={selected || hovered}
      />
    </group>
  );
}

function Scene({
  selectedId,
  onSelect,
  exploded,
  autoRotate,
  zoom,
  resetSignal,
  reduceMotion,
  quality,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  exploded: boolean;
  autoRotate: boolean;
  zoom: number;
  resetSignal: number;
  reduceMotion: boolean;
  quality: SceneQuality;
}) {
  const settings = QUALITY_SETTINGS[quality];
  return (
    <>
      <color attach="background" args={["#f3f3ee"]} />
      <fog attach="fog" args={["#f3f3ee", 26, 46]} />

      <ambientLight intensity={0.7} />
      <hemisphereLight args={["#ffffff", "#d7d3c6", 1.05]} />
      <directionalLight
        position={[8, 13, 7]}
        intensity={2.4}
        castShadow={settings.shadows}
        shadow-mapSize={[settings.shadowMap, settings.shadowMap]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-7, 7, -6]} intensity={0.75} color="#FFD54F" />
      <pointLight position={[0, 5.5, 1]} intensity={42} distance={18} color="#FFD54F" decay={2} />

      <Ground quality={quality} />
      <Pathways exploded={exploded} />

      {labs.map((lab, index) => (
        <LabStation
          key={lab.id}
          lab={lab}
          index={index}
          selected={selectedId === lab.id}
          exploded={exploded}
          onSelect={onSelect}
          reduceMotion={reduceMotion}
        />
      ))}

      {quality !== "low" && (
        <Sparkles
          count={settings.sparkles}
          scale={[18, 5, 18]}
          size={1.7}
          speed={0.25}
          color="#FFC107"
          opacity={0.55}
          position={[0, 2, 0]}
        />
      )}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        minDistance={4.5}
        maxDistance={30}
        minPolarAngle={0.3}
        maxPolarAngle={1.44}
        autoRotate={autoRotate && !selectedId && !reduceMotion}
        autoRotateSpeed={0.55}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_ROTATE,
        }}
      />
      <CameraRig
        selectedId={selectedId}
        exploded={exploded}
        zoom={zoom}
        resetSignal={resetSignal}
        reduceMotion={reduceMotion}
      />
    </>
  );
}

export default function CampusCanvas({
  selectedId,
  onSelect,
  exploded = false,
  autoRotate = false,
  zoom = 0,
  resetSignal = 0,
  reduceMotion = false,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  exploded?: boolean;
  autoRotate?: boolean;
  zoom?: number;
  resetSignal?: number;
  reduceMotion?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quality = useDeviceQuality();
  const settings = QUALITY_SETTINGS[quality];
  const active = useSceneActivity(containerRef);

  return (
    <div ref={containerRef} className="!absolute inset-0">
      <Canvas
        dpr={settings.dpr}
        shadows={settings.shadows ? { type: THREE.PCFShadowMap } : false}
        frameloop={active ? "always" : "demand"}
        performance={{ min: 0.4 }}
        camera={{ position: [12, 10, 15], fov: 38, near: 0.1, far: 100 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={() => onSelect(null)}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <Scene
            selectedId={selectedId}
            onSelect={onSelect}
            exploded={exploded}
            autoRotate={autoRotate}
            zoom={zoom}
            resetSignal={resetSignal}
            reduceMotion={reduceMotion}
            quality={quality}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
