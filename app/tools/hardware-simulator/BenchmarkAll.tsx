"use client";

import React, { useState } from "react";
import {
  runFullBenchmark,
  type BenchmarkResult,
  type BenchmarkConfig,
} from "./benchmarkEngine";

import { MODEL_PRESETS, BACKEND_PRESETS } from "./presets";

export function BenchmarkAll() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BenchmarkResult[]>([]);

  const [modelId, setModelId] = useState(MODEL_PRESETS[0].id);
  const [backendId, setBackendId] = useState(BACKEND_PRESETS[0].id);

  async function handleRun() {
    setRunning(true);
    setProgress(0);
    setResults([]);

    const config: BenchmarkConfig = { modelId, backendId };

    const data = await runFullBenchmark(config, (p) => setProgress(p));

    setResults(data);
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
        <h2 className="text-xl font-semibold">Benchmark All Devices</h2>
        <p className="text-sm text-[var(--muted)]">
          Run a full performance simulation across every hardware preset.
        </p>
      </div>

      {/* Model + backend selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
            Model
          </div>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="w-full border border-[var(--border)] rounded px-2 py-1 bg-[var(--bg)]"
          >
            {MODEL_PRESETS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
            Backend
          </div>
          <select
            value={backendId}
            onChange={(e) => setBackendId(e.target.value)}
            className="w-full border border-[var(--border)] rounded px-2 py-1 bg-[var(--bg)]"
          >
            {BACKEND_PRESETS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Run button */}
      <button
        onClick={handleRun}
        disabled={running}
        className="px-4 py-2 border border-[var(--border)] rounded text-sm hover:border-[var(--accent)] transition disabled:opacity-50"
      >
        {running ? "Running…" : "Run Benchmark"}
      </button>

      {/* Progress bar */}
      {running && (
        <div className="w-full h-2 bg-[var(--border)] rounded">
          <div
            className="h-full bg-[var(--accent)] rounded transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {/* Results table */}
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
