"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  Flame,
  Loader2,
  Lock,
  LogOut,
  Play,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { labs, getLab } from "@/src/lib/labs";
import { getTool } from "@/src/lib/tools";
import { assets } from "@/src/lib/assets";
import { useApp } from "@/src/lib/store/app-provider";
import { LabGlyph } from "@/components/shared/icons";
import { buttonClass } from "@/components/shared/button";
import { cn } from "@/src/lib/utils";

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function DashboardView() {
  const {
    hydrated,
    profile,
    cloudEnabled,
    favorites,
    recent,
    progress,
    signOut,
    toggleFavorite,
  } = useApp();

  if (!hydrated) {
    return (
      <div className="container-wide flex min-h-[420px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-spark-dark" />
        <p className="text-[11px] text-ink-muted">Loading your dashboard…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-wide py-14 sm:py-20">
        <div className="grid overflow-hidden rounded-[32px] border border-ink/[0.08] bg-white shadow-card lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-7 sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-spark-yellow">
              <Lock className="h-5 w-5" />
            </span>
            <p className="eyebrow mt-5">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
              Protected area
            </p>
            <h1 className="mt-3 text-balance text-[2.2rem] leading-[1.04] sm:text-[2.8rem]">
              Your dashboard is{" "}
              <span className="text-spark-dark">waiting.</span>
            </h1>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-ink-muted">
              Sign in to see the labs you have explored, the tools you saved and
              where to go next. No account is needed to use the labs — an account
              simply remembers them.
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                { icon: TrendingUp, label: "Lab progress" },
                { icon: Star, label: "Saved favourites" },
                { icon: Clock, label: "Recent activity" },
                { icon: Target, label: "Next recommendation" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-xl border border-ink/[0.07] bg-warm/60 px-3 py-2.5"
                >
                  <item.icon className="h-3.5 w-3.5 text-spark-dark" />
                  <span className="text-[11px] text-ink-muted">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link href="/auth" className={buttonClass("primary")}>
                Sign in or create profile <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/explore" className={buttonClass("outline")}>
                Explore without an account
              </Link>
            </div>
          </div>
          <div className="relative min-h-[280px]">
            <Image
              src={assets.images.students}
              alt="Nano Spark students working together"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-spark-yellow px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink">
                <Sparkles className="h-3 w-3" /> Small ideas, big impact
              </p>
              <p className="mt-3 max-w-sm font-display text-xl font-semibold text-white">
                Come back to the lab you left open.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const explored = Object.keys(progress).length;
  const totalVisits = Object.values(progress).reduce(
    (sum, entry) => sum + entry.visits,
    0,
  );
  const average = explored
    ? Math.round(
        Object.values(progress).reduce((sum, entry) => sum + entry.percent, 0) /
          explored,
      )
    : 0;
  const latest = Object.entries(progress).sort(
    (a, b) => +new Date(b[1].lastVisitedAt) - +new Date(a[1].lastVisitedAt),
  )[0];
  const nextLab =
    labs.find((lab) => !progress[lab.id]) ??
    getLab(latest?.[0] ?? "") ??
    labs[0];
  const favoriteLabs = favorites.labs
    .map((id) => getLab(id))
    .filter((lab): lab is NonNullable<typeof lab> => Boolean(lab));
  const favoriteTools = favorites.tools
    .map((id) => getTool(id))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  return (
    <div className="container-wide py-10 sm:py-14">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink font-display text-2xl font-bold text-spark-yellow">
            {profile.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted/60">
              {profile.provider === "demo" ? "Local demo session" : "Signed in"}
            </p>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">
              Welcome back, {profile.name.split(" ")[0]}.
            </h1>
            <p className="text-[11.5px] text-ink-muted">{profile.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9.5px] font-semibold",
              cloudEnabled && profile.provider !== "demo"
                ? "bg-emerald-500/10 text-emerald-700"
                : "bg-ink/[0.05] text-ink-muted",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                cloudEnabled && profile.provider !== "demo"
                  ? "bg-emerald-500"
                  : "bg-spark-dark",
              )}
            />
            {cloudEnabled && profile.provider !== "demo"
              ? "Cloud sync ready"
              : "Saved on this device"}
          </span>
          <Link href="/auth" className={buttonClass("outline", "sm")}>
            <Bookmark className="h-3.5 w-3.5" /> Account
          </Link>
          <button
            onClick={() => signOut()}
            className={buttonClass("ghost", "sm")}
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Labs explored", value: `${explored}/7`, icon: Compass },
          { label: "Lab visits", value: `${totalVisits}`, icon: Flame },
          { label: "Average progress", value: `${average}%`, icon: TrendingUp },
          {
            label: "Favourites",
            value: `${favorites.labs.length + favorites.tools.length}`,
            icon: Star,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-ink/[0.07] bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-muted/60">
                {stat.label}
              </span>
              <stat.icon className="h-3.5 w-3.5 text-spark-dark" />
            </div>
            <p className="mt-2 font-display text-2xl font-extrabold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-ink/[0.07] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-muted/60">
                Learning progress
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold">
                The seven labs
              </h2>
            </div>
            <Link
              href="/playground"
              className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-ink transition-colors hover:text-spark-dark"
            >
              Playground <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-5 space-y-2">
            {labs.map((lab) => {
              const entry = progress[lab.id];
              return (
                <div
                  key={lab.id}
                  className="flex items-center gap-3 rounded-2xl border border-ink/[0.05] bg-warm/40 p-2.5 transition-colors hover:border-spark-dark/30 hover:bg-warm"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      entry
                        ? "bg-ink text-spark-yellow"
                        : "bg-white text-ink/50",
                    )}
                  >
                    <LabGlyph icon={lab.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[12px] font-semibold">
                        {lab.name}
                      </p>
                      <span className="shrink-0 text-[9px] text-ink-muted">
                        {entry ? `${entry.percent}%` : "Not started"}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-ink/10">
                      <div
                        className="h-full rounded-full bg-spark-yellow transition-all duration-500"
                        style={{ width: `${entry?.percent ?? 0}%` }}
                      />
                    </div>
                    {entry && (
                      <p className="mt-1 text-[8.5px] text-ink-muted/60">
                        {entry.visits} visit{entry.visits === 1 ? "" : "s"} ·
                        last {formatDate(entry.lastVisitedAt)}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/playground?lab=${lab.id}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink-muted transition-colors hover:bg-spark-yellow hover:text-ink"
                    aria-label={`Open ${lab.name}`}
                  >
                    <Play className="h-3 w-3 fill-current" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 rounded-2xl bg-ink p-4 text-white sm:flex-row sm:items-center">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-spark-light/70">
                Recommended next
              </p>
              <p className="mt-1 font-display text-[15px] font-semibold">
                {progress[nextLab.id] ? "Revisit " : "Start "}
                {nextLab.name}
              </p>
              <p className="text-[10px] text-white/45">{nextLab.tagline}</p>
            </div>
            <Link
              href={`/playground?lab=${nextLab.id}`}
              className={buttonClass("primary", "sm", "shrink-0")}
            >
              {progress[nextLab.id] ? "Resume" : "Start lab"}{" "}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-ink/[0.07] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                Favourites
              </h2>
              <span className="text-[9.5px] text-ink-muted/60">
                {favoriteLabs.length + favoriteTools.length} saved
              </span>
            </div>

            {favoriteLabs.length + favoriteTools.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-ink/15 p-5 text-center">
                <Star className="mx-auto h-5 w-5 text-ink-muted/30" />
                <p className="mt-2 text-[11px] text-ink-muted">
                  Star a lab or tool and it will appear here.
                </p>
                <Link
                  href="/explore"
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-ink hover:text-spark-dark"
                >
                  Explore labs <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {favoriteLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="flex items-center gap-2.5 rounded-xl bg-warm/50 p-2"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-spark-yellow">
                      <LabGlyph icon={lab.icon} className="h-3.5 w-3.5" />
                    </span>
                    <Link
                      href={`/playground?lab=${lab.id}`}
                      className="min-w-0 flex-1 truncate text-[11px] font-medium hover:text-spark-dark"
                    >
                      {lab.name}
                    </Link>
                    <button
                      onClick={() => toggleFavorite("lab", lab.id)}
                      className="text-spark-dark"
                      aria-label={`Remove ${lab.name} from favourites`}
                    >
                      <Star className="h-3 w-3 fill-current" />
                    </button>
                  </div>
                ))}
                {favoriteTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center gap-2.5 rounded-xl bg-warm/50 p-2"
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[8px] font-bold text-white"
                      style={{ backgroundColor: tool.color }}
                    >
                      {tool.monogram}
                    </span>
                    <Link
                      href={`/tools?tool=${tool.id}`}
                      className="min-w-0 flex-1 truncate text-[11px] font-medium hover:text-spark-dark"
                    >
                      {tool.name}
                    </Link>
                    <button
                      onClick={() => toggleFavorite("tool", tool.id)}
                      className="text-spark-dark"
                      aria-label={`Remove ${tool.name} from favourites`}
                    >
                      <Star className="h-3 w-3 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-ink/[0.07] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                Recent activity
              </h2>
              <Clock className="h-4 w-4 text-ink-muted/40" />
            </div>
            {recent.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-ink/15 p-5 text-center text-[11px] text-ink-muted">
                Open a lab or tool to start your activity trail.
              </p>
            ) : (
              <div className="mt-3 space-y-1.5">
                {recent.slice(0, 6).map((entry) => {
                  const isLab = entry.kind === "lab";
                  const lab = isLab ? getLab(entry.refId) : undefined;
                  const tool = !isLab ? getTool(entry.refId) : undefined;
                  return (
                    <Link
                      key={entry.id}
                      href={
                        isLab
                          ? `/playground?lab=${entry.refId}`
                          : `/tools?tool=${entry.refId}`
                      }
                      className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-warm"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-warm text-ink/60">
                        {isLab ? (
                          <LabGlyph icon={lab?.icon ?? "cpu"} className="h-3.5 w-3.5" />
                        ) : (
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded text-[7px] font-bold text-white"
                            style={{ backgroundColor: tool?.color ?? "#111111" }}
                          >
                            {tool?.monogram ?? "?"}
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-medium">
                          {lab?.name ?? tool?.name ?? entry.refId}
                        </span>
                        <span className="block text-[8.5px] uppercase tracking-[0.1em] text-ink-muted/50">
                          {isLab ? "Lab" : "Tool"} · {formatDate(entry.at)}
                        </span>
                      </span>
                      <ExternalLink className="h-3 w-3 text-ink-muted/30" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-spark-dark/25 bg-spark-yellow/[0.08] p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-spark-dark" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted/70">
                Keep going
              </p>
            </div>
            <p className="mt-2 font-display text-[15px] font-semibold">
              {explored === labs.length
                ? "You have visited every lab. Now build something with them."
                : `${labs.length - explored} lab${labs.length - explored === 1 ? "" : "s"} left to explore.`}
            </p>
            <Link
              href={explored === labs.length ? "/projects" : "/playground"}
              className="mt-3 inline-flex items-center gap-1 text-[10.5px] font-semibold text-ink hover:text-spark-dark"
            >
              {explored === labs.length ? "Open project studio" : "Open playground"}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
