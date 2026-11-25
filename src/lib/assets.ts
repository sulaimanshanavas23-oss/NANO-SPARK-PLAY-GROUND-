export const assets = {
  branding: {
    logo: "/branding/nano-spark-logo.jpeg",
    logoAlt: "/branding/nano-spark-logo-alt.jpeg",
    mark: "/branding/nano-spark-mark.png",
    markAlt: "/branding/nano-spark-mark-alt.jpeg",
    favicon: "/branding/nano-spark-favicon.png",
    wordmarkWide: "/branding/nano-spark-logo-wide.png",
  },
  images: {
    brandSystem: "/images/brand-system.jpeg",
    toolsPlatforms: "/images/tools-platforms.png",
    toolsBox: "/images/tools-box.jpeg",
    toolsLearning: "/images/tools-learning.jpeg",
    classroom: "/images/classroom.jpeg",
    droneLab: "/images/drone-lab.jpeg",
    students: "/images/students.jpeg",
    labsCampus: "/images/labs-campus.png",
  },
} as const;

export type AssetInventoryItem = {
  file: string;
  original: string;
  usage: string[];
};

export const assetInventory: AssetInventoryItem[] = [
  {
    file: assets.branding.logo,
    original: "BIG LOGO.jpeg",
    usage: ["Brand story", "About page", "Footer lockup", "Auth artwork"],
  },
  {
    file: assets.branding.mark,
    original: "extlogo.png",
    usage: ["Navigation bar", "Preloader", "3D station badges"],
  },
  {
    file: assets.branding.markAlt,
    original: "LOGO ONLY.jpeg",
    usage: ["Community page", "Project studio"],
  },
  {
    file: assets.branding.logoAlt,
    original: "logo.jpeg",
    usage: ["About page", "Footer"],
  },
  {
    file: assets.branding.favicon,
    original: "OVERLAY FAVICON.png",
    usage: ["Browser icon", "Social share image"],
  },
  {
    file: assets.images.labsCampus,
    original: "Nano Spark Interactive Learning Labs.png",
    usage: [
      "Homepage hero fallback",
      "Explore Labs hero",
      "WebGL fallback campus",
    ],
  },
  {
    file: assets.images.toolsPlatforms,
    original: "TOOLS AND PLATFORM SOF NS.png",
    usage: [
      "Tools & Platforms hero",
      "Technology Showroom editorial",
      "Homepage tools feature",
    ],
  },
  {
    file: assets.images.toolsBox,
    original: "TOOLS BOX OF NS.jpeg",
    usage: [
      "Showroom floor guide",
      "Tools & Platforms editorial banner",
      "Learning journey",
    ],
  },
  {
    file: assets.images.toolsLearning,
    original: "TOLLS THEY LERAN AS IN HAND.jpeg",
    usage: [
      "Learn page hero",
      "Learning journey section",
      "Homepage journey teaser",
    ],
  },
  {
    file: assets.images.students,
    original: "WhatsApp_Image_2026-08-22_at_7.43.05_202608242014.jpeg",
    usage: [
      "Student environment",
      "Community hero",
      "Auth visual",
      "Dashboard welcome",
    ],
  },
  {
    file: assets.images.classroom,
    original: "CLASS ROOM TEACHING.jpeg",
    usage: ["Learning environment", "Projects page", "About mission"],
  },
  {
    file: assets.images.droneLab,
    original: "DRONE VIEW IMAGE FOR STDUENTS.jpeg",
    usage: ["Projects page", "Robotics workshops", "Community"],
  },
  {
    file: assets.images.brandSystem,
    original: "BRAND ASSESTS COLOUR FONT THEME IN WEBISTE DESTAILS.jpeg",
    usage: [
      "About page design system",
      "Brand guidelines section",
      "Design language reference",
    ],
  },
];
