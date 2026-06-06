"use client";

import React, { useState, useRef } from "react";

import {
  computePerf,
  detectHardwareProfile,
  defaultRuntimeProfile,
  type Quantization,
  type PerfResult,
  type HardwareProfile,
  type RuntimeProfile,
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
  const [profile, setProfile] = useState<HardwareProfile>(detectHardwareProfile());
  const [runtime, setRuntime] = useState<RuntimeProfile>(defaultRuntimeProfile());

  const [modelParamsB, setModelParamsB] = useState<number>(7);
  const [quant, setQuant] = useState<Quantization>("Q4_K_M");

  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedBackend, setSelectedBackend] = useState<string>("ollama");

  const [perf, setPerf] = useState<PerfResult>(() =>
    computePerf(profile, runtime, modelParamsB, quant)
  );

  const [slowMotion, setSlowMotion] = useState(false);
  const [demoSignal, setDemoSignal] = useState(0);

  const deviceScrollRef = useRef<HTMLDivElement>(null);
  const modelScrollRef = useRef<HTMLDivElement>(null);
  const backendScrollRef = useRef<HTMLDivElement>(null);

  function applyDevicePreset(id: string) {
    const preset = DEVICE_PRESETS.find((p) => p.id === id);
    if (!preset) return;

    const scrollPos = deviceScrollRef.current?.scrollTop ?? 0;

    const newProfile = preset.profile;
    setProfile(newProfile);
    setSelectedDevice(id);

    setPerf(computePerf(newProfile, runtime, modelParamsB, quant));

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

    const newRuntime: RuntimeProfile = { ...runtime, backend: preset.value };
    setRuntime(newRuntime);
    setSelectedBackend(id);

    setPerf(computePerf(profile, newRuntime, modelParamsB, quant));

    requestAnimationFrame(() => {
      if (backendScrollRef.current) backendScrollRef.current.scrollTop = scrollPos;
    });
  }

  function runSimulation() {
    setPerf(computePerf(profile, runtime, modelParamsB, quant));
    setDemoSignal((s) => s + 1);
  }

  function handleImportProfile(p: HardwareProfile) {
    setProfile(p);
    setPerf(computePerf(p, runtime, modelParamsB, quant));
  }

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

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        <header>
          <h1 className="text-3xl font-semibold">Hardware LLM Performance Simulator</h1>
          <p className="text-sm text-[var(--muted)]">
            Realistic TTFT, decode speed, memory fit, and hardware behavior.
          </p>
        </header>

        {/* Preset selectors */}
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

        {/* Simulation + results */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Manual config */}
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
                  onChange={(e) => setQuant(e.target.value as Quantization)}
                  className="w-full border border-[var(--border)] rounded px-2 py-1 bg-[var(--bg)]"
                >
                  <option value="F16">F16</option>
                  <option value="BF16">BF16</option>
                  <option value="FP8">FP8</option>
                  <option value="Q8_0">Q8_0</option>
                  <option value="Q6_K">Q6_K</option>
                  <option value="Q5_K_M">Q5_K_M</option>
                  <option value="Q5_K_S">Q5_K_S</option>
                  <option value="Q4_K_M">Q4_K_M</option>
                  <option value="Q4_K_S">Q4_K_S</option>
                  <option value="Q3_K_M">Q3_K_M</option>
                  <option value="Q3_K_S">Q3_K_S</option>
                  <option value="A8">A8</option>
                  <option value="A4">A4</option>
                  <option value="A3B">A3B</option>
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

          {/* Results */}
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
              <div>{perf.decodeTokPerSec.toFixed(1)} tok/s</div>

              <div>Prefill speed</div>
              <div>{perf.prefillTokPerSec.toFixed(1)} tok/s</div>

              <div>TTFT</div>
              <div>{perf.ttftSeconds.toFixed(2)} s</div>

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

          {/* Live chat simulation */}
          <div className="border border-[var(--border)] rounded-md p-4">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
              Live Response Simulation
            </div>

            <ChatTTFTDemo
              ttft={perf.ttftSeconds}
              decodeSpeed={
                slowMotion ? perf.decodeTokPerSec / 2 : perf.decodeTokPerSec
              }
              startSignal={demoSignal}
            />
          </div>
        </section>

        {/* Compare */}
        <CompareAnyTwo />

        {/* Benchmark */}
        <BenchmarkAll />

        {/* Charts */}
        <ChartsPanel />

        {/* Import / Export */}
        <ProfileExportImport profile={profile} onImport={handleImportProfile} />
      </main>
    </div>
  );
}
