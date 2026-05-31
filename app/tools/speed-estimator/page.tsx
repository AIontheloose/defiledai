"use client";
import { useState } from "react";

const GPUS = [
  { name: "RTX 4090", vram: 24, bandwidth: 1008, tflops: 82.6, gen: "Ada" },
  { name: "RTX 4080 Super", vram: 16, bandwidth: 736, tflops: 52.2, gen: "Ada" },
  { name: "RTX 4080", vram: 16, bandwidth: 717, tflops: 48.7, gen: "Ada" },
  { name: "RTX 4070 Ti Super", vram: 16, bandwidth: 672, tflops: 40.0, gen: "Ada" },
  { name: "RTX 4070 Ti", vram: 12, bandwidth: 504, tflops: 40.0, gen: "Ada" },
  { name: "RTX 4070 Super", vram: 12, bandwidth: 504, tflops: 35.5, gen: "Ada" },
  { name: "RTX 4070", vram: 12, bandwidth: 504, tflops: 29.1, gen: "Ada" },
  { name: "RTX 4060 Ti 16GB", vram: 16, bandwidth: 288, tflops: 22.1, gen: "Ada" },
  { name: "RTX 4060 Ti 8GB", vram: 8, bandwidth: 288, tflops: 22.1, gen: "Ada" },
  { name: "RTX 4060", vram: 8, bandwidth: 272, tflops: 15.1, gen: "Ada" },
  { name: "RTX 3090 Ti", vram: 24, bandwidth: 1008, tflops: 40.0, gen: "Ampere" },
  { name: "RTX 3090", vram: 24, bandwidth: 936, tflops: 35.6, gen: "Ampere" },
  { name: "RTX 3080 Ti", vram: 12, bandwidth: 912, tflops: 34.1, gen: "Ampere" },
  { name: "RTX 3080 12GB", vram: 12, bandwidth: 912, tflops: 30.6, gen: "Ampere" },
  { name: "RTX 3080 10GB", vram: 10, bandwidth: 760, tflops: 29.8, gen: "Ampere" },
  { name: "RTX 3070 Ti", vram: 8, bandwidth: 608, tflops: 21.7, gen: "Ampere" },
  { name: "RTX 3070", vram: 8, bandwidth: 448, tflops: 20.3, gen: "Ampere" },
  { name: "RTX 3060 Ti", vram: 8, bandwidth: 448, tflops: 16.2, gen: "Ampere" },
  { name: "RTX 3060 12GB", vram: 12, bandwidth: 360, tflops: 12.7, gen: "Ampere" },
  { name: "RTX 2080 Ti", vram: 11, bandwidth: 616, tflops: 13.4, gen: "Turing" },
  { name: "RX 7900 XTX", vram: 24, bandwidth: 960, tflops: 61.4, gen: "RDNA3" },
  { name: "RX 7900 XT", vram: 20, bandwidth: 800, tflops: 51.6, gen: "RDNA3" },
  { name: "RX 7800 XT", vram: 16, bandwidth: 624, tflops: 37.3, gen: "RDNA3" },
  { name: "RX 6900 XT", vram: 16, bandwidth: 512, tflops: 23.0, gen: "RDNA2" },
  { name: "RX 6800 XT", vram: 16, bandwidth: 512, tflops: 20.7, gen: "RDNA2" },
  { name: "M3 Max (40 GPU)", vram: 48, bandwidth: 400, tflops: 14.2, gen: "Apple Silicon" },
  { name: "M3 Pro (18 GPU)", vram: 36, bandwidth: 150, tflops: 5.6, gen: "Apple Silicon" },
  { name: "M2 Ultra", vram: 192, bandwidth: 800, tflops: 27.2, gen: "Apple Silicon" },
  { name: "2× RTX 3090 NVLink", vram: 48, bandwidth: 1872, tflops: 71.2, gen: "Multi-GPU" },
  { name: "2× RTX 4090", vram: 48, bandwidth: 2016, tflops: 165.2, gen: "Multi-GPU" },
  { name: "A100 40GB SXM", vram: 40, bandwidth: 1555, tflops: 77.9, gen: "Datacenter" },
  { name: "A100 80GB SXM", vram: 80, bandwidth: 2000, tflops: 77.9, gen: "Datacenter" },
  { name: "H100 SXM", vram: 80, bandwidth: 3350, tflops: 267.0, gen: "Datacenter" },
];

