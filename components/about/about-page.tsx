"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AboutHero } from "@/components/about/hero";
import { FounderSection } from "@/components/about/founder-section";
import { VisionSection } from "@/components/about/vision-section";
import { ConnectedSteps } from "@/components/about/connected-steps";
import { StoryStats } from "@/components/about/story-stats";
import { MissionValues } from "@/components/about/value-card";
import { WhatWeDoGrid } from "@/components/about/what-we-do-grid";
import { TechStackMarquee } from "@/components/about/tech-stack-marquee";
import { GoldCTA } from "@/components/about/gold-cta";

export function AboutPage() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <AboutHero />
      <FounderSection />
      <VisionSection />
      <ConnectedSteps />
      <StoryStats />
      <MissionValues />
      <WhatWeDoGrid />
      <TechStackMarquee />
      <GoldCTA />
    </motion.div>
  );
}
