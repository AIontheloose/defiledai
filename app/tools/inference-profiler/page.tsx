"use client";
import { useState } from "react";

interface ProfileResult {
  label: string;
  toks: number;
  ttft: number;
  vramUsed: number;
  cpuOffload: number;
  efficiency: number;
  notes: string[];
}

const GPUS = [
  { name: "RTX 4090 24GB",        vram: 24, bw: 1008, gen: "Ada" },
  { name: "RTX 3090 24GB",        vram: 24, bw: 936,  gen: "Ampere" },
  { name: "RTX 3080 Ti 12GB",     vram: 12, bw: 912,  gen: "Ampere" },
  { name: "RTX 3080 10GB",        vram: 10, bw: 760,  gen: "Ampere" },
  { name: "RTX 4080 16GB",        vram: 16, bw: 717,  gen: "Ada" },
  { name: "RTX 4070 Ti 12GB",     vram: 12, bw: 504,  gen: "Ada" },
  { name: "RX 7900 XTX 24GB",     vram: 24, bw: 960,  gen: "RDNA3" },
  { name: "2× RTX 3090 NVLink",   vram: 48, bw: 1872, gen: "Multi" },
  { name: "2× RTX 4090",          vram: 48, bw: 2016, gen: "Multi" },
];

const BACKENDS = [
  { id: "exllamav2",   label: "ExLlamaV2",        eff: 1.00, ttftMult: 1.0, gpuOnly: true },
  { id: "llamacpp",    label: "llama.cpp (CUDA)",  eff: 0.80, ttftMult: 1.2, gpuOnly: false },
  { id: "ollama",      label: "Ollama",            eff: 0.78, ttftMult: 1.3, gpuOnly: false },
  { id: "tensorrt",    label: "TensorRT-LLM",      eff: 1.15, ttftMult: 0.7, gpuOnly: true },
  { id: "llamacpp_rocm", label: "llama.cpp (ROCm)", eff: 0.70, ttftMult: 1.4, gpuOnly: false },
];

const QUANTS = [
  { name: "F16",    bpw: 16,   qualMult: 1.00 },
  { name: "Q8_0",   bpw: 8.5,  qualMult: 0.97 },
  { name: "Q6_K",   bpw: 6.6,  qualMult: 0.94 },
  { name: "Q5_K_M", bpw: 5.7,  qualMult: 0.91 },
  { name: "Q4_K_M", bpw: 4.8,  qualMult: 0.88 },
  { name: "Q3_K_M", bpw: 3.9,  qualMult: 0.84 },
  { name: "IQ3_M",  bpw: 3.7,  qualMult: 0.83 },
  { name: "Q2_K",   bpw: 2.6,  qualMult: 0.78 },
];

function profile(params: number, quant: typeof QUANTS[0], gpu: typeof GPUS[0], backend: typeof BACKENDS[0], ctx: number, batchSize: number): ProfileResult {
  const modelGb = (params * 1e9 * quant.bpw) / 8 / 1e9;
  const kvGb = (params * 0.571 * 2 * 2 * 128 * ctx) / 1e9 / 1024;
  const totalGb = modelGb + kvGb + 0.5;
  const vramUsed = Math.min(totalGb, gpu.vram);
  const cpuOffload = Math.max(0, totalGb - gpu.vram * 0.92);
  const fits = cpuOffload === 0;

  // Bandwidth-bound tok/s
  const modelBytes = modelGb * 1e9;
  const bwBytes = gpu.bw * 1e9;
  let toks = Math.round((bwBytes / modelBytes) * quant.qualMult * backend.eff * 0.82);
  if (!fits) toks = Math.round(toks * 0.15); // CPU offload kills speed

  // TTFT scales with input length and batch
  const ttft = parseFloat(((ctx / 512) * backend.ttftMult * (modelGb / 5) * 0.3 * batchSize).toFixed(2));

  const efficiency = fits ? Math.round((toks / (gpu.bw * 1e9 / modelBytes * 0.82)) * 100) : 0;

  const notes: string[] = [];
  if (!fits) notes.push(`⚠ ${cpuOffload.toFixed(1)}GB overflows to RAM — expect ~${Math.round(toks)} tok/s (CPU-limited)`);
  if (kvGb > 4) notes.push(`ℹ KV cache is ${kvGb.toFixed(1)}GB at ${ctx}K ctx — consider Q8 KV cache`);
  if (backend.gpuOnly && gpu.gen === "RDNA3") notes.push("⚠ ExLlamaV2/TensorRT are NVIDIA-only — use llama.cpp ROCm");
  if (batchSize > 1 && backend.id !== "tensorrt") notes.push("ℹ Batch >1 is best with TensorRT-LLM or vLLM for concurrent users");
  if (efficiency > 85) notes.push("✓ Excellent memory bandwidth utilisation");
  if (toks > 100) notes.push("✓ Interactive speed — feels instant for chat");
  else if (toks > 30) notes.push("✓ Usable for interactive generation");
  else if (toks > 10) notes.push("⚠ Marginal speed — consider smaller model or lower quant");
  else notes.push("✗ Too slow for interactive use");

  return { label: `${params}B ${quant.name} on ${gpu.name}`, toks, ttft, vramUsed, cpuOffload, efficiency, notes };
}

