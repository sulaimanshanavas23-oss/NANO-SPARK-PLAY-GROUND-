"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { assets } from "@/src/lib/assets";

export function Preloader() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem("nano.preloader.seen") === "1";
    } catch {
      seen = false;
    }
    if (seen || reduceMotion) {
      try {
        window.sessionStorage.setItem("nano.preloader.seen", "1");
      } catch {
        /* ignore */
      }
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      try {
        window.sessionStorage.setItem("nano.preloader.seen", "1");
      } catch {
        /* ignore */
      }
    }, 1650);

    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-ink text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeInOut" } }}
          aria-hidden="true"
        >
          <div className="pointer-events-none absolute inset-0 dark-circuit opacity-80" />
          <motion.div
            className="absolute h-[320px] w-[320px] rounded-full border border-spark-yellow/25 sm:h-[420px] sm:w-[420px]"
            animate={{ scale: [0.82, 1.05, 0.82], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute h-[220px] w-[220px] rounded-full border border-spark-yellow/40 sm:h-[300px] sm:w-[300px]"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-spark-yellow shadow-glow" />
          </motion.div>

          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/15 bg-white shadow-glow sm:h-28 sm:w-28">
              <Image
                src={assets.branding.mark}
                alt=""
                fill
                sizes="112px"
                className="object-contain p-2"
                priority
              />
            </div>
            <div className="mt-7 flex overflow-hidden">
              {"NANO PLAYGROUND".split("").map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={{ y: 26, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.25 + index * 0.035,
                    duration: 0.45,
                    ease: "easeOut",
                  }}
                  className="font-display text-sm font-semibold tracking-[0.2em] text-white sm:text-base"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-3 text-[10px] uppercase tracking-[0.34em] text-white/45"
            >
              Technology · Innovations · Solutions
            </motion.p>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 h-[2px] w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-spark-yellow"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
