"use client";

import { Billboard, Text } from "@react-three/drei";

export function StationLabel({
  position,
  meta,
  title,
  subtitle,
  footer,
  active = false,
}: {
  position: [number, number, number];
  meta: string;
  title: string;
  subtitle: string;
  footer: string;
  active?: boolean;
}) {
  const width = 1.7;
  const height = 0.58;

  return (
    <Billboard position={position} follow>
      <mesh position={[0, 0, -0.004]}>
        <planeGeometry args={[width + 0.045, height + 0.045]} />
        <meshBasicMaterial
          color={active ? "#FFC107" : "#2b2b2b"}
          transparent
          opacity={active ? 0.9 : 0.7}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color="#111111"
          transparent
          opacity={0.96}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, height / 2 - 0.012, 0.002]}>
        <planeGeometry args={[width, 0.014]} />
        <meshBasicMaterial color="#FFC107" toneMapped={false} depthWrite={false} />
      </mesh>
      <Text
        position={[-width / 2 + 0.11, 0.19, 0.006]}
        fontSize={0.06}
        color="#FFD54F"
        anchorX="left"
        anchorY="middle"
        maxWidth={0.95}
        textAlign="left"
      >
        {meta}
      </Text>
      <mesh position={[width / 2 - 0.12, 0.19, 0.006]}>
        <circleGeometry args={[0.021, 16]} />
        <meshBasicMaterial color="#FFC107" toneMapped={false} depthWrite={false} />
      </mesh>
      <Text
        position={[0, 0.06, 0.006]}
        fontSize={0.098}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={width - 0.2}
        textAlign="center"
      >
        {title}
      </Text>
      <Text
        position={[0, -0.065, 0.006]}
        fontSize={0.055}
        color="#a3a3a3"
        anchorX="center"
        anchorY="middle"
        maxWidth={width - 0.18}
        textAlign="center"
      >
        {subtitle}
      </Text>
      <Text
        position={[0, -0.19, 0.006]}
        fontSize={0.043}
        color={active ? "#FFD54F" : "#7c7c7c"}
        anchorX="center"
        anchorY="middle"
        maxWidth={width - 0.18}
        textAlign="center"
      >
        {footer}
      </Text>
    </Billboard>
  );
}
