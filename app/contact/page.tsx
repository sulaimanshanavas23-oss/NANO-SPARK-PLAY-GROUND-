import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Github, GraduationCap, MessageSquare, Users } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { MessageForm } from "@/components/shared/message-form";
import { buttonClass } from "@/components/shared/button";
import { assets } from "@/src/lib/assets";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Nano Spark team about the labs, workshops, partnerships or anything you want to build on the playground.",
};

const channels = [
  {
    icon: MessageSquare,
    title: "Feedback first",
    body: "The fastest route for a bug, a fix or a feature request.",
    href: "/feedback",
    label: "Send feedback",
  },
  {
    icon: Users,
    title: "Community",
    body: "Ask a question and see what other students are building.",
    href: "/community",
    label: "Open the community",
  },
  {
    icon: GraduationCap,
    title: "Workshops",
    body: "Bring a lab session to your class, club or campus.",
    href: "/learn",
    label: "See the learning pathway",
  },
  {
    icon: Github,
    title: "Source code",
    body: "Follow the project and open issues on GitHub.",
    href: "https://github.com/sulaimanshanavas23-oss/NANO-SPARK-PLAY-GROUND-",
    label: "View repository",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Nano Spark"
        title={
          <>
            Start a conversation{" "}
            <span className="text-spark-dark">about what you want to build.</span>
          </>
        }
        description="A workshop, a partnership, a question about a lab or a project that needs a second pair of eyes — send it over and the right person will pick it up."
        image={assets.images.students}
        imageAlt="Nano Spark students collaborating"
        compact
        actions={
          <>
            <Link href="#contact" className={buttonClass("primary")}>
              <MessageSquare className="h-4 w-4" /> Write a message
            </Link>
            <Link href="/about" className={buttonClass("outline")}>
              About Nano Spark
            </Link>
          </>
        }
      />

      <section className="section-pad">
        <div className="container-wide mx-auto max-w-5xl">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => (
              <Link
                key={channel.title}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noreferrer noopener" : undefined}
                className="group flex h-full flex-col rounded-2xl border border-ink/[0.07] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-spark-dark/40 hover:shadow-card"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-spark-yellow">
                  <channel.icon className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-[14px] font-semibold">
                  {channel.title}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                  {channel.body}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-ink">
                  {channel.label}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-warm section-pad scroll-mt-24">
        <div className="container-wide mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark-dark" />
              Message the team
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight">
              Tell us who you are and what you need.
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
              Include the lab or page you were using, what you expected and what
              happened. Screenshots and file names help us reproduce the issue
              faster.
            </p>
            <div className="mt-6 rounded-2xl border border-ink/[0.07] bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted/70">
                Response window
              </p>
              <p className="mt-1.5 font-display text-lg font-semibold">
                Within two working days
              </p>
              <p className="mt-1 text-[11px] text-ink-muted">
                Urgent lab outages are triaged first.
              </p>
            </div>
          </div>
          <MessageForm mode="contact" />
        </div>
      </section>
    </>
  );
}
