"use client";

import { WordReveal } from "@/components/shared/reveal";

export function FeedbackSectionHeading({
  eyebrow,
  title,
  highlight,
  description,
}: {
  eyebrow: string;
  title: string;
  highlight?: string[];
  description?: string;
}) {
  return (
    <div className="text-center">
      <p className="eyebrow justify-center">
        <span aria-hidden className="text-[10px] text-spark-dark">
          &#9654;
        </span>
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        <WordReveal text={title} highlightWords={highlight} />
      </h2>
      <div className="ns-gold-rule mx-auto mt-4 h-1.5 w-16 rounded-full" />
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-ink/65">
          {description}
        </p>
      )}
    </div>
  );
}
