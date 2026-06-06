// app/tools/hardware-simulator/presets.ts
// ======================================================
//  REAL-HARDWARE PRESETS (S1 DETAIL, STRICT TYPESCRIPT)
//  Compatible with hardwareEngine.ts
// ======================================================

import type { HardwareProfile, Quantization } from "./hardwareEngine";
import type { RuntimeProfile } from "./hardwareEngine";


export type DevicePreset = {
  id: string;
  label: string;
  description?: string;
  profile: HardwareProfile;
};

export type ModelPreset = {
  id: string;
  label: string;
  description?: string;
  paramsB: number;
  quant: Quantization;
};

export type BackendPreset = {
  id: string;
  label: string;
  description?: string;
  value: RuntimeProfile["backend"];
};

// ------------------------------------------------------
//  DEVICE PRESETS (LAPTOPS, DESKTOPS, APPLE, INTEGRATED)
// ------------------------------------------------------

export const DEVICE_PRESETS: DevicePreset[] = [
  // =========================
  // High-end desktop GPUs
  // =========================
  {
    id: "desktop_rtx_4090",
    label: "Desktop — RTX 4090 + i9-13900K",
    description: "24GB GDDR6X, top-tier gaming/workstation rig",
    profile: {
      cpuVendor: "Intel",
      cpuModel: "Core i9-13900K",
      cpuCores: 8,
      cpuThreads: 16,
      cpuBaseGHz: 3.0,
      cpuBoostGHz: 5.8,
      cpuTdpWatts: 125,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 64,
      ramType: "DDR5",
      ramSpeedMT: 6000,

      gpuVendor: "NVIDIA",
      gpuModel: "RTX 4090",
      gpuArchitecture: "Ada Lovelace",
      vramGB: 24,
      vramType: "GDDR6X",
      memoryBandwidthGBs: 1008,
      tflopsFP16: 330,
      tflopsFP32: 82,
      tflopsINT8: 660,

      os: "Windows",
      isLaptop: false,
      coolingClass: "HighPerformance",
      pcieGen: 4,
    },
  },
  {
    id: "desktop_rtx_4080",
    label: "Desktop — RTX 4080 + Ryzen 9 7900X",
    description: "16GB GDDR6X, high-end gaming/creator PC",
    profile: {
      cpuVendor: "AMD",
      cpuModel: "Ryzen 9 7900X",
      cpuCores: 12,
      cpuThreads: 24,
      cpuBaseGHz: 4.7,
      cpuBoostGHz: 5.6,
      cpuTdpWatts: 170,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 32,
      ramType: "DDR5",
      ramSpeedMT: 5600,

      gpuVendor: "NVIDIA",
      gpuModel: "RTX 4080",
      gpuArchitecture: "Ada Lovelace",
      vramGB: 16,
      vramType: "GDDR6X",
      memoryBandwidthGBs: 716,
      tflopsFP16: 250,
      tflopsFP32: 49,
      tflopsINT8: 500,

      os: "Windows",
      isLaptop: false,
      coolingClass: "HighPerformance",
      pcieGen: 4,
    },
  },
  {
    id: "desktop_rtx_4070",
    label: "Desktop — RTX 4070 + i5-13600K",
    description: "12GB GDDR6X, strong mid-high gaming rig",
    profile: {
      cpuVendor: "Intel",
      cpuModel: "Core i5-13600K",
      cpuCores: 6,
      cpuThreads: 12,
      cpuBaseGHz: 3.5,
      cpuBoostGHz: 5.1,
      cpuTdpWatts: 125,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 32,
      ramType: "DDR5",
      ramSpeedMT: 5600,

      gpuVendor: "NVIDIA",
      gpuModel: "RTX 4070",
      gpuArchitecture: "Ada Lovelace",
      vramGB: 12,
      vramType: "GDDR6X",
      memoryBandwidthGBs: 504,
      tflopsFP16: 160,
      tflopsFP32: 29,
      tflopsINT8: 320,

      os: "Windows",
      isLaptop: false,
      coolingClass: "Standard",
      pcieGen: 4,
    },
  },

  // =========================
  // Mid-range desktop GPUs
  // =========================
  {
    id: "desktop_rtx_3060",
    label: "Desktop — RTX 3060 + Ryzen 5 5600X",
    description: "12GB GDDR6, popular mid-range gaming PC",
    profile: {
      cpuVendor: "AMD",
      cpuModel: "Ryzen 5 5600X",
      cpuCores: 6,
      cpuThreads: 12,
      cpuBaseGHz: 3.7,
      cpuBoostGHz: 4.6,
      cpuTdpWatts: 65,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 16,
      ramType: "DDR4",
      ramSpeedMT: 3200,

      gpuVendor: "NVIDIA",
      gpuModel: "RTX 3060",
      gpuArchitecture: "Ampere",
      vramGB: 12,
      vramType: "GDDR6",
      memoryBandwidthGBs: 360,
      tflopsFP16: 25,
      tflopsFP32: 13,
      tflopsINT8: 50,

      os: "Windows",
      isLaptop: false,
      coolingClass: "Standard",
      pcieGen: 4,
    },
  },
  {
    id: "desktop_rtx_2060",
    label: "Desktop — RTX 2060 + i5-10400F",
    description: "6GB GDDR6, older but still capable",
    profile: {
      cpuVendor: "Intel",
      cpuModel: "Core i5-10400F",
      cpuCores: 6,
      cpuThreads: 12,
      cpuBaseGHz: 2.9,
      cpuBoostGHz: 4.3,
      cpuTdpWatts: 65,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 16,
      ramType: "DDR4",
      ramSpeedMT: 2666,

      gpuVendor: "NVIDIA",
      gpuModel: "RTX 2060",
      gpuArchitecture: "Turing",
      vramGB: 6,
      vramType: "GDDR6",
      memoryBandwidthGBs: 336,
      tflopsFP16: 13,
      tflopsFP32: 6.5,
      tflopsINT8: 26,

      os: "Windows",
      isLaptop: false,
      coolingClass: "Standard",
      pcieGen: 3,
    },
  },

  // =========================
  // AMD desktop GPUs
  // =========================
  {
    id: "desktop_rx_7900xtx",
    label: "Desktop — RX 7900 XTX + Ryzen 9 7950X",
    description: "24GB GDDR6, high-end AMD GPU",
    profile: {
      cpuVendor: "AMD",
      cpuModel: "Ryzen 9 7950X",
      cpuCores: 16,
      cpuThreads: 32,
      cpuBaseGHz: 4.5,
      cpuBoostGHz: 5.7,
      cpuTdpWatts: 170,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 64,
      ramType: "DDR5",
      ramSpeedMT: 6000,

      gpuVendor: "AMD",
      gpuModel: "Radeon RX 7900 XTX",
      gpuArchitecture: "RDNA 3",
      vramGB: 24,
      vramType: "GDDR6",
      memoryBandwidthGBs: 960,
      tflopsFP16: 250,
      tflopsFP32: 61,
      tflopsINT8: 500,

      os: "Windows",
      isLaptop: false,
      coolingClass: "HighPerformance",
      pcieGen: 4,
    },
  },
  {
    id: "desktop_rx_6800xt",
    label: "Desktop — RX 6800 XT + Ryzen 7 5800X",
    description: "16GB GDDR6, strong 1440p/4K GPU",
    profile: {
      cpuVendor: "AMD",
      cpuModel: "Ryzen 7 5800X",
      cpuCores: 8,
      cpuThreads: 16,
      cpuBaseGHz: 3.8,
      cpuBoostGHz: 4.7,
      cpuTdpWatts: 105,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 32,
      ramType: "DDR4",
      ramSpeedMT: 3600,

      gpuVendor: "AMD",
      gpuModel: "Radeon RX 6800 XT",
      gpuArchitecture: "RDNA 2",
      vramGB: 16,
      vramType: "GDDR6",
      memoryBandwidthGBs: 512,
      tflopsFP16: 40,
      tflopsFP32: 20,
      tflopsINT8: 80,

      os: "Windows",
      isLaptop: false,
      coolingClass: "Standard",
      pcieGen: 4,
    },
  },

  // =========================
  // Intel Arc desktop
  // =========================
  {
    id: "desktop_arc_a770",
    label: "Desktop — Intel Arc A770 + i5-12600K",
    description: "16GB GDDR6, Intel Arc desktop GPU",
    profile: {
      cpuVendor: "Intel",
      cpuModel: "Core i5-12600K",
      cpuCores: 6,
      cpuThreads: 12,
      cpuBaseGHz: 3.7,
      cpuBoostGHz: 4.9,
      cpuTdpWatts: 125,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 32,
      ramType: "DDR5",
      ramSpeedMT: 5200,

      gpuVendor: "Intel",
      gpuModel: "Arc A770",
      gpuArchitecture: "Alchemist",
      vramGB: 16,
      vramType: "GDDR6",
      memoryBandwidthGBs: 512,
      tflopsFP16: 20,
      tflopsFP32: 10,
      tflopsINT8: 40,

      os: "Windows",
      isLaptop: false,
      coolingClass: "Standard",
      pcieGen: 4,
    },
  },

  // =========================
  // Apple Silicon desktops
  // =========================
  {
    id: "mac_m2_ultra",
    label: "Mac Studio — M2 Ultra (76‑core GPU)",
    description: "Unified memory, high-end Apple Silicon desktop",
    profile: {
      cpuVendor: "Apple",
      cpuModel: "M2 Ultra",
      cpuCores: 24,
      cpuThreads: 24,
      cpuBaseGHz: 3.5,
      cpuBoostGHz: 3.7,
      cpuTdpWatts: 90,
      hasAVX2: false,
      hasAVX512: false,

      ramGB: 64,
      ramType: "Unified",
      ramSpeedMT: 6400,

      gpuVendor: "Apple",
      gpuModel: "M2 Ultra 76‑core GPU",
      gpuArchitecture: "Apple GPU",
      vramGB: 64,
      vramType: "Unified",
      memoryBandwidthGBs: 800,
      tflopsFP16: 60,
      tflopsFP32: 30,
      tflopsINT8: 120,

      os: "macOS",
      isLaptop: false,
      coolingClass: "Workstation",
      pcieGen: 0,
    },
  },

  // =========================
  // Laptops (gaming)
  // =========================
  {
    id: "laptop_blade_15_3070",
    label: "Razer Blade 15 — RTX 3070 Laptop",
    description: "8GB GDDR6, thin gaming laptop",
    profile: {
      cpuVendor: "Intel",
      cpuModel: "Core i7-11800H",
      cpuCores: 8,
      cpuThreads: 16,
      cpuBaseGHz: 2.3,
      cpuBoostGHz: 4.6,
      cpuTdpWatts: 45,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 16,
      ramType: "DDR4",
      ramSpeedMT: 3200,

      gpuVendor: "NVIDIA",
      gpuModel: "RTX 3070 Laptop",
      gpuArchitecture: "Ampere",
      vramGB: 8,
      vramType: "GDDR6",
      memoryBandwidthGBs: 384,
      tflopsFP16: 20,
      tflopsFP32: 10,
      tflopsINT8: 40,

      os: "Windows",
      isLaptop: true,
      coolingClass: "Thin",
      pcieGen: 4,
    },
  },
  {
    id: "laptop_legion_5_3060",
    label: "Lenovo Legion 5 — RTX 3060 Laptop",
    description: "6GB GDDR6, popular mid-range gaming laptop",
    profile: {
      cpuVendor: "AMD",
      cpuModel: "Ryzen 7 5800H",
      cpuCores: 8,
      cpuThreads: 16,
      cpuBaseGHz: 3.2,
      cpuBoostGHz: 4.4,
      cpuTdpWatts: 45,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 16,
      ramType: "DDR4",
      ramSpeedMT: 3200,

      gpuVendor: "NVIDIA",
      gpuModel: "RTX 3060 Laptop",
      gpuArchitecture: "Ampere",
      vramGB: 6,
      vramType: "GDDR6",
      memoryBandwidthGBs: 336,
      tflopsFP16: 18,
      tflopsFP32: 9,
      tflopsINT8: 36,

      os: "Windows",
      isLaptop: true,
      coolingClass: "Standard",
      pcieGen: 4,
    },
  },

  // =========================
  // Apple laptops
  // =========================
  {
    id: "macbook_air_m2",
    label: "MacBook Air — M2 (10‑core GPU)",
    description: "Fanless, unified memory, ultra portable",
    profile: {
      cpuVendor: "Apple",
      cpuModel: "M2",
      cpuCores: 8,
      cpuThreads: 8,
      cpuBaseGHz: 3.2,
      cpuBoostGHz: 3.5,
      cpuTdpWatts: 20,
      hasAVX2: false,
      hasAVX512: false,

      ramGB: 16,
      ramType: "Unified",
      ramSpeedMT: 6400,

      gpuVendor: "Apple",
      gpuModel: "M2 10‑core GPU",
      gpuArchitecture: "Apple GPU",
      vramGB: 16,
      vramType: "Unified",
      memoryBandwidthGBs: 200,
      tflopsFP16: 6,
      tflopsFP32: 3,
      tflopsINT8: 12,

      os: "macOS",
      isLaptop: true,
      coolingClass: "UltraThin",
      pcieGen: 0,
    },
  },
  {
    id: "macbook_pro_m3pro",
    label: "MacBook Pro 14\" — M3 Pro",
    description: "Unified memory, strong Apple Silicon laptop",
    profile: {
      cpuVendor: "Apple",
      cpuModel: "M3 Pro",
      cpuCores: 12,
      cpuThreads: 12,
      cpuBaseGHz: 3.5,
      cpuBoostGHz: 3.7,
      cpuTdpWatts: 35,
      hasAVX2: false,
      hasAVX512: false,

      ramGB: 24,
      ramType: "Unified",
      ramSpeedMT: 6400,

      gpuVendor: "Apple",
      gpuModel: "M3 Pro 18‑core GPU",
      gpuArchitecture: "Apple GPU",
      vramGB: 24,
      vramType: "Unified",
      memoryBandwidthGBs: 300,
      tflopsFP16: 12,
      tflopsFP32: 6,
      tflopsINT8: 24,

      os: "macOS",
      isLaptop: true,
      coolingClass: "Thin",
      pcieGen: 0,
    },
  },

  // =========================
  // Integrated / low-end
  // =========================
  {
    id: "laptop_iris_xe",
    label: "Ultrabook — Intel Iris Xe",
    description: "Integrated GPU, 16GB RAM, office ultrabook",
    profile: {
      cpuVendor: "Intel",
      cpuModel: "Core i7-1165G7",
      cpuCores: 4,
      cpuThreads: 8,
      cpuBaseGHz: 2.8,
      cpuBoostGHz: 4.7,
      cpuTdpWatts: 28,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 16,
      ramType: "LPDDR4X",
      ramSpeedMT: 4266,

      gpuVendor: "Intel",
      gpuModel: "Iris Xe",
      gpuArchitecture: "Xe-LP",
      vramGB: 0.5,
      vramType: "Unified",
      memoryBandwidthGBs: 68,
      tflopsFP16: 1.5,
      tflopsFP32: 0.75,
      tflopsINT8: 3,

      os: "Windows",
      isLaptop: true,
      coolingClass: "UltraThin",
      pcieGen: 4,
    },
  },
  {
    id: "laptop_vega8",
    label: "Budget Laptop — Ryzen 5 + Vega 8",
    description: "Integrated Vega 8, 8GB RAM",
    profile: {
      cpuVendor: "AMD",
      cpuModel: "Ryzen 5 4500U",
      cpuCores: 6,
      cpuThreads: 6,
      cpuBaseGHz: 2.3,
      cpuBoostGHz: 4.0,
      cpuTdpWatts: 15,
      hasAVX2: true,
      hasAVX512: false,

      ramGB: 8,
      ramType: "LPDDR4X",
      ramSpeedMT: 3733,

      gpuVendor: "AMD",
      gpuModel: "Radeon Vega 8",
      gpuArchitecture: "Vega",
      vramGB: 0.5,
      vramType: "Unified",
      memoryBandwidthGBs: 60,
      tflopsFP16: 1.2,
      tflopsFP32: 0.6,
      tflopsINT8: 2.4,

      os: "Windows",
      isLaptop: true,
      coolingClass: "UltraThin",
      pcieGen: 3,
    },
  },
];

