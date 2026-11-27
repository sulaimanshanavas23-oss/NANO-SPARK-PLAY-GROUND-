export type BoardSpec = {
  id: string;
  name: string;
  cpu: string;
  clock: string;
  memory: string;
  logic: string;
  connectivity: string;
  os: string;
  bestFor: string;
  pickWhen: string;
};

export const boardComparison: BoardSpec[] = [
  {
    id: "arduino-uno",
    name: "Arduino UNO",
    cpu: "ATmega328P",
    clock: "16 MHz",
    memory: "32 KB flash / 2 KB SRAM",
    logic: "5 V",
    connectivity: "USB serial, shields",
    os: "Bare metal / Arduino",
    bestFor: "Learning GPIO, sensors and real-time control",
    pickWhen: "You need a rugged 5 V board and simple sketches.",
  },
  {
    id: "esp32",
    name: "ESP32",
    cpu: "Dual-core Xtensa LX6",
    clock: "240 MHz",
    memory: "4 MB flash / 520 KB SRAM",
    logic: "3.3 V",
    connectivity: "Wi-Fi, Bluetooth Classic + BLE",
    os: "FreeRTOS / Arduino / ESP-IDF",
    bestFor: "Connected IoT products and wireless sensors",
    pickWhen: "You need Wi-Fi, BLE and plenty of GPIO.",
  },
  {
    id: "stm32",
    name: "STM32",
    cpu: "ARM Cortex-M",
    clock: "Up to 480 MHz",
    memory: "Flash + SRAM varies by family",
    logic: "3.3 V",
    connectivity: "USB, CAN, SPI, I2C, UART",
    os: "Bare metal / FreeRTOS",
    bestFor: "Deterministic embedded control",
    pickWhen: "You need real-time performance and low power.",
  },
  {
    id: "raspberry-pi-4",
    name: "Raspberry Pi 4",
    cpu: "Quad-core Cortex-A72",
    clock: "1.5 GHz",
    memory: "2/4/8 GB RAM",
    logic: "3.3 V GPIO",
    connectivity: "Gigabit Ethernet, Wi-Fi, Bluetooth, USB",
    os: "Linux",
    bestFor: "Vision, AI and networked robotics",
    pickWhen: "You need a full OS and camera processing.",
  },
  {
    id: "raspberry-pi-5",
    name: "Raspberry Pi 5",
    cpu: "Quad-core Cortex-A76",
    clock: "2.4 GHz",
    memory: "4/8 GB RAM",
    logic: "3.3 V GPIO",
    connectivity: "Gigabit Ethernet, Wi-Fi, Bluetooth, USB 3.0",
    os: "Linux",
    bestFor: "Faster vision and heavier AI workloads",
    pickWhen: "You need more CPU and I/O than a Pi 4.",
  },
  {
    id: "pico",
    name: "Raspberry Pi Pico",
    cpu: "Dual-core Cortex-M0+",
    clock: "133 MHz",
    memory: "2 MB flash / 264 KB SRAM",
    logic: "3.3 V",
    connectivity: "USB, PIO, SPI, I2C, UART",
    os: "Bare metal / MicroPython / Arduino",
    bestFor: "Low-cost real-time I/O and PIO",
    pickWhen: "You need deterministic timing on a tiny board.",
  },
  {
    id: "esp8266",
    name: "ESP8266",
    cpu: "Single-core Xtensa L106",
    clock: "80/160 MHz",
    memory: "1-4 MB flash / 80 KB RAM",
    logic: "3.3 V",
    connectivity: "Wi-Fi",
    os: "Arduino / NodeMCU / FreeRTOS",
    bestFor: "Simple Wi-Fi sensors and switches",
    pickWhen: "You need the cheapest Wi-Fi connection.",
  },
  {
    id: "jetson-nano",
    name: "Jetson Nano",
    cpu: "Quad-core Cortex-A57 + GPU",
    clock: "1.43 GHz",
    memory: "4 GB shared RAM",
    logic: "3.3 V GPIO",
    connectivity: "Gigabit Ethernet, USB, HDMI, CSI",
    os: "Linux / JetPack",
    bestFor: "GPU-accelerated computer vision",
    pickWhen: "You need CUDA and real-time neural networks.",
  },
];
