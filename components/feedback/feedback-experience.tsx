"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FeedbackHero } from "@/components/feedback/feedback-hero";
import { FeedbackMarquee } from "@/components/feedback/feedback-marquee";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { FeedbackSectionHeading } from "@/components/feedback/feedback-section-heading";
import { TestimonialGrid } from "@/components/feedback/testimonial-grid";

export function FeedbackExperience() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <FeedbackHero />

      <FeedbackMarquee />

      <section className="bg-[#F7F7F5] py-20">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-8">
          <FeedbackForm />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          <FeedbackSectionHeading
            eyebrow="What people say"
            title={
              <>
                Voices from our{" "}
                <span className="text-spark-dark">community</span>
              </>
            }
            description="Real feedback from the students, teachers and parents who build with Nano Spark — in classrooms, clubs and weekend workshops."
          />
          <TestimonialGrid />
        </div>
      </section>
    </motion.div>
  );
}
