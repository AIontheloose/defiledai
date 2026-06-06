// app/tools/hardware-simulator/profileSerializer.ts
import type { HardwareProfile } from "./hardwareEngine";

export function serializeProfile(profile: HardwareProfile): string {
  return JSON.stringify(profile, null, 2);
}

export function deserializeProfile(json: string): HardwareProfile | null {
  try {
    const obj = JSON.parse(json);

    if (
      typeof obj.os !== "string" ||
      typeof obj.cpuKind !== "string" ||
      typeof obj.cores !== "number" ||
      typeof obj.ramGB !== "number" ||
      typeof obj.gpuKind !== "string" ||
      (obj.gpuModel !== null && typeof obj.gpuModel !== "string") ||
      typeof obj.vramGB !== "number" ||
      typeof obj.bandwidthClass !== "string" ||
      typeof obj.pcieGen !== "number" ||
      typeof obj.hasAVX512 !== "boolean" ||
      typeof obj.isLaptop !== "boolean"
    ) {
      return null;
    }

    return obj as HardwareProfile;
  } catch {
    return null;
  }
}
