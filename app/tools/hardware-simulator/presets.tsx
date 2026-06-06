// app/tools/hardware-simulator/presets.ts
// Full preset pack for DefiledAI Hardware Simulator (theme‑agnostic)

import { HardwareProfile } from "./hardwareEngine";

export type QuantKind =
  | "F16"
  | "Q8_0"
  | "Q6_K"
  | "Q5_K_M"
  | "Q4_K_M"
  | "Q4_K_S"
  | "Q3_K_M"
  | "A3B";

// ---------------------------------------------------------
// DEVICE PRESETS
// ---------------------------------------------------------

export const DEVICE_PRESETS: {
  id: string;
  label: string;
  description: string;
  apply: () => HardwareProfile;
}[] = [
  // -----------------------------
  // APPLE SILICON
  // -----------------------------
  {
    id: "m1_air_8",
    label: "MacBook Air M1 · 8GB",
    description: "Entry Apple Silicon. Realistic 7B–13B range.",
    apply: () => ({
      os: "macOS",
      cpuKind: "AppleSilicon",
      cores: 8,
      ramGB: 8,
      gpuKind: "AppleGPU",
      gpuModel: "Apple M1",
      vramGB: 4,
      bandwidthClass: "High",
      pcieGen: 0,
      hasAVX512: false,
      isLaptop: true,
      multiGPU: undefined,
    }),
  },
  {
    id: "m1_pro_16",
    label: "MacBook Pro M1 Pro · 16GB",
    description: "Better bandwidth, still unified memory.",
    apply: () => ({
      os: "macOS",
      cpuKind: "AppleSilicon",
      cores: 10,
      ramGB: 16,
      gpuKind: "AppleGPU",
      gpuModel: "Apple M1 Pro",
      vramGB: 8,
      bandwidthClass: "High",
      pcieGen: 0,
      hasAVX512: false,
      isLaptop: true,
      multiGPU: undefined,
    }),
  },
  {
    id: "m1_max_32",
    label: "MacBook Pro M1 Max · 32GB",
    description: "High bandwidth, can handle 13B–20B comfortably.",
    apply: () => ({
      os: "macOS",
      cpuKind: "AppleSilicon",
      cores: 10,
      ramGB: 32,
      gpuKind: "AppleGPU",
      gpuModel: "Apple M1 Max",
      vramGB: 16,
      bandwidthClass: "Extreme",
      pcieGen: 0,
      hasAVX512: false,
      isLaptop: true,
      multiGPU: undefined,
    }),
  },

  // -----------------------------
  // NVIDIA DESKTOP GPUs
  // -----------------------------
  {
    id: "rtx_4090",
    label: "RTX 4090 · 24GB",
    description: "Top-tier consumer GPU. 70B capable.",
    apply: () => ({
      os: "Windows",
      cpuKind: "Intel",
      cores: 16,
      ramGB: 64,
      gpuKind: "Nvidia",
      gpuModel: "RTX 4090",
      vramGB: 24,
      bandwidthClass: "Extreme",
      pcieGen: 4,
      hasAVX512: false,
      isLaptop: false,
      multiGPU: undefined,
    }),
  },
  {
    id: "rtx_4080",
    label: "RTX 4080 · 16GB",
    description: "Great for 33B, borderline for 70B.",
    apply: () => ({
      os: "Windows",
      cpuKind: "Intel",
      cores: 16,
      ramGB: 64,
      gpuKind: "Nvidia",
      gpuModel: "RTX 4080",
      vramGB: 16,
      bandwidthClass: "High",
      pcieGen: 4,
      hasAVX512: false,
      isLaptop: false,
      multiGPU: undefined,
    }),
  },
  {
    id: "rtx_3090",
    label: "RTX 3090 · 24GB",
    description: "Previous-gen powerhouse. 70B capable.",
    apply: () => ({
      os: "Windows",
      cpuKind: "Intel",
      cores: 16,
      ramGB: 64,
      gpuKind: "Nvidia",
      gpuModel: "RTX 3090",
      vramGB: 24,
      bandwidthClass: "High",
      pcieGen: 4,
      hasAVX512: false,
      isLaptop: false,
      multiGPU: undefined,
    }),
  },

  // -----------------------------
  // NVIDIA LAPTOP GPUs
  // -----------------------------
  {
    id: "laptop_4060",
    label: "Laptop RTX 4060 · 8GB",
    description: "Good for 7B–13B. 33B borderline.",
    apply: () => ({
      os: "Windows",
      cpuKind: "Intel",
      cores: 12,
      ramGB: 32,
      gpuKind: "Nvidia",
      gpuModel: "Laptop RTX 4060",
      vramGB: 8,
      bandwidthClass: "Medium",
      pcieGen: 4,
      hasAVX512: false,
      isLaptop: true,
      multiGPU: undefined,
    }),
  },
  {
    id: "laptop_4070",
    label: "Laptop RTX 4070 · 8GB",
    description: "Fast laptop GPU, still VRAM-limited.",
    apply: () => ({
      os: "Windows",
      cpuKind: "Intel",
      cores: 14,
      ramGB: 32,
      gpuKind: "Nvidia",
      gpuModel: "Laptop RTX 4070",
      vramGB: 8,
      bandwidthClass: "High",
      pcieGen: 4,
      hasAVX512: false,
      isLaptop: true,
      multiGPU: undefined,
    }),
  },

  // -----------------------------
  // MINI PCs / LOW POWER
  // -----------------------------
  {
    id: "n100",
    label: "Intel N100 MiniPC",
    description: "Low-power CPU/iGPU. 7B only.",
    apply: () => ({
      os: "Linux",
      cpuKind: "Intel",
      cores: 4,
      ramGB: 16,
      gpuKind: "Integrated",
      gpuModel: "Intel UHD",
      vramGB: 1,
      bandwidthClass: "Low",
      pcieGen: 3,
      hasAVX512: false,
      isLaptop: false,
      multiGPU: undefined,
    }),
  },
  {
    id: "780m",
    label: "Ryzen 7840U / 780M iGPU",
    description: "Shockingly good iGPU. 7B–13B possible.",
    apply: () => ({
      os: "Linux",
      cpuKind: "AMD",
      cores: 8,
      ramGB: 32,
      gpuKind: "Integrated",
      gpuModel: "Radeon 780M",
      vramGB: 4,
      bandwidthClass: "Medium",
      pcieGen: 4,
      hasAVX512: false,
      isLaptop: true,
      multiGPU: undefined,
    }),
  },

  // -----------------------------
  // SERVERS
  // -----------------------------
  {
    id: "a100_40",
    label: "NVIDIA A100 · 40GB",
    description: "Enterprise GPU. 70B+ capable.",
    apply: () => ({
      os: "Linux",
      cpuKind: "AMD",
      cores: 64,
      ramGB: 256,
      gpuKind: "Nvidia",
      gpuModel: "A100 40GB",
      vramGB: 40,
      bandwidthClass: "Extreme",
      pcieGen: 4,
      hasAVX512: false,
      isLaptop: false,
      multiGPU: undefined,
    }),
  },
  {
    id: "h100_80",
    label: "NVIDIA H100 · 80GB",
    description: "The king. 400B+ capable.",
    apply: () => ({
      os: "Linux",
      cpuKind: "AMD",
      cores: 96,
      ramGB: 512,
      gpuKind: "Nvidia",
      gpuModel: "H100 80GB",
      vramGB: 80,
      bandwidthClass: "Extreme",
      pcieGen: 5,
      hasAVX512: false,
      isLaptop: false,
      multiGPU: undefined,
    }),
  },
];

