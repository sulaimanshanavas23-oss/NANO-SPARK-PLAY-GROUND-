export type ToolCategoryId = "development" | "simulation" | "hardware" | "ai";

export type ToolCategory = {
  id: ToolCategoryId;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
};

export const toolCategories: ToolCategory[] = [
  {
    id: "development",
    number: "01",
    title: "Programming & Development",
    shortTitle: "Development",
    description:
      "Write, test and ship code with the same editors and platforms used by professional engineers.",
  },
  {
    id: "simulation",
    number: "02",
    title: "Simulation & Design",
    shortTitle: "Simulation",
    description:
      "Prototype circuits and 3D models in the browser before a single component is wired.",
  },
  {
    id: "hardware",
    number: "03",
    title: "Hardware & IoT",
    shortTitle: "Hardware & IoT",
    description:
      "Connect development boards, sensors and cloud dashboards into working IoT systems.",
  },
  {
    id: "ai",
    number: "04",
    title: "AI & Productivity",
    shortTitle: "AI",
    description:
      "Use modern AI assistants and machine-learning tools to research, debug and build faster.",
  },
];

export type Tool = {
  id: string;
  name: string;
  category: ToolCategoryId;
  domain: string;
  description: string;
  learning: string;
  url?: string;
  monogram: string;
  color: string;
  model: "laptop" | "board" | "breadboard" | "cloud" | "ai" | "rover";
  relatedLab?: string;
  featured?: boolean;
};

