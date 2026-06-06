// app/tools/hardware-simulator/hardwareEngine.ts
// ======================================================
//  FULL STRICT TYPESCRIPT HARDWARE ENGINE (P1-MAXIMAL)
// ======================================================

/**
 * Quantization formats supported by the simulator.
 * These are real formats used by llama.cpp, vLLM, MLX, TensorRT-LLM, etc.
 */
export type Quantization =
  | "F16"
  | "BF16"
  | "FP8"
  | "Q8_0"
  | "Q6_K"
  | "Q5_K_M"
  | "Q5_K_S"
  | "Q4_K_M"
  | "Q4_K_S"
  | "Q3_K_M"
  | "Q3_K_S"
  | "A8"
  | "A4"
  | "A3B";

/**
 * Full detailed hardware profile.
 * This is the S1 spec: maximum realism.
 */
export type HardwareProfile = {
  // CPU
  cpuVendor: "Intel" | "AMD" | "Apple" | "Qualcomm" | "Unknown";
  cpuModel: string;
  cpuCores: number;
  cpuThreads: number;
  cpuBaseGHz: number;
  cpuBoostGHz: number;
  cpuTdpWatts: number;
  hasAVX2: boolean;
  hasAVX512: boolean;

  // --- Compatibility fields for simpler presets (Path B) ---
  cpuKind?: string;
  cores?: number;
  // --- Compatibility for simpler presets (Path B) ---
multiGPU?: {
  gpuCount: number;
  vramPerGPU: number;
  hasNVLink: boolean;
};


  // RAM
  ramGB: number;
  ramType: "DDR4" | "DDR5" | "LPDDR4X" | "LPDDR5" | "Unified";
  ramSpeedMT: number;

  // GPU
  gpuVendor: "NVIDIA" | "AMD" | "Intel" | "Apple" | "None";
  gpuModel: string | null;
  gpuArchitecture: string | null;
  vramGB: number;
  vramType: "GDDR6" | "GDDR6X" | "HBM2" | "HBM3" | "Unified" | "None";
  memoryBandwidthGBs: number;
  tflopsFP16: number;
  tflopsFP32: number;
  tflopsINT8: number;

  // --- Compatibility fields for simpler presets (Path B) ---
  gpuKind?: string;
  bandwidthClass?: "Low" | "Medium" | "High" | "Extreme";

  // System
  os: "Windows" | "Linux" | "macOS";
  isLaptop: boolean;
  coolingClass: "UltraThin" | "Thin" | "Standard" | "HighPerformance" | "Workstation";
  pcieGen: 3 | 4 | 5 | 0; // 0 = integrated / unified memory
};

/**
 * Runtime backend configuration.
 */
export type RuntimeProfile = {
  backend:
    | "Custom"
    | "ollama"
    | "llamacpp"
    | "vllm"
    | "tensorrt-llm"
    | "mlx"
    | "pytorch"
    | "onnx"
    | "webgpu"
    | "webnn"
    | "mps";

  // --- Compatibility field for simpler presets (Path B) ---
  deviceType?: "Laptop" | "Desktop" | "Server" | "MiniPC" | "Phone" | "Tablet";
};


/**
 * Final performance result returned by computePerf().
 */
export type PerfResult = {
  totalVramGB: number;
  modelVramGB: number;
  fitsInVram: boolean;
  fitsInRam: boolean;
  mode: "GPU" | "CPU" | "CPU+Disk";

  decodeTokPerSec: number;
  prefillTokPerSec: number;
  ttftSeconds: number;

  maxContextTokens: number;
  perceivedSpeed: "Very slow" | "Slow" | "OK" | "Fast" | "Instant";

  paragraphTokens: number;
};

/**
 * Quantization multipliers (approximate real-world memory scaling).
 */
function quantizationMemoryMultiplier(q: Quantization): number {
  switch (q) {
    case "F16":
    case "BF16":
      return 2.0;
    case "FP8":
      return 1.0;
    case "Q8_0":
      return 1.0;
    case "Q6_K":
      return 0.85;
    case "Q5_K_M":
    case "Q5_K_S":
      return 0.70;
    case "Q4_K_M":
    case "Q4_K_S":
      return 0.55;
    case "Q3_K_M":
    case "Q3_K_S":
      return 0.40;
    case "A8":
      return 0.50;
    case "A4":
      return 0.30;
    case "A3B":
      return 0.25;
    default:
      return 1.0;
  }
}

/**
 * Backend performance multipliers.
 */
function backendPerfMultiplier(backend: RuntimeProfile["backend"]): number {
  switch (backend) {
    case "tensorrt-llm":
      return 1.6;
    case "vllm":
      return 1.4;
    case "llamacpp":
      return 1.15;
    case "mlx":
      return 1.1;
    case "pytorch":
      return 1.0;
    case "onnx":
      return 0.9;
    case "webgpu":
      return 0.7;
    case "webnn":
      return 0.6;
    case "mps":
      return 1.0;
    case "ollama":
    default:
      return 1.0;
  }
}