// ---------------------------------------------------------
// MODEL PRESETS
// ---------------------------------------------------------

export const MODEL_PRESETS = [
  {
    id: "7b_chat_q4",
    label: "7B · Chat · Q4_K_M",
    paramsB: 7,
    quant: "Q4_K_M" as QuantKind,
    note: "Baseline chat model, runs everywhere.",
  },
  {
    id: "13b_instruct_q4",
    label: "13B · Instruct · Q4_K_M",
    paramsB: 13,
    quant: "Q4_K_M" as QuantKind,
    note: "Better reasoning, needs more memory.",
  },
  {
    id: "20b_q3",
    label: "20B · Q3_K_M",
    paramsB: 20,
    quant: "Q3_K_M" as QuantKind,
    note: "Borderline on mid-tier hardware.",
  },
  {
    id: "33b_q4",
    label: "33B · Q4_K_M",
    paramsB: 33,
    quant: "Q4_K_M" as QuantKind,
    note: "Needs 16GB+ VRAM.",
  },
  {
    id: "70b_q4",
    label: "70B · Q4_K_M",
    paramsB: 70,
    quant: "Q4_K_M" as QuantKind,
    note: "Requires 24GB+ VRAM.",
  },
];

// ---------------------------------------------------------
// BACKEND PRESETS
// ---------------------------------------------------------

export const BACKEND_PRESETS = [
  { id: "ollama", label: "Ollama", value: "Ollama" as const },
  { id: "llamacpp", label: "llama.cpp", value: "llama.cpp" as const },
  { id: "vllm", label: "vLLM", value: "vLLM" as const },
  { id: "kobold", label: "KoboldCPP", value: "KoboldCPP" as const },
  { id: "lmstudio", label: "LM Studio", value: "LM Studio" as const },
  { id: "custom", label: "Custom", value: "Custom" as const },
];