export const tools: Tool[] = [
  {
    id: "arduino-ide",
    name: "Arduino IDE",
    category: "development",
    domain: "Embedded development",
    description:
      "The classic editor for writing, compiling and uploading sketches to Arduino boards.",
    learning: "Write structured C++ sketches and upload them to real hardware.",
    url: "https://www.arduino.cc/en/software",
    monogram: "AR",
    color: "#00979D",
    model: "laptop",
    relatedLab: "arduino-lab",
    featured: true,
  },
  {
    id: "vs-code",
    name: "Visual Studio Code",
    category: "development",
    domain: "Programming & development",
    description:
      "A fast, extensible editor with rich support for C++, Python, PlatformIO and Git.",
    learning: "Build multi-file projects with debugging, extensions and source control.",
    url: "https://code.visualstudio.com/",
    monogram: "VS",
    color: "#007ACC",
    model: "laptop",
    featured: true,
  },
  {
    id: "python",
    name: "Python",
    category: "development",
    domain: "Data analysis & AI",
    description:
      "A readable language with a deep ecosystem for automation, data science and AI.",
    learning: "Script sensor data, analyse experiments and prototype intelligent systems.",
    url: "https://www.python.org/",
    monogram: "PY",
    color: "#3776AB",
    model: "laptop",
    featured: true,
  },
  {
    id: "github",
    name: "GitHub",
    category: "development",
    domain: "Project hosting & collaboration",
    description:
      "Host code, track versions and collaborate on projects with branches and pull requests.",
    learning: "Version your prototypes and collaborate like a professional team.",
    url: "https://github.com/",
    monogram: "GH",
    color: "#111111",
    model: "laptop",
  },
  {
    id: "tinkercad",
    name: "Tinkercad",
    category: "simulation",
    domain: "3D design & prototyping",
    description:
      "Browser-based 3D modelling for beginners — design enclosures and printable parts.",
    learning: "Turn an idea into a measurable 3D model ready for fabrication.",
    url: "https://www.tinkercad.com/",
    monogram: "TC",
    color: "#F15A24",
    model: "laptop",
    featured: true,
  },
  {
    id: "tinkercad-circuits",
    name: "Tinkercad Circuits",
    category: "simulation",
    domain: "Electronics & circuit simulation",
    description:
      "Simulate Arduino boards, breadboards and components safely in the browser.",
    learning: "Test circuit logic and debug wiring before touching real hardware.",
    url: "https://www.tinkercad.com/circuits",
    monogram: "TC",
    color: "#E94E1B",
    model: "breadboard",
    relatedLab: "electronics-101",
  },
  {
    id: "wokwi",
    name: "Wokwi",
    category: "simulation",
    domain: "Arduino & ESP32 simulation",
    description:
      "High-fidelity online simulation for Arduino, ESP32 and embedded peripherals.",
    learning: "Prototype IoT firmware with virtual sensors, displays and Wi-Fi.",
    url: "https://wokwi.com/",
    monogram: "WK",
    color: "#7C3AED",
    model: "board",
    relatedLab: "esp32-lab",
    featured: true,
  },
  {
    id: "scratch",
    name: "Scratch",
    category: "simulation",
    domain: "Beginner block programming",
    description:
      "Drag-and-drop blocks that introduce logic, events and loops without syntax.",
    learning: "Learn sequencing, conditionals and loops through interactive stories.",
    url: "https://scratch.mit.edu/",
    monogram: "SC",
    color: "#F7A500",
    model: "laptop",
  },
  {
    id: "seeed-studio",
    name: "Seeed Studio",
    category: "hardware",
    domain: "Hardware & IoT development",
    description:
      "Sensors, modules and development kits for building real connected devices.",
    learning: "Select the right sensor and integrate it into a working prototype.",
    url: "https://www.seeedstudio.com/",
    monogram: "SS",
    color: "#3B9F4A",
    model: "board",
  },
  {
    id: "blynk",
    name: "Blynk",
    category: "hardware",
    domain: "IoT dashboard & device management",
    description:
      "Build mobile dashboards to monitor sensors and control devices over the internet.",
    learning: "Design a cloud dashboard and connect it to live hardware.",
    url: "https://blynk.io/",
    monogram: "BL",
    color: "#25D366",
    model: "cloud",
    relatedLab: "esp32-lab",
  },
  {
    id: "iot-platforms",
    name: "IoT Platforms",
    category: "hardware",
    domain: "Cloud integration (MQTT, APIs)",
    description:
      "MQTT brokers, REST APIs and cloud services that tie devices into systems.",
    learning: "Publish telemetry, subscribe to commands and integrate cloud services.",
    monogram: "IoT",
    color: "#2F80ED",
    model: "cloud",
  },
  {
    id: "arduino-hardware",
    name: "Arduino Hardware",
    category: "hardware",
    domain: "Microcontroller development",
    description:
      "UNO, Nano and compatible boards — the physical heart of thousands of projects.",
    learning: "Wire input and output devices safely to a real microcontroller.",
    url: "https://www.arduino.cc/",
    monogram: "AR",
    color: "#00979D",
    model: "board",
    relatedLab: "arduino-lab",
  },
  {
    id: "esp32-hardware",
    name: "ESP32 Hardware",
    category: "hardware",
    domain: "Embedded & wireless development",
    description:
      "Dual-core Wi-Fi and Bluetooth microcontrollers for connected products.",
    learning: "Build wireless devices with real-time cloud connectivity.",
    url: "https://www.espressif.com/",
    monogram: "32",
    color: "#E7352C",
    model: "board",
    relatedLab: "esp32-lab",
  },
  {
    id: "claude-ai",
    name: "Claude AI (LLMs)",
    category: "ai",
    domain: "Idea generation & debugging",
    description:
      "A large-language-model assistant for research, explanation and pair debugging.",
    learning: "Interrogate code, generate ideas and reason through engineering problems.",
    url: "https://claude.ai/",
    monogram: "AI",
    color: "#D97757",
    model: "ai",
    featured: true,
  },
  {
    id: "python-ai",
    name: "Python AI Tools",
    category: "ai",
    domain: "Machine learning & data science",
    description:
      "NumPy, pandas, scikit-learn, OpenCV and the wider Python AI stack.",
    learning: "Train small models, analyse sensor datasets and add computer vision.",
    url: "https://www.python.org/",
    monogram: "ML",
    color: "#FFD43B",
    model: "ai",
    relatedLab: "robotics-lab",
  },
  {
    id: "ai-dev-environments",
    name: "AI Development Environments",
    category: "ai",
    domain: "Intelligent applications",
    description:
      "Notebooks and AI-assisted editors for building and evaluating intelligent apps.",
    learning: "Prototype an AI feature, evaluate it and integrate it into a product.",
    monogram: "DV",
    color: "#7C3AED",
    model: "laptop",
  },
];

export const toolsByCategory = toolCategories.map((category) => ({
  ...category,
  tools: tools.filter((tool) => tool.category === category.id),
}));

export const getTool = (id: string) => tools.find((tool) => tool.id === id);
