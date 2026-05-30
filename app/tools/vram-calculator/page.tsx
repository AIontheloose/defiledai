"use client";
import { useState } from "react";


const QUANT_MULTIPLIERS: Record<string, { mult: number; label: string; quality: number }> = {
  F16:    { mult: 2.00, label: "F16 — Full precision",        quality: 100 },
  Q8_0:   { mult: 1.00, label: "Q8_0 — Near lossless",        quality: 99  },
  Q6_K:   { mult: 0.75, label: "Q6_K — Excellent quality",    quality: 98  },
  Q5_K_M: { mult: 0.625,label: "Q5_K_M — Strong quality",     quality: 96  },
  Q4_K_M: { mult: 0.50, label: "Q4_K_M — Best balance",       quality: 92  },
  Q3_K_M: { mult: 0.375,label: "Q3_K_M — Reduced quality",    quality: 83  },
  IQ3_M:  { mult: 0.4375,label:"IQ3_M — Better than Q3",      quality: 87  },
  Q2_K:   { mult: 0.25, label: "Q2_K — Severe loss",          quality: 65  },
  IQ1_M:  { mult: 0.1875,label:"IQ1_M — Extreme compression", quality: 45  },
};

const PRESET_MODELS = [
  { name: "Llama 3.1 8B",   params: 8   },
  { name: "Llama 3.1 13B",  params: 13  },
  { name: "Mistral 7B",     params: 7   },
  { name: "Gemma 2 9B",     params: 9   },
  { name: "Gemma 2 27B",    params: 27  },
  { name: "Qwen 3 14B",     params: 14  },
  { name: "Qwen 3 72B",     params: 72  },
  { name: "Llama 3.1 70B",  params: 70  },
  { name: "DeepSeek R1 70B",params: 70  },
  { name: "Mixtral 8x22B",  params: 141 },
  { name: "Llama 3.1 405B", params: 405 },
  { name: "DeepSeek V3",    params: 671 },
];

const GPU_VRAM = [
  { name: "RTX 3060 Ti",    vram: 8   },
  { name: "RTX 3070",       vram: 8   },
  { name: "RTX 3080 10GB",  vram: 10  },
  { name: "RTX 3080 Ti",    vram: 12  },
  { name: "RTX 3090",       vram: 24  },
  { name: "RTX 4070",       vram: 12  },
  { name: "RTX 4070 Ti",    vram: 12  },
  { name: "RTX 4080",       vram: 16  },
  { name: "RTX 4090",       vram: 24  },
  { name: "2× RTX 3090 NVLink", vram: 48 },
  { name: "2× RTX 4090",    vram: 48  },
  { name: "A100 40GB",      vram: 40  },
  { name: "A100 80GB",      vram: 80  },
  { name: "4× A100 80GB",   vram: 320 },
  { name: "H100 80GB",      vram: 80  },
];

function calcVram(params: number, quant: string, ctx: number): number {
  const bitsPerParam = 2; // baseline bytes at fp16 = 2 bytes per param
  const quantMult = QUANT_MULTIPLIERS[quant]?.mult ?? 0.5;
  const weightGb = (params * 1e9 * bitsPerParam * quantMult) / 1e9;
  // KV cache: rough estimate — 2 bytes × 2 (k+v) × layers × heads × ctx
  // Simplified: ~0.5MB per layer per 1K context for 7B, scales with params
  const layerEstimate = Math.round(params * 0.571); // approx layers
  const kvGb = (layerEstimate * 2 * 2 * 128 * (ctx / 1024)) / 1024;
  return weightGb + kvGb + 0.5; // +0.5 overhead
}

