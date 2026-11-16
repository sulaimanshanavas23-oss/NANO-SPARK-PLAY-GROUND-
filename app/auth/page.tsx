import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { assets } from "@/src/lib/assets";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Sign in or create a Nano Playground profile to save favourite labs, track progress and keep a record of the technology you explore.",
};

const benefits = [
  "Save favourite labs and tools in one place",
  "Keep a record of every lab you explore",
  "Track progress across the seven live labs",
  "Return to recent activity from any device",
];

export default function AuthPage() {
  return (
    <section className="relative overflow-hidden bg-warm">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.3]" />
      <div className="container-wide relative py-12 sm:py-16 lg:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to the campus
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-xl">
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
              Nano Playground account
            </p>
            <h1 className="mt-4 text-balance text-[2.5rem] leading-[1.02] sm:text-[3.2rem]">
              Your campus,{" "}
              <span className="text-spark-dark">remembered.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-ink-muted">
              A profile turns the playground into your playground. Favourites,
              recent labs and progress stay together so you can pick up exactly
              where you left off.
            </p>

            <div className="mt-7 space-y-2.5">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-spark-dark" />
                  <p className="text-[12px] text-ink-muted">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink/10">
                <Image
                  src={assets.images.students}
                  alt="Nano Spark students learning together"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink/10">
                <Image
                  src={assets.images.classroom}
                  alt="A Nano Spark classroom session"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="lg:pl-6">
            <AuthForm />

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                { icon: Heart, label: "Favourites" },
                { icon: Clock, label: "Recent activity" },
                { icon: ShieldCheck, label: "Optional cloud sync" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-xl border border-ink/[0.07] bg-white/70 px-3 py-2.5 text-[9.5px] font-medium text-ink-muted backdrop-blur"
                >
                  <item.icon className="h-3.5 w-3.5 text-spark-dark" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 rounded-3xl border border-ink/[0.07] bg-white p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-spark-yellow/15 text-spark-dark">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-[14px] font-semibold">
                Just want to look around?
              </p>
              <p className="text-[11px] text-ink-muted">
                No account needed to explore the campus, labs or tools. An
                account only adds memory.
              </p>
            </div>
          </div>
          <Link
            href="/playground"
            className="shrink-0 text-[11px] font-semibold text-ink transition-colors hover:text-spark-dark"
          >
            Continue without an account →
          </Link>
        </div>
      </div>
    </section>
  );
}
