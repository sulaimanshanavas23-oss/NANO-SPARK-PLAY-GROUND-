import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Sparkles, Star, Wrench } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { MessageForm } from "@/components/shared/message-form";
import { buttonClass } from "@/components/shared/button";
import { assets } from "@/src/lib/assets";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Tell Nano Spark what is working, what broke and what would make the labs, tools and 3D campus better.",
};

const promises = [
  {
    icon: Wrench,
    title: "Broken things get fixed",
    body: "A lab that will not load, a model that will not rotate or a link that dead-ends — report it and we will trace it.",
  },
  {
    icon: Star,
    title: "Small ideas are welcome",
    body: "A single sentence about a project you want to build is enough to start a conversation.",
  },
  {
    icon: Sparkles,
    title: "Students shape the roadmap",
    body: "The labs and tools on this campus started as requests from the people using them.",
  },
];

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        eyebrow="Feedback · we read all of it"
        title={
          <>
            Tell us what to{" "}
            <span className="text-spark-dark">fix or build next.</span>
          </>
        }
        description="Whether a circuit simulation misbehaved, a 3D model needs work or a lesson needs a clearer example — this is the place to say it."
        image={assets.images.toolsBox}
        imageAlt="The Nano Spark tools box"
        compact
        actions={
          <>
            <Link href="#feedback" className={buttonClass("primary")}>
              <MessageSquare className="h-4 w-4" /> Write feedback
            </Link>
            <Link href="/community" className={buttonClass("outline")}>
              Meet the community
            </Link>
          </>
        }
      />

      <section id="feedback" className="section-pad scroll-mt-24">
        <div className="container-wide mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <MessageForm mode="feedback" />
          <div className="grid gap-3">
            {promises.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-ink/[0.07] bg-warm/60 p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-spark-yellow">
                  <item.icon className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-[14px] font-semibold">
                  {item.title}
                </p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
