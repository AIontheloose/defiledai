"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

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
  { name: "Llama 3.1 8B",    params: 8   },
  { name: "Llama 3.1 13B",   params: 13  },
  { name: "Mistral 7B",      params: 7   },
  { name: "Gemma 2 9B",      params: 9   },
  { name: "Gemma 2 27B",     params: 27  },
  { name: "Qwen 3 14B",      params: 14  },
  { name: "Qwen 3 72B",      params: 72  },
  { name: "Llama 3.1 70B",   params: 70  },
  { name: "DeepSeek R1 70B", params: 70  },
  { name: "Mixtral 8x22B",   params: 141 },
  { name: "Llama 3.1 405B",  params: 405 },
  { name: "DeepSeek V3",     params: 671 },
];

const GPU_VRAM = [
  { name: "RTX 4090",            vram: 24  },
  { name: "RTX 3090",            vram: 24  },
  { name: "RTX 4080",            vram: 16  },
  { name: "RTX 3080 Ti",         vram: 12  },
  { name: "RTX 3060 12GB",       vram: 12  },
  { name: "2× RTX 3090 NVLink",  vram: 48  },
  { name: "2× RTX 4090",         vram: 48  },
  { name: "A100 80GB",           vram: 80  },
];

function calcVram(params: number, quant: string, ctx: number): number {
  const quantMult = QUANT_MULTIPLIERS[quant]?.mult ?? 0.5;
  const weightGb = (params * 1e9 * 2 * quantMult) / 1e9;
  const layerEstimate = Math.round(params * 0.571);
  const kvGb = (layerEstimate * 2 * 2 * 128 * (ctx / 1024)) / 1024;
  return weightGb + kvGb + 0.5;
}

