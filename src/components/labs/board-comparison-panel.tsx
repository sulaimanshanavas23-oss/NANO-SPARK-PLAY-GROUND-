"use client";

import { Cpu } from "lucide-react";
import { boardComparison } from "@/src/data/boards";

export function BoardComparisonPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-spark-yellow">
            Board comparison
          </p>
          <p className="mt-0.5 text-[11px] text-white/45">
            Pick the right brain for the job
          </p>
        </div>
        <Cpu className="h-4 w-4 text-spark-yellow/80" />
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2.5">
        {boardComparison.map((board) => (
          <article
            key={board.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-[12px] font-semibold text-white">
                {board.name}
              </h3>
              <span className="shrink-0 rounded-full border border-spark-yellow/25 bg-spark-yellow/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.06em] text-spark-yellow/80">
                {board.logic}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] leading-snug">
              <p className="text-white/30">CPU</p>
              <p className="text-white/65">{board.cpu}</p>
              <p className="text-white/30">Clock</p>
              <p className="text-white/65">{board.clock}</p>
              <p className="text-white/30">Memory</p>
              <p className="text-white/65">{board.memory}</p>
              <p className="text-white/30">Radio</p>
              <p className="text-white/65">{board.connectivity}</p>
              <p className="text-white/30">Software</p>
              <p className="text-white/65">{board.os}</p>
            </div>
            <p className="mt-2 text-[9.5px] leading-snug text-white/55">
              <span className="font-semibold text-spark-yellow/80">Best for: </span>
              {board.bestFor}
            </p>
            <p className="mt-1 text-[9px] leading-snug text-white/35">
              {board.pickWhen}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
