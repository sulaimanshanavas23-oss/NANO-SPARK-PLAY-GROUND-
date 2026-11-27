"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Grid,
  Html,
  OrbitControls,
  useCursor,
} from "@react-three/drei";
import * as THREE from "three";
import { labs, type Lab } from "@/src/lib/labs";
import { LabModel } from "@/components/campus/lab-models";
import {
  QUALITY_SETTINGS,
  useDeviceQuality,
  useSceneActivity,
  type SceneQuality,
} from "@/src/lib/use-device-quality";
import { cn } from "@/src/lib/utils";

const RING_RADIUS = 5.2;
const STATION_RADIUS = 1.2;
const CAMERA_FOV = 20;
const CAMERA_AZIMUTH = Math.PI / 4;
const CAMERA_ELEVATION = THREE.MathUtils.degToRad(35);
const CAMERA_DIRECTION = new THREE.Vector3(
  Math.cos(CAMERA_AZIMUTH) * Math.cos(CAMERA_ELEVATION),
  Math.sin(CAMERA_ELEVATION),
  Math.sin(CAMERA_AZIMUTH) * Math.cos(CAMERA_ELEVATION),
).normalize();

const LAB_ORDER = [
  "arduino-lab",
  "esp32-lab",
  "protocol-explorer",
  "electronics-101",
  "roverkit-lab",
  "vehicle-explorer",
  "robotics-lab",
] as const;

export type StationConfig = {
  id: string;
  index: number;
  angle: number;
  position: [number, number, number];
};

export const LAB_STATIONS: StationConfig[] = LAB_ORDER.map((id, index) => {
  const angle = Math.PI / 2 + (index / LAB_ORDER.length) * Math.PI * 2;
  return {
    id,
    index,
    angle,
    position: [
      Math.cos(angle) * RING_RADIUS,
      0,
      Math.sin(angle) * RING_RADIUS,
    ],
  };
});

export const LAB_POSITIONS = Object.fromEntries(
  LAB_STATIONS.map((station) => [station.id, station.position]),
) as Record<string, [number, number, number]>;

type ControlsLike = {
  target: THREE.Vector3;
  update: () => void;
  autoRotate: boolean;
};

function getFitDistance(
  size: { width: number; height: number },
  exploded: boolean,
) {
  const aspect = Math.max(size.width / Math.max(size.height, 1), 0.35);
  const verticalFov = THREE.MathUtils.degToRad(CAMERA_FOV);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  const limitingFov = Math.min(verticalFov, horizontalFov);
  const radius =
    RING_RADIUS * (exploded ? 1.55 : 1) + STATION_RADIUS + 0.4;
  return (radius * 1.12) / Math.sin(limitingFov / 2);
}

function CameraRig({
  selectedId,
  exploded,
  zoom,
  resetSignal,
  reduceMotion,
  fitDistance,
}: {
  selectedId: string | null;
  exploded: boolean;
  zoom: number;
  resetSignal: number;
  reduceMotion: boolean;
  fitDistance: number;
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
    const zoomFactor = 1 - zoom * 0.1;
    const target = base
      ? new THREE.Vector3(
          base[0] * (exploded ? 1.5 : 1),
          exploded ? 0.9 : 0.68,
          base[2] * (exploded ? 1.55 : 1),
        )
      : new THREE.Vector3(0, exploded ? 0.85 : 0.55, 0);

    const distance = base
      ? (mobile ? 14 : 11.5) * zoomFactor
      : fitDistance * zoomFactor;
    const goalPosition = target
      .clone()
      .add(CAMERA_DIRECTION.clone().multiplyScalar(distance));

    transition.current = {
      start: performance.now(),
      duration: reduceMotion ? 0 : 900,
      fromPosition: camera.position.clone(),
      toPosition: goalPosition,
      fromTarget: controls.target.clone(),
      toTarget: target,
    };
  }, [
    selectedId,
    exploded,
    zoom,
    resetSignal,
    controls,
    camera,
    size.width,
    fitDistance,
    reduceMotion,
  ]);

  useFrame(() => {
    if (!controls || !transition.current) return;
    const { start, duration, fromPosition, toPosition, fromTarget, toTarget } =
      transition.current;
    const raw =
      duration === 0
        ? 1
        : Math.min(1, (performance.now() - start) / duration);
    const eased =
      raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;

    camera.position.lerpVectors(fromPosition, toPosition, eased);
    controls.target.lerpVectors(fromTarget, toTarget, eased);
    controls.update();

    if (raw >= 1) transition.current = null;
  });

  return null;
}

