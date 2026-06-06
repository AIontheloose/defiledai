// app/tools/hardware-simulator/benchmarkEngine.ts
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

export async function runFullBenchmark(): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];

  const model = MODEL_PRESETS[0];
  const backend = BACKEND_PRESETS[0];
  const runtime = { ...defaultRuntimeProfile(), backend: backend.value };

  for (const preset of DEVICE_PRESETS) {
    const profile = preset.apply();
    const perf = computePerf(profile, runtime, model.paramsB, model.quant);

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

    await new Promise((r) => setTimeout(r, 50));
  }

  return results;
}
