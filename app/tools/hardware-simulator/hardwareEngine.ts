// app/tools/hardware-simulator/hardwareEngine.ts

export type HardwareProfile = {
  os: string;
  cpuKind: string;
  cores: number;
  ramGB: number;
  gpuKind: string;
  gpuModel: string | null;
  vramGB: number;
  bandwidthClass: string;
  pcieGen: number;
  hasAVX512: boolean;
  isLaptop: boolean;
};

export type RuntimeProfile = {
  backend: string;
};

export type PerfResult = {
  totalVramGB: number;
  modelVramGB: number;
  fitsInVram: boolean;
  fitsInRam: boolean;
  mode: string;
  decodeTokPerSec: number;
  prefillTokPerSec: number;
  ttftSeconds: number;
  maxContextTokens: number;
  perceivedSpeed: string;
  paragraphTokens: number;
};

export function computePerf(
  profile: HardwareProfile,
  runtime: RuntimeProfile,
  paramsB: number,
  quant: string
): PerfResult {
  const modelVram = paramsB * (quant.startsWith("Q") ? 0.5 : 1.0);
  const fitsVram = modelVram <= profile.vramGB;
  const fitsRam = modelVram <= profile.ramGB;

  const decode = fitsVram ? 40 / paramsB : 10 / paramsB;
  const prefill = fitsVram ? 60 / paramsB : 20 / paramsB;
  const ttft = fitsVram ? 0.4 * paramsB : 1.2 * paramsB;

  return {
    totalVramGB: profile.vramGB,
    modelVramGB: modelVram,
    fitsInVram: fitsVram,
    fitsInRam: fitsRam,
    mode: fitsVram ? "GPU" : "CPU",
    decodeTokPerSec: decode,
    prefillTokPerSec: prefill,
    ttftSeconds: ttft,
    maxContextTokens: fitsVram ? 32768 : 8192,
    perceivedSpeed: decode > 10 ? "Fast" : "Slow",
    paragraphTokens: 120,
  };
}

export function detectHardwareProfile(): HardwareProfile {
  return {
    os: "Windows",
    cpuKind: "Intel",
    cores: 8,
    ramGB: 16,
    gpuKind: "NVIDIA",
    gpuModel: "RTX 3060",
    vramGB: 12,
    bandwidthClass: "high",
    pcieGen: 4,
    hasAVX512: false,
    isLaptop: false,
  };
}

export function defaultRuntimeProfile(): RuntimeProfile {
  return {
    backend: "ollama",
  };
}
