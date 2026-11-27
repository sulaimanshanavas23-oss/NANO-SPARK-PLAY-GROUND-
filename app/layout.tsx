import type { Metadata, Viewport } from "next";
import { Baloo_2, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/shared/footer";
import { BackToTop } from "@/components/shared/back-to-top";
import { GlobalTextReveal } from "@/components/shared/global-text-reveal";
import { assets } from "@/src/lib/assets";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nanoplayground.vercel.app",
  ),
  title: {
    default: "Nano Playground — Learn. Build. Innovate. | Nano Spark",
    template: "%s | Nano Playground",
  },
  description:
    "Nano Playground by Nano Spark: seven interactive technology labs, a 3D campus, a tools and platforms showroom, real student projects and a hands-on learning ecosystem.",
  keywords: [
    "Nano Spark",
    "Nano Playground",
    "Arduino",
    "ESP32",
    "electronics",
    "robotics",
    "IoT",
    "STEM education",
    "interactive learning",
  ],
  authors: [{ name: "Nano Spark" }],
  icons: {
    icon: assets.branding.favicon,
    apple: assets.branding.favicon,
  },
  openGraph: {
    title: "Nano Playground — Small Ideas. Big Impact.",
    description:
      "One platform. Seven interactive labs. Endless learning. Explore the Nano Spark 3D technology campus.",
    type: "website",
    images: [{ url: assets.images.labsCampus, width: 1256, height: 1256 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nano Playground — Nano Spark",
    description:
      "Learn. Build. Experiment. Debug. Innovate. Solve. Seven interactive labs in one 3D campus.",
    images: [assets.images.labsCampus],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFC107",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${baloo.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
          strategy="afterInteractive"
        />
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <BackToTop />
          <GlobalTextReveal />
        </Providers>
      </body>
    </html>
  );
}
