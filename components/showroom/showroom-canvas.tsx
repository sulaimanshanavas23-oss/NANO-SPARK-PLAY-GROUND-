"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useCursor } from "@react-three/drei";
import * as THREE from "three";
import type { Tool } from "@/src/lib/tools";
import { toolCategories } from "@/src/lib/tools";
import { StationLabel } from "@/components/shared/station-label";
import {
  QUALITY_SETTINGS,
  useDeviceQuality,
  useSceneActivity,
} from "@/src/lib/use-device-quality";

function AnimatedGroup({
  children,
  speed = 0.25,
  float = 0.04,
  offset = 0,
  reduceMotion,
}: {
  children: React.ReactNode;
  speed?: number;
  float?: number;
  offset?: number;
  reduceMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.position.y =
      0.58 + (reduceMotion ? 0 : Math.sin(t * 0.9 + offset) * float);
    if (!reduceMotion)
      group.current.rotation.y = Math.sin(t * speed * 1.2 + offset) * 0.12;
  });
  return <group ref={group}>{children}</group>;
}

function LaptopModel({ accent }: { accent: string }) {
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (screen.current)
      screen.current.emissiveIntensity = 0.55 + Math.sin(clock.elapsedTime * 1.5) * 0.15;
  });
  return (
    <group scale={0.9}>
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[0.92, 0.055, 0.6]} />
        <meshStandardMaterial color="#202124" metalness={0.65} roughness={0.32} />
      </mesh>
      <group position={[0, 0.33, -0.24]} rotation={[-0.28, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.9, 0.58, 0.035]} />
          <meshStandardMaterial color="#202124" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[0.79, 0.48]} />
          <meshStandardMaterial
            ref={screen}
            color="#0a1b29"
            emissive="#0e2f45"
            emissiveIntensity={0.6}
            toneMapped={false}
          />
        </mesh>
        {[0.14, 0.06, -0.02, -0.1].map((y, index) => (
          <mesh key={y} position={[-0.14 + index * 0.025, y, 0.024]}>
            <planeGeometry args={[0.38 - index * 0.04, 0.022]} />
            <meshBasicMaterial color={index === 0 ? accent : "#5b8ba3"} toneMapped={false} />
          </mesh>
        ))}
      </group>
      {Array.from({ length: 12 }).map((_, index) => {
        const row = Math.floor(index / 4);
        const column = index % 4;
        return (
          <mesh
            key={index}
            position={[-0.27 + column * 0.18, 0.074, 0.02 + row * 0.1]}
          >
            <boxGeometry args={[0.14, 0.008, 0.075]} />
            <meshStandardMaterial color="#383b3f" metalness={0.4} roughness={0.5} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.074, 0.22]}>
        <boxGeometry args={[0.32, 0.006, 0.13]} />
        <meshStandardMaterial color="#5b5e63" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function BoardModel({ accent }: { accent: string }) {
  return (
    <group scale={0.95} rotation={[0, 0.3, 0]}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[1.05, 0.07, 0.66]} />
        <meshStandardMaterial color={accent} metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[-0.08, 0.13, 0]}>
        <boxGeometry args={[0.44, 0.1, 0.32]} />
        <meshStandardMaterial color="#1b1b1b" metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[-0.08, 0.185, 0]}>
        <boxGeometry args={[0.22, 0.012, 0.2]} />
        <meshStandardMaterial color="#5a5a5a" metalness={0.85} roughness={0.22} />
      </mesh>
      <mesh position={[0.3, 0.115, -0.14]}>
        <boxGeometry args={[0.16, 0.05, 0.12]} />
        <meshStandardMaterial color="#c8ccd0" metalness={0.95} roughness={0.2} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.48, 0.12, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.56]} />
          <meshStandardMaterial color="#101010" roughness={0.5} />
        </mesh>
      ))}
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh key={index} position={[-0.38 + index * 0.11, 0.14, 0.28]}>
          <boxGeometry args={[0.02, 0.05, 0.02]} />
          <meshStandardMaterial color="#d8a13a" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[0.2 + index * 0.09, 0.11, 0.25]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshStandardMaterial
            color={index === 0 ? "#ff3b30" : index === 1 ? "#34c759" : "#FFC107"}
            emissive={index === 0 ? "#ff3b30" : index === 1 ? "#34c759" : "#FFC107"}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function BreadboardModel() {
  return (
    <group scale={0.92} rotation={[0, -0.25, 0]}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.08, 0.1, 0.7]} />
        <meshStandardMaterial color="#f4f2ea" roughness={0.6} />
      </mesh>
      {Array.from({ length: 24 }).map((_, index) => {
        const row = Math.floor(index / 8);
        const column = index % 8;
        return (
          <mesh key={index} position={[-0.42 + column * 0.12, 0.105, -0.18 + row * 0.18]}>
            <cylinderGeometry args={[0.017, 0.017, 0.006, 6]} />
            <meshStandardMaterial color="#292929" roughness={0.8} />
          </mesh>
        );
      })}
      {[0, 1].map((index) => (
        <group key={index} position={[0.3 + index * 0.16, 0.24, 0.12]}>
          <mesh>
            <cylinderGeometry args={[0.065, 0.065, 0.05, 14]} />
            <meshStandardMaterial
              color={index === 0 ? "#ff3b30" : "#FFC107"}
              emissive={index === 0 ? "#ff3b30" : "#FFC107"}
              emissiveIntensity={0.7}
            />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.065, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color={index === 0 ? "#ff6056" : "#ffe066"}
              emissive={index === 0 ? "#ff3b30" : "#FFC107"}
              emissiveIntensity={2.4}
              transparent
              opacity={0.92}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            color={index === 0 ? "#ff3b30" : "#FFC107"}
            intensity={1}
            distance={0.8}
          />
        </group>
      ))}
      <mesh position={[-0.3, 0.1, 0.2]}>
        <boxGeometry args={[0.3, 0.04, 0.06]} />
        <meshStandardMaterial color="#c62828" roughness={0.5} />
      </mesh>
      <mesh position={[-0.3, 0.105, -0.12]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.22, 10]} />
        <meshStandardMaterial color="#d8b27a" roughness={0.6} />
      </mesh>
    </group>
  );
}

