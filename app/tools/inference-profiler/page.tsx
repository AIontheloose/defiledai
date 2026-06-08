"use client";
import { useState } from "react";

const GPUS = [
  { name: "RTX 4090",           vram: 24, bw: 1008, gen: "Ada" },
  { name: "RTX 4080 Super",     vram: 16, bw: 736,  gen: "Ada" },
  { name: "RTX 4080",           vram: 16, bw: 717,  gen: "Ada" },
  { name: "RTX 4070 Ti Super",  vram: 16, bw: 672,  gen: "Ada" },
  { name: "RTX 4070 Ti",        vram: 12, bw: 504,  gen: "Ada" },
  { name: "RTX 4070 Super",     vram: 12, bw: 504,  gen: "Ada" },
  { name: "RTX 4070",           vram: 12, bw: 504,  gen: "Ada" },
  { name: "RTX 4060 Ti 16GB",   vram: 16, bw: 288,  gen: "Ada" },
  { name: "RTX 4060 Ti 8GB",    vram: 8,  bw: 288,  gen: "Ada" },
  { name: "RTX 3090 Ti",        vram: 24, bw: 1008, gen: "Ampere" },
  { name: "RTX 3090",           vram: 24, bw: 936,  gen: "Ampere" },
  { name: "RTX 3080 Ti",        vram: 12, bw: 912,  gen: "Ampere" },
  { name: "RTX 3080 12GB",      vram: 12, bw: 912,  gen: "Ampere" },
  { name: "RTX 3080 10GB",      vram: 10, bw: 760,  gen: "Ampere" },
  { name: "RTX 3070 Ti",        vram: 8,  bw: 608,  gen: "Ampere" },
  { name: "RTX 3070",           vram: 8,  bw: 448,  gen: "Ampere" },
  { name: "RTX 3060 Ti",        vram: 8,  bw: 448,  gen: "Ampere" },
  { name: "RTX 3060 12GB",      vram: 12, bw: 360,  gen: "Ampere" },
  { name: "RTX 2080 Ti",        vram: 11, bw: 616,  gen: "Turing" },
  { name: "RX 7900 XTX",        vram: 24, bw: 960,  gen: "RDNA3" },
  { name: "RX 7900 XT",         vram: 20, bw: 800,  gen: "RDNA3" },
  { name: "RX 7800 XT",         vram: 16, bw: 624,  gen: "RDNA3" },
  { name: "RX 6900 XT",         vram: 16, bw: 512,  gen: "RDNA2" },
  { name: "RX 6800 XT",         vram: 16, bw: 512,  gen: "RDNA2" },
  { name: "M3 Max 40-core",     vram: 48, bw: 400,  gen: "Apple" },
  { name: "M3 Pro 18-core",     vram: 36, bw: 150,  gen: "Apple" },
  { name: "M2 Ultra",           vram: 192,bw: 800,  gen: "Apple" },
  { name: "2x RTX 3090 NVLink", vram: 48, bw: 1872, gen: "Multi" },
  { name: "2x RTX 4090",        vram: 48, bw: 2016, gen: "Multi" },
  { name: "A100 40GB",          vram: 40, bw: 1555, gen: "Datacenter" },
  { name: "A100 80GB",          vram: 80, bw: 2000, gen: "Datacenter" },
  { name: "H100 SXM",           vram: 80, bw: 3350, gen: "Datacenter" },
];

const BACKENDS = [
  { id: "exllamav2",      label: "ExLlamaV2",          eff: 1.00, ttftMult: 1.0 },
  { id: "llamacpp_cuda",  label: "llama.cpp (CUDA)",    eff: 0.80, ttftMult: 1.2 },
  { id: "ollama",         label: "Ollama",              eff: 0.78, ttftMult: 1.3 },
  { id: "tensorrt",       label: "TensorRT-LLM",        eff: 1.15, ttftMult: 0.7 },
  { id: "llamacpp_rocm",  label: "llama.cpp (ROCm)",    eff: 0.70, ttftMult: 1.4 },
  { id: "llamacpp_metal", label: "llama.cpp (Metal)",   eff: 0.85, ttftMult: 1.1 },
];

const QUANTS = [
  { name: "F16",    bpw: 16   },
  { name: "Q8_0",   bpw: 8.5  },
  { name: "Q6_K",   bpw: 6.6  },
  { name: "Q5_K_M", bpw: 5.7  },
  { name: "Q4_K_M", bpw: 4.8  },
  { name: "Q3_K_M", bpw: 3.9  },
  { name: "IQ3_M",  bpw: 3.7  },
  { name: "Q2_K",   bpw: 2.6  },
];

