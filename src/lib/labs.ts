export type LabIcon =
  | "cpu"
  | "wifi"
  | "network"
  | "circuit"
  | "rover"
  | "truck"
  | "bot";

export type Lab = {
  id: string;
  number: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  longDescription: string;
  url: string;
  icon: LabIcon;
  skills: string[];
  embeddable: boolean;
  accent: string;
};

export const labs: Lab[] = [
  {
    id: "arduino-lab",
    number: "01",
    name: "Arduino Lab",
    shortName: "Arduino",
    tagline: "Learn, code & simulate",
    description:
      "Program the Arduino UNO, wire real components and watch your code light up the physical world.",
    longDescription:
      "Start with the Arduino UNO, master GPIO pins, blink your first LED and progress to sensors, motors and complete embedded systems. Every lesson pairs code with a real circuit.",
    url: "https://learn-arduino-red.vercel.app/",
    icon: "cpu",
    skills: ["C++ basics", "GPIO & PWM", "Sensors", "Serial monitor"],
    embeddable: true,
    accent: "#FFC107",
  },
  {
    id: "esp32-lab",
    number: "02",
    name: "ESP32 Lab",
    shortName: "ESP32",
    tagline: "IoT, Wi-Fi & Bluetooth",
    description:
      "Connect devices to the internet with Wi-Fi, Bluetooth and a full IoT toolchain on the ESP32.",
    longDescription:
      "Build connected products with the ESP32. Publish sensor data, control devices remotely, work with MQTT and explore dual-core wireless development for real IoT products.",
    url: "https://learn-esp32.vercel.app/",
    icon: "wifi",
    skills: ["Wi-Fi & BLE", "MQTT", "Cloud APIs", "Deep sleep"],
    embeddable: true,
    accent: "#FFD54F",
  },
  {
    id: "protocol-explorer",
    number: "03",
    name: "Protocol Explorer",
    shortName: "Protocols",
    tagline: "Explore internet & network protocols",
    description:
      "See how data actually travels. Trace packets across networks and understand the protocols behind the internet.",
    longDescription:
      "Visualise TCP, UDP, HTTP, DNS, MQTT and more. Follow packets between nodes, understand handshakes and build a mental model of how connected systems communicate.",
    url: "https://protocol-explorer-alpha.vercel.app/",
    icon: "network",
    skills: ["TCP / IP", "HTTP & DNS", "Packet flow", "Network models"],
    embeddable: false,
    accent: "#FFB900",
  },
  {
    id: "electronics-101",
    number: "04",
    name: "Electronics 101",
    shortName: "Electronics",
    tagline: "Components, circuits & concepts",
    description:
      "From breadboards to voltage dividers — build a fearless foundation in real electronics.",
    longDescription:
      "Learn components, symbols and circuit theory through hands-on breadboard experiments. Measure, test and debug real circuits before moving on to microcontrollers.",
    url: "https://electronics-101-six.vercel.app/",
    icon: "circuit",
    skills: ["Ohm's law", "Breadboarding", "Components", "Measurements"],
    embeddable: true,
    accent: "#FFC107",
  },
  {
    id: "roverkit-lab",
    number: "05",
    name: "RoverKit Lab",
    shortName: "RoverKit",
    tagline: "Build & simulate a smart rover",
    description:
      "Assemble a yellow-and-black smart rover, then teach it to sense, steer and avoid obstacles.",
    longDescription:
      "A complete robotics build: chassis, motor driver, ultrasonic sensing and control logic. Assemble the rover in 3D, then program autonomous behaviour.",
    url: "https://roverkit.vercel.app/",
    icon: "rover",
    skills: ["Motor control", "Ultrasonic sensing", "Autonomy", "Chassis design"],
    embeddable: true,
    accent: "#FFD54F",
  },
  {
    id: "vehicle-explorer",
    number: "06",
    name: "3D Vehicle Explorer",
    shortName: "Vehicle 3D",
    tagline: "Interactive models & system design",
    description:
      "Rotate, explode and inspect a six-wheel exploration vehicle down to its mechanical systems.",
    longDescription:
      "An interactive engineering model. Inspect suspension, drivetrain and sensor placement in 3D, then connect the mechanics to the control system that drives them.",
    url: "https://fable-rover.vercel.app/",
    icon: "truck",
    skills: ["Mechanical systems", "6-wheel drive", "3D inspection", "System design"],
    embeddable: true,
    accent: "#FFB900",
  },
  {
    id: "robotics-lab",
    number: "07",
    name: "Robotics Lab",
    shortName: "Robotics",
    tagline: "Raspberry Pi, AI & vision projects",
    description:
      "Combine a Raspberry Pi, camera and sensors to build vision-powered intelligent robots.",
    longDescription:
      "Explore computer vision and AI on real hardware. Stream camera frames, run detection models and turn sensor input into intelligent robotic behaviour.",
    url: "https://robotics-lab-app.vercel.app/",
    icon: "bot",
    skills: ["Raspberry Pi", "Computer vision", "AI models", "Sensor fusion"],
    embeddable: true,
    accent: "#FFC107",
  },
];

export const getLab = (id: string) => labs.find((lab) => lab.id === id);

export const labSlugFromNumber = (value: string | number) =>
  String(value).padStart(2, "0");
