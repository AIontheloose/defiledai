// app/tools/hardware-simulator/benchmarkEngine.ts
// ======================================================
//  BENCHMARK ENGINE (STRICT TYPESCRIPT)
// ======================================================

import { computePerf, defaultRuntimeProfile } from "./hardwareEngine";
import { DEVICE_PRESETS, MODEL_PRESETS, BACKEND_PRESETS } from "./presets";

export type BenchmarkResult = {
  device: string;
  model: string;
  backend: string;

  ttft: number;
  decode: number;
  prefill: number;

  fitsVram: boolean;
  fitsRam: boolean;
  context: number;
};

export type BenchmarkConfig = {
  modelId: string;
  backendId: string;
};

/**
 * Runs a full benchmark across all device presets.
 */
export async function runFullBenchmark(
  config: BenchmarkConfig,
  onProgress?: (fraction: number) => void
): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];

  const model = MODEL_PRESETS.find((m) => m.id === config.modelId);
  const backend = BACKEND_PRESETS.find((b) => b.id === config.backendId);

  if (!model || !backend) return results;

  const runtime = { ...defaultRuntimeProfile(), backend: backend.value };

  const total = DEVICE_PRESETS.length;
  let index = 0;

  for (const preset of DEVICE_PRESETS) {
    const perf = computePerf(
      preset.profile,
      runtime,
      model.paramsB,
      model.quant
    );

    results.push({
      device: preset.label,
      model: model.label,
      backend: backend.label,

      ttft: perf.ttftSeconds,
      decode: perf.decodeTokPerSec,
      prefill: perf.prefillTokPerSec,

      fitsVram: perf.fitsInVram,
      fitsRam: perf.fitsInRam,
      context: perf.maxContextTokens,
    });

    index++;
    if (onProgress) onProgress(index / total);

    await new Promise((r) => setTimeout(r, 40));
  }

  return results;
}
