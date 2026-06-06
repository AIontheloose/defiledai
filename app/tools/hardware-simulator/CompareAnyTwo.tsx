"use client";

import React, { useState } from "react";
import {
  computePerf,
  defaultRuntimeProfile,
  type Quantization,
  type RuntimeProfile,
} from "./hardwareEngine";

import {
  DEVICE_PRESETS,
  MODEL_PRESETS,
  BACKEND_PRESETS,
} from "./presets";

export function CompareAnyTwo() {
  const [leftDevice, setLeftDevice] = useState(DEVICE_PRESETS[0].id);
  const [rightDevice, setRightDevice] = useState(
    DEVICE_PRESETS[1]?.id ?? DEVICE_PRESETS[0].id
  );

  const [modelId, setModelId] = useState(MODEL_PRESETS[0].id);
  const [backendId, setBackendId] = useState(BACKEND_PRESETS[0].id);

  const model = MODEL_PRESETS.find((m) => m.id === modelId)!;
  const backend = BACKEND_PRESETS.find((b) => b.id === backendId)!;

  const runtime: RuntimeProfile = {
    ...defaultRuntimeProfile(),
    backend: backend.value as RuntimeProfile["backend"],
  };

  const leftProfile = DEVICE_PRESETS.find((d) => d.id === leftDevice)!.profile;
  const rightProfile = DEVICE_PRESETS.find((d) => d.id === rightDevice)!.profile;

  const leftPerf = computePerf(
    leftProfile,
    runtime,
    model.paramsB,
    model.quant as Quantization
  );

  const rightPerf = computePerf(
    rightProfile,
    runtime,
    model.paramsB,
    model.quant as Quantization
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Compare Any Two Devices</h2>
        <p className="text-sm text-[var(--muted)]">
          Select two hardware presets and compare their performance for the same
          model and backend.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Left device
          </div>
          <select
            value={leftDevice}
            onChange={(e) => setLeftDevice(e.target.value)}
            className="w-full border border-[var(--border)] rounded px-2 py-1 bg-[var(--bg)]"
          >
            {DEVICE_PRESETS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Model + backend
          </div>
          <div className="flex flex-col gap-2">
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

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Right device
          </div>
          <select
            value={rightDevice}
            onChange={(e) => setRightDevice(e.target.value)}
            className="w-full border border-[var(--border)] rounded px-2 py-1 bg-[var(--bg)]"
          >
            {DEVICE_PRESETS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="border border-[var(--border)] rounded-md p-4 space-y-2">
          <div className="font-medium">
            {DEVICE_PRESETS.find((d) => d.id === leftDevice)?.label}
          </div>
          <div className="grid grid-cols-2 gap-1">
            <span>TTFT</span>
            <span>{leftPerf.ttftSeconds.toFixed(2)} s</span>

            <span>Decode</span>
            <span>{leftPerf.decodeTokPerSec.toFixed(1)} tok/s</span>

            <span>Prefill</span>
            <span>{leftPerf.prefillTokPerSec.toFixed(1)} tok/s</span>

            <span>Fits VRAM</span>
            <span>{leftPerf.fitsInVram ? "✔" : "✘"}</span>

            <span>Fits RAM</span>
            <span>{leftPerf.fitsInRam ? "✔" : "✘"}</span>

            <span>Mode</span>
            <span>{leftPerf.mode}</span>

            <span>Context</span>
            <span>{leftPerf.maxContextTokens}</span>
          </div>
        </div>

        <div className="border border-[var(--border)] rounded-md p-4 space-y-2">
          <div className="font-medium">
            {DEVICE_PRESETS.find((d) => d.id === rightDevice)?.label}
          </div>
          <div className="grid grid-cols-2 gap-1">
            <span>TTFT</span>
            <span>{rightPerf.ttftSeconds.toFixed(2)} s</span>

            <span>Decode</span>
            <span>{rightPerf.decodeTokPerSec.toFixed(1)} tok/s</span>

            <span>Prefill</span>
            <span>{rightPerf.prefillTokPerSec.toFixed(1)} tok/s</span>

            <span>Fits VRAM</span>
            <span>{rightPerf.fitsInVram ? "✔" : "✘"}</span>

            <span>Fits RAM</span>
            <span>{rightPerf.fitsInRam ? "✔" : "✘"}</span>

            <span>Mode</span>
            <span>{rightPerf.mode}</span>

            <span>Context</span>
            <span>{rightPerf.maxContextTokens}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
