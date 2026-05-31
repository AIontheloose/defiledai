"use client";
import { useState } from "react";

const GPUS = [
  { name: "RTX 4090", vram: 24, bw: 1008, toks7b: 128, toks70b: 0, price: 1599, used: 1350, gen: "Ada", nvlink: false },
  { name: "RTX 4080 Super", vram: 16, bw: 736, toks7b: 98, toks70b: 0, price: 999, used: 850, gen: "Ada", nvlink: false },
  { name: "RTX 4080", vram: 16, bw: 717, toks7b: 94, toks70b: 0, price: 899, used: 750, gen: "Ada", nvlink: false },
  { name: "RTX 4070 Ti Super", vram: 16, bw: 672, toks7b: 88, toks70b: 0, price: 799, used: 680, gen: "Ada", nvlink: false },
  { name: "RTX 4070 Ti", vram: 12, bw: 504, toks7b: 76, toks70b: 0, price: 649, used: 530, gen: "Ada", nvlink: false },
  { name: "RTX 4070 Super", vram: 12, bw: 504, toks7b: 74, toks70b: 0, price: 549, used: 460, gen: "Ada", nvlink: false },
  { name: "RTX 4070", vram: 12, bw: 504, toks7b: 68, toks70b: 0, price: 449, used: 370, gen: "Ada", nvlink: false },
  { name: "RTX 4060 Ti 16GB", vram: 16, bw: 288, toks7b: 48, toks70b: 0, price: 449, used: 370, gen: "Ada", nvlink: false },
  { name: "RTX 3090 Ti", vram: 24, bw: 1008, toks7b: 104, toks70b: 0, price: 0, used: 820, gen: "Ampere", nvlink: true },
  { name: "RTX 3090", vram: 24, bw: 936, toks7b: 96, toks70b: 0, price: 0, used: 680, gen: "Ampere", nvlink: true },
  { name: "RTX 3080 Ti", vram: 12, bw: 912, toks7b: 88, toks70b: 0, price: 0, used: 420, gen: "Ampere", nvlink: false },
  { name: "RTX 3080 12GB", vram: 12, bw: 912, toks7b: 86, toks70b: 0, price: 0, used: 380, gen: "Ampere", nvlink: false },
  { name: "RTX 3080 10GB", vram: 10, bw: 760, toks7b: 78, toks70b: 0, price: 0, used: 320, gen: "Ampere", nvlink: false },
  { name: "RTX 3070 Ti", vram: 8, bw: 608, toks7b: 62, toks70b: 0, price: 0, used: 240, gen: "Ampere", nvlink: false },
  { name: "RTX 3070", vram: 8, bw: 448, toks7b: 52, toks70b: 0, price: 0, used: 210, gen: "Ampere", nvlink: false },
  { name: "RTX 3060 12GB", vram: 12, bw: 360, toks7b: 42, toks70b: 0, price: 0, used: 180, gen: "Ampere", nvlink: false },
  { name: "RX 7900 XTX", vram: 24, bw: 960, toks7b: 88, toks70b: 0, price: 799, used: 680, gen: "RDNA3", nvlink: false },
  { name: "RX 7900 XT", vram: 20, bw: 800, toks7b: 76, toks70b: 0, price: 649, used: 540, gen: "RDNA3", nvlink: false },
  { name: "RX 7800 XT", vram: 16, bw: 624, toks7b: 62, toks70b: 0, price: 449, used: 370, gen: "RDNA3", nvlink: false },
  { name: "RX 6800 XT", vram: 16, bw: 512, toks7b: 52, toks70b: 0, price: 0, used: 280, gen: "RDNA2", nvlink: false },
  { name: "2× RTX 3090 NVLink", vram: 48, bw: 1872, toks7b: 98, toks70b: 21, price: 0, used: 1360, gen: "Multi", nvlink: true },
  { name: "2× RTX 4090", vram: 48, bw: 2016, toks7b: 132, toks70b: 35, price: 0, used: 2700, gen: "Multi", nvlink: false },
  { name: "2× RX 7900 XTX", vram: 48, bw: 1920, toks7b: 94, toks70b: 19, price: 0, used: 1360, gen: "Multi", nvlink: false },
];

type Metric = "toks_per_dollar" | "toks7b" | "vram_per_dollar" | "raw_bw";

const METRIC_LABELS: Record<Metric, string> = {
  toks_per_dollar: "Tok/s per $100 (7B Q4)",
  toks7b: "Raw Tok/s (7B Q4)",
  vram_per_dollar: "GB VRAM per $100",
  raw_bw: "Memory Bandwidth (GB/s)",
};

