"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function Led({
  color = "#ffd54f",
  position = [0, 0, 0],
  size = 0.035,
  speed = 2,
  offset = 0,
}: {
  color?: string;
  position?: [number, number, number];
  size?: number;
  speed?: number;
  offset?: number;
}) {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.emissiveIntensity =
      1.8 + Math.sin(clock.elapsedTime * speed + offset) * 1.3;
  });
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial
        ref={material}
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}

function Pins({
  count = 10,
  start = [-0.5, 0, -0.32],
  step = [0.1, 0, 0],
  color = "#d8a13a",
}: {
  count?: number;
  start?: [number, number, number];
  step?: [number, number, number];
  color?: string;
}) {
  const positions = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => [
        start[0] + step[0] * index,
        start[1] + step[1] * index,
        start[2] + step[2] * index,
      ]) as [number, number, number][],
    [count, start, step],
  );
  return (
    <>
      {positions.map((position, index) => (
        <mesh key={index} position={position}>
          <boxGeometry args={[0.022, 0.05, 0.022]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
    </>
  );
}

function SignalWaves() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.elapsedTime * 0.5;
  });
  return (
    <group ref={group} position={[0.38, 0.45, 0]} rotation={[0, 0, -0.25]}>
      {[0, 1, 2].map((index) => (
        <mesh key={index} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14 + index * 0.09, 0.008, 8, 32, Math.PI]} />
          <meshStandardMaterial
            color="#FFD54F"
            emissive="#FFC107"
            emissiveIntensity={1.5}
            transparent
            opacity={0.85 - index * 0.22}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function ArduinoModel() {
  return (
    <group scale={0.82} rotation={[0, 0.22, 0]}>
      <RoundedBox args={[1.62, 0.09, 1.02]} radius={0.035} smoothness={3} position={[0, 0.12, 0]}>
        <meshStandardMaterial color="#0b7fa8" metalness={0.35} roughness={0.42} />
      </RoundedBox>
      <RoundedBox args={[0.34, 0.18, 0.28]} radius={0.02} position={[0.64, 0.23, -0.18]}>
        <meshStandardMaterial color="#c8ccd0" metalness={0.95} roughness={0.22} />
      </RoundedBox>
      <mesh position={[0.64, 0.23, 0.05]}>
        <boxGeometry args={[0.22, 0.14, 0.16]} />
        <meshStandardMaterial color="#25282b" metalness={0.6} roughness={0.4} />
      </mesh>
      {[-0.34, 0.12].map((x, index) => (
        <group key={x}>
          <mesh position={[x, 0.2, index === 0 ? -0.4 : 0.36]}>
            <boxGeometry args={[0.76, 0.075, 0.09]} />
            <meshStandardMaterial color="#121212" roughness={0.55} />
          </mesh>
          <Pins
            count={9}
            start={[x - 0.32, 0.255, index === 0 ? -0.4 : 0.36]}
            step={[0.08, 0, 0]}
          />
        </group>
      ))}
      <mesh position={[-0.2, 0.2, 0.04]}>
        <boxGeometry args={[0.42, 0.07, 0.28]} />
        <meshStandardMaterial color="#171717" roughness={0.45} />
      </mesh>
      <mesh position={[-0.2, 0.245, 0.04]}>
        <boxGeometry args={[0.18, 0.015, 0.16]} />
        <meshStandardMaterial color="#3b3b3b" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0.28, 0.22, 0.28]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.1, 20]} />
        <meshStandardMaterial color="#1e5aa8" metalness={0.3} roughness={0.4} />
      </mesh>
      <Led color="#ff3b30" position={[0.5, 0.24, -0.35]} offset={0} />
      <Led color="#ffd60a" position={[0.4, 0.24, -0.35]} offset={1.4} />
      <Led color="#34c759" position={[0.3, 0.24, -0.35]} offset={2.2} />
      <Led color="#ff9f0a" position={[-0.72, 0.24, 0.2]} size={0.028} offset={2.8} />
      <mesh position={[0.52, 0.235, 0.36]}>
        <boxGeometry args={[0.14, 0.04, 0.1]} />
        <meshStandardMaterial color="#d4d4d4" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Esp32Model() {
  return (
    <group scale={0.84} rotation={[0, -0.2, 0]}>
      <RoundedBox args={[1.38, 0.08, 0.8]} radius={0.03} smoothness={3} position={[0, 0.12, 0]}>
        <meshStandardMaterial color="#232a30" metalness={0.35} roughness={0.45} />
      </RoundedBox>
      <RoundedBox args={[0.62, 0.11, 0.44]} radius={0.02} position={[-0.12, 0.19, 0.02]}>
        <meshStandardMaterial color="#c9ced3" metalness={0.95} roughness={0.2} />
      </RoundedBox>
      <mesh position={[0.42, 0.19, 0.1]}>
        <boxGeometry args={[0.16, 0.05, 0.18]} />
        <meshStandardMaterial color="#2b2b2b" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.1, 0.24, -0.28]}>
        <boxGeometry args={[0.42, 0.02, 0.05]} />
        <meshStandardMaterial color="#d8a13a" metalness={0.9} roughness={0.3} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.64, 0.18, 0]}>
            <boxGeometry args={[0.06, 0.1, 0.68]} />
            <meshStandardMaterial color="#0e0e0e" roughness={0.5} />
          </mesh>
          <Pins
            count={12}
            start={[side * 0.64, 0.24, -0.3]}
            step={[0, 0, 0.055]}
          />
        </group>
      ))}
      <mesh position={[-0.12, 0.255, 0.02]}>
        <boxGeometry args={[0.18, 0.012, 0.16]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.7} roughness={0.35} />
      </mesh>
      <Led color="#00e5ff" position={[0.24, 0.255, 0.22]} size={0.028} />
      <Led color="#ff3b30" position={[0.34, 0.255, 0.22]} size={0.024} offset={1.2} />
      <mesh position={[0, 0.05, 0.26]}>
        <boxGeometry args={[0.22, 0.03, 0.1]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.8} roughness={0.25} />
      </mesh>
      <SignalWaves />
    </group>
  );
}

