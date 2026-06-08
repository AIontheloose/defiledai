"use client";
import { useState } from "react";

const CONFIGS = [
  { id: "rtx4090", label: "RTX 4090 24GB", vram: 24, bw: 1008, price: 1599, toks7b: 128, toks13b: 82, toks70b: 0, backend: "ExLlamaV2" },
  { id: "rtx3090", label: "RTX 3090 24GB", vram: 24, bw: 936, price: 680, toks7b: 96, toks13b: 62, toks70b: 0, backend: "ExLlamaV2" },
  { id: "rtx3090x2", label: "2× RTX 3090 NVLink 48GB", vram: 48, bw: 1872, price: 1360, toks7b: 98, toks13b: 64, toks70b: 21, backend: "ExLlamaV2" },
  { id: "rtx4090x2", label: "2× RTX 4090 48GB", vram: 48, bw: 2016, price: 3198, toks7b: 132, toks13b: 86, toks70b: 35, backend: "ExLlamaV2" },
  { id: "rtx4080super", label: "RTX 4080 Super 16GB", vram: 16, bw: 736, price: 999, toks7b: 98, toks13b: 62, toks70b: 0, backend: "ExLlamaV2" },
  { id: "rtx4070ti", label: "RTX 4070 Ti 12GB", vram: 12, bw: 504, price: 649, toks7b: 76, toks13b: 48, toks70b: 0, backend: "ExLlamaV2" },
  { id: "rtx3080ti", label: "RTX 3080 Ti 12GB", vram: 12, bw: 912, price: 420, toks7b: 88, toks13b: 56, toks70b: 0, backend: "ExLlamaV2" },
  { id: "rtx3080", label: "RTX 3080 10GB", vram: 10, bw: 760, price: 320, toks7b: 78, toks13b: 48, toks70b: 0, backend: "llama.cpp" },
  { id: "rx7900xtx", label: "RX 7900 XTX 24GB", vram: 24, bw: 960, price: 799, toks7b: 88, toks13b: 56, toks70b: 0, backend: "llama.cpp ROCm" },
  { id: "rx7800xt", label: "RX 7800 XT 16GB", vram: 16, bw: 624, price: 449, toks7b: 62, toks13b: 40, toks70b: 0, backend: "llama.cpp ROCm" },
  { id: "m3max", label: "M3 Max 40-core 48GB", vram: 48, bw: 400, price: 2499, toks7b: 68, toks13b: 44, toks70b: 18, backend: "llama.cpp Metal" },
  { id: "a100_80", label: "A100 80GB SXM", vram: 80, bw: 2000, price: 10000, toks7b: 180, toks13b: 120, toks70b: 42, backend: "TensorRT-LLM" },
];

const MODELS = [
  { label: "7B Q4_K_M", key: "toks7b", vramNeeded: 5.5 },
  { label: "13B Q4_K_M", key: "toks13b", vramNeeded: 9.0 },
  { label: "70B Q4_K_M", key: "toks70b", vramNeeded: 40.0 },
];

function Bar({ val, max, color }: { val: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-[var(--surface)] h-3">
        <div style={{ width: `${max > 0 ? (val / max) * 100 : 0}%`, background: color, height: "100%", transition: "width 0.4s" }} />
      </div>
      <span className="text-sm font-mono font-bold w-16 text-right" style={{ color }}>
        {val === 0 ? "N/A" : `${val} t/s`}
      </span>
    </div>
  );
}