const QUANTS: Record<string, { bpw: number; label: string; overhead: number }> = {
  F16:    { bpw: 16,   label: "F16",    overhead: 1.00 },
  Q8_0:   { bpw: 8.5,  label: "Q8_0",   overhead: 0.97 },
  Q6_K:   { bpw: 6.6,  label: "Q6_K",   overhead: 0.94 },
  Q5_K_M: { bpw: 5.7,  label: "Q5_K_M", overhead: 0.91 },
  Q4_K_M: { bpw: 4.8,  label: "Q4_K_M", overhead: 0.88 },
  Q3_K_M: { bpw: 3.9,  label: "Q3_K_M", overhead: 0.84 },
  IQ3_M:  { bpw: 3.7,  label: "IQ3_M",  overhead: 0.83 },
  Q2_K:   { bpw: 2.6,  label: "Q2_K",   overhead: 0.78 },
  IQ1_M:  { bpw: 1.75, label: "IQ1_M",  overhead: 0.72 },
};

const BACKENDS: Record<string, { label: string; efficiency: number; note: string }> = {
  exllamav2: { label: "ExLlamaV2", efficiency: 1.0, note: "Fastest on NVIDIA. Custom CUDA kernels." },
  llamacpp_cuda: { label: "llama.cpp (CUDA)", efficiency: 0.80, note: "~20% slower than ExLlamaV2. Most compatible." },
  llamacpp_rocm: { label: "llama.cpp (ROCm)", efficiency: 0.70, note: "AMD GPU. ~30% below CUDA equivalent." },
  ollama: { label: "Ollama", efficiency: 0.78, note: "llama.cpp backend. Easy setup, small overhead." },
  llamacpp_metal: { label: "llama.cpp (Metal)", efficiency: 0.85, note: "Apple Silicon. Very efficient for bandwidth." },
  tensorrt: { label: "TensorRT-LLM", efficiency: 1.15, note: "Fastest possible on NVIDIA. Complex setup." },
};

function estimateToksPerSec(params: number, quant: string, gpu: typeof GPUS[0], gpuCount: number, backend: string): number {
  const q = QUANTS[quant];
  const b = BACKENDS[backend];
  if (!q || !b || !gpu) return 0;

  const modelSizeGb = (params * 1e9 * q.bpw) / 8 / 1e9;
  const totalVram = gpu.vram * gpuCount;
  if (modelSizeGb > totalVram * 0.92) return 0;

  // Token generation is memory-bandwidth bound
  // bytes moved per token ≈ model size in bytes
  const bytesPerToken = modelSizeGb * 1e9;
  const totalBandwidth = gpu.bandwidth * gpuCount * (gpuCount > 1 ? 0.85 : 1) * 1e9; // GB/s to bytes/s
  const rawToks = totalBandwidth / bytesPerToken;

  return Math.round(rawToks * q.overhead * b.efficiency * 0.82); // 0.82 = real-world overhead factor
}

function getRating(toks: number): { label: string; color: string } {
  if (toks === 0) return { label: "DOES NOT FIT", color: "#f87171" };
  if (toks >= 100) return { label: "EXCELLENT", color: "#22d3ee" };
  if (toks >= 50) return { label: "GREAT", color: "#4ade80" };
  if (toks >= 20) return { label: "GOOD", color: "#86efac" };
  if (toks >= 10) return { label: "USABLE", color: "#fbbf24" };
  return { label: "SLOW", color: "#f87171" };
}

