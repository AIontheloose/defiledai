"use client";

import React, { useState } from "react";

import {
  generateDecodeVsParams,
  generateVramVsContext,
  generateTtftVsParams,
  generateBackendComparison,
} from "./chartData";

import { DEVICE_PRESETS, MODEL_PRESETS } from "./presets";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export function ChartsPanel() {
  const [deviceId, setDeviceId] = useState(DEVICE_PRESETS[0].id);
  const [modelId, setModelId] = useState(MODEL_PRESETS[0].id);

  const decodeData = generateDecodeVsParams(deviceId);
  const vramData = generateVramVsContext(deviceId);
  const ttftData = generateTtftVsParams(deviceId);
  const backendData = generateBackendComparison(deviceId, modelId);

  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold">Performance Charts</h2>
        <p className="text-sm text-[var(--muted)]">
          Visualize how hardware, model size, and backend affect performance.
        </p>
      </div>

      {/* Device + model selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="border border-[var(--border)] rounded px-2 py-1 bg-[var(--bg)]"
        >
          {DEVICE_PRESETS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>

        <select
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          className="border border-[var(--border)] rounded px-2 py-1 bg-[var(--bg)]"
        >
          {MODEL_PRESETS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Decode vs Params */}
      <div>
        <h3 className="text-sm font-medium mb-2">Decode Speed vs Model Size</h3>
        <div className="h-64 min-w-0 min-h-0 block">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={decodeData}>
              <XAxis dataKey="params" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="decode"
                stroke="var(--accent)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* VRAM vs Context */}
      <div>
        <h3 className="text-sm font-medium mb-2">VRAM vs Max Context</h3>
        <div className="h-64 min-w-0 min-h-0 block">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vramData}>
              <XAxis dataKey="vram" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="context" fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TTFT vs Params */}
      <div>
        <h3 className="text-sm font-medium mb-2">TTFT vs Model Size</h3>
        <div className="h-64 min-w-0 min-h-0 block">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ttftData}>
              <XAxis dataKey="params" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ttft"
                stroke="var(--accent)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Backend comparison */}
      <div>
        <h3 className="text-sm font-medium mb-2">Backend Comparison</h3>
        <div className="h-64 min-w-0 min-h-0 block">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={backendData}>
              <XAxis dataKey="name" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="decode" fill="var(--accent)" />
              <Bar dataKey="ttft" fill="var(--border)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
