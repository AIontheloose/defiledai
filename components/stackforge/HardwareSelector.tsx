"use client";

import hardware from "@/data/hardware.json";
import { useStackForge } from "@/lib/stackforge/store";

export default function HardwareSelector() {
  const { selectedGpu, setSelectedGpu } = useStackForge();

  const gpu = hardware.find(
    (g) => g.id === selectedGpu
  );

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      <h3 className="text-lg font-semibold">
        Hardware Selection
      </h3>

      <p
        className="mt-2 text-sm"
        style={{ color: "var(--muted2)" }}
      >
        Choose your primary GPU.
      </p>

      <select
        value={selectedGpu}
        onChange={(e) =>
          setSelectedGpu(e.target.value)
        }
        className="mt-4 w-full rounded-lg px-3 py-2"
        style={{
          background: "var(--surface)",
          color: "var(--fg)",
          border: "1px solid var(--border)",
        }}
      >
        <option value="">
          Select GPU
        </option>

        {hardware.map((gpu) => (
          <option
            key={gpu.id}
            value={gpu.id}
          >
            {gpu.name}
          </option>
        ))}
      </select>

      {gpu && (
        <div
          className="mt-4 rounded-lg p-4"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="font-semibold">
            {gpu.name}
          </div>

          <div
            className="mt-2 text-sm"
            style={{ color: "var(--muted2)" }}
          >
            VRAM: {gpu.vram} GB
          </div>

          <div
            className="text-sm"
            style={{ color: "var(--muted2)" }}
          >
            Bandwidth: {gpu.bandwidth} GB/s
          </div>

          <div
            className="text-sm"
            style={{ color: "var(--muted2)" }}
          >
            Tier: {gpu.tier}
          </div>
        </div>
      )}
    </div>
  );
}