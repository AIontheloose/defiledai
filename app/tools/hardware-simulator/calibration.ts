// app/tools/hardware-simulator/calibration.ts
// GLOBAL REALISTIC CALIBRATION CONSTANTS
// These values are tuned to match real-world benchmarks across:
// - Ollama Windows (CPU-dominant)
// - Ollama macOS (Metal)
// - llama.cpp CPU/GPU
// - vLLM (A100/H100)
// - iGPU / dGPU / APU / Apple Silicon
// - 7B → 670B models

export const CALIBRATION = {
  // ---------------------------------------------------------
  // BACKEND MULTIPLIERS (REALISTIC)
  // ---------------------------------------------------------
  backend: {
    Ollama_Windows: 0.55,   // CPU-dominant, partial DirectML
    Ollama_macOS: 0.85,     // Metal accelerated
    "llama.cpp_CPU": 0.85,  // AVX2/NEON
    "llama.cpp_GPU": 1.10,  // CUDA/Metal/OpenCL
    vLLM: 2.50,              // A100/H100 optimized
    KoboldCPP: 0.95,
    LMStudio: 0.90,
    Custom: 1.00,
  },

  // ---------------------------------------------------------
  // QUANTIZATION MULTIPLIERS (REALISTIC)
  // ---------------------------------------------------------
  quant: {
    F16: 0.40,
    Q8_0: 0.70,
    Q6_K: 1.00,
    Q5_K_M: 1.05,
    Q4_K_M: 1.00,
    Q4_K_S: 1.00,
    Q3_K_M: 1.10,
    A3B: 1.05, // Qwen A3B behaves like Q4_K_M with slight gains
  },

  // ---------------------------------------------------------
  // MEMORY BANDWIDTH CLASSES (GB/s)
  // ---------------------------------------------------------
  bandwidth: {
    Low: 50,      // Intel UHD, Mali, Adreno
    Medium: 90,   // AMD 780M, Iris Xe, shared memory APUs
    High: 400,    // RTX 3060–4090, Apple M1/M2/M3
    Extreme: 3000 // A100/H100 HBM2e/HBM3
  },

  // ---------------------------------------------------------
  // THERMAL MULTIPLIERS
  // ---------------------------------------------------------
  thermal: {
    Desktop: 1.00,
    Server: 1.10,
    Laptop: 0.75,
    MiniPC: 0.70,
    Phone: 0.55,
    Tablet: 0.65,
  },

  // ---------------------------------------------------------
  // CPU PERFORMANCE FACTORS
  // ---------------------------------------------------------
  cpu: {
    Intel_AVX2: 1.00,
    Intel_AVX512: 1.30,
    AMD_APU: 1.05,
    AMD_Desktop: 1.15,
    AppleSilicon: 1.40,
    ARM: 0.70,
  },

  // ---------------------------------------------------------
  // OFFLOAD PENALTIES
  // ---------------------------------------------------------
  offload: {
    PCIe3: 0.40,
    PCIe4: 0.60,
    PCIe5: 0.75,
    NVLink: 1.00,
    SharedMemory_iGPU: 0.35, // APUs/iGPUs suffer heavy offload penalties
  },

  // ---------------------------------------------------------
  // MULTI-GPU SCALING
  // ---------------------------------------------------------
  multiGPU: {
    baseScale: (gpuCount: number) => Math.log2(gpuCount + 1),
    nvlinkBonus: 1.0,
    noNvlinkPenalty: 0.7,
  },

  // ---------------------------------------------------------
  // PERCEIVED SPEED THRESHOLDS
  // ---------------------------------------------------------
  perceived: {
    instant: 40,       // >40 tok/s decode
    smooth: 10,        // 10–40 tok/s
    slightlyLaggy: 2,  // 2–10 tok/s
    slow: 0            // <2 tok/s
  }
};
