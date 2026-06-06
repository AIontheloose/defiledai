// app/tools/hardware-simulator/BenchmarkAll.tsx
"use client";

import React, { useState } from "react";
import { runFullBenchmark, type BenchmarkResult } from "./benchmarkEngine";

export function BenchmarkAll() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BenchmarkResult[]>([]);

  async function handleRun() {
    setRunning(true);
    setProgress(0);
    setResults([]);

    const total = 1; // one batch of device presets
    const data = await runFullBenchmark();

    setResults(data);
    setProgress(1);
    setRunning(false);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "benchmark-results.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Benchmark All Presets</h2>
        <p className="text-sm text-[var(--muted)]">
          Runs a full performance simulation across all device presets.
        </p>
      </div>

      <button
        onClick={handleRun}
        disabled={running}
        className="px-4 py-2 border border-[var(--border)] rounded text-sm hover:border-[var(--accent)] transition disabled:opacity-50"
      >
        {running ? "Running…" : "Run Benchmark"}
      </button>

      {running && (
        <div className="w-full h-2 bg-[var(--border)] rounded">
          <div
            className="h-full bg-[var(--accent)] rounded transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <button
            onClick={exportJSON}
            className="px-3 py-1 border border-[var(--border)] rounded text-xs hover:border-[var(--accent)] transition"
          >
            Export JSON
          </button>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-[var(--border)]">
                  <th className="py-2">Device</th>
                  <th>TTFT</th>
                  <th>Decode</th>
                  <th>Prefill</th>
                  <th>VRAM</th>
                  <th>RAM</th>
                  <th>Context</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--border)] hover:bg-[var(--accent-bg)] transition"
                  >
                    <td className="py-2">{r.device}</td>
                    <td>{r.ttft.toFixed(2)}s</td>
                    <td>{r.decode.toFixed(1)}</td>
                    <td>{r.prefill.toFixed(1)}</td>
                    <td>{r.fitsVram ? "✔" : "✘"}</td>
                    <td>{r.fitsRam ? "✔" : "✘"}</td>
                    <td>{r.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