function CloudModel({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.elapsedTime * 0.35;
  });
  return (
    <group>
      <group ref={group} position={[0, 0.18, 0]}>
        {[
          [0, 0, 0, 0.26],
          [-0.22, 0.02, 0.08, 0.17],
          [0.22, 0.01, 0.04, 0.18],
          [0.02, 0.01, -0.2, 0.16],
        ].map(([x, y, z, r], index) => (
          <mesh key={index} position={[x, y, z]}>
            <sphereGeometry args={[r, 18, 14]} />
            <meshStandardMaterial
              color="#f5f5f2"
              emissive={accent}
              emissiveIntensity={0.18}
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.008, 8, 64]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
      </group>
      {[0, 1, 2, 3].map((index) => (
        <mesh
          key={index}
          position={[
            Math.cos((index / 4) * Math.PI * 2) * 0.42,
            0.18 + Math.sin((index / 4) * Math.PI * 2) * 0.12,
            Math.sin((index / 4) * Math.PI * 2) * 0.42,
          ]}
        >
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function AiModel({ accent }: { accent: string }) {
  const core = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (core.current) core.current.rotation.x = clock.elapsedTime * 0.4;
    if (core.current) core.current.rotation.y = clock.elapsedTime * 0.55;
    if (orbit.current) orbit.current.rotation.y = clock.elapsedTime * 0.6;
  });
  return (
    <group position={[0, 0.2, 0]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.26, 1]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.7}
          metalness={0.4}
          roughness={0.25}
          wireframe
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color="#FFC107"
          emissive="#FFB900"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <group ref={orbit}>
        {[0, 1, 2, 3, 4].map((index) => (
          <mesh
            key={index}
            position={[
              Math.cos((index / 5) * Math.PI * 2) * 0.44,
              Math.sin((index / 5) * Math.PI * 2) * 0.2,
              Math.sin((index / 5) * Math.PI * 2) * 0.44,
            ]}
          >
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial
              color="#FFD54F"
              emissive="#FFC107"
              emissiveIntensity={1.6}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function RoverModel() {
  return (
    <group scale={0.92} position={[0, 0.08, 0]} rotation={[0, 0.4, 0]}>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.8, 0.18, 0.5]} />
        <meshStandardMaterial color="#FFC107" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.64, 0.1, 0.4]} />
        <meshStandardMaterial color="#161616" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0.3, 0.3, 0.14]}>
        <cylinderGeometry args={[0.035, 0.035, 0.025, 12]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00c8e0" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      <mesh position={[0.3, 0.3, -0.14]}>
        <cylinderGeometry args={[0.035, 0.035, 0.025, 12]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00c8e0" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {[-0.27, 0.27].map((x) =>
        [-0.29, 0.29].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0.12, z]} rotation={[0, 0, Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[0.15, 0.15, 0.12, 16]} />
              <meshStandardMaterial color="#181818" roughness={0.7} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.07, 0.07, 0.125, 12]} />
              <meshStandardMaterial color="#FFC107" metalness={0.4} roughness={0.4} />
            </mesh>
          </group>
        )),
      )}
      <mesh position={[-0.1, 0.4, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.28, 6]} />
        <meshStandardMaterial color="#bdbdbd" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

function ToolModel({ tool }: { tool: Tool }) {
  switch (tool.model) {
    case "laptop":
      return <LaptopModel accent={tool.color} />;
    case "board":
      return <BoardModel accent={tool.color} />;
    case "breadboard":
      return <BreadboardModel />;
    case "cloud":
      return <CloudModel accent={tool.color} />;
    case "ai":
      return <AiModel accent={tool.color} />;
    case "rover":
      return <RoverModel />;
    default:
      return <LaptopModel accent={tool.color} />;
  }
}