const protocolNodes: [number, number, number][] = [
  [-0.75, 0.45, 0.2],
  [-0.2, 0.85, -0.25],
  [0.45, 0.65, 0.3],
  [0.8, 0.3, -0.25],
  [0.05, 0.25, 0.55],
];

function ProtocolModel() {
  const packets = useRef<THREE.Group>(null);
  const lineMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#FFB900", transparent: true, opacity: 0.55 }),
    [],
  );

  const connections = useMemo(() => {
    const pairs: Array<[THREE.Vector3, THREE.Vector3]> = [];
    const used = new Set<string>();
    protocolNodes.forEach((node, index) => {
      const target = protocolNodes[(index + 2) % protocolNodes.length];
      const key = [index, (index + 2) % protocolNodes.length].sort().join("-");
      if (!used.has(key)) {
        used.add(key);
        pairs.push([
          new THREE.Vector3(...node),
          new THREE.Vector3(...target),
        ]);
      }
    });
    return pairs;
  }, []);

  useFrame(({ clock }) => {
    if (packets.current) {
      packets.current.children.forEach((child, index) => {
        const pair = connections[index];
        if (!pair) return;
        const t = (clock.elapsedTime * 0.35 + index * 0.27) % 1;
        child.position.lerpVectors(pair[0], pair[1], t);
      });
    }
  });

  return (
    <group scale={0.86} position={[0, 0.05, 0]}>
      {[0, 1, 2].map((index) => (
        <group key={index} position={[-0.25 + index * 0.02, 0.12 + index * 0.17, -0.32]}>
          <RoundedBox args={[0.62, 0.17, 0.42]} radius={0.03} smoothness={3}>
            <meshStandardMaterial color="#151515" metalness={0.75} roughness={0.32} />
          </RoundedBox>
          <mesh position={[0.18, 0, 0.215]}>
            <boxGeometry args={[0.26, 0.025, 0.01]} />
            <meshStandardMaterial color="#FFC107" emissive="#FFB900" emissiveIntensity={2} toneMapped={false} />
          </mesh>
          <Led color="#39ff14" position={[-0.2, 0.03, 0.215]} size={0.022} offset={index} />
          <Led color="#00e5ff" position={[-0.12, 0.03, 0.215]} size={0.022} offset={index + 2} />
        </group>
      ))}

      <mesh position={[-0.7, 0.72, 0.05]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.72, 0.48, 0.07]} />
        <meshStandardMaterial color="#171717" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[-0.7, 0.72, 0.09]} rotation={[0, 0.18, 0]}>
        <planeGeometry args={[0.6, 0.36]} />
        <meshStandardMaterial color="#0a1a2b" emissive="#0b2540" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[-0.7, 0.6, 0.12]}>
        <boxGeometry args={[0.1, 0.18, 0.06]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
      </mesh>

      {protocolNodes.map((node, index) => (
        <mesh key={index} position={node}>
          <sphereGeometry args={[index === 0 ? 0.075 : 0.055, 16, 16]} />
          <meshStandardMaterial
            color="#FFC107"
            emissive="#FFB900"
            emissiveIntensity={1.6}
            metalness={0.4}
            roughness={0.25}
          />
        </mesh>
      ))}

      {connections.map((pair, index) => {
        const direction = new THREE.Vector3().subVectors(pair[1], pair[0]);
        const length = direction.length();
        const midpoint = new THREE.Vector3().addVectors(pair[0], pair[1]).multiplyScalar(0.5);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.clone().normalize(),
        );
        return (
          <mesh
            key={index}
            position={midpoint}
            quaternion={quaternion}
            material={lineMaterial}
          >
            <cylinderGeometry args={[0.006, 0.006, length, 6]} />
          </mesh>
        );
      })}

      <group ref={packets}>
        {connections.slice(0, 4).map((_, index) => (
          <mesh key={index} position={[0, 0, 0]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshBasicMaterial color="#FFD54F" toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Resistor({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.3, 14]} />
        <meshStandardMaterial color="#d8b27a" roughness={0.6} />
      </mesh>
      {[-0.08, -0.02, 0.05].map((x, index) => (
        <mesh key={index} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.058, 0.058, 0.03, 14]} />
          <meshStandardMaterial color={index === 1 ? "#111111" : color} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function ElectronicsModel() {
  const holes = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let row = 0; row < 5; row += 1) {
      for (let column = 0; column < 11; column += 1) {
        list.push([-0.56 + column * 0.112, 0.205, -0.23 + row * 0.095]);
      }
    }
    return list;
  }, []);

  return (
    <group scale={0.9} rotation={[0, -0.15, 0]}>
      <RoundedBox args={[1.56, 0.14, 0.94]} radius={0.03} smoothness={3} position={[0, 0.13, 0]}>
        <meshStandardMaterial color="#f4f2ea" roughness={0.6} />
      </RoundedBox>
      <mesh position={[0, 0.145, 0]}>
        <boxGeometry args={[1.18, 0.01, 0.02]} />
        <meshStandardMaterial color="#c9c5b8" />
      </mesh>
      {holes.map((position, index) => (
        <mesh key={index} position={position}>
          <cylinderGeometry args={[0.018, 0.018, 0.006, 6]} />
          <meshStandardMaterial color="#262626" roughness={0.8} />
        </mesh>
      ))}
      <Resistor position={[-0.4, 0.24, -0.15]} color="#c62828" />
      <Resistor position={[0.1, 0.24, -0.15]} color="#f9a825" />
      <mesh position={[0.5, 0.22, -0.12]}>
        <cylinderGeometry args={[0.075, 0.075, 0.18, 18]} />
        <meshStandardMaterial color="#1d4ed8" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0.5, 0.32, -0.12]}>
        <cylinderGeometry args={[0.078, 0.078, 0.015, 18]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
      </mesh>
      <group position={[-0.62, 0.27, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.075, 0.075, 0.06, 18]} />
          <meshStandardMaterial color="#ff3b30" emissive="#ff2d20" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <sphereGeometry args={[0.075, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#ff5b50"
            emissive="#ff3b30"
            emissiveIntensity={2.4}
            transparent
            opacity={0.92}
            toneMapped={false}
          />
        </mesh>
        <pointLight color="#ff4438" intensity={2.2} distance={1.2} />
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.2, 6]} />
          <meshStandardMaterial color="#b8b8b8" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>
      <group position={[0.8, 0.24, 0.22]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
          <meshStandardMaterial color="#ffd60a" emissive="#ffd60a" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.06, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#ffe066"
            emissive="#ffd60a"
            emissiveIntensity={2.2}
            transparent
            opacity={0.92}
            toneMapped={false}
          />
        </mesh>
        <pointLight color="#ffd60a" intensity={1.6} distance={1} />
      </group>
      {[
        { points: [[-0.58, 0.26, 0.08], [-0.1, 0.42, 0.12], [0.35, 0.26, 0.12]], color: "#ff3b30" },
        { points: [[0.38, 0.26, 0.26], [0.1, 0.4, 0.3], [-0.2, 0.26, 0.26]], color: "#1d4ed8" },
      ].map((wire, index) => (
        <mesh key={index}>
          <tubeGeometry
            args={[
              new THREE.CatmullRomCurve3(
                wire.points.map((point) => new THREE.Vector3(...(point as [number, number, number]))),
              ),
              24,
              0.012,
              8,
              false,
            ]}
          />
          <meshStandardMaterial color={wire.color} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Wheel({
  position,
  radius = 0.22,
  width = 0.15,
  spin = 0.6,
}: {
  position: [number, number, number];
  radius?: number;
  width?: number;
  spin?: number;
}) {
  const wheel = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (wheel.current) wheel.current.rotation.y += delta * spin;
  });
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh ref={wheel}>
        <cylinderGeometry args={[radius, radius, width, 20]} />
        <meshStandardMaterial color="#181818" roughness={0.75} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[radius * 0.5, radius * 0.5, width + 0.012, 14]} />
        <meshStandardMaterial color="#FFC107" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[radius * 0.18, radius * 0.18, width + 0.02, 10]} />
        <meshStandardMaterial color="#2b2b2b" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function RoverModel() {
  return (
    <group scale={0.92} rotation={[0, 0.35, 0]}>
      <RoundedBox args={[0.98, 0.22, 0.64]} radius={0.06} smoothness={3} position={[0, 0.42, 0]}>
        <meshStandardMaterial color="#FFC107" metalness={0.4} roughness={0.34} />
      </RoundedBox>
      <mesh position={[0, 0.29, 0]}>
        <boxGeometry args={[0.8, 0.12, 0.5]} />
        <meshStandardMaterial color="#141414" metalness={0.5} roughness={0.5} />
      </mesh>
      <RoundedBox args={[0.5, 0.18, 0.44]} radius={0.05} smoothness={3} position={[-0.04, 0.58, 0]}>
        <meshStandardMaterial color="#1b1b1b" metalness={0.5} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0.42, 0.45, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.5]} />
        <meshStandardMaterial color="#111111" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0.5, 0.4, 0.19]}>
        <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00c8e0" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.5, 0.4, -0.19]}>
        <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00c8e0" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.48, 0.29, 0.26]}>
        <boxGeometry args={[0.04, 0.05, 0.1]} />
        <meshStandardMaterial color="#fff4c2" emissive="#ffe066" emissiveIntensity={2.6} toneMapped={false} />
      </mesh>
      <mesh position={[0.48, 0.29, -0.26]}>
        <boxGeometry args={[0.04, 0.05, 0.1]} />
        <meshStandardMaterial color="#fff4c2" emissive="#ffe066" emissiveIntensity={2.6} toneMapped={false} />
      </mesh>
      {[-0.34, 0.34].map((x) =>
        [-0.37, 0.37].map((z) => (
          <Wheel key={`${x}-${z}`} position={[x, 0.24, z]} radius={0.22} width={0.16} spin={x > 0 ? 1.1 : -1.1} />
        )),
      )}
      <mesh position={[0.3, 0.62, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.36, 6]} />
        <meshStandardMaterial color="#bdbdbd" metalness={0.9} roughness={0.3} />
      </mesh>
      <Led color="#39ff14" position={[0.3, 0.82, 0]} size={0.03} />
      <mesh position={[0.02, 0.7, 0]}>
        <boxGeometry args={[0.18, 0.045, 0.22]} />
        <meshStandardMaterial color="#2e2e2e" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

function VehicleModel() {
  return (
    <group scale={0.94} rotation={[0, 0.4, 0]}>
      <RoundedBox args={[1.28, 0.3, 0.68]} radius={0.07} smoothness={3} position={[0, 0.46, 0]}>
        <meshStandardMaterial color="#f3f2ee" metalness={0.35} roughness={0.36} />
      </RoundedBox>
      <RoundedBox args={[0.72, 0.28, 0.6]} radius={0.06} smoothness={3} position={[-0.05, 0.7, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.35} />
      </RoundedBox>
      <mesh position={[-0.05, 0.71, 0.302]}>
        <planeGeometry args={[0.5, 0.18]} />
        <meshStandardMaterial color="#5b97a8" metalness={0.7} roughness={0.15} />
      </mesh>
      <mesh position={[-0.05, 0.71, -0.302]}>
        <planeGeometry args={[0.5, 0.18]} />
        <meshStandardMaterial color="#5b97a8" metalness={0.7} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.33, 0.345]}>
        <boxGeometry args={[1.1, 0.05, 0.01]} />
        <meshStandardMaterial color="#FFC107" emissive="#FFB900" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.63, 0.4, 0.23]}>
        <boxGeometry args={[0.03, 0.08, 0.1]} />
        <meshStandardMaterial color="#fff8dc" emissive="#ffe066" emissiveIntensity={2.8} toneMapped={false} />
      </mesh>
      <mesh position={[0.63, 0.4, -0.23]}>
        <boxGeometry args={[0.03, 0.08, 0.1]} />
        <meshStandardMaterial color="#fff8dc" emissive="#ffe066" emissiveIntensity={2.8} toneMapped={false} />
      </mesh>
      <mesh position={[-0.2, 0.89, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.44]} />
        <meshStandardMaterial color="#2b2b2b" metalness={0.6} roughness={0.35} />
      </mesh>
      {[-0.4, 0, 0.4].map((x) =>
        [-0.4, 0.4].map((z) => (
          <Wheel key={`${x}-${z}`} position={[x, 0.26, z]} radius={0.2} width={0.14} spin={0.4} />
        )),
      )}
      <mesh position={[-0.2, 0.95, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 18]} />
        <meshStandardMaterial color="#FFC107" metalness={0.4} roughness={0.45} />
      </mesh>
      <Led color="#FFD54F" position={[0.45, 0.88, 0]} size={0.025} />
    </group>
  );
}