function calcProfile(params: number, quantBpw: number, gpuBw: number, gpuVram: number, gpuCount: number, backendEff: number, backendTtftMult: number, ctx: number, batch: number) {
  const modelGb = (params * 1e9 * quantBpw) / 8 / 1e9;
  const kvGb = (Math.round(params * 0.571) * 2 * 2 * 128 * ctx) / 1e9 / 1024;
  const totalGb = modelGb + kvGb + 0.5;
  const totalVram = gpuVram * gpuCount;
  const cpuOffload = Math.max(0, totalGb - totalVram * 0.92);
  const fits = cpuOffload === 0;

  const modelBytes = modelGb * 1e9;
  const totalBw = gpuBw * gpuCount * (gpuCount > 1 ? 0.85 : 1) * 1e9;
  let toks = Math.round((totalBw / modelBytes) * backendEff * 0.82);
  if (!fits) toks = Math.round(toks * 0.15);

  const ttft = parseFloat(((ctx / 512) * backendTtftMult * (modelGb / 5) * 0.3 * batch).toFixed(2));
  const efficiency = fits ? Math.round((toks / (totalBw / modelBytes * 0.82)) * 100) : 0;

  const notes: string[] = [];
  if (!fits) notes.push(`⚠ ${cpuOffload.toFixed(1)}GB overflows to RAM — ~${toks} tok/s (CPU-limited)`);
  if (kvGb > 4) notes.push(`ℹ KV cache is ${kvGb.toFixed(1)}GB at ${ctx} ctx — consider Q8 KV cache`);
  if (efficiency > 85) notes.push("✓ Excellent memory bandwidth utilisation");
  if (toks > 100) notes.push("✓ Interactive speed — feels instant for chat");
  else if (toks > 30) notes.push("✓ Usable for interactive generation");
  else if (toks > 10) notes.push("⚠ Marginal — consider smaller model or lower quant");
  else if (toks > 0) notes.push("✗ Too slow for interactive use");

  return { toks, ttft, vramUsed: Math.min(totalGb, totalVram), cpuOffload, efficiency, modelGb, kvGb, totalGb, fits, notes };
}

