"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Pause,
  Play,
  Radio,
  RotateCcw,
  SkipForward,
} from "lucide-react";
import {
  protocolComparison,
  protocols,
  type ProtocolConfig,
} from "@/src/data/protocols";
import { cn } from "@/src/lib/utils";

function ProtocolDiagram({
  protocol,
  playing,
  step,
  reducedMotion,
}: {
  protocol: ProtocolConfig;
  playing: boolean;
  step: number;
  reducedMotion: boolean;
}) {
  const stepPercent = Math.round(
    ((step + 1) / Math.max(protocol.steps.length, 1)) * 100,
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
          <Radio className="h-3 w-3 text-spark-yellow" /> Live diagram
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-spark-yellow/80">
          {protocol.name}
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {protocol.lines.map((line, index) => (
          <div key={line} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-right text-[9px] font-semibold uppercase tracking-[0.08em] text-white/45">
              {line}
            </span>
            <div className="relative h-5 flex-1 overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
              <span className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,transparent,rgba(255,193,7,0.08),transparent)]" />
              <motion.span
                className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full shadow-[0_0_12px_rgba(255,193,7,0.8)]"
                style={{ backgroundColor: protocol.color }}
                animate={{
                  left: playing
                    ? ["2%", "96%"]
                    : `${Math.min(96, Math.max(2, stepPercent))}%`,
                }}
                transition={
                  playing && !reducedMotion
                    ? {
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear",
                        delay: index * 0.14,
                      }
                    : { duration: 0.25 }
                }
              />
            </div>
          </div>
        ))}
      </div>

      <svg
        viewBox="0 0 220 34"
        className="mt-3 h-8 w-full"
        aria-hidden="true"
      >
        <path
          d="M0 24 H22 V8 H44 V24 H66 V8 H88 V24 H110 V8 H132 V24 H154 V8 H176 V24 H198 V8 H220"
          fill="none"
          stroke={protocol.color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.55"
        />
      </svg>

      <div className="mt-2 flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.1em]">
        <span className="text-white/35">Bytes on the wire</span>
        <span className="text-spark-yellow" aria-live="polite">
          {protocol.bytes}
        </span>
      </div>
    </div>
  );
}

export function ProtocolExplorerPanel() {
  const reducedMotion = useReducedMotion() ?? false;
  const [selectedId, setSelectedId] = useState(protocols[0].id);
  const [playing, setPlaying] = useState(!reducedMotion);
  const [step, setStep] = useState(0);
  const [bytes, setBytes] = useState(0);

  const protocol = useMemo(
    () => protocols.find((item) => item.id === selectedId) ?? protocols[0],
    [selectedId],
  );

  useEffect(() => {
    setStep(0);
    setBytes(0);
  }, [selectedId]);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % protocol.steps.length);
      setBytes((current) => current + 1);
    }, 1100);
    return () => window.clearInterval(timer);
  }, [playing, protocol.steps.length, reducedMotion]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-spark-yellow">
          Protocol explorer
        </p>
        <div className="mt-1 flex items-end justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-white">
            {protocol.fullName}
          </h3>
          <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-white/35">
            {protocols.length} protocols
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex gap-1.5 overflow-x-auto border-b border-white/10 px-3 py-2.5">
          {protocols.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.06em] transition-colors",
                item.id === selectedId
                  ? "border-spark-yellow/50 bg-spark-yellow/15 text-spark-yellow"
                  : "border-white/10 text-white/45 hover:border-white/20 hover:text-white/70",
              )}
              aria-pressed={item.id === selectedId}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="space-y-3 p-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
              <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/30">
                Speed
              </p>
              <p className="mt-1 text-[10px] leading-snug text-white/65">
                {protocol.speed}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
              <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/30">
                Wires
              </p>
              <p className="mt-1 text-[10px] leading-snug text-white/65">
                {protocol.lines.join(" + ")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/30">
              Typical devices
            </p>
            <p className="mt-1 text-[10px] leading-snug text-white/65">
              {protocol.devices}
            </p>
          </div>

          <div className="rounded-xl border border-spark-yellow/20 bg-spark-yellow/[0.06] p-2.5">
            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-spark-yellow/70">
              When to use it
            </p>
            <p className="mt-1 text-[10px] leading-snug text-white/65">
              {protocol.when}
            </p>
          </div>

          <ProtocolDiagram
            protocol={protocol}
            playing={playing && !reducedMotion}
            step={step}
            reducedMotion={reducedMotion}
          />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full border border-spark-yellow/40 bg-spark-yellow/10 text-[9px] font-semibold uppercase tracking-[0.08em] text-spark-yellow transition-colors hover:bg-spark-yellow/20"
              aria-label={playing ? "Pause protocol animation" : "Play protocol animation"}
            >
              {playing ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setStep((current) => (current + 1) % protocol.steps.length);
                setBytes((current) => current + 1);
              }}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-white/10 px-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/55 transition-colors hover:bg-white/10 hover:text-white"
            >
              <SkipForward className="h-3 w-3" /> Step
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(0);
                setBytes(0);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/45 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Reset protocol animation"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/30">
                Current step
              </p>
              <span className="text-[9px] font-semibold text-spark-yellow">
                {step + 1}/{protocol.steps.length}
              </span>
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-medium text-white/70">
              <ArrowRight className="h-3 w-3 shrink-0 text-spark-yellow" />
              {protocol.steps[step]}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-spark-yellow transition-all duration-300"
                style={{
                  width: `${((step + 1) / protocol.steps.length) * 100}%`,
                }}
              />
            </div>
            <p className="mt-2 text-[9px] text-white/30">
              {bytes} packets visualised
            </p>
          </div>

          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/30">
              Quick comparison
            </p>
            <div className="mt-1.5 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-[9px]">
                <thead className="bg-white/[0.04] text-white/35">
                  <tr>
                    <th className="px-2 py-1.5 font-semibold">Bus</th>
                    <th className="px-2 py-1.5 font-semibold">Wires</th>
                    <th className="px-2 py-1.5 font-semibold">Best for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-white/55">
                  {protocolComparison.map((row) => (
                    <tr key={row.name}>
                      <td className="px-2 py-1.5 font-semibold text-spark-yellow/80">
                        {row.name}
                      </td>
                      <td className="px-2 py-1.5">{row.wires}</td>
                      <td className="px-2 py-1.5">{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