// ------------------------------------------------------
//  MODEL PRESETS (REAL LLMs)
// ------------------------------------------------------

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: "llama3_8b_q4",
    label: "LLaMA 3 8B Q4_K_M",
    description: "General-purpose 8B model, 4-bit quant",
    paramsB: 8,
    quant: "Q4_K_M",
  },
  {
    id: "llama3_70b_q4",
    label: "LLaMA 3 70B Q4_K_M",
    description: "Large 70B model, 4-bit quant",
    paramsB: 70,
    quant: "Q4_K_M",
  },
  {
    id: "mistral_7b_q4",
    label: "Mistral 7B Q4_K_M",
    description: "Efficient 7B model, 4-bit quant",
    paramsB: 7,
    quant: "Q4_K_M",
  },
  {
    id: "mixtral_8x7b_q4",
    label: "Mixtral 8x7B MoE Q4_K_M",
    description: "Sparse MoE, behaves like ~12–14B active",
    paramsB: 46,
    quant: "Q4_K_M",
  },
  {
    id: "phi3_small_q4",
    label: "Phi-3 Small 7B Q4_K_M",
    description: "Small, efficient, good for local use",
    paramsB: 7,
    quant: "Q4_K_M",
  },
  {
    id: "gemma_7b_q4",
    label: "Gemma 7B Q4_K_M",
    description: "Google Gemma 7B, 4-bit quant",
    paramsB: 7,
    quant: "Q4_K_M",
  },
];