export default function PricePerformancePage() {
  const [priceType, setPriceType] = useState<"used" | "new">("used");
  const [metric, setMetric] = useState<Metric>("toks_per_dollar");
  const [filterGen, setFilterGen] = useState("All");
  const [filter70b, setFilter70b] = useState(false);

  const price = (g: typeof GPUS[0]) => priceType === "used" ? g.used : g.price;

  const getValue = (g: typeof GPUS[0]): number => {
    const p = price(g);
    if (metric === "toks_per_dollar") return p > 0 ? (g.toks7b / p) * 100 : 0;
    if (metric === "toks7b") return g.toks7b;
    if (metric === "vram_per_dollar") return p > 0 ? (g.vram / p) * 100 : 0;
    if (metric === "raw_bw") return g.bw;
    return 0;
  };

  const gens = ["All", ...Array.from(new Set(GPUS.map((g) => g.gen)))];

  const filtered = GPUS
    .filter((g) => filterGen === "All" || g.gen === filterGen)
    .filter((g) => !filter70b || g.toks70b > 0)
    .filter((g) => price(g) > 0)
    .sort((a, b) => getValue(b) - getValue(a));

  const maxVal = Math.max(...filtered.map(getValue));
  const updatedDate = "2026-05-30";

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">GPU PRICE/PERFORMANCE</h1>
          <p className="text-[var(--muted)] max-w-2xl">Current GPU rankings by inference value. Prices updated {updatedDate}. Sorted by tokens per second per dollar by default.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-1">
            {(["used","new"] as const).map((t) => (
              <button key={t} onClick={() => setPriceType(t)}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-mono border transition-all ${priceType === t ? "bg-cyan-500 text-black border-cyan-500 font-bold" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                {t === "used" ? "Used/Street" : "MSRP/New"}
              </button>
            ))}
          </div>
          <select value={metric} onChange={(e) => setMetric(e.target.value as Metric)}
            className="bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] transition-colors">
            {Object.entries(METRIC_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={filterGen} onChange={(e) => setFilterGen(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] transition-colors">
            {gens.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <button onClick={() => setFilter70b(!filter70b)}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-mono border transition-all ${filter70b ? "border-cyan-400 text-cyan-400 bg-cyan-400/10" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
            70B Capable Only
          </button>
        </div>

        {/* Table */}
        <div className="border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase">
                  <th className="text-left px-5 py-3">Rank</th>
                  <th className="text-left px-5 py-3">GPU</th>
                  <th className="text-left px-5 py-3">VRAM</th>
                  <th className="text-left px-5 py-3">{priceType === "used" ? "Street Price" : "MSRP"}</th>
                  <th className="text-left px-5 py-3">7B Tok/s</th>
                  <th className="text-left px-5 py-3">70B Tok/s</th>
                  <th className="text-left px-5 py-3 w-56">{METRIC_LABELS[metric]}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => {
                  const val = getValue(g);
                  const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                  const barColor = i === 0 ? "#22d3ee" : i <= 2 ? "#4ade80" : i <= 5 ? "#86efac" : "#64748b";
                  return (
                    <tr key={g.name} className={`border-b border-[var(--border)]/50 hover:bg-[var(--surface)] transition-colors ${i === 0 ? "bg-cyan-500/[0.02]" : ""}`}>
                      <td className="px-5 py-3">
                        <span className={`font-black text-lg ${i === 0 ? "text-cyan-400" : i <= 2 ? "text-[var(--fg)]" : "text-[var(--muted)]"}`}>#{i + 1}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-[var(--fg)] font-bold">{g.name}</div>
                        <div className="text-xs text-[var(--muted)]">{g.gen}{g.nvlink ? " · NVLink" : ""}</div>
                      </td>
                      <td className="px-5 py-3 text-cyan-400">{g.vram}GB</td>
                      <td className="px-5 py-3 text-[var(--fg2)]">${price(g).toLocaleString()}</td>
                      <td className="px-5 py-3 text-green-400">{g.toks7b > 0 ? g.toks7b : "—"}</td>
                      <td className="px-5 py-3">{g.toks70b > 0 ? <span className="text-green-400">{g.toks70b}</span> : <span className="text-[var(--muted)]">N/A</span>}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[var(--surface)] h-2 max-w-[100px]">
                            <div style={{ width: `${pct}%`, background: barColor, height: "100%" }} />
                          </div>
                          <span className="text-xs w-12 text-right" style={{ color: barColor }}>
                            {val.toFixed(metric === "raw_bw" ? 0 : 1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-3 text-xs text-[var(--muted)] font-mono">
          Prices are estimated street/used market values as of {updatedDate}. Tok/s measured at Q4_K_M with ExLlamaV2 on NVIDIA, llama.cpp on AMD. Multi-GPU configs assume PCIe unless noted.
        </div>
      </div>
    </main>
  );
}
