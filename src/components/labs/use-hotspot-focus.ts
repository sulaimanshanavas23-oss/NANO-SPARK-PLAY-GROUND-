"use client";

import { useCallback, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

type FocusAnimation = {
  fromPosition: THREE.Vector3;
  toPosition: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  elapsed: number;
  duration: number;
};

export function useHotspotFocus(
  controls: React.RefObject<OrbitControlsImpl | null>,
  reducedMotion: boolean,
) {
  const { camera } = useThree();
  const animation = useRef<FocusAnimation | null>(null);

  useFrame((_, delta) => {
    const current = animation.current;
    if (!current) return;

    current.elapsed += delta * 1000;
    const progress = Math.min(current.elapsed / current.duration, 1);
    const eased =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    camera.position.lerpVectors(
      current.fromPosition,
      current.toPosition,
      eased,
    );

    const target = controls.current?.target;
    if (target) {
      target.lerpVectors(current.fromTarget, current.toTarget, eased);
    }
    controls.current?.update();

    if (progress >= 1) animation.current = null;
  });

  const focus = useCallback(
    (target: [number, number, number], duration = 700) => {
      const control = controls.current;
      const toTarget = new THREE.Vector3(...target);
      const fromTarget = control?.target.clone() ?? new THREE.Vector3();
      const direction = camera.position.clone().sub(fromTarget);
      const distance = Math.max(direction.length(), 2.8);
      direction.normalize();

      const toPosition = toTarget
        .clone()
        .add(direction.multiplyScalar(Math.min(distance, 4.2)));

      if (reducedMotion) {
        camera.position.copy(toPosition);
        control?.target.copy(toTarget);
        control?.update();
        animation.current = null;
        return;
      }

      animation.current = {
        fromPosition: camera.position.clone(),
        toPosition,
        fromTarget,
        toTarget,
        elapsed: 0,
        duration,
      };
    },
    [camera, controls, reducedMotion],
  );

  const cancel = useCallback(() => {
    animation.current = null;
  }, []);

  return { focus, cancel };
}
