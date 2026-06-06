// app/tools/hardware-simulator/hardwarePresets.ts

import { HardwareProfile, RuntimeProfile } from "./hardwareEngine";

export type HardwarePreset = {
  name: string;
  hardware: Partial<HardwareProfile>;
  runtime: Partial<RuntimeProfile>;
};

/**
 * NOTE:
 * These presets intentionally use *Partial* profiles.
 * Your page.tsx merges them into the existing simulated profile.
 */

export const HARDWARE_PRESETS: HardwarePreset[] = [

  // -----------------------------
  // APPLE LAPTOPS / DESKTOPS
  // -----------------------------
  {
    name: "MacBook Air M1",
    hardware: {
      os: "macOS",
      cpuKind: "AppleSilicon",
      cores: 8,
      gpuKind: "AppleGPU",
      gpuModel: "M1 GPU",
      vramGB: 8,
      ramGB: 8,
      bandwidthClass: "High",
      pcieGen: 5,
      isLaptop: true,
    },
    runtime: { backend: "Ollama", deviceType: "Laptop" },
  },
  {
    name: "MacBook Air M2",
    hardware: {
      os: "macOS",
      cpuKind: "AppleSilicon",
      cores: 8,
      gpuKind: "AppleGPU",
      gpuModel: "M2 GPU",
      vramGB: 16,
      ramGB: 16,
      bandwidthClass: "High",
      pcieGen: 5,
      isLaptop: true,
    },
    runtime: { backend: "Ollama", deviceType: "Laptop" },
  },
  {
    name: "MacBook Pro M3 Pro",
    hardware: {
      os: "macOS",
      cpuKind: "AppleSilicon",
      cores: 12,
      gpuKind: "AppleGPU",
      gpuModel: "M3 Pro GPU",
      vramGB: 24,
      ramGB: 24,
      bandwidthClass: "High",
      pcieGen: 5,
      isLaptop: true,
    },
    runtime: { backend: "Ollama", deviceType: "Laptop" },
  },
  {
    name: "MacBook Pro M3 Max",
    hardware: {
      os: "macOS",
      cpuKind: "AppleSilicon",
      cores: 16,
      gpuKind: "AppleGPU",
      gpuModel: "M3 Max GPU",
      vramGB: 48,
      ramGB: 48,
      bandwidthClass: "High",
      pcieGen: 5,
      isLaptop: true,
    },
    runtime: { backend: "Ollama", deviceType: "Laptop" },
  },
  {
    name: "Mac Studio M2 Ultra",
    hardware: {
      os: "macOS",
      cpuKind: "AppleSilicon",
      cores: 24,
      gpuKind: "AppleGPU",
      gpuModel: "M2 Ultra GPU",
      vramGB: 128,
      ramGB: 128,
      bandwidthClass: "Extreme",
      pcieGen: 5,
      isLaptop: false,
    },
    runtime: { backend: "Ollama", deviceType: "Desktop" },
  },

  // -----------------------------
  // WINDOWS LAPTOPS (DELL / HP / LENOVO / RAZER / ALIENWARE)
  // -----------------------------
  {
    name: "Dell XPS 13 (Intel iGPU)",
    hardware: {
      os: "Windows",
      cpuKind: "Intel",
      cores: 12,
      gpuKind: "Integrated",
      gpuModel: "Intel Iris Xe",
      vramGB: 4,
      ramGB: 16,
      bandwidthClass: "Low",
      pcieGen: 4,
      isLaptop: true,
    },
    runtime: { backend: "Ollama", deviceType: "Laptop" },
  },
  {
    name: "Dell XPS 15 (RTX 4050)",
    hardware: {
      os: "Windows",
      cpuKind: "Intel",
      cores: 14,
      gpuKind: "Nvidia",
      gpuModel: "RTX 4050 Mobile",
      vramGB: 6,
      ramGB: 32,
      bandwidthClass: "Medium",
      pcieGen: 4,
      isLaptop: true,
    },
    runtime: { backend: "llama.cpp", deviceType: "Laptop" },
  },
  {
    name: "HP Omen (RTX 4070)",
    hardware: {
      os: "Windows",
      cpuKind: "Intel",
      cores: 16,
      gpuKind: "Nvidia",
      gpuModel: "RTX 4070 Mobile",
      vramGB: 8,
      ramGB: 32,
      bandwidthClass: "Medium",
      pcieGen: 4,
      isLaptop: true,
    },
    runtime: { backend: "llama.cpp", deviceType: "Laptop" },
  },
  {
    name: "Lenovo Legion 5 Pro (RTX 4080)",
    hardware: {
      os: "Windows",
      cpuKind: "AMD",
      cores: 16,
      gpuKind: "Nvidia",
      gpuModel: "RTX 4080 Mobile",
      vramGB: 12,
      ramGB: 32,
      bandwidthClass: "High",
      pcieGen: 4,
      isLaptop: true,
    },
    runtime: { backend: "llama.cpp", deviceType: "Laptop" },
  },
  {
    name: "Razer Blade 16 (RTX 4090 Mobile)",
    hardware: {
      os: "Windows",
      cpuKind: "Intel",
      cores: 24,
      gpuKind: "Nvidia",
      gpuModel: "RTX 4090 Mobile",
      vramGB: 16,
      ramGB: 64,
      bandwidthClass: "High",
      pcieGen: 5,
      isLaptop: true,
    },
    runtime: { backend: "llama.cpp", deviceType: "Laptop" },
  },
  {
    name: "Alienware m18 (RTX 4090)",
    hardware: {
      os: "Windows",
      cpuKind: "Intel",
      cores: 24,
      gpuKind: "Nvidia",
      gpuModel: "RTX 4090 Mobile",
      vramGB: 16,
      ramGB: 64,
      bandwidthClass: "High",
      pcieGen: 5,
      isLaptop: true,
    },
    runtime: { backend: "llama.cpp", deviceType: "Laptop" },
  },

  // -----------------------------
  // MINI PCs (YOUR CATEGORY)
  // -----------------------------
  {
    name: "NucBox K8 Plus (8845HS + 780M)",
    hardware: {
      os: "Windows",
      cpuKind: "AMD",
      cores: 16,
      gpuKind: "Integrated",
      gpuModel: "Radeon 780M",
      vramGB: 16,
      ramGB: 32,
      bandwidthClass: "Medium",
      pcieGen: 4,
      isLaptop: true,
    },
    runtime: { backend: "Ollama", deviceType: "MiniPC" },
  },
  {
    name: "Minisforum UM790 Pro",
    hardware: {
      os: "Windows",
      cpuKind: "AMD",
      cores: 16,
      gpuKind: "Integrated",
      gpuModel: "Radeon 780M",
      vramGB: 16,
      ramGB: 32,
      bandwidthClass: "Medium",
      pcieGen: 4,
      isLaptop: true,
    },
    runtime: { backend: "Ollama", deviceType: "MiniPC" },
  },
  {
    name: "Beelink SER7 (7840HS)",
    hardware: {
      os: "Windows",
      cpuKind: "AMD",
      cores: 16,
      gpuKind: "Integrated",
      gpuModel: "Radeon 780M",
      vramGB: 16,
      ramGB: 32,
      bandwidthClass: "Medium",
      pcieGen: 4,
      isLaptop: true,
    },
    runtime: { backend: "Ollama", deviceType: "MiniPC" },
  },

  // -----------------------------
  // DESKTOPS (NVIDIA)
  // -----------------------------
  {
    name: "RTX 3060 Desktop",
    hardware: {
      os: "Windows",
      cpuKind: "AMD",
      cores: 12,
      gpuKind: "Nvidia",
      gpuModel: "RTX 3060",
      vramGB: 12,
      ramGB: 32,
      bandwidthClass: "High",
      pcieGen: 4,
      isLaptop: false,
    },
    runtime: { backend: "llama.cpp", deviceType: "Desktop" },
  },
  {
    name: "RTX 4070 Desktop",
    hardware: {
      os: "Windows",
      cpuKind: "AMD",
      cores: 16,
      gpuKind: "Nvidia",
      gpuModel: "RTX 4070",
      vramGB: 12,
      ramGB: 32,
      bandwidthClass: "High",
      pcieGen: 5,
      isLaptop: false,
    },
    runtime: { backend: "llama.cpp", deviceType: "Desktop" },
  },
  {
    name: "RTX 4080 Desktop",
    hardware: {
      os: "Windows",
      cpuKind: "Intel",
      cores: 24,
      gpuKind: "Nvidia",
      gpuModel: "RTX 4080",
      vramGB: 16,
      ramGB: 64,
      bandwidthClass: "High",
      pcieGen: 5,
      isLaptop: false,
    },
    runtime: { backend: "llama.cpp", deviceType: "Desktop" },
  },
  {
    name: "RTX 4090 Desktop",
    hardware: {
      os: "Windows",
      cpuKind: "AMD",
      cores: 16,
      gpuKind: "Nvidia",
      gpuModel: "RTX 4090",
      vramGB: 24,
      ramGB: 64,
      bandwidthClass: "High",
      pcieGen: 5,
      isLaptop: false,
    },
    runtime: { backend: "llama.cpp", deviceType: "Desktop" },
  },

  // -----------------------------
  // ENTERPRISE SERVERS
  // -----------------------------
  {
    name: "2×RTX 4090 Workstation",
    hardware: {
      os: "Linux",
      cpuKind: "AMD",
      cores: 32,
      gpuKind: "Nvidia",
      gpuModel: "RTX 4090",
      vramGB: 48,
      ramGB: 128,
      bandwidthClass: "High",
      pcieGen: 5,
      hasAVX512: true,
      multiGPU: {
        gpuCount: 2,
        vramPerGPU: 24,
        hasNVLink: false,
      },
    },
    runtime: { backend: "vLLM", deviceType: "Server" },
  },
  {
    name: "4×A100 40GB",
    hardware: {
      os: "Linux",
      cpuKind: "AMD",
      cores: 64,
      gpuKind: "Nvidia",
      gpuModel: "A100 40GB",
      vramGB: 160,
      ramGB: 256,
      bandwidthClass: "Extreme",
      pcieGen: 5,
      hasAVX512: true,
      multiGPU: {
        gpuCount: 4,
        vramPerGPU: 40,
        hasNVLink: true,
      },
    },
    runtime: { backend: "vLLM", deviceType: "Server" },
  },
  {
    name: "8×A100 80GB NVLink",
    hardware: {
      os: "Linux",
      cpuKind: "AMD",
      cores: 64,
      gpuKind: "Nvidia",
      gpuModel: "A100 80GB",
      vramGB: 640,
      ramGB: 512,
      bandwidthClass: "Extreme",
      pcieGen: 5,
      hasAVX512: true,
      multiGPU: {
        gpuCount: 8,
        vramPerGPU: 80,
        hasNVLink: true,
      },
    },
    runtime: { backend: "vLLM", deviceType: "Server" },
  },
  {
    name: "8×H100 80GB NVLink",
    hardware: {
      os: "Linux",
      cpuKind: "AMD",
      cores: 64,
      gpuKind: "Nvidia",
      gpuModel: "H100 80GB",
      vramGB: 640,
      ramGB: 512,
      bandwidthClass: "Extreme",
      pcieGen: 5,
      hasAVX512: true,
      multiGPU: {
        gpuCount: 8,
        vramPerGPU: 80,
        hasNVLink: true,
      },
    },
    runtime: { backend: "vLLM", deviceType: "Server" },
  },
  {
    name: "16×H100 NVLink (670B Ready)",
    hardware: {
      os: "Linux",
      cpuKind: "AMD",
      cores: 96,
      gpuKind: "Nvidia",
      gpuModel: "H100 NVLink",
      vramGB: 1280,
      ramGB: 1024,
      bandwidthClass: "Extreme",
      pcieGen: 5,
      hasAVX512: true,
      multiGPU: {
        gpuCount: 16,
        vramPerGPU: 80,
        hasNVLink: true,
      },
    },
    runtime: { backend: "vLLM", deviceType: "Server" },
  },

  // -----------------------------
  // PHONES / TABLETS
  // -----------------------------
  {
    name: "iPhone 15 Pro",
    hardware: {
      os: "macOS",
      cpuKind: "AppleSilicon",
      cores: 6,
      gpuKind: "AppleGPU",
      gpuModel: "A17 Pro GPU",
      vramGB: 2,
      ramGB: 8,
      bandwidthClass: "Medium",
      pcieGen: 3,
      isLaptop: true,
    },
    runtime: { backend: "Custom", deviceType: "Phone" },
  },
  {
    name: "iPad Pro M4",
    hardware: {
      os: "macOS",
      cpuKind: "AppleSilicon",
      cores: 10,
      gpuKind: "AppleGPU",
      gpuModel: "M4 GPU",
      vramGB: 16,
      ramGB: 16,
      bandwidthClass: "High",
      pcieGen: 5,
      isLaptop: true,
    },
    runtime: { backend: "Ollama", deviceType: "Tablet" },
  },
  {
    name: "Samsung S24 Ultra",
    hardware: {
      os: "Linux",
      cpuKind: "ARM",
      cores: 8,
      gpuKind: "Integrated",
      gpuModel: "Adreno 750",
      vramGB: 2,
      ramGB: 12,
      bandwidthClass: "Low",
      pcieGen: 3,
      isLaptop: true,
    },
    runtime: { backend: "Custom", deviceType: "Phone" },
  },
  {
    name: "Pixel 8 Pro",
    hardware: {
      os: "Linux",
      cpuKind: "ARM",
      cores: 8,
      gpuKind: "Integrated",
      gpuModel: "Mali-G715",
      vramGB: 2,
      ramGB: 12,
      bandwidthClass: "Low",
      pcieGen: 3,
      isLaptop: true,
    },
    runtime: { backend: "Custom", deviceType: "Phone" },
  },
];
