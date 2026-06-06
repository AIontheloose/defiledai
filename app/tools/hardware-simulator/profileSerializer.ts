// app/tools/hardware-simulator/profileSerializer.ts
// ======================================================
//  PROFILE SERIALIZATION + VALIDATION (STRICT TS)
// ======================================================

import type { HardwareProfile } from "./hardwareEngine";

/**
 * Serialize a HardwareProfile to JSON.
 */
export function serializeProfile(profile: HardwareProfile): string {
  return JSON.stringify(profile, null, 2);
}

/**
 * Validate that an unknown object matches HardwareProfile.
 */
export function isValidHardwareProfile(obj: any): obj is HardwareProfile {
  if (typeof obj !== "object" || obj === null) return false;

  const requiredString = [
    "cpuVendor",
    "cpuModel",
    "gpuVendor",
    "gpuModel",
    "gpuArchitecture",
    "ramType",
    "vramType",
    "os",
    "coolingClass",
  ];

  const requiredNumber = [
    "cpuCores",
    "cpuThreads",
    "cpuBaseGHz",
    "cpuBoostGHz",
    "cpuTdpWatts",
    "ramGB",
    "ramSpeedMT",
    "vramGB",
    "memoryBandwidthGBs",
    "tflopsFP16",
    "tflopsFP32",
    "tflopsINT8",
    "pcieGen",
  ];

  const requiredBoolean = ["hasAVX2", "hasAVX512", "isLaptop"];

  for (const key of requiredString) {
    if (typeof obj[key] !== "string" && obj[key] !== null) return false;
  }

  for (const key of requiredNumber) {
    if (typeof obj[key] !== "number") return false;
  }

  for (const key of requiredBoolean) {
    if (typeof obj[key] !== "boolean") return false;
  }

  return true;
}

/**
 * Deserialize JSON → HardwareProfile (with validation).
 */
export function deserializeProfile(json: string): HardwareProfile | null {
  try {
    const parsed = JSON.parse(json);
    return isValidHardwareProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