export default function VramCalculatorPage() {
  const [params, setParams] = useState<string>("70");
  const [quant, setQuant] = useState("Q4_K_M");
  const [ctx, setCtx] = useState(4096);
  const [gpuVram, setGpuVram] = useState<string>("48");

  const paramNum = parseFloat(params) || 0;
  const vramNeeded = calcVram(paramNum, quant, ctx);
  const gpuVramNum = parseFloat(gpuVram) || 0;
  const fits = gpuVramNum >= vramNeeded;
  const headroom = gpuVramNum - vramNeeded;

  const weightOnly = (paramNum * 1e9 * 2 * (QUANT_MULTIPLIERS[quant]?.mult ?? 0.5)) / 1e9;
  const kvCache = vramNeeded - weightOnly - 0.5;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">VRAM CALCULATOR</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Calculate exact VRAM requirements for any model size and quantization format,
            including KV cache overhead at your chosen context length.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            {/* Model preset */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Model Preset</label>
              <select
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                onChange={(e) => {
                  const found = PRESET_MODELS.find((m) => m.name === e.target.value);
                  if (found) setParams(String(found.params));
                }}
                defaultValue="">
                <option value="">— Select a model —</option>
                {PRESET_MODELS.map((m) => (
                  <option key={m.name} value={m.name}>{m.name} ({m.params}B)</option>
                ))}
              </select>
            </div>

            {/* Custom params */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
                Parameters (Billions)
              </label>
              <input
                type="number"
                value={params}
                onChange={(e) => setParams(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="e.g. 70"
                min="0.1"
                step="0.1"
              />
            </div>

            {/* Quantization */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Quantization</label>
              <select
                value={quant}
                onChange={(e) => setQuant(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {Object.entries(QUANT_MULTIPLIERS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              {/* Quality bar */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-[var(--muted)]">Quality</span>
                <div className="flex-1 bg-[var(--surface)] h-1.5">
                  <div
                    style={{
                      width: `${QUANT_MULTIPLIERS[quant]?.quality ?? 90}%`,
                      background: (QUANT_MULTIPLIERS[quant]?.quality ?? 90) >= 90 ? "#22d3ee" : (QUANT_MULTIPLIERS[quant]?.quality ?? 90) >= 75 ? "#86efac" : "#f87171",
                      height: "100%",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <span className="text-xs text-[var(--accent)]">{QUANT_MULTIPLIERS[quant]?.quality ?? 90}%</span>
              </div>
            </div>

            {/* Context length */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
                Context Length: {ctx.toLocaleString()} tokens
              </label>
              <input
                type="range"
                min={512}
                max={131072}
                step={512}
                value={ctx}
                onChange={(e) => setCtx(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
                <span>512</span><span>8K</span><span>32K</span><span>128K</span>
              </div>
            </div>

            {/* GPU VRAM */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Your GPU VRAM (GB)</label>
              <select
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors mb-2"
                onChange={(e) => {
                  const found = GPU_VRAM.find((g) => g.name === e.target.value);
                  if (found) setGpuVram(String(found.vram));
                }}
                defaultValue="">
                <option value="">— Select your GPU —</option>
                {GPU_VRAM.map((g) => (
                  <option key={g.name} value={g.name}>{g.name} ({g.vram}GB)</option>
                ))}
              </select>
              <input
                type="number"
                value={gpuVram}
                onChange={(e) => setGpuVram(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="Custom VRAM GB"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Main result */}
            <div className={`border-2 p-6 transition-colors ${fits ? "border-green-500/40 bg-green-500/[0.03]" : "border-red-500/40 bg-red-500/[0.03]"}`}>
              <div className="text-xs uppercase tracking-widest mb-3" style={{ color: fits ? "#4ade80" : "#f87171" }}>
                {fits ? "✓ FITS IN VRAM" : "✗ EXCEEDS VRAM"}
              </div>
              <div className="font-black font-mono text-5xl mb-2" style={{ color: fits ? "#4ade80" : "#f87171" }}>
                {vramNeeded.toFixed(1)}<span className="text-2xl ml-1">GB</span>
              </div>
              <div className="text-[var(--muted)] text-sm">
                {gpuVramNum > 0 && (
                  fits
                    ? `${headroom.toFixed(1)}GB headroom remaining`
                    : `${Math.abs(headroom).toFixed(1)}GB short — try a lower quant`
                )}
              </div>
            </div>

            {/* Breakdown */}
            <div className="border border-[var(--border)] p-5 space-y-3">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Breakdown</div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-[var(--muted)]">Model weights ({quant})</span>
                <span className="text-[var(--fg)]">{weightOnly.toFixed(1)} GB</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-[var(--muted)]">KV cache ({ctx.toLocaleString()} ctx)</span>
                <span className="text-[var(--fg)]">{kvCache.toFixed(1)} GB</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="text-[var(--muted)]">Runtime overhead</span>
                <span className="text-[var(--fg)]">0.5 GB</span>
              </div>
              <div className="border-t border-[var(--border)] pt-3 flex justify-between text-sm font-mono font-bold">
                <span className="text-[var(--fg)]">Total</span>
                <span className="text-[var(--accent)]">{vramNeeded.toFixed(1)} GB</span>
              </div>
            </div>

            {/* Quant comparison */}
            <div className="border border-[var(--border)] p-5">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">All Quants at {paramNum}B</div>
              <div className="space-y-2">
                {Object.entries(QUANT_MULTIPLIERS).map(([k, v]) => {
                  const gb = calcVram(paramNum, k, ctx);
                  const ok = gpuVramNum >= gb;
                  return (
                    <div key={k} className={`flex items-center justify-between text-xs font-mono py-1 px-2 transition-colors ${k === quant ? "bg-[var(--surface)]" : ""}`}>
                      <span className={k === quant ? "text-[var(--accent)]" : "text-[var(--muted)]"}>{k}</span>
                      <span className={ok ? "text-green-400" : "text-red-400"}>{gb.toFixed(1)} GB</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
