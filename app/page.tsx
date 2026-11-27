import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  CircuitBoard,
  GraduationCap,
  Lightbulb,
  PackageOpen,
  Play,
  Wrench,
} from "lucide-react";
import { Hero } from "@/components/hero/hero";
import { Marquee } from "@/components/shared/marquee";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { HardwareShowcase } from "@/components/showcase/hardware-showcase";
import { LearningPathway } from "@/components/learning-journey/learning-pathway";
import { buttonClass } from "@/components/shared/button";
import { CategoryGlyph } from "@/components/shared/icons";
import { assets } from "@/src/lib/assets";
import { projectIdeas, stats } from "@/src/lib/site";
import { toolCategories, tools } from "@/src/lib/tools";
import { cn } from "@/src/lib/utils";

const studentFeatures = [
  "Hands-on workshops",
  "Project demonstrations",
  "Robotics experiments",
  "Embedded development",
  "Mentorship",
  "Collaborative builds",
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <Marquee
        className="mt-14"
        items={[
          "Learn",
          "Build",
          "Experiment",
          "Debug",
          "Innovate",
          "Solve",
          "Small Ideas. Big Impact.",
          "Nano Spark",
        ]}
      />

      <section className="border-b border-ink/[0.06] bg-white">
        <div className="container-wide grid grid-cols-2 divide-ink/[0.06] py-8 sm:grid-cols-4 sm:divide-x">
          {stats.map((stat) => (
            <Reveal key={stat.label} className="px-4 py-4 text-center sm:py-2">
              <p className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {stat.value === "∞" ? (
                  <span className="text-spark-dark">{stat.value}</span>
                ) : (
                  stat.value
                )}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-warm section-pad">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Tools & platforms"
            title={
              <>
                Tools &amp; Platforms You{" "}
                <span className="text-spark-dark">Will Use</span>
              </>
            }
            description="From beginner-friendly learning tools to advanced programming, AI and hardware development platforms — explore the technologies behind real-world innovation."
            action={
              <div className="flex flex-wrap gap-2">
                <Link href="/tools" className={buttonClass("primary", "sm")}>
                  EXPLORE ALL TOOLS
                </Link>
                <Link href="/showroom" className={buttonClass("outline", "sm")}>
                  ENTER SHOWROOM
                </Link>
              </div>
            }
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="group relative h-full min-h-[360px] overflow-hidden rounded-[28px] border border-ink/10 bg-ink">
                <Image
                  src={assets.images.toolsPlatforms}
                  alt="The full ecosystem of tools and platforms Nano Spark students learn with"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/5" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                  <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                    Tools &amp; platforms
                  </span>
                  <span className="rounded-full bg-spark-yellow px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-ink">
                    16 tools · 4 categories
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <h3 className="max-w-md font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    Real software. Real hardware. One showroom.
                  </h3>
                  <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-white/60">
                    Explore the editors, simulators, IoT platforms and AI tools
                    students use to move from an idea to a working prototype.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/tools"
                      className={cn(buttonClass("primary", "sm"), "text-[10px]")}
                    >
                      Open the tool library <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/showroom"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-[10px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                    >
                      Walk the 3D showroom
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="grid gap-4 lg:col-span-5">
              <Reveal delay={0.08}>
                <Link
                  href="/showroom"
                  className="group relative block overflow-hidden rounded-[28px] border border-ink/10 bg-white"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={assets.images.toolsBox}
                      alt="The Nano Spark tools box with development boards, electronics and learning materials"
                      fill
                      sizes="(max-width: 1024px) 100vw, 35vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-spark-light">
                          Inside the kit
                        </p>
                        <p className="font-display text-lg font-semibold">
                          The Nano Spark tools box
                        </p>
                      </div>
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="rounded-[28px] border border-ink/10 bg-white p-4">
                  {toolCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/tools?category=${category.id}`}
                      className="group flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-warm"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-spark-yellow">
                        <CategoryGlyph category={category.id} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold">
                          {category.title}
                        </span>
                        <span className="block text-[10.5px] text-ink-muted">
                          {tools.filter((tool) => tool.category === category.id).length} tools
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-ink-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:text-spark-dark" />
                    </Link>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <HardwareShowcase />

      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 dark-circuit opacity-90" />
        <Image
          src={assets.images.labsCampus}
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover opacity-[0.07]"
        />
        <div className="container-wide relative section-pad">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow text-spark-light/80">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark-yellow" />
                Exploded view experience
              </p>
              <h2 className="text-display-2 mt-4 text-balance">
                Take the campus{" "}
                <span className="text-spark-yellow">apart.</span>
              </h2>
              <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/55">
                The Nano Playground campus is not a background image. Every
                station is a real 3D object. Assemble the labs, explode them
                into their components and rebuild the environment.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/explore" className={buttonClass("primary")}>
                  <Boxes className="h-4 w-4" /> Open the campus
                </Link>
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Launch a lab <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-4 text-[11px] text-white/35">
                Use Explode, Assemble, Reset, Rotate and Zoom inside the campus controls.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Boxes,
                  title: "Assembled",
                  body: "Seven labs connected by illuminated golden pathways.",
                  active: true,
                },
                {
                  icon: PackageOpen,
                  title: "Exploded",
                  body: "Platforms separate, components float and the camera reframes.",
                },
                {
                  icon: CircuitBoard,
                  title: "Reassembled",
                  body: "Reset to the full campus and enter any station.",
                },
              ].map((item, index) => (
                <Reveal
                  key={item.title}
                  delay={index * 0.1}
                  className="h-full"
                >
                  <div
                    className={cn(
                      "flex h-full flex-col rounded-2xl border p-4",
                      item.active
                        ? "border-spark-yellow/40 bg-spark-yellow/[0.08]"
                        : "border-white/10 bg-white/[0.03]",
                    )}
                  >
                    <item.icon className="h-5 w-5 text-spark-yellow" />
                    <p className="mt-3 font-display text-sm font-semibold">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/45">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <Reveal>
              <div className="relative overflow-hidden rounded-[28px] border border-ink/10">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={assets.images.toolsLearning}
                    alt="Nano Spark students working with physical tools and technology in their hands"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-5">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                    <Wrench className="h-3 w-3" /> In students&apos; hands
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <SectionHeading
                eyebrow="The learning journey"
                title={
                  <>
                    The Toolbox{" "}
                    <span className="text-spark-dark">Students Learn With</span>
                  </>
                }
                description="From Scratch for absolute beginners to Python and VS Code for advanced AI projects — every tool has a place in the journey."
                action={
                  <Link href="/learn" className={buttonClass("outline")}>
                    See the full journey <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />
            </Reveal>
          </div>

          <div className="mt-12">
            <LearningPathway compact />
          </div>
        </div>
      </section>

      <section className="bg-warm section-pad">
        <div className="container-wide">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <Reveal className="lg:col-span-7">
              <div className="relative h-full min-h-[340px] overflow-hidden rounded-[28px] border border-ink/10">
                <Image
                  src={assets.images.students}
                  alt="Nano Spark students learning and building technology together"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-spark-yellow px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-ink">
                    <GraduationCap className="h-3.5 w-3.5" /> Student environment
                  </span>
                  <p className="mt-3 max-w-md font-display text-xl font-semibold text-white sm:text-2xl">
                    Ideas become hardware, firmware and real systems.
                  </p>
                </div>
              </div>
            </Reveal>
            <div className="grid gap-6 lg:col-span-5">
              <Reveal delay={0.08}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-ink/10">
                  <Image
                    src={assets.images.classroom}
                    alt="A Nano Spark classroom teaching session with students and technology"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                    Workshops &amp; classes
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-ink/10">
                  <Image
                    src={assets.images.droneLab}
                    alt="Students working with drones and robotics in the Nano Spark lab"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                    Robotics experiments
                  </span>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <Reveal>
              <SectionHeading
                eyebrow="Student & learning environment"
                title={
                  <>
                    Learn. Build. Innovate.{" "}
                    <span className="text-spark-dark">Together.</span>
                  </>
                }
                description="An ecosystem where students turn ideas into real technology projects through hands-on learning, experimentation and collaboration."
                action={
                  <Link href="/community" className={buttonClass("dark")}>
                    Meet the community <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-2">
                {studentFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 rounded-xl border border-ink/[0.07] bg-white px-3 py-2.5 text-[11.5px] text-ink-muted"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-spark-dark" />
                    {feature}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Student project studio"
            title={
              <>
                Built by students.{" "}
                <span className="text-spark-dark">Tested in the real world.</span>
              </>
            }
            description="Rovers, IoT stations, vision robots and drones — explore the kinds of systems students build across the Nano Playground labs."
            action={
              <Link href="/projects" className={buttonClass("outline")}>
                View all projects <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {projectIdeas.slice(0, 3).map((project, index) => (
              <Reveal key={project.title} delay={index * 0.08}>
                <Link
                  href="/projects"
                  className="group block overflow-hidden rounded-3xl border border-ink/[0.08] bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card"
                >
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur">
                      Student build
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-semibold">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-ink-muted">
                      {project.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-warm px-2.5 py-1 text-[9.5px] text-ink-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-spark-yellow">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
        <div className="container-wide relative flex flex-col items-start justify-between gap-8 py-14 lg:flex-row lg:items-center lg:py-20">
          <div className="flex items-start gap-5">
            <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card sm:block">
              <Image
                src={assets.branding.mark}
                alt="Nano Spark logo"
                fill
                sizes="80px"
                className="object-contain p-1.5"
              />
            </div>
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-spark-light">
                <Lightbulb className="h-3 w-3" /> Small Ideas. Big Impact.
              </p>
              <h2 className="text-display-2 mt-4 max-w-xl text-balance font-display font-extrabold">
                Ready to build something that matters?
              </h2>
              <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-ink/70">
                Seven labs, sixteen tools and one campus. Pick a station and
                start experimenting — or sign in to save your progress.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/playground" className={buttonClass("dark", "lg")}>
              <Play className="h-4 w-4 fill-current" /> Start learning
            </Link>
            <Link href="/auth" className={buttonClass("outline", "lg")}>
              Create account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
