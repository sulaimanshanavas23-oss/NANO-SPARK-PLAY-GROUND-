import Link from "next/link";
import { ArrowLeft, Compass, Play, Search } from "lucide-react";
import { buttonClass } from "@/components/shared/button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-warm">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.35]" />
      <div className="container-wide relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-spark-yellow">
          <Compass className="h-7 w-7" />
        </span>
        <p className="eyebrow mt-6">
          <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
          Error 404
        </p>
        <h1 className="mt-3 max-w-xl text-balance text-[2.4rem] leading-[1.03] sm:text-[3.2rem]">
          This part of the campus{" "}
          <span className="text-spark-dark">does not exist yet.</span>
        </h1>
        <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-ink-muted">
          The page you were looking for may have moved, or the lab may be
          available under a different route. Head back to the campus and pick up
          from there.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Link href="/" className={buttonClass("dark")}>
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <Link href="/explore" className={buttonClass("outline")}>
            <Search className="h-4 w-4" /> Explore the labs
          </Link>
          <Link href="/playground" className={buttonClass("primary")}>
            <Play className="h-4 w-4 fill-current" /> Open playground
          </Link>
        </div>
      </div>
    </section>
  );
}
