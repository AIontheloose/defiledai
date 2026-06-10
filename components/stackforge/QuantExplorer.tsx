"use client";

import { useState } from "react";
import quants from "@/data/quants.json";

export default function QuantExplorer() {
  const [selectedQuant, setSelectedQuant] =
    useState("q4_k_m");

  const quant = quants.find(
    (q) => q.id === selectedQuant
  );

  if (!quant) return null;

  return (
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
        Quant Explorer
      </div>

      <h3 className="text-xl font-bold">
        {quant.name}
      </h3>

      <p
        className="mt-2 text-sm"
        style={{
          color: "var(--muted2)",
        }}
      >
        Compare VRAM usage, speed,
        and quality tradeoffs.
      </p>

      <select
        value={selectedQuant}
        onChange={(e) =>
          setSelectedQuant(
            e.target.value
          )
        }
        className="mt-4 w-full rounded-lg px-3 py-2"
        style={{
          background: "var(--surface)",
          color: "var(--fg)",
          border: "1px solid var(--border)",
        }}
      >
        {quants.map((quant) => (
          <option
            key={quant.id}
            value={quant.id}
          >
            {quant.name}
          </option>
        ))}
      </select>

      <div className="mt-5 grid gap-3">
        <div
          className="rounded-lg p-3"
          style={{
            background:
              "var(--surface)",
          }}
        >
          <div className="text-sm">
            VRAM Usage
          </div>

          <div className="mt-1 text-lg font-bold">
            {Math.round(
              quant.vram_modifier *
                100
            )}
            %
          </div>
        </div>

        <div
          className="rounded-lg p-3"
          style={{
            background:
              "var(--surface)",
          }}
        >
          <div className="text-sm">
            Speed
          </div>

          <div className="mt-1 text-lg font-bold">
            {Math.round(
              quant.speed_modifier *
                100
            )}
            %
          </div>
        </div>

        <div
          className="rounded-lg p-3"
          style={{
            background:
              "var(--surface)",
          }}
        >
          <div className="text-sm">
            Quality
          </div>

          <div className="mt-1 text-lg font-bold">
            {Math.round(
              quant.quality_modifier *
                100
            )}
            %
          </div>
        </div>
      </div>

      {quant.id === "q4_k_m" && (
        <div
          className="mt-4 rounded-lg p-3"
          style={{
            border:
              "1px solid var(--accent)",
          }}
        >
          Recommended default
          quantization for most
          users.
        </div>
      )}
    </div>
  );
}