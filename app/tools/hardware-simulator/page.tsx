"use client";
import { useState } from "react";

// ─── TYPES & DATA ─────────────────────────────────────────────────────────────
type GPUModel = {
  name: string;
  vram: number;
  tflops: number;
  efficiency: number;
};

type ConfiguredGPU = GPUModel & { count: number };

const COMMON_GPUS: GPUModel[] = [
  { name: "RTX 4090", vram: 24, tflops: 82.6, efficiency: 1.0 },
  { name: "RTX 3090 / 3090 Ti", vram: 24, tflops: 35.6, efficiency: 0.75 },
  { name: "RTX 4080", vram: 16, tflops: 48.7, efficiency: 0.85 },
  { name: "RTX 4070 Ti", vram: 12, tflops: 40.1, efficiency: 0.72 },
  { name: "A100 80GB", vram: 80, tflops: 19.5, efficiency: 1.15 },
  { name: "RTX 5090 (Expected)", vram: 32, tflops: 110, efficiency: 1.25 },
  { name: "RX 7900 XTX", vram: 24, tflops: 61, efficiency: 0.68 },
];

const BACKENDS = ["ExLlama2", "vLLM", "llama.cpp", "Ollama"];

export default function HardwareSimulatorPage() {
  const [gpus, setGpus] = useState<ConfiguredGPU[]>([{ ...COMMON_GPUS[0], count: 1 }]);
  const [systemRam, setSystemRam] = useState(64);
  const [modelParams, setModelParams] = useState(70);
  const [selectedQuant, setSelectedQuant] = useState("Q4_K_M");
  const [selectedBackend, setSelectedBackend] = useState("ExLlama2");

  const addGPU = () => {
    if (gpus.length < 4) {
      setGpus([...gpus, { ...COMMON_GPUS[0], count: 1 }]);
    }
  };

  const updateGPU = (index: number, field: keyof ConfiguredGPU, value: any) => {
    const newGpus = [...gpus];
    if (field === "count") {
      newGpus[index].count = Math.max(1, parseInt(value) || 1);
    } else {
      (newGpus[index] as any)[field] = value;
    }
    setGpus(newGpus);
  };

  const removeGPU = (index: number) => {
    if (gpus.length > 1) {
      setGpus(gpus.filter((_, i) => i !== index));
    }
  };

  // Core Calculations
  const totalGpuVram = gpus.reduce((sum, g) => sum + g.vram * g.count, 0);
  const totalTflops = gpus.reduce((sum, g) => sum + g.tflops * g.count, 0);

  const bitsPerWeight = 
    selectedQuant === "F16" ? 16 :
    selectedQuant === "Q8_0" ? 8.5 :
    selectedQuant.includes("Q6") ? 6.5 :
    selectedQuant.includes("Q5") ? 5.6 :
    selectedQuant.includes("Q4") ? 4.7 : 4.0;

  const estimatedModelVram = (modelParams / 7) * (bitsPerWeight / 8) * 1.25;

  const fitsInGpu = estimatedModelVram <= totalGpuVram * 0.85;

  // Performance Calculations
  const baseCompute = totalTflops * 1.85;
  const sizeFactor = Math.pow(70 / modelParams, 0.88);

  const decodeSpeed = Math.max(18, Math.round(baseCompute * 0.62 * sizeFactor *
    (selectedQuant === "F16" ? 0.48 : selectedQuant.includes("Q8") ? 0.82 : 0.94)));

  const prefillSpeed = Math.max(45, Math.round(decodeSpeed * 3.4));

  const ttft = Math.round((modelParams * 2.1) / prefillSpeed * 100) / 100;

  // Context Length
  const availableForKV = Math.max(0, totalGpuVram * 0.72 - estimatedModelVram);
  const layers = Math.floor(modelParams * 1.08);
  const bytesPerToken = (modelParams * 2 * 16) / 8;
  const maxContext = Math.max(4096, Math.floor((availableForKV * 1024) / (layers * bytesPerToken * 1.15)));

  const recommendedBatch = totalGpuVram > 48 ? 16 : totalGpuVram > 24 ? 8 : 4;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">HARDWARE + MULTI-GPU SIMULATOR</h1>
          <p className="text-[var(--muted)] max-w-3xl text-lg">
            Professional-grade performance estimator. Real multi-GPU simulation with prefill/decode split, 
            TTFT, and practical recommendations.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Configuration */}
          <div className="lg:col-span-5 space-y-8">
            {/* GPUs */}
            <div className="border border-[var(--border)] p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold font-mono">GPU Setup</h2>
                <button
                  onClick={addGPU}
                  disabled={gpus.length >= 4}
                  className="px-5 py-2 text-sm border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all disabled:opacity-50"
                >
                  + Add GPU
                </button>
              </div>

              {gpus.map((gpu, index) => (
                <div key={index} className="mb-6 p-6 border border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex gap-3 mb-4">
                    <select
                      value={gpu.name}
                      onChange={(e) => {
                        const selected = COMMON_GPUS.find(g => g.name === e.target.value)!;
                        const newGpus = [...gpus];
                        newGpus[index] = { ...selected, count: gpu.count };
                        setGpus(newGpus);
                      }}
                      className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-4 py-3 font-mono"
                    >
                      {COMMON_GPUS.map(g => (
                        <option key={g.name} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                    {gpus.length > 1 && (
                      <button onClick={() => removeGPU(index)} className="text-red-400 hover:text-red-500 px-3">✕</button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[var(--muted)] w-24">Count:</span>
                    <input
                      type="number"
                      value={gpu.count}
                      onChange={(e) => updateGPU(index, "count", e.target.value)}
                      min={1} max={8}
                      className="w-24 bg-[var(--bg)] border border-[var(--border)] px-4 py-2 text-center font-mono"
                    />
                    <span className="text-[var(--muted)]">→ {(gpu.vram * gpu.count).toFixed(0)} GB VRAM</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Model & System Settings */}
            <div className="border border-[var(--border)] p-6 space-y-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-2">System RAM (GB)</label>
                <input
                  type="number"
                  value={systemRam}
                  onChange={(e) => setSystemRam(Math.max(16, parseInt(e.target.value) || 32))}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-5 py-3.5 font-mono text-xl"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-2">Model Size (Billion Parameters)</label>
                <input
                  type="number"
                  value={modelParams}
                  step="0.5"
                  onChange={(e) => setModelParams(parseFloat(e.target.value) || 7)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-5 py-3.5 font-mono text-xl"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-2">Quantization</label>
                <select value={selectedQuant} onChange={(e) => setSelectedQuant(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-5 py-3.5 font-mono">
                  <option value="F16">F16</option>
                  <option value="Q8_0">Q8_0</option>
                  <option value="Q6_K">Q6_K</option>
                  <option value="Q5_K_M">Q5_K_M</option>
                  <option value="Q4_K_M">Q4_K_M — Recommended</option>
                  <option value="Q4_K_S">Q4_K_S</option>
                  <option value="Q3_K_M">Q3_K_M</option>
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-2">Inference Backend</label>
                <select value={selectedBackend} onChange={(e) => setSelectedBackend(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-5 py-3.5 font-mono">
                  {BACKENDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-7">
            <div className={`border p-8 ${fitsInGpu ? "border-green-500/40" : "border-red-500/40"}`}>
              <h2 className="text-2xl font-bold font-mono mb-8">SIMULATION RESULTS</h2>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <div className="text-[var(--muted)]">Total GPU VRAM</div>
                  <div className="text-5xl font-black font-mono text-cyan-400">{totalGpuVram} GB</div>
                </div>
                <div>
                  <div className="text-[var(--muted)]">Est. Model Usage</div>
                  <div className="text-5xl font-black font-mono">{estimatedModelVram.toFixed(1)} GB</div>
                </div>
              </div>

              <div className="space-y-6 font-mono">
                <div className="flex justify-between py-4 border-b border-[var(--border)]">
                  <span>Prefill Speed</span>
                  <span className="text-cyan-400 font-bold">{prefillSpeed} tokens/sec</span>
                </div>
                <div className="flex justify-between py-4 border-b border-[var(--border)]">
                  <span>Decode Speed</span>
                  <span className="text-green-400 font-bold">{decodeSpeed} tokens/sec</span>
                </div>
                <div className="flex justify-between py-4 border-b border-[var(--border)]">
                  <span>Time To First Token</span>
                  <span className="font-bold">{ttft.toFixed(2)} seconds</span>
                </div>
                <div className="flex justify-between py-4 border-b border-[var(--border)]">
                  <span>Maximum Context Length</span>
                  <span className="text-cyan-400 font-bold">{maxContext.toLocaleString()} tokens</span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[var(--border)]">
                <div className="uppercase tracking-widest text-xs text-[var(--muted)] mb-4">RECOMMENDATIONS</div>
                <div className="space-y-3 text-sm">
                  <p>• Recommended batch size: <strong className="text-[var(--accent)]">{recommendedBatch}</strong></p>
                  <p>• {fitsInGpu ? "✅ Full GPU offload possible" : "⚠️ Layer offloading or lower quantization recommended"}</p>
                  {selectedBackend === "vLLM" && <p>• vLLM is excellent for high throughput with this setup</p>}
                  {maxContext > 32768 && <p>• Excellent for long-context work and agentic workflows</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}