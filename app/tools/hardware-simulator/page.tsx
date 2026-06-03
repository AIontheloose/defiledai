"use client";
import { useState } from "react";

// ─── TYPES & DATA ─────────────────────────────────────────────────────────────
type GPUModel = {
  name: string;
  vram: number;
  tflops: number;
  efficiency: number;
};

type ConfiguredGPU = GPUModel & {
  count: number;
};

const COMMON_GPUS: GPUModel[] = [
  { name: "RTX 4090", vram: 24, tflops: 82.6, efficiency: 1.0 },
  { name: "RTX 3090 / 3090 Ti", vram: 24, tflops: 35.6, efficiency: 0.75 },
  { name: "RTX 4080", vram: 16, tflops: 48.7, efficiency: 0.85 },
  { name: "RTX 4070 Ti", vram: 12, tflops: 40.1, efficiency: 0.72 },
  { name: "A100 80GB", vram: 80, tflops: 19.5, efficiency: 1.15 },
  { name: "RTX 5090 (Expected)", vram: 32, tflops: 110, efficiency: 1.25 },
  { name: "RX 7900 XTX", vram: 24, tflops: 61, efficiency: 0.68 },
];

const BACKENDS = ["ExLlama2", "vLLM", "llama.cpp", "MLX (Mac)", "Ollama"];

