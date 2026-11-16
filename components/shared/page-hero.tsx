import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClass } from "@/components/shared/button";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/src/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imageClassName,
  actions,
  children,
  tone = "light",
  compact = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  image?: string;
  imageAlt?: string;
  imageClassName?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  tone?: "light" | "dark";
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        tone === "dark" ? "bg-ink text-white" : "bg-warm",
      )}
    >
      {tone === "dark" && (
        <div className="pointer-events-none absolute inset-0 dark-circuit opacity-90" />
      )}
      {tone === "light" && (
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.35]" />
      )}
      <div
        className={cn(
          "container-wide relative grid items-center gap-10",
          compact ? "py-14 lg:py-16" : "py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24",
        )}
      >
        <div className="max-w-2xl">
          <Reveal>
            <p className={cn("eyebrow mb-5", tone === "dark" && "text-spark-light/80")}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark-dark" />
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-display-1 text-balance">{title}</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p
              className={cn(
                "text-lead-fluid mt-6 max-w-xl text-pretty",
                tone === "dark" ? "text-white/60" : "text-ink-muted",
              )}
            >
              {description}
            </p>
          </Reveal>
          {actions && (
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>
            </Reveal>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>

        {image && (
          <Reveal delay={0.15} className="relative">
            <div
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-[28px] border border-ink/10 shadow-card",
                imageClassName,
              )}
            >
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
            </div>
            {tone === "light" && (
              <>
                <div className="absolute -bottom-5 -left-5 -z-10 h-28 w-28 rounded-full bg-spark-yellow/40 blur-2xl" />
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-2xl border border-spark-dark/30 bg-white/60 backdrop-blur" />
              </>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function InlineLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={buttonClass("outline")}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