export default function InferenceProfilerPage() {
  const [params, setParams] = useState("70");
  const [quantName, setQuantName] = useState("Q4_K_M");
  const [gpuName, setGpuName] = useState(GPUS[0].name);
  const [gpuName2, setGpuName2] = useState(GPUS[2].name);
  const [backendId, setBackendId] = useState("exllamav2");
  const [backendId2, setBackendId2] = useState("exllamav2");
  const [gpuCount, setGpuCount] = useState(1);
  const [gpuCount2, setGpuCount2] = useState(2);
  const [ctx, setCtx] = useState(4096);
  const [batch, setBatch] = useState(1);
  const [compareMode, setCompareMode] = useState(false);

  const paramNum = parseFloat(params) || 0;
  const quant = QUANTS.find(q => q.name === quantName) ?? QUANTS[4];
  const gpu = GPUS.find(g => g.name === gpuName) ?? GPUS[0];
  const gpu2 = GPUS.find(g => g.name === gpuName2) ?? GPUS[2];
  const backend = BACKENDS.find(b => b.id === backendId) ?? BACKENDS[0];
  const backend2 = BACKENDS.find(b => b.id === backendId2) ?? BACKENDS[0];

  const result = paramNum > 0 ? calcProfile(paramNum, quant.bpw, gpu.bw, gpu.vram, gpuCount, backend.eff, backend.ttftMult, ctx, batch) : null;
  const result2 = compareMode && paramNum > 0 ? calcProfile(paramNum, quant.bpw, gpu2.bw, gpu2.vram, gpuCount2, backend2.eff, backend2.ttftMult, ctx, batch) : null;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Tools</div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-4xl font-black font-mono">INFERENCE PROFILER</h1>
            <button onClick={() => setCompareMode(!compareMode)}
              className={`text-xs border px-4 py-2 font-mono transition-all ${compareMode ? "border-cyan-400 text-cyan-400 bg-cyan-400/10" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
              {compareMode ? "▪ Compare ON" : "Compare 2 configs"}
            </button>
          </div>
          <p className="text-[var(--muted)] max-w-2xl mt-2">Throughput, TTFT, bandwidth utilisation, and CPU offload analysis for any GPU + model combination.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ── Config A ── */}
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono mb-2">
              {compareMode ? "Config A" : "Configuration"}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Parameters (B)</label>
              <input type="number" value={params} onChange={e => setParams(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                min="0.5" step="0.5" placeholder="e.g. 70" />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[3,7,8,13,27,70,72].map(p => (
                  <button key={p} onClick={() => setParams(String(p))}
                    className={`text-xs border px-2 py-0.5 font-mono transition-all ${params === String(p) ? "border-cyan-400 text-cyan-400" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                    {p}B
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Quantization</label>
                <select value={quantName} onChange={e => setQuantName(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  {QUANTS.map(q => <option key={q.name} value={q.name}>{q.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">GPU Count</label>
                <select value={gpuCount} onChange={e => setGpuCount(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  {[1,2,4,8].map(n => <option key={n} value={n}>{n}×</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">GPU</label>
              <select value={gpuName} onChange={e => setGpuName(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {["Ada","Ampere","Turing","RDNA3","RDNA2","Apple","Multi","Datacenter"].map(gen => (
                  <optgroup key={gen} label={gen}>
                    {GPUS.filter(g => g.gen === gen).map(g => (
                      <option key={g.name} value={g.name}>{g.name} ({g.vram}GB · {g.bw}GB/s)</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Backend</label>
              <select value={backendId} onChange={e => setBackendId(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {BACKENDS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Context (tokens)</label>
                <select value={ctx} onChange={e => setCtx(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  {[512,1024,2048,4096,8192,16384,32768,65536].map(c => (
                    <option key={c} value={c}>{c >= 1024 ? `${c/1024}K` : c}</option>
                  ))}
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

            {/* Config B inputs */}
            {compareMode && (
              <div className="border border-purple-500/30 bg-purple-500/[0.03] p-4 space-y-3 mt-2">
                <div className="text-xs uppercase tracking-widest text-purple-400 font-mono">Config B</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">GPU Count</label>
                    <select value={gpuCount2} onChange={e => setGpuCount2(Number(e.target.value))}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                      {[1,2,4,8].map(n => <option key={n} value={n}>{n}×</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">Backend</label>
                    <select value={backendId2} onChange={e => setBackendId2(e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                      {BACKENDS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">GPU</label>
                  <select value={gpuName2} onChange={e => setGpuName2(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                    {["Ada","Ampere","Turing","RDNA3","RDNA2","Apple","Multi","Datacenter"].map(gen => (
                      <optgroup key={gen} label={gen}>
                        {GPUS.filter(g => g.gen === gen).map(g => (
                          <option key={g.name} value={g.name}>{g.name} ({g.vram}GB)</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* ── Results ── */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Config A result */}
                <div className={`border-2 p-6 transition-colors ${result.cpuOffload > 0 ? "border-red-500/30 bg-red-500/[0.02]" : "border-cyan-500/30 bg-cyan-500/[0.02]"}`}>
                  <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">
                    {compareMode ? "Config A Results" : "Profile Results"}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <div className="text-xs text-[var(--muted)] mb-1 font-mono">Throughput</div>
                      <div className="text-4xl font-black font-mono text-cyan-400">
                        {result.toks > 0 ? result.toks : "OOM"}
                        {result.toks > 0 && <span className="text-lg ml-1 font-normal">t/s</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--muted)] mb-1 font-mono">TTFT</div>
                      <div className="text-4xl font-black font-mono text-purple-400">
                        {result.ttft}<span className="text-lg ml-1 font-normal">s</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs font-mono border-t border-[var(--border)] pt-4">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Model size</span>
                      <span className="text-[var(--fg2)]">{result.modelGb.toFixed(1)}GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">KV cache ({ctx >= 1024 ? `${ctx/1024}K` : ctx} ctx)</span>
                      <span className="text-[var(--fg2)]">{result.kvGb.toFixed(1)}GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Total VRAM needed</span>
                      <span className={result.fits ? "text-green-400" : "text-red-400"}>{result.totalGb.toFixed(1)}GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">CPU offload</span>
                      <span className={result.cpuOffload > 0 ? "text-red-400" : "text-green-400"}>
                        {result.cpuOffload > 0 ? `${result.cpuOffload.toFixed(1)}GB` : "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">BW utilisation</span>
                      <span className={result.efficiency > 70 ? "text-green-400" : "text-yellow-400"}>{result.efficiency}%</span>
                    </div>
                  </div>
                </div>

                {/* Config B result */}
                {compareMode && result2 && (
                  <div className="border-2 border-purple-500/30 bg-purple-500/[0.02] p-5">
                    <div className="text-xs uppercase tracking-widest text-purple-400 mb-3 font-mono">Config B Results</div>
                    <div className="grid grid-cols-3 gap-3 text-center font-mono mb-4">
                      <div>
                        <div className="text-xs text-[var(--muted)] mb-1">Tok/s</div>
                        <div className="text-2xl font-black text-purple-400">{result2.toks > 0 ? result2.toks : "OOM"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[var(--muted)] mb-1">TTFT</div>
                        <div className="text-2xl font-black text-purple-400">{result2.ttft}s</div>
                      </div>
                      <div>
                        <div className="text-xs text-[var(--muted)] mb-1">BW Util</div>
                        <div className="text-2xl font-black text-purple-400">{result2.efficiency}%</div>
                      </div>
                    </div>
                    <div className="border-t border-[var(--border)] pt-3 text-xs font-mono">
                      <span className="text-[var(--muted)]">Δ Throughput: </span>
                      <span className={result2.toks >= result.toks ? "text-green-400" : "text-red-400"}>
                        {result2.toks >= result.toks ? "+" : ""}{result2.toks - result.toks} tok/s
                        {result.toks > 0 && ` (${(((result2.toks - result.toks) / result.toks) * 100).toFixed(1)}%)`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {result.toks > 0 && (
                  <div className="border border-[var(--border)] bg-[var(--surface)]/40 p-4 space-y-1.5">
                    <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2 font-mono">Analysis</div>
                    {result.notes.map((n, i) => (
                      <div key={i} className="text-xs font-mono text-[var(--fg2)]">{n}</div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="border border-[var(--border)] p-8 text-center text-[var(--muted)] font-mono text-sm">
                Enter parameters above to see profile results
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
