"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type PointerPosition = RefObject<{ x: number; y: number }>;

export function ModelHoverController({
  hovered,
  pointer,
  baseRotation = [0, 0, 0],
  idleRotation = 0.14,
  hoverRotation = 0.5,
  hoverScale = 1.25,
  reducedMotion = false,
  children,
}: {
  hovered: boolean;
  pointer: PointerPosition;
  baseRotation?: [number, number, number];
  idleRotation?: number;
  hoverRotation?: number;
  hoverScale?: number;
  reducedMotion?: boolean;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const hoverAmount = useRef(0);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;

    const lerp = 1 - Math.exp(-delta * 7);
    const damp = 1 - Math.exp(-delta * 6);

    hoverAmount.current = THREE.MathUtils.lerp(
      hoverAmount.current,
      hovered ? 1 : 0,
      lerp,
    );
    const hover = hoverAmount.current;

    const spinSpeed = idleRotation + hoverRotation * hover;
    spin.current += delta * spinSpeed;

    const float = reducedMotion
      ? 0
      : Math.sin(state.clock.elapsedTime * 1.1) * 0.018;

    node.position.y = THREE.MathUtils.lerp(
      node.position.y,
      hover * 0.2 + float,
      lerp,
    );
    node.scale.setScalar(
      THREE.MathUtils.lerp(
        node.scale.x,
        1 + (hoverScale - 1) * hover,
        lerp,
      ),
    );

    const px = reducedMotion ? 0 : pointer.current.x;
    const py = reducedMotion ? 0 : pointer.current.y;

    const targetX = baseRotation[0] + py * 0.32 * hover;
    const targetY = baseRotation[1] + spin.current + px * 0.28 * hover;
    const targetZ = baseRotation[2] - px * 0.36 * hover;

    node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, targetX, damp);
    node.rotation.y = THREE.MathUtils.lerp(node.rotation.y, targetY, damp);
    node.rotation.z = THREE.MathUtils.lerp(node.rotation.z, targetZ, damp);
  });

  return (
    <group ref={group} rotation={baseRotation}>
      {children}
    </group>
  );
}
