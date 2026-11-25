import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Handshake,
  Heart,
  Lightbulb,
  MessageCircle,
  Play,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { buttonClass } from "@/components/shared/button";
import { assets } from "@/src/lib/assets";
import { communityPillars } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The Nano Spark community: peer study groups, build-in-public culture, mentoring and real-world challenges for young technologists.",
};

const ways = [
  {
    icon: MessageCircle,
    title: "Join a study circle",
    body: "Small groups working through the same lab, comparing notes and unblocking each other.",
  },
  {
    icon: Share2,
    title: "Build in public",
    body: "Post progress, wiring photos and failed attempts. Documenting the messy middle is encouraged.",
  },
  {
    icon: Handshake,
    title: "Mentor a beginner",
    body: "If you have solved it once, you can teach it. Advanced students coach first-time builders.",
  },
  {
    icon: Lightbulb,
    title: "Answer a challenge",
    body: "Community challenges focus on classrooms, campuses and everyday problems worth solving.",
  },
];

const rhythms = [
  {
    day: "Open build",
    title: "Weekly lab session",
    body: "A shared block of time to work through a lab or project brief together.",
  },
  {
    day: "Show & tell",
    title: "Fortnightly demo",
    body: "Three minutes to show what works, what broke and what you learned.",
  },
  {
    day: "Deep dive",
    title: "Monthly workshop",
    body: "A focused session on one system: sensors, wireless, control or vision.",
  },
  {
    day: "Challenge",
    title: "Term project sprint",
    body: "Teams choose a real problem, build evidence and present the result.",
  },
];

const charter = [
  "Ask the question you think is too basic — someone else is wondering it too.",
  "Share failures with the same honesty as successes.",
  "Credit the person who helped you debug.",
  "Never mock a beginner's wiring, code or spelling.",
  "Leave every shared workstation better than you found it.",
];

export default function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title={
          <>
            Nobody builds{" "}
            <span className="text-spark-dark">alone.</span>
          </>
        }
        description="Nano Spark is a learning community before it is a platform. Students compare notes, share failures and teach each other — because that is how technology is actually learned."
        image={assets.images.students}
        imageAlt="Nano Spark students working together on technology projects"
        actions={
          <>
            <Link href="/auth" className={buttonClass("primary")}>
              <Users className="h-4 w-4" /> Join the community
            </Link>
            <Link href="/projects" className={buttonClass("outline")}>
              Browse builds <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <div className="flex max-w-lg items-center gap-3 rounded-2xl border border-ink/[0.08] bg-white/70 p-3 backdrop-blur">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-spark-yellow text-ink">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="text-[11.5px] leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink">Small ideas, big impact.</span>{" "}
            Bring a real problem from your world and work on it with people who
            are learning the same things.
          </p>
        </div>
      </PageHero>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeading
            eyebrow="What holds us together"
            title="Four commitments, not four features."
            description="These pillars describe how the community behaves. They are the reason a shared lab session feels different from watching a tutorial alone."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communityPillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 0.07}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/[0.07] bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-spark-dark/40 hover:shadow-card">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-spark-yellow/0 blur-2xl transition-colors duration-500 group-hover:bg-spark-yellow/20" />
                  <span className="font-display text-3xl font-extrabold text-ink/[0.08]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
                    {pillar.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-warm section-pad">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] border border-ink/10">
              <div className="relative aspect-[4/3]">
                <Image
                  src={assets.images.classroom}
                  alt="A Nano Spark community workshop in progress"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold text-ink backdrop-blur">
                  <CalendarDays className="h-3 w-3" /> In person & online
                </span>
                <p className="mt-2 font-display text-lg font-semibold text-white">
                  A room full of people debugging is a good room.
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
              Ways to take part
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.06] sm:text-[2.5rem]">
              Pick the level of involvement that fits today.
            </h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {ways.map((way) => (
                <div
                  key={way.title}
                  className="rounded-2xl border border-ink/[0.07] bg-white p-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-spark-yellow">
                    <way.icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 font-display text-[14px] font-semibold">
                    {way.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                    {way.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Community rhythm"
            title="A predictable cadence beats a loud launch."
            description="The community runs on a simple repeating rhythm. Show up for the sessions that are useful; the door stays open."
          />
          <div className="mt-10 overflow-hidden rounded-3xl border border-ink/[0.07] bg-white">
            {rhythms.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="grid gap-2 border-b border-ink/[0.06] p-5 last:border-b-0 sm:grid-cols-[150px_1fr_auto] sm:items-center">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-warm px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
                    {item.day}
                  </span>
                  <div>
                    <h3 className="font-display text-[15px] font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-[11.5px] leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                  <ArrowRight className="hidden h-4 w-4 text-ink-muted/30 sm:block" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink section-pad text-white">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="eyebrow text-spark-light/80">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-yellow" />
              Builder&apos;s charter
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.06] sm:text-[2.5rem]">
              Basic decency is part of the curriculum.
            </h2>
            <div className="mt-7 space-y-3">
              {charter.map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-spark-yellow" />
                  <p className="text-[12.5px] leading-relaxed text-white/60">
                    {line}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[10px] text-white/50">
              <ShieldCheck className="h-3.5 w-3.5 text-spark-yellow" />
              Safe, respectful, beginner-friendly by design
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-spark-yellow" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Bring your build
                </p>
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold">
                Show the working version — and the version that failed.
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed text-white/50">
                Create a profile to save your favourite labs, keep a record of
                what you have explored and bring your project notes to the next
                session.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/auth" className={buttonClass("primary")}>
                Create a profile <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Open a lab
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
