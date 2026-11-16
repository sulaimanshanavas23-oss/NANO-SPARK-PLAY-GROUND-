import Image from "next/image";
import Link from "next/link";
import { assets } from "@/src/lib/assets";
import { cn } from "@/src/lib/utils";

export function Logo({
  href = "/",
  compact = false,
  tone = "light",
  className,
}: {
  href?: string;
  compact?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Nano Spark home"
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-ink/10 sm:h-11 sm:w-11">
        <Image
          src={assets.branding.mark}
          alt="Nano Spark logo"
          fill
          sizes="44px"
          className="object-contain p-0.5 transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[15px] font-extrabold tracking-tight sm:text-base",
              tone === "dark" ? "text-white" : "text-ink",
            )}
          >
            Nano <span className="text-spark-dark">Spark</span>
            <span className="text-spark-yellow">.</span>
          </span>
          <span
            className={cn(
              "mt-1 hidden text-[7px] font-semibold uppercase tracking-[0.17em] sm:block",
              tone === "dark" ? "text-white/45" : "text-ink-muted/80",
            )}
          >
            Technology · Innovations · Solutions
          </span>
        </span>
      )}
    </Link>
  );
}
