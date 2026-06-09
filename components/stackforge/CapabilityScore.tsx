"use client";

import hardware from "@/data/hardware.json";
import { useStackForge } from "@/lib/stackforge/store";

export default function CapabilityScore() {
  const { selectedGpu } =
    useStackForge();

  const gpu = hardware.find(
    (g) => g.id === selectedGpu
  );

  let score = 0;
  let tier = "N/A";

  if (gpu) {
    score = Math.min(
      100,
      Math.round(
        gpu.vram * 2 +
          gpu.bandwidth / 30
      )
    );

    if (score >= 90) tier = "S";
    else if (score >= 75) tier = "A";
    else if (score >= 60) tier = "B";
    else if (score >= 40) tier = "C";
    else tier = "D";
  }

  return (
    <div className="rounded-xl border p-4">
      <h3 className="text-lg font-semibold">
        AI Capability Score
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Estimated local AI capability.
      </p>

      <div className="mt-6 text-5xl font-bold">
        {score}/100
      </div>

      <div className="mt-2 text-sm text-muted-foreground">
        Tier {tier}
      </div>
    </div>
  );
}