function RoboticsModel() {
  const cone = useRef<THREE.Mesh>(null);
  const camera = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (cone.current) {
      cone.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.7;
      const material = cone.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(clock.elapsedTime * 1.5) * 0.04;
    }
    if (camera.current) {
      camera.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.35;
    }
  });

  return (
    <group scale={0.92} rotation={[0, -0.25, 0]}>
      <RoundedBox args={[1.42, 0.08, 0.9]} radius={0.03} smoothness={3} position={[0, 0.13, 0]}>
        <meshStandardMaterial color="#1f7a3f" metalness={0.35} roughness={0.45} />
      </RoundedBox>
      <mesh position={[-0.25, 0.185, 0.02]}>
        <boxGeometry args={[0.18, 0.05, 0.18]} />
        <meshStandardMaterial color="#b9bec4" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[0.52, 0.19, 0]}>
        <boxGeometry args={[0.28, 0.06, 0.2]} />
        <meshStandardMaterial color="#c6cbd0" metalness={0.95} roughness={0.22} />
      </mesh>
      <mesh position={[0.15, 0.19, 0.36]}>
        <boxGeometry args={[0.6, 0.05, 0.06]} />
        <meshStandardMaterial color="#111111" roughness={0.55} />
      </mesh>
      <Pins count={16} start={[-0.24, 0.225, 0.36]} step={[0.055, 0, 0]} />
      <Led color="#39ff14" position={[0.55, 0.22, -0.3]} size={0.03} />
      <Led color="#ff3b30" position={[0.45, 0.22, -0.3]} size={0.025} offset={1.1} />
      <mesh position={[-0.55, 0.21, -0.3]}>
        <cylinderGeometry args={[0.06, 0.06, 0.18, 16]} />
        <meshStandardMaterial color="#1b1b1b" metalness={0.6} roughness={0.35} />
      </mesh>

      <group ref={camera} position={[0.2, 0.62, 0.18]}>
        <mesh position={[0, -0.2, -0.08]}>
          <cylinderGeometry args={[0.025, 0.025, 0.32, 8]} />
          <meshStandardMaterial color="#2b2b2b" metalness={0.7} roughness={0.3} />
        </mesh>
        <RoundedBox args={[0.34, 0.22, 0.2]} radius={0.03} smoothness={3}>
          <meshStandardMaterial color="#121212" metalness={0.5} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.075, 0.08, 18]} />
          <meshStandardMaterial color="#0b0b0b" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0.225, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.02, 18]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00c8e0" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <pointLight color="#00e5ff" intensity={1.4} distance={1.2} />
      </group>

      <mesh ref={cone} position={[0.55, 0.62, 0.18]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.55, 1.15, 24, 1, true]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0.45, 0.13, 0.5]}>
        <boxGeometry args={[0.3, 0.06, 0.1]} />
        <meshStandardMaterial color="#141414" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.36, 0.13, 0.56]}>
        <cylinderGeometry args={[0.032, 0.032, 0.03, 12]} />
        <meshStandardMaterial color="#e5e5e5" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0.54, 0.13, 0.56]}>
        <cylinderGeometry args={[0.032, 0.032, 0.03, 12]} />
        <meshStandardMaterial color="#e5e5e5" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );
}

export function LabModel({ id }: { id: string }) {
  switch (id) {
    case "arduino-lab":
      return <ArduinoModel />;
    case "esp32-lab":
      return <Esp32Model />;
    case "protocol-explorer":
      return <ProtocolModel />;
    case "electronics-101":
      return <ElectronicsModel />;
    case "roverkit-lab":
      return <RoverModel />;
    case "vehicle-explorer":
      return <VehicleModel />;
    case "robotics-lab":
      return <RoboticsModel />;
    default:
      return <ArduinoModel />;
  }
}