export default function SpeedEstimatorPage() {
  const [params, setParams] = useState("70");
  const [quant, setQuant] = useState("Q4_K_M");
  const [backend, setBackend] = useState("exllamav2");
  const [gpuName, setGpuName] = useState("");
  const [gpuCount, setGpuCount] = useState(1);

  const gpu = GPUS.find((g) => g.name === gpuName);
  const paramNum = parseFloat(params) || 0;
  const toks = gpu ? estimateToksPerSec(paramNum, quant, gpu, gpuCount, backend) : null;
  const rating = toks !== null ? getRating(toks) : null;

  const modelSizeGb = gpu ? ((paramNum * 1e9 * QUANTS[quant].bpw) / 8 / 1e9).toFixed(1) : null;
  const fits = gpu ? parseFloat(modelSizeGb!) <= gpu.vram * gpuCount * 0.92 : null;

  // Compare all quants at current settings
  const quantComparison = gpu ? Object.entries(QUANTS).map(([k]) => ({
    name: k,
    toks: estimateToksPerSec(paramNum, k, gpu, gpuCount, backend),
    size: ((paramNum * 1e9 * QUANTS[k].bpw) / 8 / 1e9).toFixed(1),
  })) : [];

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">INFERENCE SPEED ESTIMATOR</h1>
          <p className="text-[var(--muted)] max-w-2xl">Predict tokens per second before downloading multi-gigabyte model files. Based on memory bandwidth — the primary bottleneck for LLM token generation.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">GPU</label>
              <select value={gpuName} onChange={(e) => setGpuName(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value="">— Select GPU —</option>
                {["Ada","Ampere","Turing","RDNA3","RDNA2","Apple Silicon","Multi-GPU","Datacenter"].map((gen) => (
                  <optgroup key={gen} label={gen}>
                    {GPUS.filter((g) => g.gen === gen).map((g) => (
                      <option key={g.name} value={g.name}>{g.name} ({g.vram}GB · {g.bandwidth} GB/s)</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">GPU Count</label>
              <select value={gpuCount} onChange={(e) => setGpuCount(Number(e.target.value))}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value={1}>1× GPU</option>
                <option value={2}>2× GPU</option>
                <option value={4}>4× GPU</option>
                <option value={8}>8× GPU</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Model Size (Billions of Parameters)</label>
              <input type="number" value={params} onChange={(e) => setParams(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                min="0.5" step="0.5" placeholder="e.g. 70" />
              <div className="flex flex-wrap gap-2 mt-2">
                {[3,7,8,13,27,70,72].map((p) => (
                  <button key={p} onClick={() => setParams(String(p))}
                    className={`text-xs border px-2 py-1 font-mono transition-all ${params === String(p) ? "border-cyan-400 text-cyan-400" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                    {p}B
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Quantization</label>
              <select value={quant} onChange={(e) => setQuant(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {Object.entries(QUANTS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label} — {((paramNum * 1e9 * v.bpw) / 8 / 1e9).toFixed(1)}GB</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Backend</label>
              <select value={backend} onChange={(e) => setBackend(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {Object.entries(BACKENDS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              {backend && <div className="text-xs text-[var(--muted)] mt-1.5 font-mono">{BACKENDS[backend].note}</div>}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Main result */}
            <div className={`border-2 p-8 text-center transition-colors ${fits === false ? "border-red-500/30" : fits === true ? "border-cyan-500/30 bg-cyan-500/[0.02]" : "border-[var(--border)]"}`}>
              {toks === null ? (
                <div className="text-[var(--muted)] font-mono text-sm">Select a GPU to see estimate</div>
              ) : toks === 0 ? (
                <>
                  <div className="text-red-400 text-xs uppercase tracking-widest mb-3">Model does not fit</div>
                  <div className="text-red-400 font-black font-mono text-4xl mb-2">OOM</div>
                  <div className="text-[var(--muted)] text-sm">
                    Need {modelSizeGb}GB · Have {gpu!.vram * gpuCount}GB
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs uppercase tracking-widest mb-3" style={{ color: rating!.color }}>{rating!.label}</div>
                  <div className="font-black font-mono text-6xl mb-2" style={{ color: rating!.color }}>
                    {toks}<span className="text-2xl ml-1 font-normal">tok/s</span>
                  </div>
                  <div className="text-[var(--muted)] text-sm mt-3">
                    {paramNum}B {quant} · {gpu!.name}{gpuCount > 1 ? ` ×${gpuCount}` : ""} · {BACKENDS[backend].label}
                  </div>
                  <div className="text-[var(--muted)] text-xs mt-2">
                    Model: {modelSizeGb}GB of {gpu!.vram * gpuCount}GB VRAM
                  </div>
                </>
              )}
            </div>

            {/* Quant comparison */}
            {gpu && quantComparison.length > 0 && (
              <div className="border border-[var(--border)] p-5">
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">All Quants — {paramNum}B on {gpu.name}{gpuCount > 1 ? ` ×${gpuCount}` : ""}</div>
                <div className="space-y-2">
                  {quantComparison.map((q) => {
                    const r = getRating(q.toks);
                    return (
                      <div key={q.name} className={`flex items-center gap-3 text-xs font-mono py-1.5 px-2 transition-colors ${q.name === quant ? "bg-[var(--surface)]" : ""}`}>
                        <span className={`w-14 ${q.name === quant ? "text-cyan-400 font-bold" : "text-[var(--muted)]"}`}>{q.name}</span>
                        <span className="text-[var(--muted)] w-12">{q.size}GB</span>
                        <div className="flex-1 bg-[var(--surface)] h-1.5">
                          {q.toks > 0 && (
                            <div style={{ width: `${Math.min(100, (q.toks / 200) * 100)}%`, background: r.color, height: "100%" }} />
                          )}
                        </div>
                        <span style={{ color: r.color }} className="w-20 text-right">
                          {q.toks === 0 ? "OOM" : `${q.toks} tok/s`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border border-[var(--border)] p-4 text-xs text-[var(--muted)] font-mono leading-relaxed">
              <div className="text-[var(--fg2)] mb-1">About this estimate</div>
              Token generation speed is primarily memory-bandwidth bound. This tool models bandwidth × quant overhead × backend efficiency. Real-world results typically fall within ±15% of this estimate. First-token latency (TTFT) is not modelled here.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
