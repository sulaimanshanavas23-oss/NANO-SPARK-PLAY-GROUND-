"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { CircuitBoard, Cpu, Loader2 } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/src/lib/utils";

const ModelViewer = dynamic(
  () =>
    import("@/components/showcase/model-viewer").then(
      (mod) => mod.ModelViewer,
    ),
  {
    ssr: false,
    loading: () => <ModelCardSkeleton />,
  },
);

const hardwareModels = [
  {
    title: "Arduino UNO",
    description:
      "The classic 8-bit microcontroller board for first circuits, sensors and robotics builds.",
    modelUrl: "/models/arduino-uno.stl",
    accent: "#2f8f5b",
  },
  {
    title: "ESP32 DevKit V1",
    description:
      "A Wi-Fi + Bluetooth development board for connected IoT projects and wireless experiments.",
    modelUrl: null,
  },
] as const;

const cardClass =
  "flex h-full flex-col overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-[0_1px_0_rgba(17,17,17,0.03)]";

function ModelCardSkeleton() {
  return (
    <article className={cardClass} aria-hidden="true">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-[#fcfaf4] via-[#f7f2e4] to-[#f0e2b4]">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
        <div className="flex flex-col items-center gap-2 text-ink-muted">
          <Loader2 className="h-5 w-5 animate-spin text-spark-dark" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
            Preparing 3D viewer…
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="h-5 w-36 rounded bg-ink/[0.06]" />
        <div className="mt-3 h-3 w-full rounded bg-ink/[0.04]" />
        <div className="mt-2 h-3 w-3/4 rounded bg-ink/[0.04]" />
      </div>
    </article>
  );
}

function Esp32Placeholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className={cn(cardClass, "h-full")}>
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#fcfaf4] via-[#f7f2e4] to-[#f0e2b4]">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-28 w-[72%] -translate-x-1/2 translate-y-1/3 rounded-[50%] bg-spark-yellow/35 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full bg-white/70 blur-2xl" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-spark-yellow shadow-card">
            <Cpu className="h-7 w-7" />
          </span>
          <p className="mt-4 font-display text-lg font-semibold text-ink">
            3D model coming soon
          </p>
          <p className="mt-1 max-w-xs text-[11.5px] leading-relaxed text-ink-muted">
            The ESP32 source is ready. A browser-ready mesh export is pending.
          </p>
        </div>

        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] text-white shadow-sm">
          <CircuitBoard className="h-3 w-3 text-spark-yellow" /> Mesh export
          pending
        </span>
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

export function HardwareShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hardware-models"
      className="section-pad bg-white"
    >
      <div className="container-wide">
        <SectionHeading
          eyebrow="3D showcase"
          title={
            <>
              Hardware Models{" "}
              <span className="text-spark-dark">Up Close</span>
            </>
          }
          description="Drag, rotate and zoom the same development boards students use in the labs — rendered live in the browser with Three.js."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Reveal delay={0.05} className="h-full">
            {inView ? (
              <ModelViewer
                modelUrl={hardwareModels[0].modelUrl}
                title={hardwareModels[0].title}
                description={hardwareModels[0].description}
                accent={hardwareModels[0].accent}
              />
            ) : (
              <ModelCardSkeleton />
            )}
          </Reveal>

          <Reveal delay={0.12} className="h-full">
            <Esp32Placeholder
              title={hardwareModels[1].title}
              description={hardwareModels[1].description}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