/**
 * Compute performance for a given hardware profile, runtime backend,
 * model size (in billions of parameters), and quantization.
 */
export function computePerf(
  hw: HardwareProfile,
  runtime: RuntimeProfile,
  paramsB: number,
  quant: Quantization
): PerfResult {
  // -----------------------------
  // 1. Compute model VRAM usage
  // -----------------------------
  const bytesPerParam = 2.0 * quantizationMemoryMultiplier(quant);
  const modelBytes = paramsB * 1e9 * bytesPerParam;
  const modelVramGB = modelBytes / 1e9;

  const fitsInVram = modelVramGB <= hw.vramGB;
  const fitsInRam = modelVramGB <= hw.ramGB;

  // -----------------------------
  // 2. Determine execution mode
  // -----------------------------
  let mode: PerfResult["mode"];
  if (fitsInVram && hw.gpuVendor !== "None") mode = "GPU";
  else if (fitsInRam) mode = "CPU";
  else mode = "CPU+Disk";

  // -----------------------------
  // 3. Compute decode speed
  // -----------------------------
  const backendMult = backendPerfMultiplier(runtime.backend);

  const gpuPerf =
    hw.tflopsFP16 * 0.6 +
    hw.tflopsINT8 * 0.4 +
    hw.memoryBandwidthGBs * 0.2;

  const cpuPerf =
    hw.cpuCores * hw.cpuBoostGHz * (hw.hasAVX512 ? 1.3 : hw.hasAVX2 ? 1.1 : 1.0);

  const rawPerf =
    mode === "GPU"
      ? gpuPerf * backendMult
      : mode === "CPU"
      ? cpuPerf * 0.6
      : cpuPerf * 0.25;

  const decodeTokPerSec = Math.max(
    1,
    (rawPerf / paramsB) * (hw.isLaptop ? 0.85 : 1.0)
  );

  const prefillTokPerSec = decodeTokPerSec * 1.5;

  // -----------------------------
  // 4. Compute TTFT
  // -----------------------------
  const ttftSeconds =
    (paramsB / 7) *
    (mode === "GPU" ? 0.5 : mode === "CPU" ? 1.2 : 2.0) *
    (2.0 - backendMult * 0.5);

  // -----------------------------
  // 5. Max context tokens
  // -----------------------------
  const maxContextTokens = fitsInVram
    ? Math.floor(hw.vramGB * 2048)
    : fitsInRam
    ? Math.floor(hw.ramGB * 512)
    : 2048;

  // -----------------------------
  // 6. Perceived speed
  // -----------------------------
  let perceivedSpeed: PerfResult["perceivedSpeed"];
  if (decodeTokPerSec < 5 || ttftSeconds > 5) perceivedSpeed = "Very slow";
  else if (decodeTokPerSec < 10 || ttftSeconds > 3) perceivedSpeed = "Slow";
  else if (decodeTokPerSec < 20 || ttftSeconds > 1.5) perceivedSpeed = "OK";
  else if (decodeTokPerSec < 40 || ttftSeconds > 0.7) perceivedSpeed = "Fast";
  else perceivedSpeed = "Instant";

  return {
    totalVramGB: hw.vramGB,
    modelVramGB,
    fitsInVram,
    fitsInRam,
    mode,
    decodeTokPerSec,
    prefillTokPerSec,
    ttftSeconds,
    maxContextTokens,
    perceivedSpeed,
    paragraphTokens: 120,
  };
}

/**
 * Default runtime backend.
 */
export function defaultRuntimeProfile(): RuntimeProfile {
  return { backend: "ollama" };
}

/**
 * Default hardware profile (placeholder).
 * Real presets will override this.
 */
export function detectHardwareProfile(): HardwareProfile {
  return {
    cpuVendor: "Intel",
    cpuModel: "Core i7-12700H",
    cpuCores: 6,
    cpuThreads: 12,
    cpuBaseGHz: 2.3,
    cpuBoostGHz: 4.7,
    cpuTdpWatts: 45,
    hasAVX2: true,
    hasAVX512: false,

    ramGB: 16,
    ramType: "DDR5",
    ramSpeedMT: 4800,

    gpuVendor: "NVIDIA",
    gpuModel: "RTX 3060 Laptop",
    gpuArchitecture: "Ampere",
    vramGB: 6,
    vramType: "GDDR6",
    memoryBandwidthGBs: 192,
    tflopsFP16: 20,
    tflopsFP32: 10,
    tflopsINT8: 40,

    os: "Windows",
    isLaptop: true,
    coolingClass: "Thin",
    pcieGen: 4,
  };
}
