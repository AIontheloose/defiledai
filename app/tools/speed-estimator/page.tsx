"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const GPUS = [
  { name: "RTX 4090", vram: 24, bw: 1008, gen: "Ada" },
  { name: "RTX 4080 Super", vram: 16, bw: 736, gen: "Ada" },
  { name: "RTX 4080", vram: 16, bw: 717, gen: "Ada" },
  { name: "RTX 4070 Ti", vram: 12, bw: 504, gen: "Ada" },
  { name: "RTX 4070", vram: 12, bw: 504, gen: "Ada" },
  { name: "RTX 3090 Ti", vram: 24, bw: 1008, gen: "Ampere" },
  { name: "RTX 3090", vram: 24, bw: 936, gen: "Ampere" },
  { name: "RTX 3080 Ti", vram: 12, bw: 912, gen: "Ampere" },
  { name: "RTX 3080 10GB", vram: 10, bw: 760, gen: "Ampere" },
  { name: "RTX 3070", vram: 8, bw: 448, gen: "Ampere" },
  { name: "RTX 3060 12GB", vram: 12, bw: 360, gen: "Ampere" },
  { name: "RX 7900 XTX", vram: 24, bw: 960, gen: "RDNA3" },
  { name: "RX 7800 XT", vram: 16, bw: 624, gen: "RDNA3" },
  { name: "M3 Max 40-core", vram: 48, bw: 400, gen: "Apple" },
  { name: "2× RTX 3090 NVLink", vram: 48, bw: 1872, gen: "Multi" },
  { name: "2× RTX 4090", vram: 48, bw: 2016, gen: "Multi" },
  { name: "A100 80GB", vram: 80, bw: 2000, gen: "Datacenter" },
];

const QUANTS: Record<string, { bpw: number; overhead: number }> = {
  F16:    { bpw: 16,   overhead: 1.00 },
  Q8_0:   { bpw: 8.5,  overhead: 0.97 },
  Q6_K:   { bpw: 6.6,  overhead: 0.94 },
  Q5_K_M: { bpw: 5.7,  overhead: 0.91 },
  Q4_K_M: { bpw: 4.8,  overhead: 0.88 },
  Q3_K_M: { bpw: 3.9,  overhead: 0.84 },
  IQ3_M:  { bpw: 3.7,  overhead: 0.83 },
  Q2_K:   { bpw: 2.6,  overhead: 0.78 },
};

const BACKENDS: Record<string, { label: string; eff: number }> = {
  exllamav2:     { label: "ExLlamaV2",         eff: 1.00 },
  llamacpp_cuda: { label: "llama.cpp (CUDA)",   eff: 0.80 },
  ollama:        { label: "Ollama",             eff: 0.78 },
  tensorrt:      { label: "TensorRT-LLM",       eff: 1.15 },
  llamacpp_rocm: { label: "llama.cpp (ROCm)",   eff: 0.70 },
  llamacpp_metal:{ label: "llama.cpp (Metal)",  eff: 0.85 },
};

function estimate(params: number, quant: string, gpu: typeof GPUS[0], count: number, backend: string): number {
  const q = QUANTS[quant];
  const b = BACKENDS[backend];
  if (!q || !b || !gpu) return 0;
  const modelGb = (params * 1e9 * q.bpw) / 8 / 1e9;
  const totalVram = gpu.vram * count;
  if (modelGb > totalVram * 0.92) return 0;
  const modelBytes = modelGb * 1e9;
  const totalBw = gpu.bw * count * (count > 1 ? 0.85 : 1) * 1e9;
  return Math.round((totalBw / modelBytes) * q.overhead * b.eff * 0.82);
}

function SpeedEstimatorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [params, setParams] = useState(searchParams.get("p") ?? "70");
  const [quant, setQuant] = useState(searchParams.get("q") ?? "Q4_K_M");
  const [gpuName, setGpuName] = useState(searchParams.get("g") ?? "RTX 3090");
  const [count, setCount] = useState(Number(searchParams.get("n") ?? "2"));
  const [backend, setBackend] = useState(searchParams.get("b") ?? "exllamav2");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("p", params);
    url.searchParams.set("q", quant);
    url.searchParams.set("g", gpuName);
    url.searchParams.set("n", String(count));
    url.searchParams.set("b", backend);
    router.replace(url.pathname + url.search, { scroll: false });
  }, [params, quant, gpuName, count, backend]);

  const gpu = GPUS.find(g => g.name === gpuName);
  const paramNum = parseFloat(params) || 0;
  const toks = gpu ? estimate(paramNum, quant, gpu, count, backend) : null;
  const modelGb = paramNum > 0 && quant ? ((paramNum * 1e9 * QUANTS[quant].bpw) / 8 / 1e9).toFixed(1) : "0";
  const totalVram = gpu ? gpu.vram * count : 0;
  const fits = toks !== null && toks > 0;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quantComparison = gpu ? Object.entries(QUANTS).map(([k]) => ({
    name: k,
    toks: estimate(paramNum, k, gpu, count, backend),
    size: ((paramNum * 1e9 * QUANTS[k].bpw) / 8 / 1e9).toFixed(1),
  })) : [];

  const getRating = (t: number) => {
    if (t === 0) return { label: "DOES NOT FIT", color: "#f87171" };
    if (t >= 100) return { label: "EXCELLENT", color: "#22d3ee" };
    if (t >= 50) return { label: "GREAT", color: "#4ade80" };
    if (t >= 20) return { label: "GOOD", color: "#86efac" };
    if (t >= 10) return { label: "USABLE", color: "#fbbf24" };
    return { label: "SLOW", color: "#f87171" };
  };

  const rating = toks !== null ? getRating(toks) : null;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-4xl font-black font-mono">INFERENCE SPEED ESTIMATOR</h1>
            <button onClick={copyLink}
              className="text-xs font-mono text-cyan-400 border border-cyan-500/30 px-4 py-2 hover:border-cyan-400 transition-all flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 1h5v5M15 1L8 8"/>
              </svg>
              {copied ? "LINK COPIED ✓" : "SHARE THIS CONFIG"}
            </button>
          </div>
          <p className="text-[var(--muted)] max-w-2xl mt-2">Predict tok/s before downloading. Share your estimate with a link.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">GPU</label>
              <select value={gpuName} onChange={e => setGpuName(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {["Ada","Ampere","RDNA3","Apple","Multi","Datacenter"].map(gen => (
                  <optgroup key={gen} label={gen}>
                    {GPUS.filter(g => g.gen === gen).map(g => (
                      <option key={g.name} value={g.name}>{g.name} ({g.vram}GB · {g.bw}GB/s)</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">GPU Count</label>
              <select value={count} onChange={e => setCount(Number(e.target.value))}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {[1,2,4,8].map(n => <option key={n} value={n}>{n}×</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Parameters (B)</label>
              <input type="number" value={params} onChange={e => setParams(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="e.g. 70" min="0.5" step="0.5" />
              <div className="flex flex-wrap gap-1 mt-2">
                {[3,7,8,13,27,70,72].map(p => (
                  <button key={p} onClick={() => setParams(String(p))}
                    className={`text-xs border px-2 py-0.5 font-mono transition-all ${params === String(p) ? "border-cyan-400 text-cyan-400" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                    {p}B
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Quantization</label>
              <select value={quant} onChange={e => setQuant(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {Object.keys(QUANTS).map(k => (
                  <option key={k} value={k}>{k} — {((paramNum * 1e9 * QUANTS[k].bpw) / 8 / 1e9).toFixed(1)}GB</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Backend</label>
              <select value={backend} onChange={e => setBackend(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {Object.entries(BACKENDS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`border-2 p-8 text-center ${!fits ? "border-red-500/30" : "border-cyan-500/30 bg-cyan-500/[0.02]"}`}>
              {toks === null ? (
                <div className="text-[var(--muted)] font-mono text-sm">Select a GPU to see estimate</div>
              ) : toks === 0 ? (
                <>
                  <div className="text-red-400 text-xs uppercase tracking-widest mb-3">Model does not fit</div>
                  <div className="text-red-400 font-black font-mono text-4xl mb-2">OOM</div>
                  <div className="text-[var(--muted)] text-sm">Need {modelGb}GB · Have {totalVram}GB</div>
                </>
              ) : (
                <>
                  <div className="text-xs uppercase tracking-widest mb-3" style={{ color: rating!.color }}>{rating!.label}</div>
                  <div className="font-black font-mono text-6xl mb-2" style={{ color: rating!.color }}>
                    {toks}<span className="text-2xl ml-1 font-normal">tok/s</span>
                  </div>
                  <div className="text-[var(--muted)] text-sm mt-3">
                    {paramNum}B {quant} · {gpuName}{count > 1 ? ` ×${count}` : ""} · {BACKENDS[backend].label}
                  </div>
                  <div className="text-[var(--muted)] text-xs mt-1">
                    Model: {modelGb}GB of {totalVram}GB VRAM
                  </div>
                </>
              )}
            </div>

            {gpu && quantComparison.length > 0 && (
              <div className="border border-[var(--border)] p-5">
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">All Quants at {paramNum}B</div>
                <div className="space-y-2">
                  {quantComparison.map(q => {
                    const color = q.toks === 0 ? "#f87171" : q.toks >= 100 ? "#22d3ee" : q.toks >= 20 ? "#4ade80" : "#fbbf24";
                    return (
                      <div key={q.name} className={`flex items-center gap-3 text-xs font-mono py-1 px-2 ${q.name === quant ? "bg-[var(--surface)]" : ""}`}>
                        <span className={q.name === quant ? "text-[var(--accent)] font-bold w-14" : "text-[var(--muted)] w-14"}>{q.name}</span>
                        <span className="text-[var(--muted)] w-12">{q.size}GB</span>
                        <div className="flex-1 bg-[var(--surface)] h-1.5">
                          {q.toks > 0 && <div style={{ width: `${Math.min(100, (q.toks / 200) * 100)}%`, background: color, height: "100%" }} />}
                        </div>
                        <span style={{ color }} className="w-20 text-right">{q.toks === 0 ? "OOM" : `${q.toks} tok/s`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SpeedEstimatorPage() {
  return <Suspense><SpeedEstimatorInner /></Suspense>;
}