export default function BenchmarkComparePage() {
  const [leftId, setLeftId] = useState("rtx3090x2");
  const [rightId, setRightId] = useState("rtx4090");

  const left = CONFIGS.find((c) => c.id === leftId)!;
  const right = CONFIGS.find((c) => c.id === rightId)!;

  const maxToks = Math.max(...MODELS.map((m) => Math.max((left as any)[m.key], (right as any)[m.key])));

  const winner = (key: string) => {
    const l = (left as any)[key];
    const r = (right as any)[key];
    if (l === 0 && r === 0) return "tie";
    if (l === 0) return "right";
    if (r === 0) return "left";
    return l > r ? "left" : r > l ? "right" : "tie";
  };

  const valuePerDollar = (cfg: typeof CONFIGS[0]) =>
    cfg.price > 0 ? ((cfg.toks7b / cfg.price) * 100).toFixed(1) : "N/A";

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">BENCHMARK COMPARE</h1>
          <p className="text-[var(--muted)] max-w-2xl">Side-by-side GPU inference comparison for local AI. Pick two configs and see how they stack up across model sizes.</p>
        </div>

        {/* Selectors */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {[{ id: leftId, set: setLeftId, label: "Config A", color: "#22d3ee" }, { id: rightId, set: setRightId, label: "Config B", color: "#818cf8" }].map((side) => (
            <div key={side.label}>
              <label className="block text-xs uppercase tracking-widest mb-2 font-mono" style={{ color: side.color }}>{side.label}</label>
              <select value={side.id} onChange={(e) => side.set(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none transition-colors"
                style={{ borderColor: side.color + "40" }}>
                {CONFIGS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Specs comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {[{ cfg: left, color: "#22d3ee" }, { cfg: right, color: "#818cf8" }].map(({ cfg, color }) => (
            <div key={cfg.id} className="border p-5 space-y-3 text-sm font-mono" style={{ borderColor: color + "30" }}>
              <div className="font-black text-base mb-3" style={{ color }}>{cfg.label}</div>
              {[
                { label: "VRAM", val: `${cfg.vram}GB` },
                { label: "Bandwidth", val: `${cfg.bw} GB/s` },
                { label: "Street Price", val: `$${cfg.price.toLocaleString()}` },
                { label: "Best Backend", val: cfg.backend },
                { label: "Tok/$ (7B×100)", val: valuePerDollar(cfg) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-[var(--muted)]">{row.label}</span>
                  <span className="text-[var(--fg2)]">{row.val}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Performance bars */}
        <div className="border border-[var(--border)] p-6 mb-6">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-6 font-mono">Inference Throughput (Q4_K_M)</div>
          <div className="space-y-8">
            {MODELS.map((m) => {
              const w = winner(m.key);
              const lVal = (left as any)[m.key];
              const rVal = (right as any)[m.key];
              return (
                <div key={m.key}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-mono font-bold text-[var(--fg)]">{m.label}</span>
                    {w !== "tie" && (
                      <span className="text-xs font-mono" style={{ color: w === "left" ? "#22d3ee" : "#818cf8" }}>
                        {w === "left" ? left.label : right.label} wins
                        {lVal > 0 && rVal > 0 && ` (+${Math.abs(lVal - rVal)} tok/s)`}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--muted)] w-20 shrink-0 font-mono truncate" title={left.label}>A</span>
                      <Bar val={lVal} max={maxToks} color="#22d3ee" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--muted)] w-20 shrink-0 font-mono truncate" title={right.label}>B</span>
                      <Bar val={rVal} max={maxToks} color="#818cf8" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Value comparison */}
        <div className="border border-[var(--border)] p-5 text-sm font-mono">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Value Analysis</div>
          <div className="grid md:grid-cols-2 gap-6">
            {[{ cfg: left, color: "#22d3ee", label: "A" }, { cfg: right, color: "#818cf8", label: "B" }].map(({ cfg, color, label }) => {
              const vpd = cfg.price > 0 ? (cfg.toks7b / cfg.price) * 100 : 0;
              return (
                <div key={cfg.id}>
                  <div className="font-bold mb-2" style={{ color }}>Config {label}: {cfg.label}</div>
                  <div className="text-[var(--muted)] space-y-1">
                    <div>{vpd.toFixed(1)} tok/s per $100 (7B)</div>
                    {cfg.toks70b > 0 ? <div className="text-green-400">✓ Can run 70B models</div> : <div className="text-[var(--muted)]">✗ Cannot run 70B</div>}
                    <div>{cfg.vram}GB VRAM — fits up to {cfg.vram >= 40 ? "70B" : cfg.vram >= 16 ? "27B" : cfg.vram >= 12 ? "13B" : "7B"} Q4_K_M</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