export default function HardwareSimulatorPage() {
  const [gpus, setGpus] = useState<ConfiguredGPU[]>([
    { ...COMMON_GPUS[0], count: 1 }
  ]);
  const [systemRam, setSystemRam] = useState(64);
  const [modelParams, setModelParams] = useState(70);
  const [selectedQuant, setSelectedQuant] = useState("Q4_K_M");
  const [selectedBackend, setSelectedBackend] = useState("ExLlama2");

  // Add GPU
  const addGPU = () => {
    if (gpus.length < 4) {
      setGpus([...gpus, { ...COMMON_GPUS[0], count: 1 }]);
    }
  };

  // Update GPU
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

  // Calculations
  const totalGpuVram = gpus.reduce((sum, g) => sum + g.vram * g.count, 0);
  const totalTflops = gpus.reduce((sum, g) => sum + g.tflops * g.count, 0);

  const bitsPerWeight = 
    selectedQuant === "F16" ? 16 :
    selectedQuant === "Q8_0" ? 8.5 :
    selectedQuant.includes("Q6") ? 6.5 :
    selectedQuant.includes("Q5") ? 5.6 :
    selectedQuant.includes("Q4") ? 4.7 : 4.0;

  const estimatedVramUsage = (modelParams / 7) * (bitsPerWeight / 8) * 1.15; // rough overhead

  const fitsInGpu = estimatedVramUsage <= totalGpuVram * 0.95;
  const baseSpeed = totalTflops * 1.65;
  const quantFactor = selectedQuant === "F16" ? 0.55 : selectedQuant.includes("Q8") ? 0.82 : 1.0;
  const estimatedSpeed = Math.max(8, Math.round(baseSpeed * quantFactor * (70 / modelParams)));

  const maxContext = Math.floor((totalGpuVram * 0.7 * 1024) / (modelParams * 0.13));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">HARDWARE + MULTI-GPU SIMULATOR</h1>
          <p className="text-[var(--muted)] max-w-3xl leading-relaxed">
            Realistic performance estimates for your exact GPU setup. Updated for 2026 hardware.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Configuration */}
          <div className="lg:col-span-5 space-y-8">
            {/* GPUs */}
            <div className="border border-[var(--border)] p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold font-mono">GPU Configuration</h2>
                <button
                  onClick={addGPU}
                  disabled={gpus.length >= 4}
                  className="text-xs px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-colors disabled:opacity-50"
                >
                  + Add GPU
                </button>
              </div>

              {gpus.map((gpu, index) => (
                <div key={index} className="mb-5 p-5 border border-[var(--border)] bg-[var(--surface)] rounded">
                  <div className="flex gap-3 mb-4">
                    <select
                      value={gpu.name}
                      onChange={(e) => {
                        const selected = COMMON_GPUS.find(g => g.name === e.target.value)!;
                        const newGpus = [...gpus];
                        newGpus[index] = { ...selected, count: gpu.count };
                        setGpus(newGpus);
                      }}
                      className="bg-[var(--bg)] border border-[var(--border)] px-3 py-2.5 flex-1 font-mono"
                    >
                      {COMMON_GPUS.map(g => (
                        <option key={g.name} value={g.name}>{g.name}</option>
                      ))}
                    </select>

                    {gpus.length > 1 && (
                      <button
                        onClick={() => removeGPU(index)}
                        className="px-3 text-red-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[var(--muted)] text-sm w-20">Count:</span>
                    <input
                      type="number"
                      value={gpu.count}
                      onChange={(e) => updateGPU(index, "count", e.target.value)}
                      min={1}
                      max={8}
                      className="w-20 bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-center font-mono"
                    />
                    <span className="text-[var(--muted)] text-sm">
                      → {gpu.vram * gpu.count} GB VRAM
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* System RAM + Model Settings */}
            <div className="border border-[var(--border)] p-6 space-y-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-2">System RAM (GB)</label>
                <input
                  type="number"
                  value={systemRam}
                  onChange={(e) => setSystemRam(Math.max(16, parseInt(e.target.value) || 32))}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-4 py-3 font-mono text-xl"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-2">Model Size (Billion Parameters)</label>
                <input
                  type="number"
                  value={modelParams}
                  onChange={(e) => setModelParams(parseFloat(e.target.value) || 7)}
                  step="0.5"
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-4 py-3 font-mono text-xl"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-2">Quantization</label>
                <select
                  value={selectedQuant}
                  onChange={(e) => setSelectedQuant(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-4 py-3 font-mono"
                >
                  <option value="F16">F16</option>
                  <option value="Q8_0">Q8_0</option>
                  <option value="Q6_K">Q6_K</option>
                  <option value="Q5_K_M">Q5_K_M</option>
                  <option value="Q4_K_M">Q4_K_M</option>
                  <option value="Q4_K_S">Q4_K_S</option>
                  <option value="Q3_K_M">Q3_K_M</option>
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--muted)] block mb-2">Backend</label>
                <select
                  value={selectedBackend}
                  onChange={(e) => setSelectedBackend(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-4 py-3 font-mono"
                >
                  {BACKENDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            <div className={`border p-8 ${fitsInGpu ? "border-green-500/40" : "border-red-500/40"}`}>
              <h2 className="text-2xl font-bold mb-6 font-mono">SIMULATION RESULTS</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-[var(--muted)]">Total GPU VRAM</div>
                  <div className="text-5xl font-black font-mono text-cyan-400">{totalGpuVram} GB</div>
                </div>
                <div>
                  <div className="text-[var(--muted)]">Est. VRAM Required</div>
                  <div className="text-5xl font-black font-mono">{estimatedVramUsage.toFixed(1)} GB</div>
                </div>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between py-3 border-b border-[var(--border)]">
                  <span>Estimated Speed</span>
                  <span className="text-green-400 font-bold">{estimatedSpeed} tokens/sec</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[var(--border)]">
                  <span>Max Context Length</span>
                  <span className="font-bold">{maxContext}k tokens</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[var(--border)]">
                  <span>Fits entirely on GPU?</span>
                  <span className={fitsInGpu ? "text-green-400" : "text-red-400 font-bold"}>
                    {fitsInGpu ? "YES" : "NO — Offloading required"}
                  </span>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-[var(--border)] text-sm">
                <div className="uppercase tracking-widest text-[var(--muted)] mb-3">Recommendations</div>
                <ul className="list-disc pl-5 space-y-1 text-[var(--muted)]">
                  {estimatedSpeed > 45 && <li>Excellent setup for fast local inference</li>}
                  {maxContext > 60 && <li>Great for long-context tasks and agents</li>}
                  {!fitsInGpu && <li>Consider lower quantization or layer offloading</li>}
                  {gpus.length > 1 && <li>Use tensor or pipeline parallelism for best performance</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}