function SceneCleanup() {
  const { scene } = useThree();

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
    };
  }, [scene]);

  return null;
}

function Ground({ quality }: { quality: SceneQuality }) {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <circleGeometry args={[60, 72]} />
        <meshStandardMaterial color="#f7f6f1" roughness={0.96} metalness={0} />
      </mesh>
      <Grid
        position={[0, -0.02, 0]}
        args={[60, 60]}
        cellSize={0.6}
        cellThickness={0.55}
        cellColor="#d8d4c8"
        sectionSize={3}
        sectionThickness={0.9}
        sectionColor="#cbc7ba"
        fadeDistance={quality === "low" ? 18 : 23}
        fadeStrength={2.4}
        fadeFrom={0}
        followCamera={false}
        infiniteGrid={false}
      />
    </group>
  );
}

function Pathways({ exploded }: { exploded: boolean }) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const geometry = useMemo(() => {
    const points = Array.from({ length: 96 }, (_, index) => {
      const angle = (index / 96) * Math.PI * 2;
      return new THREE.Vector3(
        Math.cos(angle) * RING_RADIUS,
        0.02,
        Math.sin(angle) * RING_RADIUS,
      );
    });
    const curve = new THREE.CatmullRomCurve3(points, true);
    return new THREE.TubeGeometry(curve, 160, 0.012, 6, true);
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (!material.current) return;
    const k = 1 - Math.exp(-delta * 5);
    material.current.opacity = THREE.MathUtils.lerp(
      material.current.opacity,
      exploded ? 0.16 : 0.38,
      k,
    );
  });

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        ref={material}
        color="#FFC107"
        transparent
        opacity={0.38}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function clampLabelPosition(
  element: THREE.Object3D,
  camera: THREE.Camera,
  size: { width: number; height: number },
): [number, number] {
  const point = new THREE.Vector3();
  element.getWorldPosition(point);
  point.project(camera);

  const x = (point.x * 0.5 + 0.5) * size.width;
  const y = (-point.y * 0.5 + 0.5) * size.height;
  const padX = Math.min(92, size.width * 0.18);
  const padTop = 34;
  const padBottom = 84;

  return [
    THREE.MathUtils.clamp(x, padX, size.width - padX),
    THREE.MathUtils.clamp(y, padTop, size.height - padBottom),
  ];
}