function Podium({
  tool,
  index,
  reduceMotion,
  onSelect,
  selected,
}: {
  tool: Tool;
  index: number;
  reduceMotion: boolean;
  onSelect: (tool: Tool) => void;
  selected: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const row = Math.floor(index / 4);
  const column = index % 4;
  const position: [number, number, number] = [
    (column - 1.5) * 3.05,
    0,
    row === 0 ? 1.3 : -2.1,
  ];

  useFrame((_, delta) => {
    if (!group.current) return;
    const k = 1 - Math.exp(-delta * 7);
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      hovered || selected ? 0.14 : 0,
      k,
    );
    if (ring.current) {
      ring.current.emissiveIntensity = THREE.MathUtils.lerp(
        ring.current.emissiveIntensity,
        hovered || selected ? 4.4 : 1.4,
        k,
      );
    }
    if (light.current) {
      light.current.intensity = THREE.MathUtils.lerp(
        light.current.intensity,
        hovered || selected ? 8 : 2.5,
        k,
      );
    }
  });

  return (
    <group ref={group} position={position} onClick={(event) => {
      event.stopPropagation();
      onSelect(tool);
    }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0.16, 0]} receiveShadow>
        <cylinderGeometry args={[1.02, 1.12, 0.32, 48]} />
        <meshStandardMaterial color="#121214" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.325, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.03, 48]} />
        <meshStandardMaterial color="#1c1c1f" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.04, 0.008, 8, 84]} />
        <meshStandardMaterial
          ref={ring}
          color="#FFC107"
          emissive="#FFB900"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={light}
        position={[0, 0.8, 0]}
        color="#FFD54F"
        intensity={2.5}
        distance={3}
        decay={2}
      />
      <AnimatedGroup speed={0.25} offset={index} reduceMotion={reduceMotion}>
        <ToolModel tool={tool} />
      </AnimatedGroup>
      <StationLabel
        position={[0, 0.7, 1.3]}
        meta={
          toolCategories.find((category) => category.id === tool.category)?.shortTitle ??
          "Exhibit"
        }
        title={tool.name}
        subtitle={tool.domain}
        footer={hovered || selected ? "Selected exhibit" : "Click to inspect"}
        active={hovered || selected}
      />
    </group>
  );
}

function CameraReset({
  resetSignal,
  reduceMotion,
}: {
  resetSignal: number;
  reduceMotion: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const controls = useThree((state) => state.controls) as
    | { target: THREE.Vector3; update: () => void }
    | null;

  useEffect(() => {
    if (!controls) return;
    const large =
      size.width >= 2560 ? 1.3 : size.width >= 1920 ? 1.14 : 1;
    camera.position.set(0, 6.8 * large, 11.6 * large);
    controls.target.set(0, 0.9, 0);
    controls.update();
  }, [resetSignal, controls, camera, reduceMotion, size.width]);

  return null;
}

export default function ShowroomCanvas({
  items,
  onSelect,
  autoRotate = false,
  resetSignal = 0,
  reduceMotion = false,
}: {
  items: Tool[];
  onSelect: (tool: Tool) => void;
  autoRotate?: boolean;
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
        shadows={settings.shadows ? { type: THREE.PCFShadowMap } : false}
        dpr={settings.dpr}
        frameloop={active ? "always" : "demand"}
        performance={{ min: 0.4 }}
        camera={{ position: [0, 6.8, 11.6], fov: 42, near: 0.1, far: 80 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        className="!absolute inset-0"
        onPointerMissed={() => undefined}
      >
        <color attach="background" args={["#f5f5f2"]} />
        <fog attach="fog" args={["#f5f5f2", 20, 40]} />
        <ambientLight intensity={0.75} />
        <hemisphereLight args={["#ffffff", "#ddd8cb", 1.05]} />
        <directionalLight
          position={[5, 10, 7]}
          intensity={2.1}
          castShadow={settings.shadows}
          shadow-mapSize={[settings.shadowMap, settings.shadowMap]}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
        />
        <directionalLight position={[-6, 6, -5]} intensity={0.7} color="#FFD54F" />
        <pointLight position={[0, 6, 2]} color="#FFD54F" intensity={26} distance={16} decay={2} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -0.5]} receiveShadow>
          <planeGeometry args={[38, 28]} />
          <meshStandardMaterial color="#f4f4f0" roughness={0.82} metalness={0.08} />
        </mesh>
        <gridHelper args={[32, 40, "#e3c987", "#e2dfd6"]} position={[0, 0.002, -0.5]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, -0.5]}>
          <ringGeometry args={[6.9, 6.96, 96]} />
          <meshBasicMaterial color="#FFB900" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, -0.5]}>
          <ringGeometry args={[7.3, 7.32, 96]} />
          <meshBasicMaterial color="#FFC107" transparent opacity={0.2} />
        </mesh>

        <Suspense fallback={null}>
          {items.map((tool, index) => (
            <Podium
              key={tool.id}
              tool={tool}
              index={index}
              onSelect={onSelect}
              reduceMotion={reduceMotion}
              selected={false}
            />
          ))}
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          enablePan={false}
          minDistance={5}
          maxDistance={22}
          minPolarAngle={0.28}
          maxPolarAngle={1.42}
          autoRotate={autoRotate && !reduceMotion}
          autoRotateSpeed={0.45}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_ROTATE,
          }}
        />
        <CameraReset resetSignal={resetSignal} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
