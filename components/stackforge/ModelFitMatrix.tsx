"use client";

import hardware from "@/data/hardware.json";
import models from "@/data/models.json";

import { useStackForge } from "@/lib/stackforge/store";
import { getFitStatus } from "@/lib/stackforge/fit-engine";

export default function ModelFitMatrix() {
  const { selectedGpu } = useStackForge();

  const gpu = hardware.find(
    (g) => g.id === selectedGpu
  );

  if (!gpu) {
    return (
      <div className="card rounded-xl p-4">
        Select hardware to see model compatibility.
      </div>
    );
  }

  return (
    <div className="card rounded-xl p-4">
      <h3 className="text-lg font-semibold">
        Model Fit Matrix
      </h3>

      <div className="mt-4 space-y-3">
        {models.map((model) => {
          const fit = getFitStatus(
            gpu.vram,
            model.vram
          );

          return (
            <div
              key={model.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <span>{model.name}</span>

              <span>
                {fit === "fit" && "✓ Fits"}
                {fit === "offload" &&
                  "⚠ Offload"}
                {fit === "no-fit" &&
                  "✕ No Fit"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}