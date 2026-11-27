"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/src/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "The mentors made electronics feel approachable. My students built real circuits on day one instead of just copying notes.",
    name: "Priya Raman",
    role: "Science Teacher · Chennai",
    rating: 5,
  },
  {
    quote:
      "I came in curious and left with a working obstacle-avoiding rover. Best weekend I have spent learning.",
    name: "Arjun K.",
    role: "Student · Age 14",
    rating: 5,
  },
  {
    quote:
      "Well organized, genuinely hands-on and the kids were engaged the whole time. We will absolutely be back.",
    name: "Meena S.",
    role: "Parent · Chennai",
    rating: 4,
  },
  {
    quote:
      "The IoT bootcamp connected the dots between sensors, code and the cloud. Finally something that made sense.",
    name: "Sneha P.",
    role: "Student · Age 16",
    rating: 5,
  },
  {
    quote:
      "Clear curriculum, reliable kits and patient instructors. It raised the bar for our STEM lab program.",
    name: "Vikram N.",
    role: "School Coordinator",
    rating: 5,
  },
  {
    quote:
      "My son now explains breadboards to me at dinner. That is the kind of spark we were hoping for.",
    name: "Ravi M.",
    role: "Parent · Chennai",
    rating: 5,
  },
];

export function TestimonialGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <motion.figure
          key={testimonial.name}
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{
            duration: 0.6,
            delay: index * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={reduceMotion ? undefined : { y: -6 }}
          className="flex h-full flex-col rounded-3xl border border-ink/10 bg-[#F7F7F5] p-6 shadow-soft"
        >
          <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star < testimonial.rating
                    ? "fill-spark-yellow text-spark-yellow"
                    : "fill-transparent text-ink/15",
                )}
              />
            ))}
          </div>
          <blockquote className="mt-4 flex-1 text-[13px] italic leading-relaxed text-ink/75">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-5 border-t border-ink/10 pt-4">
            <p className="font-display text-[14px] font-bold text-ink">
              {testimonial.name}
            </p>
            <p className="text-[11px] text-ink/50">{testimonial.role}</p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
