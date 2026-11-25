export type LabHotspotConfig = {
  id: string;
  label: string;
  detail: string;
  position: [number, number, number];
};

export type LabModelConfig = {
  id: string;
  modelPath: string;
  placeholder: boolean;
  accent: string;
  rotation: [number, number, number];
  idleRotation: number;
  hoverRotation: number;
  hoverScale: number;
  previewCamera: { position: [number, number, number]; fov: number };
  viewerCamera: { position: [number, number, number]; fov: number };
  hotspots: LabHotspotConfig[];
};

const cameraPreview: LabModelConfig["previewCamera"] = {
  position: [2.45, 1.85, 2.95],
  fov: 34,
};

const cameraViewer: LabModelConfig["viewerCamera"] = {
  position: [2.85, 2.05, 3.45],
  fov: 36,
};

export const labModelConfigs: Record<string, LabModelConfig> = {
  "arduino-lab": {
    id: "arduino-lab",
    modelPath: "/models/arduino/arduino-uno.glb",
    placeholder: true,
    accent: "#FFC107",
    rotation: [0.06, 0.22, 0],
    idleRotation: 0.16,
    hoverRotation: 0.55,
    hoverScale: 1.25,
    previewCamera: cameraPreview,
    viewerCamera: cameraViewer,
    hotspots: [
      {
        id: "atmega",
        label: "ATmega328P",
        detail:
          "The 8-bit AVR microcontroller at the heart of the UNO — 32 KB flash, 2 KB SRAM and 23 programmable I/O lines.",
        position: [0.64, 0.3, 0.05],
      },
      {
        id: "usb",
        label: "USB-B connector",
        detail:
          "USB Type-B port used for programming and serial communication with the board.",
        position: [0.78, 0.28, -0.2],
      },
      {
        id: "headers",
        label: "Digital & analog headers",
        detail:
          "14 digital pins (6 with PWM) and 6 analog inputs break out the microcontroller to sensors and actuators.",
        position: [0.12, 0.32, -0.4],
      },
      {
        id: "power",
        label: "Power jack",
        detail:
          "Barrel jack for 7–12 V external power, with onboard regulation to 5 V and 3.3 V rails.",
        position: [0.28, 0.32, 0.28],
      },
    ],
  },
  "esp32-lab": {
    id: "esp32-lab",
    modelPath: "/models/esp32/esp32-devkit.glb",
    placeholder: true,
    accent: "#FFD54F",
    rotation: [0.04, -0.2, 0],
    idleRotation: 0.14,
    hoverRotation: 0.5,
    hoverScale: 1.25,
    previewCamera: cameraPreview,
    viewerCamera: cameraViewer,
    hotspots: [
      {
        id: "module",
        label: "ESP32 module",
        detail:
          "Dual-core 240 MHz Xtensa module with integrated 2.4 GHz Wi-Fi and Bluetooth radio behind a metal shield.",
        position: [-0.12, 0.3, 0.02],
      },
      {
        id: "headers",
        label: "GPIO headers",
        detail:
          "Two rows of breakout pins expose ADC, DAC, touch, SPI, I2C, UART and PWM peripherals.",
        position: [0.64, 0.3, 0],
      },
      {
        id: "usb",
        label: "USB bridge",
        detail:
          "USB-to-serial bridge for flashing firmware and reading the serial monitor.",
        position: [0, 0.12, 0.35],
      },
      {
        id: "buttons",
        label: "BOOT & EN buttons",
        detail:
          "EN resets the chip; BOOT selects the download mode for flashing new firmware.",
        position: [-0.45, 0.28, 0.22],
      },
    ],
  },
  "protocol-explorer": {
    id: "protocol-explorer",
    modelPath: "/models/protocol/network-globe.glb",
    placeholder: true,
    accent: "#FFB900",
    rotation: [0.02, 0.1, 0],
    idleRotation: 0.12,
    hoverRotation: 0.42,
    hoverScale: 1.25,
    previewCamera: cameraPreview,
    viewerCamera: cameraViewer,
    hotspots: [
      {
        id: "globe",
        label: "Global network",
        detail:
          "Nodes distributed around a stylised Earth represent clients, servers and routers exchanging packets.",
        position: [0, 0.62, 0.18],
      },
      {
        id: "router",
        label: "Edge router",
        detail:
          "Routes packets between networks and chooses the best next hop across the topology.",
        position: [-0.62, 0.22, 0.1],
      },
      {
        id: "server",
        label: "Server stack",
        detail:
          "Rack of servers responding to requests, completing TCP handshakes and returning HTTP responses.",
        position: [-0.22, 0.42, -0.32],
      },
      {
        id: "packets",
        label: "Data packets",
        detail:
          "Animated packets travel along the golden links to visualise request/response flows.",
        position: [0.55, 0.5, 0.1],
      },
    ],
  },
  "electronics-101": {
    id: "electronics-101",
    modelPath: "/models/electronics/breadboard.glb",
    placeholder: true,
    accent: "#FFC107",
    rotation: [0.05, -0.15, 0],
    idleRotation: 0.15,
    hoverRotation: 0.48,
    hoverScale: 1.25,
    previewCamera: cameraPreview,
    viewerCamera: cameraViewer,
    hotspots: [
      {
        id: "breadboard",
        label: "Breadboard",
        detail:
          "Solderless prototyping board with power rails and connected terminal rows for building circuits.",
        position: [0, 0.3, 0],
      },
      {
        id: "leds",
        label: "LEDs",
        detail:
          "Light-emitting diodes with current-limiting resistors, demonstrating polarity and voltage drop.",
        position: [-0.62, 0.36, 0.2],
      },
      {
        id: "resistors",
        label: "Resistors",
        detail:
          "Fixed resistors set current and form voltage dividers — the foundation of Ohm's law experiments.",
        position: [-0.4, 0.32, -0.15],
      },
      {
        id: "pot",
        label: "Potentiometer",
        detail:
          "A variable resistor used as an adjustable voltage divider for dimming LEDs and reading analog input.",
        position: [0.5, 0.36, -0.12],
      },
    ],
  },
  "roverkit-lab": {
    id: "roverkit-lab",
    modelPath: "/models/rover/smart-rover.glb",
    placeholder: true,
    accent: "#FFD54F",
    rotation: [0.05, 0.35, 0],
    idleRotation: 0.18,
    hoverRotation: 0.6,
    hoverScale: 1.25,
    previewCamera: cameraPreview,
    viewerCamera: cameraViewer,
    hotspots: [
      {
        id: "ultrasonic",
        label: "Ultrasonic sensor",
        detail:
          "Measures distance by timing sound pulses — the rover uses it to detect and avoid obstacles.",
        position: [0.55, 0.5, 0],
      },
      {
        id: "controller",
        label: "Controller board",
        detail:
          "Runs the control logic, reads sensors and drives the motors through the motor driver.",
        position: [-0.04, 0.68, 0],
      },
      {
        id: "driver",
        label: "Motor driver",
        detail:
          "H-bridge motor driver that supplies the current needed to spin the four geared wheels.",
        position: [0.42, 0.5, 0],
      },
      {
        id: "wheels",
        label: "Drive wheels",
        detail:
          "Four yellow wheels with black tyres and geared motors for differential steering.",
        position: [0.4, 0.32, 0.4],
      },
    ],
  },
  "vehicle-explorer": {
    id: "vehicle-explorer",
    modelPath: "/models/vehicle/six-wheel-rover.glb",
    placeholder: true,
    accent: "#FFB900",
    rotation: [0.04, 0.4, 0],
    idleRotation: 0.16,
    hoverRotation: 0.52,
    hoverScale: 1.25,
    previewCamera: cameraPreview,
    viewerCamera: cameraViewer,
    hotspots: [
      {
        id: "camera",
        label: "Camera mast",
        detail:
          "Elevated camera module for navigation, mapping and remote inspection of the environment.",
        position: [-0.2, 0.98, 0],
      },
      {
        id: "drivetrain",
        label: "Six-wheel drivetrain",
        detail:
          "Six independently mounted wheels improve traction and stability over uneven terrain.",
        position: [0.45, 0.33, 0.45],
      },
      {
        id: "suspension",
        label: "Suspension",
        detail:
          "Mechanical suspension keeps all wheels in contact with the ground while absorbing shocks.",
        position: [-0.45, 0.33, -0.42],
      },
      {
        id: "chassis",
        label: "Chassis & electronics",
        detail:
          "Rigid chassis houses the battery, controllers and motor assemblies for the exploration platform.",
        position: [0, 0.62, 0],
      },
    ],
  },
  "robotics-lab": {
    id: "robotics-lab",
    modelPath: "/models/robotics/raspberry-pi-robot.glb",
    placeholder: true,
    accent: "#FFC107",
    rotation: [0.05, -0.25, 0],
    idleRotation: 0.15,
    hoverRotation: 0.5,
    hoverScale: 1.25,
    previewCamera: cameraPreview,
    viewerCamera: cameraViewer,
    hotspots: [
      {
        id: "pi",
        label: "Raspberry Pi",
        detail:
          "Single-board computer running the vision and control software on Linux.",
        position: [0, 0.22, 0],
      },
      {
        id: "camera",
        label: "Camera module",
        detail:
          "CSI camera stream feeds frames to computer-vision models for detection and tracking.",
        position: [0.2, 0.76, 0.18],
      },
      {
        id: "gpio",
        label: "GPIO & sensors",
        detail:
          "GPIO pins connect sensors and drivers, turning software decisions into physical actions.",
        position: [0.15, 0.26, 0.36],
      },
      {
        id: "vision",
        label: "Vision field",
        detail:
          "The scanning cone visualises the camera's field of view during AI inspection tasks.",
        position: [0.9, 0.62, 0.18],
      },
    ],
  },
};

export function getLabModelConfig(id: string): LabModelConfig {
  return labModelConfigs[id] ?? labModelConfigs["arduino-lab"];
}
