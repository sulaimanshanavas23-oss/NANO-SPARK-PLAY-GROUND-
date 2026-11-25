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
  if (compact) {
    return (
      <Link
        href={href}
        aria-label="Nano Spark home"
        className={cn("group flex items-center", className)}
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
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label="Nano Spark home"
      className={cn("group flex items-center", className)}
    >
      <span
        className={cn(
          "relative block transition-transform duration-500 group-hover:scale-[1.02]",
          tone === "dark" &&
            "rounded-xl bg-white px-2 py-1.5 ring-1 ring-white/20",
        )}
      >
        <Image
          src={assets.branding.wordmarkWide}
          alt="Nano Spark — Technology, Innovations, Solutions"
          width={622}
          height={137}
          priority
          sizes="(max-width: 640px) 240px, 360px"
          className="h-12 w-auto sm:h-16 lg:h-[72px]"
        />
      </span>
    </Link>
  );
}
