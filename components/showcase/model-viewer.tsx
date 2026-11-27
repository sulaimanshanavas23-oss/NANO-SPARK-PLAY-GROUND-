"use client";

import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementRef,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  Box,
  Loader2,
  Move3D,
  ZoomIn,
} from "lucide-react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useWebGLAvailable } from "@/components/shared/webgl";
import { cn } from "@/src/lib/utils";

class ViewerErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function ViewerError({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#f7f2e4]/90 px-6 text-center backdrop-blur-sm">
      <AlertTriangle className="h-5 w-5 text-spark-dark" />
      <p className="text-[12px] font-semibold text-ink">3D model unavailable</p>
      <p className="max-w-xs text-[11px] leading-relaxed text-ink-muted">
        {message}
      </p>
    </div>
  );
}

function normalizeModel(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox ?? new THREE.Box3();
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z) || 1;
  const scale = 3.4 / maxDimension;

  geometry.center();
  geometry.scale(scale, scale, scale);
  geometry.computeVertexNormals();
}

export function ModelViewer({
  modelUrl,
  title,
  description,
  accent = "#2f8f5b",
  className,
}: {
  modelUrl: string;
  title: string;
  description: string;
  accent?: string;
  className?: string;
}) {
  const webgl = useWebGLAvailable();
  const reduceMotion = useReducedMotion();
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accent,
        roughness: 0.42,
        metalness: 0.18,
        emissive: new THREE.Color(accent).multiplyScalar(0.08),
        emissiveIntensity: 0.35,
      }),
    [accent],
  );

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  useEffect(() => {
    if (webgl === false) {
      setLoading(false);
      setError("This browser does not support the WebGL preview.");
      return;
    }
    if (webgl !== true) return;

    let cancelled = false;
    setGeometry(null);
    setLoading(true);
    setError(null);

    const loader = new STLLoader();
    loader.load(
      modelUrl,
      (loaded) => {
        if (cancelled) {
          loaded.dispose();
          return;
        }
        normalizeModel(loaded);
        setGeometry(loaded);
        setLoading(false);
      },
      undefined,
      () => {
        if (cancelled) return;
        setLoading(false);
        setError("We could not load this model. Please refresh and try again.");
      },
    );

    return () => {
      cancelled = true;
    };
  }, [modelUrl, webgl]);

  useEffect(() => {
    return () => geometry?.dispose();
  }, [geometry]);

  useEffect(() => {
    return () => {
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    const domElement = controlsRef.current?.domElement;
    if (domElement) domElement.style.touchAction = "pan-y";
  }, [geometry]);

  const showViewer = webgl === true && geometry !== null && !error;

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-[0_1px_0_rgba(17,17,17,0.03)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#fcfaf4] via-[#f7f2e4] to-[#f0e2b4]">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-28 w-[72%] -translate-x-1/2 translate-y-1/3 rounded-[50%] bg-spark-yellow/35 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full bg-white/70 blur-2xl" />

        {showViewer && geometry ? (
          <ViewerErrorBoundary
            fallback={<ViewerError message="The 3D viewer could not start." />}
          >
            <Canvas
              shadows
              dpr={[1, 1.6]}
              camera={{ position: [0, 3.2, 4.8], fov: 36 }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
              }}
              style={{ touchAction: "pan-y" }}
              className="!absolute inset-0"
              resize={{ debounce: 150 }}
              onCreated={({ gl }) => {
                rendererRef.current = gl;
              }}
              aria-label={`${title} interactive 3D model. Drag to rotate, scroll to zoom.`}
            >
              <ambientLight intensity={0.7} />
              <hemisphereLight args={["#fffaf0", "#e8e1cf", 1.15]} />
              <directionalLight
                position={[4, 6, 5]}
                intensity={2.2}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
              <directionalLight
                position={[-4, 3, -4]}
                intensity={0.9}
                color="#FFD54F"
              />
              <pointLight
                position={[0, 2.4, 3]}
                intensity={14}
                distance={10}
                decay={2}
                color="#FFD54F"
              />

              <mesh
                geometry={geometry}
                material={material}
                castShadow
                receiveShadow
              />

              <ContactShadows
                position={[0, -0.34, 0]}
                opacity={0.34}
                scale={5.5}
                blur={2.4}
                far={1.6}
                color="#17140c"
              />

              <OrbitControls
                ref={controlsRef}
                makeDefault
                enableDamping
                dampingFactor={0.08}
                enablePan={false}
                enableZoom
                autoRotate={!reduceMotion}
                autoRotateSpeed={0.8}
                minDistance={2.8}
                maxDistance={8}
                minPolarAngle={0.35}
                maxPolarAngle={1.45}
                touches={{
                  ONE: THREE.TOUCH.ROTATE,
                  TWO: THREE.TOUCH.DOLLY_ROTATE,
                }}
              />
            </Canvas>
          </ViewerErrorBoundary>
        ) : null}

        {loading && !error ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-ink-muted">
            <Loader2 className="h-5 w-5 animate-spin text-spark-dark" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
              Loading 3D model…
            </span>
          </div>
        ) : null}

        {error ? <ViewerError message={error} /> : null}

        {showViewer ? (
          <>
            <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] text-white shadow-sm">
              <Box className="h-3 w-3 text-spark-yellow" /> Live 3D
            </span>
            <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center whitespace-nowrap rounded-full border border-white/60 bg-white/85 px-3 py-1.5 text-[9px] font-semibold text-ink-muted shadow-sm backdrop-blur">
              <Move3D className="mr-1 h-3 w-3" /> Drag to rotate
              <span className="mx-1.5 text-ink/25">•</span>
              <ZoomIn className="mr-1 h-3 w-3" /> Scroll to zoom
            </span>
          </>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
          {description}
        </p>
      </div>
    </article>
  );
}
