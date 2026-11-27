import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const models = [
  {
    title: "ESP32 Dev Board (38 pins)",
    src: "/models/esp32-dev-board-38-pins.glb",
  },
  {
    title: "Arduino UNO-style Development Board",
    src: "/models/68-6-x-53-3-mm-uno-style-development-board.glb",
  },
] as const;

export function HardwareShowcase() {
  return (
    <section id="hardware-models" className="section-pad bg-white">
      <div className="container-wide">
        <SectionHeading
          eyebrow="3D models"
          title={
            <>
              3D <span className="text-spark-dark">Models</span>
            </>
          }
          description="Explore the ESP32 and Arduino UNO-style development boards in an interactive 3D viewer."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {models.map((model, index) => (
            <Reveal key={model.src} delay={index * 0.08} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-[0_1px_0_rgba(17,17,17,0.03)]">
                <div className="relative bg-gradient-to-br from-[#fcfaf4] via-[#f7f2e4] to-[#f0e2b4]">
                  <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
                  <model-viewer
                    src={model.src}
                    alt={model.title}
                    camera-controls
                    auto-rotate
                    shadow-intensity="1"
                    loading="lazy"
                    style={{ width: "100%", height: "320px" }}
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {model.title}
                  </h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
