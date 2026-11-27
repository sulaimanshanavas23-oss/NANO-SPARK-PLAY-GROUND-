import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { labs } from "@/src/lib/labs";
import { navigation } from "@/src/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 dark-circuit opacity-70" />
      <div className="gold-rule h-px w-full" />
      <div className="container-wide relative py-14 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_0.7fr_0.9fr] lg:gap-12">
          <div>
            <Logo tone="dark" size="md" />
            <p className="mt-6 max-w-sm text-pretty text-sm leading-relaxed text-white/55">
              The interactive learning campus from Nano Spark. Seven labs, real
              tools and a generation of students turning small ideas into big
              impact.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-spark-yellow/30 bg-spark-yellow/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-spark-light">
                Small Ideas. Big Impact.
              </span>
            </div>
            <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-white/35">
              Technology · Innovations · Solutions
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">
              Platform
            </h3>
            <ul className="mt-5 space-y-3">
              {navigation.slice(1, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/50 transition-colors hover:text-spark-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/showroom"
                  className="text-sm text-white/50 transition-colors hover:text-spark-light"
                >
                  Technology Showroom
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">
              Learning labs
            </h3>
            <ul className="mt-5 grid gap-3">
              {labs.slice(0, 5).map((lab) => (
                <li key={lab.id}>
                  <Link
                    href={`/playground?lab=${lab.id}`}
                    className="group flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-spark-light"
                  >
                    <Play className="h-2.5 w-2.5 text-spark-yellow/50 transition-colors group-hover:text-spark-yellow" />
                    {lab.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1 text-sm font-medium text-spark-yellow transition-colors hover:text-spark-light"
                >
                  All seven labs <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">
              Nano Spark
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-white/50 transition-colors hover:text-spark-light"
                >
                  About the company
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-sm text-white/50 transition-colors hover:text-spark-light"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-white/50 transition-colors hover:text-spark-light"
                >
                  Student projects
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-white/50 transition-colors hover:text-spark-light"
                >
                  Student dashboard
                </Link>
              </li>
            </ul>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-white/55">
                New to the playground?
              </p>
              <Link
                href="/playground"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-spark-yellow"
              >
                Enter the campus <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Nano Spark. All rights reserved. Nano
            Playground is an interactive learning experience.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Built with Three.js · React Three Fiber · Next.js</span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-yellow" />
              Seven labs online
            </span>
          </div>
        </div>
      </div>
      <div className="relative h-1 w-full bg-[linear-gradient(90deg,#FFC107,#F7B500,#FFC107)]" />
    </footer>
  );
}
