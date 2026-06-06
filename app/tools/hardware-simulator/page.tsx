"use client";

import React, { useState, useRef } from "react";

import {
  computePerf,
  detectHardwareProfile,
  defaultRuntimeProfile,
} from "./hardwareEngine";

import {
  DEVICE_PRESETS,
  MODEL_PRESETS,
  BACKEND_PRESETS,
} from "./presets";

import ChatTTFTDemo from "./ChatTTFTDemo";
import { Speedometer } from "./Speedometer";
import { SlowMotionToggle } from "./SlowMotionToggle";

import { CompareAnyTwo } from "./CompareAnyTwo";
import { BenchmarkAll } from "./BenchmarkAll";
import { ChartsPanel } from "./ChartsPanel";
import { ProfileExportImport } from "./ProfileExportImport";

export default function HardwareSimulatorPage() {
  const [profile, setProfile] = useState(detectHardwareProfile());
  const [runtime, setRuntime] = useState(defaultRuntimeProfile());

  const [modelParamsB, setModelParamsB] = useState(7);
  const [quant, setQuant] = useState("Q4_K_M");

  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedBackend, setSelectedBackend] = useState<string>("ollama");

  const [perf, setPerf] = useState(() =>
    computePerf(profile, runtime, modelParamsB, quant as any)
  );

  const [slowMotion, setSlowMotion] = useState(false);

  // Reset chat simulation
  const [demoSignal, setDemoSignal] = useState(0);

  // Scroll preservation
  const deviceScrollRef = useRef<HTMLDivElement>(null);
  const modelScrollRef = useRef<HTMLDivElement>(null);
  const backendScrollRef = useRef<HTMLDivElement>(null);

  // -----------------------------
  // PRESET APPLY FUNCTIONS
  // -----------------------------

  function applyDevicePreset(id: string) {
    const preset = DEVICE_PRESETS.find((p) => p.id === id);
    if (!preset) return;

    const scrollPos = deviceScrollRef.current?.scrollTop ?? 0;

    const newProfile = preset.apply();
    setProfile(newProfile);
    setSelectedDevice(id);

    setPerf(computePerf(newProfile, runtime, modelParamsB, quant as any));

    requestAnimationFrame(() => {
      if (deviceScrollRef.current) deviceScrollRef.current.scrollTop = scrollPos;
    });
  }

  function applyModelPreset(id: string) {
    const preset = MODEL_PRESETS.find((p) => p.id === id);
    if (!preset) return;

    const scrollPos = modelScrollRef.current?.scrollTop ?? 0;

    setModelParamsB(preset.paramsB);
    setQuant(preset.quant);
    setSelectedModel(id);

    setPerf(computePerf(profile, runtime, preset.paramsB, preset.quant));

    requestAnimationFrame(() => {
      if (modelScrollRef.current) modelScrollRef.current.scrollTop = scrollPos;
    });
  }

  function applyBackendPreset(id: string) {
    const preset = BACKEND_PRESETS.find((p) => p.id === id);
    if (!preset) return;

    const scrollPos = backendScrollRef.current?.scrollTop ?? 0;

    const newRuntime = { ...runtime, backend: preset.value };
    setRuntime(newRuntime);
    setSelectedBackend(id);

    setPerf(computePerf(profile, newRuntime, modelParamsB, quant as any));

    requestAnimationFrame(() => {
      if (backendScrollRef.current) backendScrollRef.current.scrollTop = scrollPos;
    });
  }

  function runSimulation() {
    setPerf(computePerf(profile, runtime, modelParamsB, quant as any));
    setDemoSignal((s) => s + 1); // reset chat
  }

  // -----------------------------
  // IMPORT PROFILE HANDLER
  // -----------------------------

  function handleImportProfile(p: typeof profile) {
    setProfile(p);
    setPerf(computePerf(p, runtime, modelParamsB, quant as any));
  }

  // -----------------------------
  // SCROLLABLE SELECTOR
  // -----------------------------

  function ScrollList({
    items,
    selected,
    onSelect,
    scrollRef,
  }: {
    items: { id: string; label: string; description?: string }[];
    selected: string;
    onSelect: (id: string) => void;
    scrollRef: React.RefObject<HTMLDivElement>;
  }) {
    return (
      <div className="border border-[var(--border)] rounded-md p-3 space-y-2">
        <div
          ref={scrollRef}
          className="max-h-48 overflow-y-auto space-y-2 pr-1"
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full text-left border rounded px-3 py-2 transition ${
                selected === item.id
                  ? "border-[var(--accent)] bg-[var(--accent-bg)]"
                  : "border-[var(--border)] hover:border-[var(--accent)]"
              }`}
            >
              <div className="font-medium">{item.label}</div>
              {item.description && (
                <div className="text-xs text-[var(--muted)]">
                  {item.description}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // -----------------------------
  // PAGE LAYOUT (A1)
  // -----------------------------

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">

        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-semibold">Hardware LLM Performance Simulator</h1>
          <p className="text-sm text-[var(--muted)]">
            Realistic TTFT, decode speed, memory fit, and hardware behavior.
          </p>
        </header>

        {/* PRESETS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
              Device Presets
            </div>
            <ScrollList
              items={DEVICE_PRESETS}
              selected={selectedDevice}
              onSelect={applyDevicePreset}
              scrollRef={deviceScrollRef}
            />
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
              Model Presets
            </div>
            <ScrollList
              items={MODEL_PRESETS}
              selected={selectedModel}
              onSelect={applyModelPreset}
              scrollRef={modelScrollRef}
            />
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
              Backend
            </div>
            <ScrollList
              items={BACKEND_PRESETS}
              selected={selectedBackend}
              onSelect={applyBackendPreset}
              scrollRef={backendScrollRef}
            />
          </div>
        </section>

        {/* MANUAL CONFIG + RESULTS + CHAT SIM */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MANUAL CONFIG */}
          <div className="border border-[var(--border)] rounded-md p-4 space-y-4">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)]">
              Manual Model Config
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 text-[var(--muted)]">
                  Model size (Billion params)
                </label>
                <input
                  type="number"
                  value={modelParamsB}
                  onChange={(e) => setModelParamsB(Number(e.target.value))}
                  className="w-full border border-[var(--border)] rounded px-2 py-1 bg-[var(--bg)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--muted)]">
                  Quantization
                </label>
                <select
                  value={quant}
                  onChange={(e) => setQuant(e.target.value)}
                  className="w-full border border-[var(--border)] rounded px-2 py-1 bg-[var(--bg)]"
                >
                  <option>F16</option>
                  <option>Q8_0</option>
                  <option>Q6_K</option>
                  <option>Q5_K_M</option>
                  <option>Q4_K_M</option>
                  <option>Q4_K_S</option>
                  <option>Q3_K_M</option>
                  <option>A3B</option>
                </select>
              </div>
            </div>

            <button
              onClick={runSimulation}
              className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm hover:border-[var(--accent)] transition"
            >
              Run Simulation
            </button>
          </div>

          {/* RESULTS */}
          <div className="border border-[var(--border)] rounded-md p-4 space-y-4">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)]">
              Simulation Results
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total VRAM</div>
              <div>{perf.totalVramGB.toFixed(1)} GB</div>

              <div>Model VRAM required</div>
              <div>{perf.modelVramGB.toFixed(1)} GB</div>

              <div>Fits in VRAM</div>
              <div>{perf.fitsInVram ? "Yes" : "No"}</div>

              <div>Fits in RAM</div>
              <div>{perf.fitsInRam ? "Yes" : "No"}</div>

              <div>Execution mode</div>
              <div>{perf.mode}</div>

              <div>Decode speed</div>
              <div>{perf.decodeTokPerSec?.toFixed(1)} tok/s</div>

              <div>Prefill speed</div>
              <div>{perf.prefillTokPerSec?.toFixed(1)} tok/s</div>

              <div>TTFT</div>
              <div>{perf.ttftSeconds?.toFixed(2)} s</div>

              <div>Max context</div>
              <div>{perf.maxContextTokens}</div>

              <div>Perceived speed</div>
              <div>{perf.perceivedSpeed}</div>

              <div>Paragraph length</div>
              <div>{perf.paragraphTokens} tokens</div>
            </div>

            <Speedometer decodeSpeed={perf.decodeTokPerSec} />

            <SlowMotionToggle
              slowMotion={slowMotion}
              setSlowMotion={setSlowMotion}
            />
          </div>

          {/* CHAT SIM */}
          <div className="border border-[var(--border)] rounded-md p-4">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
              Live Response Simulation
            </div>

            <ChatTTFTDemo
              ttft={perf.ttftSeconds}
              decodeSpeed={
                slowMotion ? perf.decodeTokPerSec! / 2 : perf.decodeTokPerSec
              }
              startSignal={demoSignal}
            />
          </div>
        </section>

        {/* COMPARE ANY TWO PRESETS */}
        <CompareAnyTwo />

        {/* BENCHMARK ALL PRESETS */}
        <BenchmarkAll />

        {/* PERFORMANCE CHARTS */}
        <ChartsPanel />

        {/* EXPORT / IMPORT PROFILE */}
        <ProfileExportImport profile={profile} onImport={handleImportProfile} />

      </main>
    </div>
  );
}
