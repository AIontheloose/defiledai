"use client";

import TTFTDemo from "./TTFTDemo";
import { HARDWARE_PRESETS } from "./hardwarePresets";
import { useEffect, useMemo, useState } from "react";
import {
  HardwareProfile,
  QuantKind,
  BackendKind,
  DeviceType,
  detectHardwareProfile,
  computePerf,
  defaultRuntimeProfile,
  RuntimeProfile,
} from "./hardwareEngine";

const QUANTS: QuantKind[] = [
  "F16",
  "Q8_0",
  "Q6_K",
  "Q5_K_M",
  "Q4_K_M",
  "Q4_K_S",
  "Q3_K_M",
  "A3B",
];

const MODEL_PRESETS = [
  { label: "7B", value: 7 },
  { label: "13B", value: 13 },
  { label: "14B", value: 14 },
  { label: "15B", value: 15 },
  { label: "20B", value: 20 },
  { label: "27B", value: 27 },
  { label: "30B", value: 30 },
  { label: "35B", value: 35 },
  { label: "70B", value: 70 },
  { label: "670B", value: 670 },
];

const BACKENDS: BackendKind[] = [
  "Ollama",
  "llama.cpp",
  "vLLM",
  "KoboldCPP",
  "LM Studio",
  "TextGenWebUI",
  "Custom",
];

const DEVICE_TYPES: DeviceType[] = [
  "Desktop",
  "Laptop",
  "MiniPC",
  "Server",
  "Phone",
  "Tablet",
];

const DEFAULT_PARAGRAPH =
  "This paragraph is being generated at the same speed your hardware would produce tokens in real time. " +
  "Each word appears according to the model's measured decode rate, giving you a realistic sense of how quickly " +
  "responses will feel during actual use. Faster GPUs or efficient CPUs will make this text appear almost instantly, " +
  "while slower or CPU-only setups will reveal a more gradual, deliberate flow of words.";

