"use client";
import { useState } from "react";

const MODELS_CTX = [
  { name: "Llama 3.1 8B", maxCtx: 131072, layers: 32, heads: 32, headDim: 128, kvFactor: 2 },
  { name: "Llama 3.1 70B", maxCtx: 131072, layers: 80, heads: 64, headDim: 128, kvFactor: 2 },
  { name: "Mistral 7B", maxCtx: 32768, layers: 32, heads: 32, headDim: 128, kvFactor: 2 },
  { name: "Mistral Nemo 12B", maxCtx: 131072, layers: 40, heads: 32, headDim: 128, kvFactor: 2 },
  { name: "Qwen 2.5 7B", maxCtx: 131072, layers: 28, heads: 28, headDim: 128, kvFactor: 2 },
  { name: "Qwen 2.5 72B", maxCtx: 131072, layers: 80, heads: 64, headDim: 128, kvFactor: 2 },
  { name: "DeepSeek R1 7B", maxCtx: 65536, layers: 30, heads: 32, headDim: 128, kvFactor: 2 },
  { name: "DeepSeek R1 70B", maxCtx: 65536, layers: 80, heads: 64, headDim: 128, kvFactor: 2 },
  { name: "Gemma 2 9B", maxCtx: 8192, layers: 42, heads: 16, headDim: 256, kvFactor: 2 },
  { name: "Gemma 2 27B", maxCtx: 8192, layers: 46, heads: 32, headDim: 128, kvFactor: 2 },
  { name: "Phi-3 Medium 14B", maxCtx: 131072, layers: 40, heads: 40, headDim: 128, kvFactor: 2 },
  { name: "Dolphin 2.9 Llama 3.1 8B", maxCtx: 131072, layers: 32, heads: 32, headDim: 128, kvFactor: 2 },
];

const QUANT_BPW: Record<string, number> = {
  F16: 16, Q8_0: 8.5, Q6_K: 6.6, Q5_K_M: 5.7, Q4_K_M: 4.8, Q3_K_M: 3.9, Q2_K: 2.6,
};

function calcKvCache(model: typeof MODELS_CTX[0], ctx: number, kvQuant: string): number {
  // KV cache = 2 (k+v) × layers × heads × headDim × ctx × bytes_per_element
  const bpe = kvQuant === "F16" ? 2 : kvQuant === "Q8" ? 1 : 0.5;
  const bytes = 2 * model.layers * model.heads * model.headDim * ctx * bpe;
  return bytes / 1e9;
}

const CONTEXT_PRESETS = [512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072];

