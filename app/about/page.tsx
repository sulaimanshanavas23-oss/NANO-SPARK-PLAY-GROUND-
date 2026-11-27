import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nano Spark is a technology and STEM innovation startup from Chennai, making hands-on tech education real for students and schools. Meet founder S. Shanavas and the vision behind Nano Spark.",
};

export default function AboutRoute() {
  return <AboutPage />;
}
