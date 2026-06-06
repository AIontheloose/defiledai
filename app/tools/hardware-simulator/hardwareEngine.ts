// app/tools/hardware-simulator/hardwareEngine.ts
// FIXED VERSION — presets now fully override hardware

export type HardwareProfile = {
  os: string;
  cpuKind: string;
  cores: number;
  ramGB: number;

  gpuKind: string;
  gpuModel: string | null;
  vramGB: number;

  bandwidthClass: "Low" | "Medium" | "High" | "Extreme";
  pcieGen: number;
  hasAVX512: boolean;
  isLaptop: boolean;

  multiGPU?: number;
};

export type RuntimeProfile = {
  backend: string;
  deviceType: string;
  isDocker: boolean;
  isVirtualized: boolean;
};

// ---------------------------------------------------------
// DEFAULT RUNTIME
// ---------------------------------------------------------

export function defaultRuntimeProfile(): RuntimeProfile {
  return {
    backend: "Ollama",
    deviceType: "Desktop",
    isDocker: false,
    isVirtualized: false,
  };
}

// ---------------------------------------------------------
// DETECT HARDWARE (used ONLY as initial baseline)
// ---------------------------------------------------------

export function detectHardwareProfile(): HardwareProfile {
  // This is intentionally generic — presets override everything.
  return {
    os: "Unknown",
    cpuKind: "Unknown",
    cores: 8,
    ramGB: 16,

    gpuKind: "Integrated",
    gpuModel: null,
    vramGB: 1,

    bandwidthClass: "Low",
    pcieGen: 3,
    hasAVX512: false,
    isLaptop: false,
  };
}

// ---------------------------------------------------------
// PERFORMANCE ENGINE
// ---------------------------------------------------------

export function computePerf(
  profile: HardwareProfile,
  runtime: RuntimeProfile,
  paramsB: number,
  quant: string
) {
  // -----------------------------
  // VRAM REQUIREMENTS
  // -----------------------------
  const quantFactor = {
    F16: 2.0,
    Q8_0: 1.0,
    Q6_K: 0.75,
    Q5_K_M: 0.65,
    Q4_K_M: 0.50,
    Q4_K_S: 0.45,
    Q3_K_M: 0.35,
    A3B: 0.30,
  }[quant] ?? 1.0;

  const modelVramGB = paramsB * quantFactor;

  const fitsInVram = modelVramGB <= profile.vramGB;
  const fitsInRam = modelVramGB <= profile.ramGB;

  // -----------------------------
  // EXECUTION MODE
  // -----------------------------
  let mode: "GPU" | "CPU" = "CPU";

  if (profile.gpuKind !== "Integrated" && profile.vramGB >= modelVramGB) {
    mode = "GPU";
  }

  // Apple Silicon = always unified memory
  if (profile.cpuKind === "AppleSilicon") {
    mode = "Unified";
  }

  // -----------------------------
  // BANDWIDTH MULTIPLIERS
  // -----------------------------
  const bandwidthMultiplier = {
    Low: 0.25,
    Medium: 0.5,
    High: 1.0,
    Extreme: 1.5,
  }[profile.bandwidthClass];

  // -----------------------------
  // BASE SPEEDS
  // -----------------------------
  let decode = 0;
  let prefill = 0;

  if (mode === "GPU") {
    decode = 40 * bandwidthMultiplier;
    prefill = 20 * bandwidthMultiplier;
  }

  if (mode === "Unified") {
    decode = 8 * bandwidthMultiplier;
    prefill = 5 * bandwidthMultiplier;
  }

  if (mode === "CPU") {
    decode = 3 * bandwidthMultiplier;
    prefill = 2 * bandwidthMultiplier;
  }

  // Model size penalty
  decode /= paramsB / 7;
  prefill /= paramsB / 7;

  // Docker penalty
  if (runtime.isDocker) {
    decode *= 0.9;
    prefill *= 0.9;
  }

  // Virtualization penalty
  if (runtime.isVirtualized) {
    decode *= 0.8;
    prefill *= 0.8;
  }

  // -----------------------------
  // TTFT
  // -----------------------------
  let ttft = 0.5 + paramsB * 0.1;

  if (mode === "Unified") ttft *= 1.5;
  if (mode === "CPU") ttft *= 2.0;

  // -----------------------------
  // CONTEXT SIZE
  // -----------------------------
  let maxContextTokens = Math.floor(profile.ramGB * 1500);

  if (mode === "Unified") maxContextTokens *= 0.6;
  if (mode === "CPU") maxContextTokens *= 0.4;

  // -----------------------------
  // PERCEIVED SPEED
  // -----------------------------
  let perceivedSpeed = "slow";

  if (decode > 20) perceivedSpeed = "normal";
  if (decode > 40) perceivedSpeed = "fast";
  if (decode > 80) perceivedSpeed = "instant";

  return {
    totalVramGB: profile.vramGB,
    modelVramGB,
    fitsInVram,
    fitsInRam,
    mode,
    decodeTokPerSec: decode,
    prefillTokPerSec: prefill,
    ttftSeconds: ttft,
    maxContextTokens,
    perceivedSpeed,
    paragraphTokens: 160,
  };
}
