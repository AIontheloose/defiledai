// app/tools/hardware-simulator/chartData.ts
import { computePerf, defaultRuntimeProfile } from "./hardwareEngine";
import { DEVICE_PRESETS, MODEL_PRESETS, BACKEND_PRESETS } from "./presets";

export function generateDecodeVsParams(deviceId: string) {
  const device = DEVICE_PRESETS.find((d) => d.id === deviceId);
  if (!device) return [];

  const profile = device.apply();
  const runtime = defaultRuntimeProfile();

  return MODEL_PRESETS.map((m) => {
    const perf = computePerf(profile, runtime, m.paramsB, m.quant);
    return {
      name: m.label,
      params: m.paramsB,
      decode: perf.decodeTokPerSec,
    };
  });
}

export function generateVramVsContext(deviceId: string) {
  const device = DEVICE_PRESETS.find((d) => d.id === deviceId);
  if (!device) return [];

  const profile = device.apply();
  const runtime = defaultRuntimeProfile();

  return MODEL_PRESETS.map((m) => {
    const perf = computePerf(profile, runtime, m.paramsB, m.quant);
    return {
      name: m.label,
      vram: perf.modelVramGB,
      context: perf.maxContextTokens,
    };
  });
}

export function generateTtftVsParams(deviceId: string) {
  const device = DEVICE_PRESETS.find((d) => d.id === deviceId);
  if (!device) return [];

  const profile = device.apply();
  const runtime = defaultRuntimeProfile();

  return MODEL_PRESETS.map((m) => {
    const perf = computePerf(profile, runtime, m.paramsB, m.quant);
    return {
      name: m.label,
      params: m.paramsB,
      ttft: perf.ttftSeconds,
    };
  });
}

export function generateBackendComparison(deviceId: string, modelId: string) {
  const device = DEVICE_PRESETS.find((d) => d.id === deviceId);
  const model = MODEL_PRESETS.find((m) => m.id === modelId);
  if (!device || !model) return [];

  const profile = device.apply();

  return BACKEND_PRESETS.map((b) => {
    const runtime = { ...defaultRuntimeProfile(), backend: b.value };
    const perf = computePerf(profile, runtime, model.paramsB, model.quant);

    return {
      name: b.label,
      decode: perf.decodeTokPerSec,
      ttft: perf.ttftSeconds,
    };
  });
}
