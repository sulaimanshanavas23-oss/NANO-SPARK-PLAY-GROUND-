import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { LabCard } from "@/components/laboratories/lab-card";
import { CampusBanner } from "@/components/laboratories/campus-banner";
import { Reveal } from "@/components/shared/reveal";
import { buttonClass } from "@/components/shared/button";
import { assets } from "@/src/lib/assets";
import { labs } from "@/src/lib/labs";

export function SevenLabsSection() {
  return (
    <section className="relative overflow-hidden border-b border-ink/[0.06] bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[210px] lg:block xl:h-[240px]">
        <Image
          src={assets.images.campusHero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>

      <div className="container-wide relative pt-9 sm:pt-11 lg:pt-14">
        <h2 className="sr-only">Seven labs. One connected campus.</h2>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-sm">
            <GraduationCap className="h-3.5 w-3.5 text-spark-yellow" />
            7 Interactive Labs
          </p>
          <Link
            href="/explore"
            className="lab-btn-explore w-fit shrink-0"
          >
            Explore all labs
            <ArrowRight className="lab-btn-explore__icon h-4 w-4" />
          </Link>
        </div>

        <figure className="relative mt-4 overflow-hidden rounded-[26px] border border-ink/[0.08] bg-white shadow-[0_30px_80px_-46px_rgba(17,17,17,0.45)]">
          <Image
            src={assets.images.sevenLabsCampus}
            alt="Seven Labs campus overview — the Arduino, ESP32, Protocol, Electronics, RoverKit, Vehicle and Robotics labs plus the playground banner"
            width={1536}
            height={1024}
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="h-auto w-full"
          />
          <figcaption className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/85 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-muted shadow-sm backdrop-blur">
            <GraduationCap className="h-3 w-3 text-spark-dark" />
            Campus overview · interactive cards below
          </figcaption>
        </figure>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:mt-5 lg:grid-cols-3">
          {labs.map((lab, index) => (
            <Reveal key={lab.id} delay={(index % 3) * 0.05} className="h-full">
              <LabCard lab={lab} />
            </Reveal>
          ))}
          <Reveal delay={0.1} className="h-full sm:col-span-2">
            <CampusBanner className="h-full" />
          </Reveal>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pb-9 text-[11px] text-ink-muted sm:pb-11">
          <p className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-spark-dark" />
            Seven live stations · interactive 3D previews · real applications
          </p>
          <Link
            href="/playground"
            className={buttonClass("ghost", "sm")}
          >
            Open the workspace <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
