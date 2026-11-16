import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your Nano Playground dashboard: lab progress, favourites, recent activity and the next lab to explore.",
};

export default function DashboardPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 dark-circuit opacity-90" />
        <div className="container-wide relative py-8 sm:py-10">
          <p className="eyebrow text-spark-light/80">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark-yellow" />
            My learning
          </p>
          <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-[2.1rem] leading-[1.05] sm:text-[2.7rem]">
                Dashboard
              </h1>
              <p className="mt-2 max-w-xl text-[12.5px] leading-relaxed text-white/50">
                Progress, favourites and recent activity across the Nano Spark
                campus. Everything stays in one place.
              </p>
            </div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
              {new Date().getFullYear()} · Nano Playground
            </p>
          </div>
        </div>
      </section>

      <section className="bg-warm">
        <DashboardView />
      </section>
    </>
  );
}
