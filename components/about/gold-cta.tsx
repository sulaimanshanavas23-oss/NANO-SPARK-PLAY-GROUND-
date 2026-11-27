"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

export function GoldCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <Reveal>
          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-4xl rounded-3xl px-6 py-12 text-center shadow-lift sm:px-8"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #F7B500 0%, #FFD54F 100%)",
            }}
          >
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Bring Nano Spark to your school
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/80">
              Set up a STEM lab, run robotics workshops, or join the Nano Spark
              Ambassador Program. Let&apos;s build something brilliant together.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="ns-btn ns-btn-dark w-full sm:w-auto">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="ns-btn ns-btn-outline w-full sm:w-auto"
              >
                Explore Careers
              </Link>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