export default function ContextCalculatorPage() {
  const [modelName, setModelName] = useState("Llama 3.1 8B");
  const [quant, setQuant] = useState("Q4_K_M");
  const [kvQuant, setKvQuant] = useState("F16");
  const [ctx, setCtx] = useState(4096);
  const [gpuVram, setGpuVram] = useState("24");
  const [paramGb, setParamGb] = useState("");

  const model = MODELS_CTX.find((m) => m.name === modelName)!;
  const bpw = QUANT_BPW[quant] ?? 4.8;
  const paramGbAuto = model ? (model.layers * model.heads * model.headDim * model.headDim * 4 * bpw) / 8 / 1e9 : 0;
  const weightGb = parseFloat(paramGb) || paramGbAuto;
  const kvGb = model ? calcKvCache(model, ctx, kvQuant) : 0;
  const totalGb = weightGb + kvGb + 0.5;
  const vram = parseFloat(gpuVram) || 0;
  const fits = vram > 0 ? totalGb <= vram : null;
  const maxCtxForVram = model && vram > 0 ? Math.floor(
    ((vram - weightGb - 0.5) * 1e9) /
    (2 * model.layers * model.heads * model.headDim * (kvQuant === "F16" ? 2 : kvQuant === "Q8" ? 1 : 0.5))
  ) : 0;

  const clampedMax = Math.min(maxCtxForVram, model?.maxCtx ?? 131072);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">CONTEXT LENGTH CALCULATOR</h1>
          <p className="text-[var(--muted)] max-w-2xl">Calculate the maximum context length your GPU can support for any model and quantization. KV cache is often the hidden VRAM cost.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Model</label>
              <select value={modelName} onChange={(e) => setModelName(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {MODELS_CTX.map((m) => <option key={m.name} value={m.name}>{m.name} (max {(m.maxCtx/1024).toFixed(0)}K)</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Weight Quant</label>
                <select value={quant} onChange={(e) => setQuant(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  {Object.keys(QUANT_BPW).map((q) => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">KV Cache Quant</label>
                <select value={kvQuant} onChange={(e) => setKvQuant(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  <option value="F16">F16 (default)</option>
                  <option value="Q8">Q8 (half size)</option>
                  <option value="Q4">Q4 (quarter size)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Context Length: {ctx.toLocaleString()} tokens</label>
              <input type="range" min={512} max={model?.maxCtx ?? 131072} step={512} value={ctx}
                onChange={(e) => setCtx(Number(e.target.value))} className="w-full accent-cyan-400" />
              <div className="flex flex-wrap gap-2 mt-2">
                {CONTEXT_PRESETS.filter((p) => p <= (model?.maxCtx ?? 131072)).map((p) => (
                  <button key={p} onClick={() => setCtx(p)}
                    className={`text-xs border px-2 py-0.5 font-mono transition-all ${ctx === p ? "border-cyan-400 text-cyan-400" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                    {p >= 1024 ? `${p/1024}K` : p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Your GPU VRAM (GB)</label>
              <input type="number" value={gpuVram} onChange={(e) => setGpuVram(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="e.g. 24" />
            </div>
          </div>

          <div className="space-y-4">
            <div className={`border-2 p-6 transition-colors ${fits === false ? "border-red-500/30 bg-red-500/[0.02]" : fits === true ? "border-green-500/30 bg-green-500/[0.02]" : "border-[var(--border)]"}`}>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">VRAM Breakdown</div>
              <div className="space-y-3 font-mono text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Model weights ({quant})</span>
                  <span className="text-[var(--fg2)]">{weightGb.toFixed(2)} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">KV cache ({ctx.toLocaleString()} ctx, {kvQuant})</span>
                  <span className={kvGb > 4 ? "text-yellow-400" : "text-[var(--fg2)]"}>{kvGb.toFixed(2)} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Runtime overhead</span>
                  <span className="text-[var(--fg2)]">0.50 GB</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-3 font-bold">
                  <span className="text-[var(--fg)]">Total</span>
                  <span className="text-cyan-400 text-lg">{totalGb.toFixed(2)} GB</span>
                </div>
              </div>
              {vram > 0 && (
                <div className={`text-sm font-mono font-bold ${fits ? "text-green-400" : "text-red-400"}`}>
                  {fits ? `✓ Fits — ${(vram - totalGb).toFixed(1)}GB headroom` : `✗ Exceeds VRAM by ${(totalGb - vram).toFixed(1)}GB`}
                </div>
              )}
            </div>

            {vram > 0 && clampedMax > 0 && (
              <div className="border border-[var(--border)] p-5">
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">Max Context on Your GPU</div>
                <div className="text-4xl font-black font-mono text-cyan-400 mb-1">
                  {clampedMax >= 1024 ? `${Math.floor(clampedMax/1024)}K` : clampedMax}
                </div>
                <div className="text-xs text-[var(--muted)] font-mono">tokens at {quant} weights + {kvQuant} KV cache</div>
                {clampedMax < (model?.maxCtx ?? 0) && (
                  <div className="text-xs text-yellow-400 mt-2 font-mono">
                    Model supports up to {((model?.maxCtx ?? 0)/1024).toFixed(0)}K — VRAM is the limiting factor
                  </div>
                )}
                <div className="text-xs text-[var(--muted)] mt-3 font-mono">
                  Switch KV cache to Q4 to get: ~{Math.min(Math.floor(
                    ((vram - weightGb - 0.5) * 1e9) /
                    (2 * model.layers * model.heads * model.headDim * 0.5)
                  ), model.maxCtx).toLocaleString()} tokens
                </div>
              </div>
            )}

            <div className="border border-[var(--border)] p-4 text-xs font-mono text-[var(--muted)] leading-relaxed">
              <div className="text-[var(--fg2)] mb-2">Why does context matter?</div>
              KV cache grows linearly with context length. At 4K tokens it is small; at 32K+ it can exceed model weight size. Use Q8 or Q4 KV cache quantization (supported in llama.cpp and ExLlamaV2) to extend context without adding VRAM.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