export default function InferenceProfilerPage() {
  const [params, setParams] = useState("70");
  const [quantName, setQuantName] = useState("Q4_K_M");
  const [gpuName, setGpuName] = useState(GPUS[0].name);
  const [backendId, setBackendId] = useState("exllamav2");
  const [ctx, setCtx] = useState(4096);
  const [batch, setBatch] = useState(1);
  const [compareMode, setCompareMode] = useState(false);
  const [compare2, setCompare2] = useState({ params: "70", quant: "Q4_K_M", gpu: "2× RTX 3090 NVLink", backend: "exllamav2" });

  const paramNum = parseFloat(params) || 0;
  const quant = QUANTS.find(q => q.name === quantName)!;
  const gpu = GPUS.find(g => g.name === gpuName)!;
  const backend = BACKENDS.find(b => b.id === backendId)!;

  const result = gpu && quant && backend ? profile(paramNum, quant, gpu, backend, ctx, batch) : null;

  const result2 = compareMode ? (() => {
    const q2 = QUANTS.find(q => q.name === compare2.quant)!;
    const g2 = GPUS.find(g => g.name === compare2.gpu)!;
    const b2 = BACKENDS.find(b => b.id === compare2.backend)!;
    return profile(parseFloat(compare2.params)||0, q2, g2, b2, ctx, batch);
  })() : null;

  const modelGb = paramNum > 0 && quant ? ((paramNum * 1e9 * quant.bpw) / 8 / 1e9).toFixed(1) : "0";

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">INFERENCE PROFILER</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Detailed inference profile: throughput, time-to-first-token, bandwidth utilisation, CPU offload analysis, and bottleneck identification.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Configuration</div>
              <button onClick={() => setCompareMode(!compareMode)}
                className={`text-xs border px-3 py-1 font-mono transition-all ${compareMode ? "border-cyan-400 text-cyan-400" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                {compareMode ? "▪ Compare ON" : "Compare 2 configs"}
              </button>
            </div>

            {[
              { label: "Parameters (B)", value: params, set: setParams, type: "number" },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">{f.label}</label>
                <input type="number" value={f.value} onChange={e => f.set(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
                {f.label.includes("Param") && <div className="text-xs text-[var(--muted)] mt-1 font-mono">Model size at {quantName}: {modelGb}GB</div>}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Quantization</label>
                <select value={quantName} onChange={e => setQuantName(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  {QUANTS.map(q => <option key={q.name}>{q.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Backend</label>
                <select value={backendId} onChange={e => setBackendId(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  {BACKENDS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">GPU</label>
              <select value={gpuName} onChange={e => setGpuName(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {GPUS.map(g => <option key={g.name}>{g.name} ({g.vram}GB · {g.bw}GB/s)</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Context (tokens)</label>
                <select value={ctx} onChange={e => setCtx(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  {[512,1024,2048,4096,8192,16384,32768,65536].map(c => <option key={c} value={c}>{c >= 1024 ? `${c/1024}K` : c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Batch Size</label>
                <select value={batch} onChange={e => setBatch(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  {[1,2,4,8,16].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {compareMode && (
              <div className="border border-purple-500/30 p-4 space-y-3">
                <div className="text-xs uppercase tracking-widest text-purple-400 mb-2 font-mono">Config B</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Params (B)", key: "params" },
                    { label: "Quant", key: "quant", options: QUANTS.map(q=>q.name) },
                    { label: "GPU", key: "gpu", options: GPUS.map(g=>g.name) },
                    { label: "Backend", key: "backend", options: BACKENDS.map(b=>({val:b.id,label:b.label})) },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs text-[var(--muted)] mb-1">{f.label}</label>
                      {f.options ? (
                        <select value={(compare2 as any)[f.key]} onChange={e=>setCompare2(p=>({...p,[f.key]:e.target.value}))}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] px-2 py-1.5 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]">
                          {(f.options as any[]).map((o:any) => typeof o === "string" ? <option key={o}>{o}</option> : <option key={o.val} value={o.val}>{o.label}</option>)}
                        </select>
                      ) : (
                        <input type="number" value={(compare2 as any)[f.key]} onChange={e=>setCompare2(p=>({...p,[f.key]:e.target.value}))}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] px-2 py-1.5 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {result && (
              <>
                <div className={`border-2 p-6 ${result.cpuOffload > 0 ? "border-red-500/30" : "border-cyan-500/30 bg-cyan-500/[0.02]"}`}>
                  <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">Profile Results</div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-[var(--muted)] mb-1">Throughput</div>
                      <div className="text-4xl font-black font-mono text-cyan-400">{result.toks}<span className="text-lg ml-1">t/s</span></div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--muted)] mb-1">TTFT</div>
                      <div className="text-4xl font-black font-mono text-purple-400">{result.ttft}<span className="text-lg ml-1">s</span></div>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between"><span className="text-[var(--muted)]">VRAM used</span><span className="text-[var(--fg2)]">{result.vramUsed.toFixed(1)}GB</span></div>
                    <div className="flex justify-between"><span className="text-[var(--muted)]">CPU offload</span><span className={result.cpuOffload > 0 ? "text-red-400" : "text-green-400"}>{result.cpuOffload > 0 ? `${result.cpuOffload.toFixed(1)}GB` : "None"}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--muted)]">BW utilisation</span><span className={result.efficiency > 70 ? "text-green-400" : "text-yellow-400"}>{result.efficiency}%</span></div>
                  </div>
                </div>

                {compareMode && result2 && (
                  <div className="border-2 border-purple-500/30 bg-purple-500/[0.02] p-5">
                    <div className="text-xs uppercase tracking-widest text-purple-400 mb-3 font-mono">Config B Results</div>
                    <div className="grid grid-cols-3 gap-3 text-xs font-mono text-center">
                      <div><div className="text-[var(--muted)] mb-1">Tok/s</div><div className="text-2xl font-black text-purple-400">{result2.toks}</div></div>
                      <div><div className="text-[var(--muted)] mb-1">TTFT</div><div className="text-2xl font-black text-purple-400">{result2.ttft}s</div></div>
                      <div><div className="text-[var(--muted)] mb-1">BW Util</div><div className="text-2xl font-black text-purple-400">{result2.efficiency}%</div></div>
                    </div>
                    {result && result2 && (
                      <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs font-mono">
                        <span className="text-[var(--muted)]">Δ Throughput: </span>
                        <span className={result2.toks > result.toks ? "text-green-400" : "text-red-400"}>
                          {result2.toks > result.toks ? "+" : ""}{result2.toks - result.toks} tok/s ({result.toks > 0 ? (((result2.toks - result.toks)/result.toks)*100).toFixed(1) : "∞"}%)
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="border border-[var(--border)] p-4 space-y-2">
                  <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2 font-mono">Analysis</div>
                  {result.notes.map((n,i) => (
                    <div key={i} className="text-xs font-mono text-[var(--fg2)]">{n}</div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
