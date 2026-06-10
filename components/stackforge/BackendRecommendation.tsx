"use client";

import hardware from "@/data/hardware.json";

import { useStackForge } from "@/lib/stackforge/store";
import { recommendBackend } from "@/lib/stackforge/backend-engine";

export default function BackendRecommendation() {
  const { selectedGpu } = useStackForge();

  const gpu = hardware.find(
    (g) => g.id === selectedGpu
  );

  if (!gpu) {
    return (
      <div className="card rounded-xl p-4">
        Select hardware first.
      </div>
    );
  }

  const backend = recommendBackend(
    gpu.name,
    gpu.tier
  );

  return (
    <div className="card rounded-xl p-4">
      <div className="section-label">
        Recommended Backend
      </div>

      <h3 className="mt-3 text-2xl font-bold">
        {backend}
      </h3>

      <p
        className="mt-3 text-sm"
        style={{ color: "var(--muted2)" }}
      >
        Recommended inference backend
        for your selected hardware.
      </p>
    </div>
  );
}