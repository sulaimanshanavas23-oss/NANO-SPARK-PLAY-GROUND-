"use client";

import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  Bot,
  BrainCircuit,
  CircuitBoard,
  CodeXml,
  Component,
  Cpu,
  Gauge,
  Microchip,
  Radio,
  Terminal,
  Wifi,
} from "lucide-react";
import { AboutSectionHeading } from "@/components/about/section-heading";
import { WordReveal } from "@/components/shared/reveal";

type Stack = { label: string; icon: LucideIcon };

const stacks: Stack[] = [
  { label: "Arduino", icon: Cpu },
  { label: "ESP32", icon: Wifi },
  { label: "Raspberry Pi", icon: Microchip },
  { label: "Python", icon: Terminal },
  { label: "C / C++", icon: CodeXml },
  { label: "Robotics", icon: Bot },
  { label: "Embedded Systems", icon: CircuitBoard },
  { label: "IoT", icon: Radio },
  { label: "Sensors", icon: Gauge },
  { label: "Scratch & Block Coding", icon: Blocks },
  { label: "AI & Machine Learning", icon: BrainCircuit },
  { label: "PCB & Electronics", icon: Component },
];

function StackChip({ stack }: { stack: Stack }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-ink/10 bg-white px-5 py-2.5 shadow-soft transition-transform duration-300 hover:-translate-y-1">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-spark-yellow text-ink">
        <stack.icon className="h-4 w-4" />
      </span>
      <span className="whitespace-nowrap font-display text-sm font-extrabold text-ink">
        {stack.label}
      </span>
    </div>
  );
}

function ChipGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 gap-3 pr-3" aria-hidden={hidden || undefined}>
      {stacks.map((stack) => (
        <StackChip key={`${stack.label}-${hidden ? "b" : "a"}`} stack={stack} />
      ))}
    </div>
  );
}

export function TechStackMarquee() {
  return (
    <section className="bg-warm py-16">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <AboutSectionHeading
          eyebrow="TECHNOLOGY STACKS"
          title={
            <WordReveal
              text="The tech we work with"
              highlightWords={["work", "with"]}
            />
          }
          description="Every stack Nano Spark uses to build kits, labs and student projects — floating through like the feedback wall."
        />
      </div>

      <div className="relative mt-10 overflow-hidden">
        <div className="ns-marquee flex w-max">
          <div className="flex w-max">
            <div className="ns-marquee-track flex w-max">
              <ChipGroup />
              <ChipGroup hidden />
            </div>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-warm to-transparent sm:w-24"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-warm to-transparent sm:w-24"
        />
      </div>
    </section>
  );
}
