import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "400px",
        "3xl": "1920px",
        tv: "2560px",
      },
      colors: {
        spark: {
          yellow: "#FFC107",
          light: "#FFD54F",
          dark: "#F7B500",
          gold: "#FFB900",
        },
        ink: {
          DEFAULT: "#111111",
          soft: "#1A1A1A",
          muted: "#5B5B57",
        },
        warm: "#F7F7F5",
        whatsapp: "#25D366",
      },
      fontFamily: {
        display: ["var(--font-baloo)", "Baloo 2", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,193,7,0.35)",
        "glow-sm": "0 0 18px rgba(255,193,7,0.28)",
        soft: "0 4px 20px rgba(17,17,17,0.08)",
        lift: "0 12px 32px rgba(17,17,17,0.16)",
        card: "0 18px 60px -20px rgba(17,17,17,0.22)",
        nav: "0 10px 40px -18px rgba(17,17,17,0.18)",
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, rgba(17,17,17,0.10) 1px, transparent 1px)",
        "dot-grid-fine":
          "radial-gradient(circle, rgba(17,17,17,0.10) 1px, transparent 1px)",
        "spark-gradient":
          "linear-gradient(135deg, #FFD54F 0%, #FFC107 45%, #F7B500 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #F7B500 0%, #FFD54F 100%)",
      },
      backgroundSize: {
        "dot-26": "26px 26px",
      },
      animation: {
        "pulse-glow": "pulseGlow 2.8s ease-in-out infinite",
        marquee: "marquee 34s linear infinite",
        "marquee-38": "marquee 38s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
