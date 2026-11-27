import type { Metadata } from "next";
import Image from "next/image";
import {
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Youtube,
} from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach S. Shanavas and the Nano Spark team about STEM labs, workshops, kits, innovation programs or partnerships.",
};

const contactRows = [
  {
    icon: Mail,
    label: "Gmail",
    value: "nanospark46@gmail.com",
    href: "mailto:nanospark46@gmail.com",
    tone: "bg-warm text-ink",
  },
  {
    icon: Phone,
    label: "Contact",
    value: "+91 8148774546",
    href: "tel:+918148774546",
    tone: "bg-warm text-ink",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Message us — quick reply",
    href: "https://wa.me/918148774546",
    tone: "bg-whatsapp text-white",
  },
];

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/sulaimanshanavas23-oss/NANO-SPARK-PLAY-GROUND-",
  },
];

const offerings = [
  { title: "STEM Lab Setup", body: "Complete lab solutions for schools" },
  { title: "Workshops", body: "Robotics, IoT, Arduino & more" },
  { title: "STEM Kits", body: "Hands-on learning kits for students" },
  {
    title: "Innovation Programs",
    body: "Hackathons, competitions & exhibitions",
  },
];

const quickActions = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    subtitle: "Quick reply",
    href: "https://wa.me/918148774546",
    tone: "bg-whatsapp text-white",
  },
  {
    icon: Mail,
    title: "Gmail",
    subtitle: "Email us",
    href: "mailto:nanospark46@gmail.com",
    tone: "bg-spark-yellow text-ink",
  },
  {
    icon: Phone,
    title: "Call",
    subtitle: "+91 8148774546",
    href: "tel:+918148774546",
    tone: "bg-ink text-spark-yellow",
  },
];

export default function ContactPage() {
  return (
    <section className="section-pad bg-warm/40">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-ink/[0.07] bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="relative mx-auto h-40 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-spark-yellow sm:mx-0 sm:h-44 sm:w-36">
                  <Image
                    src="/founder.jpeg"
                    alt="S. Shanavas, Founder and CEO of Nano Spark"
                    fill
                    sizes="144px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-spark-dark">
                    About the founder
                  </p>
                  <h1 className="mt-1 font-display text-2xl font-extrabold leading-tight text-ink sm:text-[28px]">
                    S. Shanavas
                  </h1>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
                    Founder &amp; CEO — Nano Spark | Pre-Final Year ECE Student |
                    SIH Finalist 2025 (Software Edition)
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] text-ink-muted">
                    <MapPin className="h-3.5 w-3.5 text-ink/60" />
                    Chennai, Tamil Nadu, India
                  </p>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-ink/[0.08] bg-warm px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                    <ShieldCheck className="h-3 w-3 text-spark-dark" />
                    MSME Registered · StartupTN Recognized
                  </span>
                </div>
              </div>

              <div className="mt-5 divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
                {contactRows.map((row) => (
                  <a
                    key={row.label}
                    href={row.href}
                    target={row.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      row.href.startsWith("http")
                        ? "noreferrer noopener"
                        : undefined
                    }
                    className="group flex items-center gap-3 py-3"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${row.tone}`}
                    >
                      <row.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-muted/60">
                        {row.label}
                      </span>
                      <span className="block truncate text-[12.5px] font-medium text-ink transition-colors group-hover:text-spark-dark">
                        {row.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-muted/60">
                  Find us
                </p>
                <div className="mt-2.5 flex gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target={
                        social.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        social.href.startsWith("http")
                          ? "noreferrer noopener"
                          : undefined
                      }
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition-colors hover:border-ink hover:bg-ink hover:text-spark-yellow"
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-ink/[0.07] bg-white p-5 shadow-soft sm:p-6">
              <h2 className="font-display text-lg font-bold text-ink">
                What we offer
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {offerings.map((item) => (
                  <div key={item.title} className="rounded-xl bg-warm p-3.5">
                    <p className="font-display text-[13px] font-bold text-ink">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <ContactForm />

            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <a
                  key={action.title}
                  href={action.href}
                  target={
                    action.href.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    action.href.startsWith("http")
                      ? "noreferrer noopener"
                      : undefined
                  }
                  className="flex flex-col items-center rounded-2xl border border-ink/[0.07] bg-white p-4 text-center shadow-soft transition-transform hover:-translate-y-1"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${action.tone}`}
                  >
                    <action.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-2 font-display text-[12.5px] font-bold text-ink">
                    {action.title}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-ink-muted">
                    {action.subtitle}
                  </p>
                </a>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white">
              <div className="pointer-events-none absolute inset-0 dark-circuit opacity-80" />
              <div className="relative">
                <h2 className="font-display text-lg font-bold text-spark-yellow">
                  Location
                </h2>
                <p className="mt-3 inline-flex items-center gap-2 text-[13px] text-white/80">
                  <MapPin className="h-4 w-4 text-spark-yellow" />
                  Chennai, Tamil Nadu, India
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-white/55">
                  Serving schools and innovators across the Chennai region — and
                  beyond, online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
