"use client";

import type { LucideIcon } from "lucide-react";
import { Award, ShieldCheck, Target } from "lucide-react";
import { AboutSectionHeading } from "@/components/about/section-heading";
import { Reveal, WordReveal } from "@/components/shared/reveal";

export function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group h-full rounded-2xl border border-ink/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-spark-yellow text-ink transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 font-display text-xl font-extrabold text-ink">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{description}</p>
    </div>
  );
}

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "Make practical technology education accessible to every student, school and aspiring innovator.",
  },
  {
    icon: ShieldCheck,
    title: "Our Promise",
    description:
      "Hands-on, project-first learning that takes students from first spark to working prototype.",
  },
  {
    icon: Award,
    title: "Our Standard",
    description:
      "An MSME registered, StartupTN recognized startup — built for trustworthy partnerships.",
  },
];

export function MissionValues() {
  return (
    <section className="bg-warm py-20">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <AboutSectionHeading
          eyebrow="WHY WE EXIST"
          title={
            <WordReveal
              text="Mission, promise & standard"
              highlightWords={["standard"]}
            />
          }
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.08} y={24}>
              <ValueCard {...value} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