function Bar({ value }: { value: number }) {
  const color = value >= 90 ? "#22d3ee" : value >= 75 ? "#86efac" : value >= 60 ? "#fbbf24" : "#f87171";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-[var(--surface)] h-1.5">
        <div style={{ width: `${value}%`, background: color, height: "100%" }} />
      </div>
      <span className="text-xs w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

function VramCalculatorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [params, setParams] = useState(searchParams.get("p") ?? "70");
  const [quant, setQuant] = useState(searchParams.get("q") ?? "Q4_K_M");
  const [ctx, setCtx] = useState(Number(searchParams.get("c") ?? "4096"));
  const [gpuVram, setGpuVram] = useState(searchParams.get("g") ?? "48");
  const [copied, setCopied] = useState(false);

  // Sync state to URL
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("p", params);
    url.searchParams.set("q", quant);
    url.searchParams.set("c", String(ctx));
    url.searchParams.set("g", gpuVram);
    router.replace(url.pathname + url.search, { scroll: false });
  }, [params, quant, ctx, gpuVram]);

  const paramNum = parseFloat(params) || 0;
  const vramNeeded = calcVram(paramNum, quant, ctx);
  const gpuVramNum = parseFloat(gpuVram) || 0;
  const fits = gpuVramNum >= vramNeeded;
  const headroom = gpuVramNum - vramNeeded;
  const weightOnly = (paramNum * 1e9 * 2 * (QUANT_MULTIPLIERS[quant]?.mult ?? 0.5)) / 1e9;
  const kvCache = vramNeeded - weightOnly - 0.5;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Tools</div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-4xl font-black font-mono">VRAM CALCULATOR</h1>
            <button onClick={copyLink}
              className="text-xs font-mono text-cyan-400 border border-cyan-500/30 px-4 py-2 hover:border-cyan-400 transition-all flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 1h5v5M15 1L8 8"/>
              </svg>
              {copied ? "LINK COPIED ✓" : "SHARE THIS CONFIG"}
            </button>
          </div>
          <p className="text-[var(--muted)] max-w-2xl mt-2">Calculate exact VRAM requirements. Share your config with a link.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Model Preset</label>
              <select className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                onChange={(e) => { const found = PRESET_MODELS.find(m => m.name === e.target.value); if (found) setParams(String(found.params)); }} defaultValue="">
                <option value="">— Select a model —</option>
                {PRESET_MODELS.map(m => <option key={m.name} value={m.name}>{m.name} ({m.params}B)</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Parameters (Billions)</label>
              <input type="number" value={params} onChange={e => setParams(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="e.g. 70" min="0.1" step="0.1" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Quantization</label>
              <select value={quant} onChange={e => setQuant(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {Object.entries(QUANT_MULTIPLIERS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-[var(--muted)]">Quality</span>
                <div className="flex-1 bg-[var(--surface)] h-1.5">
                  <div style={{ width: `${QUANT_MULTIPLIERS[quant]?.quality ?? 90}%`, background: "#22d3ee", height: "100%", transition: "width 0.3s" }} />
                </div>
                <span className="text-xs text-[var(--accent)]">{QUANT_MULTIPLIERS[quant]?.quality ?? 90}%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Context Length: {ctx.toLocaleString()} tokens</label>
              <input type="range" min={512} max={131072} step={512} value={ctx} onChange={e => setCtx(Number(e.target.value))} className="w-full accent-cyan-400" />
              <div className="flex justify-between text-xs text-[var(--muted)] mt-1"><span>512</span><span>8K</span><span>32K</span><span>128K</span></div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Your GPU VRAM (GB)</label>
              <select className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors mb-2"
                onChange={e => { const found = GPU_VRAM.find(g => g.name === e.target.value); if (found) setGpuVram(String(found.vram)); }} defaultValue="">
                <option value="">— Select GPU —</option>
                {GPU_VRAM.map(g => <option key={g.name} value={g.name}>{g.name} ({g.vram}GB)</option>)}
              </select>
              <input type="number" value={gpuVram} onChange={e => setGpuVram(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="Custom GB" />
            </div>
          </div>

          <div className="space-y-4">
            <div className={`border-2 p-6 transition-colors ${fits ? "border-green-500/40 bg-green-500/[0.03]" : "border-red-500/40 bg-red-500/[0.03]"}`}>
              <div className="text-xs uppercase tracking-widest mb-3" style={{ color: fits ? "#4ade80" : "#f87171" }}>
                {fits ? "✓ FITS IN VRAM" : "✗ EXCEEDS VRAM"}
              </div>
              <div className="font-black font-mono text-5xl mb-2" style={{ color: fits ? "#4ade80" : "#f87171" }}>
                {vramNeeded.toFixed(1)}<span className="text-2xl ml-1">GB</span>
              </div>
              <div className="text-[var(--muted)] text-sm">
                {gpuVramNum > 0 && (fits
                  ? `${headroom.toFixed(1)}GB headroom remaining`
                  : `${Math.abs(headroom).toFixed(1)}GB short — try a lower quant`)}
              </div>
            </div>

            <div className="border border-[var(--border)] p-5 space-y-3">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Breakdown</div>
              {[
                { label: `Model weights (${quant})`, val: weightOnly.toFixed(1) },
                { label: `KV cache (${ctx.toLocaleString()} ctx)`, val: kvCache.toFixed(1) },
                { label: "Runtime overhead", val: "0.5" },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm font-mono">
                  <span className="text-[var(--muted)]">{r.label}</span>
                  <span className="text-[var(--fg)]">{r.val} GB</span>
                </div>
              ))}
              <div className="border-t border-[var(--border)] pt-3 flex justify-between text-sm font-mono font-bold">
                <span className="text-[var(--fg)]">Total</span>
                <span className="text-[var(--accent)]">{vramNeeded.toFixed(1)} GB</span>
              </div>
            </div>

            <div className="border border-[var(--border)] p-5">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">All Quants at {paramNum}B</div>
              <div className="space-y-2">
                {Object.entries(QUANT_MULTIPLIERS).map(([k]) => {
                  const gb = calcVram(paramNum, k, ctx);
                  const ok = gpuVramNum >= gb;
                  return (
                    <div key={k} className={`flex items-center justify-between text-xs font-mono py-1 px-2 ${k === quant ? "bg-[var(--surface)]" : ""}`}>
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

export default function VramCalculatorPage() {
  return (
    <Suspense>
      <VramCalculatorInner />
    </Suspense>
  );
}
