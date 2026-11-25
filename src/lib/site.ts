export const navigation = [
  { label: "Home", href: "/" },
  { label: "Playground", href: "/playground" },
  { label: "Explore Labs", href: "/explore" },
  { label: "Tools & Platforms", href: "/tools" },
  { label: "Showroom", href: "/showroom" },
  { label: "Learn", href: "/learn" },
  { label: "Projects", href: "/projects" },
  { label: "Community", href: "/community" },
  { label: "Quiz Generator", href: "/quiz" },
  { label: "About", href: "/about" },
  { label: "Feedback", href: "/feedback" },
  { label: "Contact", href: "/contact" },
] as const;

export const site = {
  name: "Nano Playground",
  company: "Nano Spark",
  tagline: "Technology • Innovations • Solutions",
  message: "Small Ideas. Big Impact.",
  description:
    "One platform. Seven interactive labs. Endless learning. Explore electronics, microcontrollers, networking, robotics, AI and real-world technology experiments.",
  url: "https://nano-playground.vercel.app",
};

export const stats = [
  { value: "07", label: "Interactive labs" },
  { value: "16", label: "Tools & platforms" },
  { value: "03", label: "Learning stages" },
  { value: "∞", label: "Ideas to build" },
];

export const learningStages = [
  {
    stage: "Stage 01",
    title: "Beginner",
    subtitle: "Start with curiosity",
    description:
      "Get comfortable with blocks, safe circuits and the joy of making something respond.",
    tools: ["Scratch", "Tinkercad", "Basic electronics", "Arduino basics"],
    color: "#FFD54F",
  },
  {
    stage: "Stage 02",
    title: "Intermediate",
    subtitle: "Turn ideas into circuits",
    description:
      "Simulate before you solder, then upload real firmware to real boards.",
    tools: ["Tinkercad Circuits", "Wokwi", "Arduino IDE", "Sensors"],
    color: "#FFC107",
  },
  {
    stage: "Stage 03",
    title: "Advanced",
    subtitle: "Build connected systems",
    description:
      "Ship multi-file projects, connect devices to the cloud and add AI to your builds.",
    tools: ["VS Code", "Python", "ESP32", "IoT Platforms", "GitHub", "AI tools"],
    color: "#F7B500",
  },
];

export const projectIdeas = [
  {
    title: "Smart Rover",
    summary:
      "A four-wheel rover that senses obstacles, steers itself and reports telemetry to a dashboard.",
    tags: ["Arduino", "Ultrasonic", "Blynk"],
    lab: "roverkit-lab",
    image: "/images/labs-campus.png",
  },
  {
    title: "IoT Weather Station",
    summary:
      "ESP32 sensors streaming temperature, humidity and air quality to a live cloud dashboard.",
    tags: ["ESP32", "MQTT", "Wokwi"],
    lab: "esp32-lab",
    image: "/images/tools-platforms.png",
  },
  {
    title: "Vision Robot",
    summary:
      "A Raspberry Pi robot that detects objects with a camera and reacts in real time.",
    tags: ["Python", "OpenCV", "Raspberry Pi"],
    lab: "robotics-lab",
    image: "/images/students.jpeg",
  },
  {
    title: "Line Follower",
    summary:
      "A tuned electronics build that follows a track using infrared sensors and PID control.",
    tags: ["Electronics", "PID", "Motors"],
    lab: "electronics-101",
    image: "/images/classroom.jpeg",
  },
  {
    title: "Drone Mission Lab",
    summary:
      "Design, program and safely test a drone mission with sensors and ground-station feedback.",
    tags: ["Drone", "Sensors", "Telemetry"],
    lab: "robotics-lab",
    image: "/images/drone-lab.jpeg",
  },
  {
    title: "Exploded Vehicle Study",
    summary:
      "Inspect a six-wheel exploration vehicle system-by-system and model its drivetrain.",
    tags: ["3D", "Mechanical", "Systems"],
    lab: "vehicle-explorer",
    image: "/images/labs-campus.png",
  },
];

export const communityPillars = [
  {
    title: "Learn together",
    body: "Peer study groups, guided build sessions and a shared library of experiments.",
  },
  {
    title: "Build in public",
    body: "Show work-in-progress prototypes, document failures and celebrate the fixes.",
  },
  {
    title: "Mentor the next maker",
    body: "Advanced students coach beginners through their first circuit and first upload.",
  },
  {
    title: "Solve real problems",
    body: "Community challenges focus on classrooms, campuses and everyday life.",
  },
];

export const faqs = [
  {
    question: "What is Nano Playground?",
    answer:
      "Nano Playground is the interactive learning campus from Nano Spark. It brings seven hands-on technology labs, the tools students use and their projects into one connected platform.",
  },
  {
    question: "Do I need to own hardware to start?",
    answer:
      "No. Several labs begin with simulation tools like Tinkercad Circuits and Wokwi. When you are ready for hardware, the same concepts transfer directly to a real board.",
  },
  {
    question: "Do I have to follow the learning stages in order?",
    answer:
      "The stages are an illustrative pathway, not a gate. You can explore any lab or tool independently at any time — the progression simply helps you see how skills connect.",
  },
  {
    question: "Can I use the labs on a phone or tablet?",
    answer:
      "Yes. The campus and pages adapt to touch, and the Playground workspace always offers an external launch option when an embedded lab is restricted by its host.",
  },
  {
    question: "How do favorites and progress work?",
    answer:
      "Your account stores favorite labs and tools plus recent activity. The dashboard is built on a Supabase-ready data model, and a local demo session is available when cloud credentials are not configured.",
  },
];
