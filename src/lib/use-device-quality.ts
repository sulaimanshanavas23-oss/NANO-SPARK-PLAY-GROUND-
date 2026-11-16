"use client";

import { useEffect, useState, type RefObject } from "react";

export type SceneQuality = "low" | "medium" | "high" | "ultra";

function detectQuality(width: number): SceneQuality {
  if (typeof navigator === "undefined") return "high";
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const saveData = Boolean(nav.connection?.saveData);
  const slowNetwork =
    nav.connection?.effectiveType === "2g" ||
    nav.connection?.effectiveType === "slow-2g";
  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;

  if (saveData || slowNetwork || cores <= 2 || memory <= 2) return "low";
  if (width < 640 || (coarse && width < 900)) return "low";
  if (width < 1024) return "medium";
  if (width >= 1920 && cores >= 8 && memory >= 8) return "ultra";
  return "high";
}

function stepDown(quality: SceneQuality): SceneQuality {
  if (quality === "ultra") return "high";
  if (quality === "high") return "medium";
  if (quality === "medium") return "low";
  return "low";
}

export function useDeviceQuality(): SceneQuality {
  const [quality, setQuality] = useState<SceneQuality>("high");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() =>
        setQuality(detectQuality(window.innerWidth)),
      );
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let start = 0;
    let frames = 0;

    const sample = (now: number) => {
      if (!start) start = now;
      frames += 1;
      const elapsed = now - start;
      if (elapsed >= 1500) {
        const fps = (frames * 1000) / elapsed;
        if (fps < 42) setQuality((current) => stepDown(current));
        return;
      }
      frame = window.requestAnimationFrame(sample);
    };

    const timer = window.setTimeout(() => {
      frame = window.requestAnimationFrame(sample);
    }, 900);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return quality;
}

export function useSceneActivity(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: "240px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    const onVisibility = () =>
      setVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return inView && visible;
}

export const QUALITY_SETTINGS: Record<
  SceneQuality,
  {
    dpr: [number, number];
    shadows: boolean;
    shadowMap: number;
    sparkles: number;
    detail: number;
  }
> = {
  low: { dpr: [1, 1.15], shadows: false, shadowMap: 512, sparkles: 18, detail: 24 },
  medium: { dpr: [1, 1.4], shadows: true, shadowMap: 1024, sparkles: 36, detail: 36 },
  high: { dpr: [1, 1.75], shadows: true, shadowMap: 2048, sparkles: 64, detail: 48 },
  ultra: { dpr: [1, 2], shadows: true, shadowMap: 2048, sparkles: 88, detail: 56 },
};