// ------------------------------------------------------
//  BACKEND PRESETS (REAL BACKENDS)
// ------------------------------------------------------

export const BACKEND_PRESETS: BackendPreset[] = [
  {
    id: "ollama",
    label: "Ollama",
    description: "User-friendly local runner",
    value: "ollama",
  },
  {
    id: "llamacpp",
    label: "llama.cpp",
    description: "Highly optimized CPU/GPU inference",
    value: "llamacpp",
  },
  {
    id: "vllm",
    label: "vLLM",
    description: "High-throughput GPU serving",
    value: "vllm",
  },
  {
    id: "tensorrt-llm",
    label: "TensorRT-LLM",
    description: "NVIDIA-optimized GPU inference",
    value: "tensorrt-llm",
  },
  {
    id: "mlx",
    label: "MLX (Apple Silicon)",
    description: "Apple’s framework for M-series chips",
    value: "mlx",
  },
  {
    id: "pytorch",
    label: "PyTorch",
    description: "Baseline deep learning framework",
    value: "pytorch",
  },
  {
    id: "onnx",
    label: "ONNX Runtime",
    description: "Portable inference runtime",
    value: "onnx",
  },
  {
    id: "webgpu",
    label: "WebGPU",
    description: "Browser GPU backend",
    value: "webgpu",
  },
  {
    id: "webnn",
    label: "WebNN",
    description: "Experimental browser NN backend",
    value: "webnn",
  },
  {
    id: "mps",
    label: "Metal (MPS)",
    description: "Metal Performance Shaders on macOS",
    value: "mps",
  },
];