export default function HardwareSimulatorPage() {
  const [detected, setDetected] = useState<HardwareProfile | null>(null);
  const [simulated, setSimulated] = useState<HardwareProfile | null>(null);
  const [useSimulated, setUseSimulated] = useState(false);

  const [runtime, setRuntime] = useState<RuntimeProfile>(
    defaultRuntimeProfile()
  );

  const [modelParamsB, setModelParamsB] = useState(20);
  const [quant, setQuant] = useState<QuantKind>("Q4_K_M");

  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const prof = detectHardwareProfile();
    setDetected(prof);
    setSimulated({
      ...prof,
      vramGB: prof.vramGB ?? 16,
      ramGB: prof.ramGB || 32,
    });
  }, []);

  const activeProfile = useMemo(
    () => (useSimulated && simulated ? simulated : detected),
    [useSimulated, simulated, detected]
  );

  const perf = useMemo(() => {
    if (!activeProfile) return null;
    return computePerf(activeProfile, runtime, modelParamsB, quant);
  }, [activeProfile, runtime, modelParamsB, quant]);

  useEffect(() => {
    setTypingText("");
    setIsTyping(false);
  }, [perf?.decodeTokPerSec, useSimulated, modelParamsB, quant, runtime]);

  const handleGenerateParagraph = () => {
    if (!perf || !perf.decodeTokPerSec || perf.mode === "UNAVAILABLE") return;
    setTypingText("");
    setIsTyping(true);

    const charsPerToken = 4;
    const charsPerSecond = perf.decodeTokPerSec * charsPerToken;
    const intervalMs = Math.max(1, Math.floor(1000 / charsPerSecond));

    let i = 0;
    const text = DEFAULT_PARAGRAPH;
    const id = setInterval(() => {
      i++;
      setTypingText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setIsTyping(false);
      }
    }, intervalMs);
  };

  if (!activeProfile || !perf) {
    return (
      <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-mono font-bold mb-4">
            HARDWARE + MULTI-PLATFORM SIMULATOR
          </h1>
          <p>Detecting hardware profile…</p>
        </div>
      </main>
    );
  }

  const profile = activeProfile;
  const showPerf = perf.mode !== "UNAVAILABLE" && perf.fitsInRam;

  const detectionUncertain =
    profile.gpuKind === "Integrated" &&
    (!profile.gpuModel ||
      profile.gpuModel.toLowerCase().includes("microsoft basic render"));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        <header>
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">
            DefiledAI Tools
          </div>
          <h1 className="text-4xl font-black font-mono mb-2">
            HARDWARE + MULTI-PLATFORM SIMULATOR
          </h1>
          <p className="text-[var(--muted)] max-w-3xl">
            See how large language models will actually feel on your current
            machine—or on the hardware you&apos;re thinking about buying, from
            phones to $20k racks.
          </p>
        </header>

        <section className="grid lg:grid-cols-12 gap-8">
          {/* LEFT: Hardware + Model + Runtime */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-[var(--border)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-mono font-bold text-lg">Hardware Profile</h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--muted)]">Mode:</span>
                  <button
                    className={`px-2 py-1 border text-xs ${
                      !useSimulated
                        ? "border-[var(--accent)] text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--muted)]"
                    }`}
                    onClick={() => setUseSimulated(false)}
                  >
                    Current
                  </button>
                  <button
                    className={`px-2 py-1 border text-xs ${
                      useSimulated
                        ? "border-[var(--accent)] text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--muted)]"
                    }`}
                    onClick={() => setUseSimulated(true)}
                  >
                    Simulated
                  </button>
                </div>
              </div>

              {detectionUncertain && !useSimulated && (
                <div className="text-xs text-yellow-300 border border-yellow-500/40 p-2 font-mono mb-2">
                  ⚠️ Hardware detection may be incomplete (fallback driver
                  detected). Switch to &quot;Simulated&quot; mode to enter your
                  actual GPU/VRAM/RAM.
                </div>
              )}

              <div className="text-sm space-y-1 font-mono">
                <div>
                  <span className="text-[var(--muted)]">OS: </span>
                  <span>{profile.os}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">CPU: </span>
                  <span>
                    {profile.cpuKind} · {profile.cores} cores
                  </span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">GPU: </span>
                  <span>
                    {profile.gpuKind === "None"
                      ? "None"
                      : profile.gpuModel || profile.gpuKind}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">VRAM: </span>
                  <span>{profile.vramGB ?? "Unknown"} GB</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">RAM: </span>
                  <span>{profile.ramGB} GB</span>
                </div>
              </div>

{useSimulated && simulated && (
  <div className="pt-3 border-t border-[var(--border)] space-y-4 text-sm">
    {/* Presets */}
<div className="space-y-2">
  <div className="text-xs uppercase tracking-widest text-[var(--muted)]">
    Hardware Presets
  </div>

  
</div>
<div className="grid grid-cols-2 gap-2 text-xs font-mono">
  {HARDWARE_PRESETS.map((preset) => (
    <button
      key={preset.name}
      className="px-2 py-1 border border-[var(--border)] hover:border-[var(--accent)]"
      onClick={() => {
        setSimulated({ ...simulated, ...preset.hardware });
        setRuntime({ ...runtime, ...preset.runtime });
      }}
    >
      {preset.name}
    </button>
  ))}
</div>




<div className="text-xs uppercase tracking-widest text-[var(--muted)]">
      Adjust simulated hardware
    </div>
    {/* OS */}
    <div className="flex items-center gap-3">
      <span className="w-24 text-[var(--muted)] text-xs">OS</span>
      <select
        className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-1 text-xs font-mono"
        value={simulated.os}
        onChange={(e) =>
          setSimulated({ ...simulated, os: e.target.value as any })
        }
      >
        <option>Windows</option>
        <option>Linux</option>
        <option>macOS</option>
      </select>
    </div>

    {/* CPU */}
    <div className="flex items-center gap-3">
      <span className="w-24 text-[var(--muted)] text-xs">CPU Type</span>
      <select
        className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-1 text-xs font-mono"
        value={simulated.cpuKind}
        onChange={(e) =>
          setSimulated({ ...simulated, cpuKind: e.target.value as any })
        }
      >
        <option>Intel</option>
        <option>AMD</option>
        <option>AppleSilicon</option>
        <option>Unknown</option>
      </select>
    </div>

    {/* CPU Cores */}
    <div className="flex items-center gap-3">
      <span className="w-24 text-[var(--muted)] text-xs">CPU Cores</span>
      <input
        type="number"
        className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-1 text-xs font-mono"
        value={simulated.cores}
        onChange={(e) =>
          setSimulated({
            ...simulated,
            cores: Math.max(1, Number(e.target.value) || 1),
          })
        }
      />
    </div>

    {/* GPU Kind */}
    <div className="flex items-center gap-3">
      <span className="w-24 text-[var(--muted)] text-xs">GPU Type</span>
      <select
        className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-1 text-xs font-mono"
        value={simulated.gpuKind}
        onChange={(e) =>
          setSimulated({ ...simulated, gpuKind: e.target.value as any })
        }
      >
        <option>Nvidia</option>
        <option>AMD</option>
        <option>IntelArc</option>
        <option>AppleGPU</option>
        <option>Integrated</option>
        <option>None</option>
      </select>
    </div>

    {/* GPU Model */}
    <div className="flex items-center gap-3">
      <span className="w-24 text-[var(--muted)] text-xs">GPU Model</span>
      <input
        type="text"
        className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-1 text-xs font-mono"
        value={simulated.gpuModel ?? ""}
        onChange={(e) =>
          setSimulated({ ...simulated, gpuModel: e.target.value })
        }
      />
    </div>

    {/* VRAM */}
    <div className="flex items-center gap-3">
      <span className="w-24 text-[var(--muted)] text-xs">VRAM (GB)</span>
      <input
        type="number"
        className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-1 text-xs font-mono"
        value={simulated.vramGB ?? 0}
        onChange={(e) =>
          setSimulated({
            ...simulated,
            vramGB: Math.max(0, Number(e.target.value) || 0),
          })
        }
      />
    </div>

    {/* RAM */}
    <div className="flex items-center gap-3">
      <span className="w-24 text-[var(--muted)] text-xs">RAM (GB)</span>
      <input
        type="number"
        className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-1 text-xs font-mono"
        value={simulated.ramGB}
        onChange={(e) =>
          setSimulated({
            ...simulated,
            ramGB: Math.max(4, Number(e.target.value) || 4),
          })
        }
      />
    </div>

    {/* Bandwidth */}
    <div className="flex items-center gap-3">
      <span className="w-24 text-[var(--muted)] text-xs">Bandwidth</span>
      <select
        className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-1 text-xs font-mono"
        value={simulated.bandwidthClass}
        onChange={(e) =>
          setSimulated({
            ...simulated,
            bandwidthClass: e.target.value as any,
          })
        }
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Extreme</option>
      </select>
    </div>

    {/* PCIe */}
    <div className="flex items-center gap-3">
      <span className="w-24 text-[var(--muted)] text-xs">PCIe Gen</span>
      <select
        className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-1 text-xs font-mono"
        value={simulated.pcieGen ?? 4}
        onChange={(e) =>
          setSimulated({
            ...simulated,
            pcieGen: Number(e.target.value) as any,
          })
        }
      >
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>
    </div>

    {/* AVX512 */}
    <label className="flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        checked={simulated.hasAVX512 ?? false}
        onChange={(e) =>
          setSimulated({ ...simulated, hasAVX512: e.target.checked })
        }
      />
      AVX‑512 Support
    </label>

    {/* Laptop/Desktop */}
    <label className="flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        checked={simulated.isLaptop ?? false}
        onChange={(e) =>
          setSimulated({ ...simulated, isLaptop: e.target.checked })
        }
      />
      Laptop / MiniPC thermal limits
    </label>

    {/* Multi-GPU */}
    <div className="flex items-center gap-3">
      <span className="w-24 text-[var(--muted)] text-xs">Multi‑GPU</span>
      <div className="flex gap-2 flex-1">
        <input
          type="number"
          placeholder="GPUs"
          className="w-16 bg-[var(--bg)] border border-[var(--border)] px-2 py-1 text-xs font-mono"
          value={simulated.multiGPU?.gpuCount ?? ""}
          onChange={(e) =>
            setSimulated({
              ...simulated,
              multiGPU: {
                gpuCount: Number(e.target.value) || 0,
                vramPerGPU: simulated.multiGPU?.vramPerGPU ?? 80,
                hasNVLink: simulated.multiGPU?.hasNVLink ?? true,
              },
            })
          }
        />
        <input
          type="number"
          placeholder="VRAM/GPU"
          className="w-24 bg-[var(--bg)] border border-[var(--border)] px-2 py-1 text-xs font-mono"
          value={simulated.multiGPU?.vramPerGPU ?? ""}
          onChange={(e) =>
            setSimulated({
              ...simulated,
              multiGPU: {
                gpuCount: simulated.multiGPU?.gpuCount ?? 2,
                vramPerGPU: Number(e.target.value) || 1,
                hasNVLink: simulated.multiGPU?.hasNVLink ?? true,
              },
            })
          }
        />
        <label className="flex items-center gap-1 text-[var(--muted)] text-xs">
          <input
            type="checkbox"
            checked={simulated.multiGPU?.hasNVLink ?? false}
            onChange={(e) =>
              setSimulated({
                ...simulated,
                multiGPU: {
                  gpuCount: simulated.multiGPU?.gpuCount ?? 2,
                  vramPerGPU: simulated.multiGPU?.vramPerGPU ?? 80,
                  hasNVLink: e.target.checked,
                },
              })
            }
          />
          NVLink
        </label>
      </div>
    </div>
  </div>
)}

            </div>

            <div className="border border-[var(--border)] p-5 space-y-4">
              <h2 className="font-mono font-bold text-lg">Model Settings</h2>

              <div className="flex flex-wrap gap-2 text-xs font-mono mb-2">
                {MODEL_PRESETS.map((m) => (
                  <button
                    key={m.label}
                    onClick={() => setModelParamsB(m.value)}
                    className={`px-2 py-1 border ${
                      modelParamsB === m.value
                        ? "border-[var(--accent)] text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-1">
                  Model Size (Billion Parameters)
                </label>
                <input
                  type="number"
                  value={modelParamsB}
                  step={0.5}
                  min={1}
                  max={1000}
                  onChange={(e) =>
                    setModelParamsB(Math.max(1, Number(e.target.value) || 7))
                  }
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-4 py-2 font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-1">
                  Quantization
                </label>
                <select
                  value={quant}
                  onChange={(e) => setQuant(e.target.value as QuantKind)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-4 py-2 font-mono text-sm"
                >
                  {QUANTS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border border-[var(--border)] p-5 space-y-4">
              <h2 className="font-mono font-bold text-lg">Runtime & Backend</h2>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-1">
                  Backend
                </label>
                <select
                  value={runtime.backend}
                  onChange={(e) =>
                    setRuntime({
                      ...runtime,
                      backend: e.target.value as BackendKind,
                    })
                  }
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-4 py-2 font-mono text-sm"
                >
                  {BACKENDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-1">
                  Device Type
                </label>
                <select
                  value={runtime.deviceType}
                  onChange={(e) =>
                    setRuntime({
                      ...runtime,
                      deviceType: e.target.value as DeviceType,
                    })
                  }
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-4 py-2 font-mono text-sm"
                >
                  {DEVICE_TYPES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={runtime.isDocker}
                    onChange={(e) =>
                      setRuntime({ ...runtime, isDocker: e.target.checked })
                    }
                  />
                  Docker / Container
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={runtime.isVirtualized}
                    onChange={(e) =>
                      setRuntime({
                        ...runtime,
                        isVirtualized: e.target.checked,
                      })
                    }
                  />
                  VM / Virtualized
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border border-[var(--border)] p-6 space-y-6">
              <h2 className="font-mono font-bold text-xl mb-2">
                Simulation Results
              </h2>

              <div className="grid grid-cols-2 gap-6 text-sm font-mono">
                <div>
                  <div className="text-[var(--muted)] mb-1">Total VRAM</div>
                  <div className="text-3xl font-black text-cyan-400">
                    {perf.totalVramGB || 0} GB
                  </div>
                </div>
                <div>
                  <div className="text-[var(--muted)] mb-1">
                    Model VRAM Required
                  </div>
                  <div className="text-3xl font-black">
                    {perf.modelVramGB.toFixed(1)} GB
                  </div>
                </div>
              </div>

              <div className="text-sm font-mono space-y-1">
                <div>
                  <span className="text-[var(--muted)]">Fits in VRAM: </span>
                  <span>{perf.fitsInVram ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Fits in RAM: </span>
                  <span>{perf.fitsInRam ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Execution Mode: </span>
                  <span>
                    {perf.mode === "GPU"
                      ? "GPU only"
                      : perf.mode === "GPU+CPU_OFFLOAD"
                      ? "GPU + CPU offload"
                      : perf.mode === "CPU_ONLY"
                      ? "CPU only"
                      : "Unavailable"}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Backend: </span>
                  <span>{runtime.backend}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Device: </span>
                  <span>{runtime.deviceType}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Perceived speed: </span>
                  <span>{perf.perceivedSpeed}</span>
                </div>
              </div>

              {!showPerf && (
                <div className="mt-4 p-3 border border-red-500/40 text-sm font-mono text-red-300">
                  {perf.mode === "UNAVAILABLE" || !perf.fitsInRam ? (
                    <>
                      ❌ Model does not fit in available memory on this
                      configuration.
                      <br />
                      Required RAM (approx): {perf.requiredRamGB.toFixed(1)} GB
                    </>
                  ) : (
                    <>
                      ❌ Model does not fit in GPU VRAM. Performance metrics are
                      not shown because this configuration would not run
                      reliably.
                    </>
                  )}
                </div>
              )}

              {showPerf && (
                <div className="mt-4 space-y-4 font-mono text-sm">
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span>Prefill Speed</span>
                    <span className="text-cyan-400 font-bold">
                      {perf.prefillTokPerSec?.toFixed(1)} tok/s
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span>Decode Speed</span>
                    <span className="text-green-400 font-bold">
                      {perf.decodeTokPerSec?.toFixed(1)} tok/s
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span>Time To First Token</span>
                    <span>{perf.ttftSeconds?.toFixed(2)} s</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span>Max Context</span>
                    <span>
                      {perf.maxContextTokens?.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span>Recommended Batch Size</span>
                    <span>{perf.recommendedBatch}</span>
                  </div>
                </div>
              )}
            </div>

            {showPerf && (
              <div className="border border-[var(--border)] p-6 space-y-5">
                <h3 className="font-mono font-bold text-lg">
                  Real-world Memory Capacity
                </h3>
                <div className="text-sm font-mono space-y-1">
                  <div>
                    <span className="text-[var(--muted)]">Tokens: </span>
                    <span>{perf.maxContextTokens?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">
                      Words (approx):{" "}
                    </span>
                    <span>{perf.words?.toFixed(0)}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">
                      Pages of a novel:{" "}
                    </span>
                    <span>{perf.pages?.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">
                      Conversation time:{" "}
                    </span>
                    <span>
                      {perf.conversationMinutes &&
                        `${(perf.conversationMinutes / 60).toFixed(1)} hours`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {showPerf && (
              <div className="border border-[var(--border)] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono font-bold text-lg">
                    Real-time Response Demo
                  </h3>
                  <button
                    onClick={handleGenerateParagraph}
                    disabled={isTyping}
                    className="px-4 py-2 border border-[var(--accent)] text-[var(--accent)] text-xs font-mono hover:bg-[var(--accent)] hover:text-black disabled:opacity-50"
                  >
                    {isTyping ? "Generating…" : "Generate Example Response"}
                  </button>
                </div>
                <TTFTDemo ttft={perf.ttftSeconds} decodeSpeed={perf.decodeTokPerSec} />

                <div className="text-xs text-[var(--muted)] font-mono mb-2">
                  Paragraph length: {perf.paragraphTokens} tokens ·{" "}
                  {perf.paragraphSeconds &&
                    `${perf.paragraphSeconds.toFixed(2)} seconds at this speed`}
                </div>
                <div className="bg-[var(--surface)] border border-[var(--border)] p-4 min-h-[120px] font-mono text-sm leading-relaxed">
                  {typingText || (
                    <span className="text-[var(--muted)]">
                      Click &quot;Generate Example Response&quot; to see how
                      this model would actually feel on this hardware, backend,
                      and device type.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
