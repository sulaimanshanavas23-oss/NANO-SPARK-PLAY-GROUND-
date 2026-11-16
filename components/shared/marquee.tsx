import { cn } from "@/src/lib/utils";

export function Marquee({
  items,
  className,
  tone = "dark",
}: {
  items: string[];
  className?: string;
  tone?: "dark" | "yellow";
}) {
  const track = [...items, ...items];
  return (
    <div
      className={cn(
        "relative flex overflow-hidden border-y py-4",
        tone === "dark"
          ? "border-white/10 bg-ink text-white"
          : "border-spark-dark/20 bg-spark-yellow text-ink",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap pr-8">
        {track.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-8">
            <span className="text-[13px] font-semibold uppercase tracking-[0.16em] opacity-80">
              {item}
            </span>
            <span
              className={cn(
                "h-1.5 w-1.5 rotate-45",
                tone === "dark" ? "bg-spark-yellow" : "bg-ink/50",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