function StationPill({
  lab,
  selected,
  hovered,
  onHover,
  onSelect,
}: {
  lab: Lab;
  selected: boolean;
  hovered: boolean;
  onHover: (value: boolean) => void;
  onSelect: () => void;
}) {
  return (
    <Html
      center
      position={[0, 0.12, 1.42]}
      zIndexRange={[20, 0]}
      calculatePosition={clampLabelPosition}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
        className={cn(
          "min-w-[92px] rounded-xl border bg-ink/90 px-2 py-1.5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.22)] transition-colors sm:min-w-[124px] sm:px-2.5",
          selected || hovered
            ? "border-spark-yellow/50 bg-ink/95"
            : "border-white/10 hover:border-spark-yellow/35",
        )}
        aria-label={`Open ${lab.name}`}
        aria-haspopup="dialog"
        aria-pressed={selected}
      >
        <span className="block font-mono text-[7.5px] font-semibold uppercase tracking-[0.18em] text-spark-yellow sm:text-[8px]">
          LAB {lab.number}
        </span>
        <span className="mt-0.5 block whitespace-nowrap text-[10px] font-semibold leading-tight text-white sm:text-[11px]">
          {lab.name}
        </span>
        <span
          className={cn(
            "block overflow-hidden text-[9px] leading-tight text-white/50 transition-all duration-200",
            hovered ? "mt-0.5 max-h-4 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          {lab.tagline}
        </span>
      </button>
    </Html>
  );
}

function LabStation({
  lab,
  station,
  selected,
  exploded,
  onSelect,
  reduceMotion,
}: {
  lab: Lab;
  station: StationConfig;
  selected: boolean;
  exploded: boolean;
  onSelect: (id: string | null) => void;
  reduceMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const model = useRef<THREE.Group>(null);
  const ring = useRef<THREE.MeshStandardMaterial>(null);
  const floorRing = useRef<THREE.MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const base = station.position;

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
      (exploded ? 0.55 : 0) + (hovered ? 0.08 : 0) + (selected ? 0.12 : 0);

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
        0.9 + highlight * 1.2,
        k,
      );
    }
    if (floorRing.current) {
      floorRing.current.opacity = THREE.MathUtils.lerp(
        floorRing.current.opacity,
        0.12 + highlight * 0.22,
        k,
      );
    }
    if (model.current) {
      const float = reduceMotion
        ? 0
        : Math.sin(clock.elapsedTime * 1.1 + station.index) * 0.015;
      model.current.position.y = THREE.MathUtils.lerp(
        model.current.position.y,
        0.5 + (exploded ? 0.2 : 0) + float,
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
        <ringGeometry args={[1.28, 1.33, 72]} />
        <meshBasicMaterial
          ref={floorRing}
          color="#FFC107"
          transparent
          opacity={0.12}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.12, 1.2, 0.4, 56]} />
        <meshStandardMaterial color="#222222" metalness={0.12} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.315, 0]} castShadow>
        <cylinderGeometry args={[1.16, 1.16, 0.045, 56]} />
        <meshStandardMaterial color="#2b2b2b" metalness={0.08} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.205, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.155, 0.012, 10, 96]} />
        <meshStandardMaterial
          ref={ring}
          color="#FFC107"
          emissive="#FFC107"
          emissiveIntensity={0.9}
          metalness={0.2}
          roughness={0.35}
          toneMapped={false}
        />
      </mesh>

      <group ref={model}>
        <LabModel id={lab.id} />
      </group>

      <StationPill
        lab={lab}
        selected={selected}
        hovered={hovered}
        onHover={setHovered}
        onSelect={() => onSelect(lab.id)}
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
  const size = useThree((state) => state.size);
  const fitDistance = getFitDistance(size, exploded);

  return (
    <>
      <color attach="background" args={["#f7f6f1"]} />
      <fog
        attach="fog"
        args={["#f7f6f1", fitDistance * 1.15, fitDistance * 2.4]}
      />

      <hemisphereLight args={["#ffffff", "#e8e1d2", 0.95]} />
      <directionalLight
        position={[8, 12, 8]}
        intensity={2.2}
        color="#fff3d6"
        castShadow={settings.shadows}
        shadow-mapSize={[settings.shadowMap, settings.shadowMap]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-bias={-0.0003}
        shadow-radius={4}
      />
      <directionalLight
        position={[-8, 6, -6]}
        intensity={0.55}
        color="#dfe8ff"
      />

      <Ground quality={quality} />
      <Pathways exploded={exploded} />
      <ContactShadows
        position={[0, 0.008, 0]}
        opacity={0.28}
        scale={18}
        blur={2.6}
        far={4}
        resolution={quality === "low" ? 128 : 256}
        frames={1}
      />

      {LAB_STATIONS.map((station) => {
        const lab = labs.find((item) => item.id === station.id);
        if (!lab) return null;
        return (
          <LabStation
            key={station.id}
            lab={lab}
            station={station}
            selected={selectedId === station.id}
            exploded={exploded}
            onSelect={onSelect}
            reduceMotion={reduceMotion}
          />
        );
      })}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        minDistance={selectedId ? 5 : fitDistance * 0.45}
        maxDistance={fitDistance * 1.6}
        minPolarAngle={0.55}
        maxPolarAngle={1.2}
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
        fitDistance={fitDistance}
      />
      <SceneCleanup />
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
        shadows={settings.shadows ? { type: THREE.PCFSoftShadowMap } : false}
        frameloop={active ? "always" : "demand"}
        performance={{ min: 0.4 }}
        camera={{ position: [18, 14, 22], fov: CAMERA_FOV, near: 0.1, far: 120 }}
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
