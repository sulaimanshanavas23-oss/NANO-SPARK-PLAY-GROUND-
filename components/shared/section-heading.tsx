import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6",
        align === "center" && "items-center text-center",
        Boolean(action) && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p
            className={cn(
              "eyebrow mb-4",
              tone === "dark" && "text-spark-light/80",
            )}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark-dark" />
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "text-display-2 text-balance",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-lead-fluid mt-5 max-w-2xl text-pretty",
              align === "center" && "mx-auto",
              tone === "dark" ? "text-white/60" : "text-ink-muted",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
