"use client";

import { useMemo, useState } from "react";
import { Calculator, Zap } from "lucide-react";

const inputClass =
  "h-8 w-full rounded-lg border border-white/10 bg-black/25 px-2 text-[11px] text-white outline-none transition-colors placeholder:text-white/25 focus:border-spark-yellow/50";

export function ElectronicsToolsPanel() {
  const [voltage, setVoltage] = useState("5");
  const [current, setCurrent] = useState("0.02");
  const [resistance, setResistance] = useState("");

  const [vin, setVin] = useState("9");
  const [r1, setR1] = useState("10000");
  const [r2, setR2] = useState("10000");

  const ohmResult = useMemo(() => {
    const v = Number.parseFloat(voltage);
    const i = Number.parseFloat(current);
    const r = Number.parseFloat(resistance);
    const valid = [v, i, r].filter((value) => Number.isFinite(value) && value > 0);

    if (valid.length < 2) {
      return "Enter any two values";
    }
    if (Number.isFinite(v) && Number.isFinite(i) && !Number.isFinite(r)) {
      return `R = ${(v / i).toFixed(1)} ohms`;
    }
    if (Number.isFinite(v) && Number.isFinite(r) && !Number.isFinite(i)) {
      return `I = ${(v / r).toFixed(4)} A`;
    }
    if (Number.isFinite(i) && Number.isFinite(r) && !Number.isFinite(v)) {
      return `V = ${(i * r).toFixed(2)} V`;
    }
    return "Clear one field to solve";
  }, [current, resistance, voltage]);

  const dividerResult = useMemo(() => {
    const source = Number.parseFloat(vin);
    const top = Number.parseFloat(r1);
    const bottom = Number.parseFloat(r2);
    if (![source, top, bottom].every((value) => Number.isFinite(value)) || top + bottom <= 0) {
      return "Enter Vin, R1 and R2";
    }
    return `Vout = ${((source * bottom) / (top + bottom)).toFixed(2)} V`;
  }, [r1, r2, vin]);

  return (
    <div className="border-t border-white/10">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <Calculator className="h-3.5 w-3.5 text-spark-yellow" />
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Bench calculators
        </p>
      </div>

      <div className="space-y-3 px-3 pb-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-spark-yellow/80">
              Ohm&apos;s law
            </p>
            <span className="text-[8px] uppercase tracking-[0.1em] text-white/25">
              V = I x R
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <label className="block">
              <span className="mb-1 block text-[8px] uppercase tracking-[0.1em] text-white/30">
                Volts
              </span>
              <input
                value={voltage}
                onChange={(event) => setVoltage(event.target.value)}
                inputMode="decimal"
                className={inputClass}
                placeholder="V"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[8px] uppercase tracking-[0.1em] text-white/30">
                Amps
              </span>
              <input
                value={current}
                onChange={(event) => setCurrent(event.target.value)}
                inputMode="decimal"
                className={inputClass}
                placeholder="I"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[8px] uppercase tracking-[0.1em] text-white/30">
                Ohms
              </span>
              <input
                value={resistance}
                onChange={(event) => setResistance(event.target.value)}
                inputMode="decimal"
                className={inputClass}
                placeholder="R"
              />
            </label>
          </div>
          <p className="mt-2 rounded-lg bg-black/25 px-2 py-1.5 text-[10px] font-medium text-spark-yellow/90">
            {ohmResult}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-spark-yellow/80">
              Voltage divider
            </p>
            <Zap className="h-3 w-3 text-spark-yellow/70" />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <label className="block">
              <span className="mb-1 block text-[8px] uppercase tracking-[0.1em] text-white/30">
                Vin
              </span>
              <input
                value={vin}
                onChange={(event) => setVin(event.target.value)}
                inputMode="decimal"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[8px] uppercase tracking-[0.1em] text-white/30">
                R1
              </span>
              <input
                value={r1}
                onChange={(event) => setR1(event.target.value)}
                inputMode="decimal"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[8px] uppercase tracking-[0.1em] text-white/30">
                R2
              </span>
              <input
                value={r2}
                onChange={(event) => setR2(event.target.value)}
                inputMode="decimal"
                className={inputClass}
              />
            </label>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-spark-yellow transition-all duration-300"
                style={{
                  width: `${
                    Math.min(
                      100,
                      Math.max(
                        0,
                        (Number.parseFloat(r2) /
                          (Number.parseFloat(r1) + Number.parseFloat(r2))) *
                          100 || 0,
                      ),
                    ) || 50
                  }%`,
                }}
              />
            </div>
            <span className="text-[9px] font-medium text-spark-yellow/90">
              {dividerResult}
            </span>
          </div>
          <p className="mt-1.5 text-[8px] text-white/25">
            Vout = Vin x R2 / (R1 + R2)
          </p>
        </div>
      </div>
    </div>
  );
}
