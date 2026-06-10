"use client";

import hardware from "@/data/hardware.json";
import models from "@/data/models.json";

import { useStackForge } from "@/lib/stackforge/store";
import { getFitStatus } from "@/lib/stackforge/fit-engine";

export default function RecommendationCards() {
  const { selectedGpu } = useStackForge();

  const gpu = hardware.find(
    (g) => g.id === selectedGpu
  );

  if (!gpu) {
    return (
      <div
        className="rounded-xl p-4"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      >
        Select hardware to receive recommendations.
      </div>
    );
  }

  const fitModels = models.filter((model) => {
    const fit = getFitStatus(
      gpu.vram,
      model.vram
    );

    return fit === "fit";
  });

  const offloadModels = models.filter((model) => {
    const fit = getFitStatus(
      gpu.vram,
      model.vram
    );

    return fit === "offload";
  });

  const bestOverall =
    fitModels.find(
      (m) => m.id === "qwen3-32b"
    ) ||
    fitModels.find(
      (m) => m.id === "gemma3-27b"
    ) ||
    fitModels[0];

  const bestQuality =
    fitModels
      .slice()
      .sort((a, b) => b.vram - a.vram)[0];

  const stretchGoal =
    offloadModels
      .slice()
      .sort((a, b) => b.vram - a.vram)[0];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Best Overall */}

      <div
        className="rounded-xl p-5"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="mb-2 text-xs uppercase"
          style={{
            color: "var(--accent)",
            letterSpacing: "0.15em",
          }}
        >
          Best Overall
        </div>

        <h3 className="text-xl font-bold">
          {bestOverall?.name ?? "N/A"}
        </h3>

        <p
          className="mt-2 text-sm"
          style={{
            color: "var(--muted2)",
          }}
        >
          Strong balance of speed,
          quality, memory usage,
          and compatibility.
        </p>
      </div>

      {/* Best Quality */}

      <div
        className="rounded-xl p-5"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="mb-2 text-xs uppercase"
          style={{
            color: "var(--accent2)",
            letterSpacing: "0.15em",
          }}
        >
          Best Quality
        </div>

        <h3 className="text-xl font-bold">
          {bestQuality?.name ?? "N/A"}
        </h3>

        <p
          className="mt-2 text-sm"
          style={{
            color: "var(--muted2)",
          }}
        >
          Highest quality model
          that fully fits inside
          your available VRAM.
        </p>
      </div>

      {/* Stretch Goal */}

      <div
        className="rounded-xl p-5"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="mb-2 text-xs uppercase"
          style={{
            color: "#f59e0b",
            letterSpacing: "0.15em",
          }}
        >
          Stretch Goal
        </div>

        <h3 className="text-xl font-bold">
          {stretchGoal?.name ?? "None"}
        </h3>

        <p
          className="mt-2 text-sm"
          style={{
            color: "var(--muted2)",
          }}
        >
          Larger models that may
          run with CPU offloading
          or additional hardware.
        </p>
      </div>
    </div>
  );
}