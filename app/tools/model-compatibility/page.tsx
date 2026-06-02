"use client";
import { useState } from "react";
import { getAllModels, type Model } from "../../../lib/models";

const GPUS = [
  { name: "RTX 4090", vram: 24, bw: 1008, gen: "Ada" },
  { name: "RTX 4080 Super", vram: 16, bw: 736, gen: "Ada" },
  { name: "RTX 4080", vram: 16, bw: 717, gen: "Ada" },
  { name: "RTX 4070 Ti Super", vram: 16, bw: 672, gen: "Ada" },
  { name: "RTX 4070 Ti", vram: 12, bw: 504, gen: "Ada" },
  { name: "RTX 4070 Super", vram: 12, bw: 504, gen: "Ada" },
  { name: "RTX 4070", vram: 12, bw: 504, gen: "Ada" },
  { name: "RTX 4060 Ti 16GB", vram: 16, bw: 288, gen: "Ada" },
  { name: "RTX 4060 Ti 8GB", vram: 8, bw: 288, gen: "Ada" },
  { name: "RTX 4060", vram: 8, bw: 272, gen: "Ada" },
  { name: "RTX 3090 Ti", vram: 24, bw: 1008, gen: "Ampere" },
  { name: "RTX 3090", vram: 24, bw: 936, gen: "Ampere" },
  { name: "RTX 3080 Ti", vram: 12, bw: 912, gen: "Ampere" },
  { name: "RTX 3080 12GB", vram: 12, bw: 912, gen: "Ampere" },
  { name: "RTX 3080 10GB", vram: 10, bw: 760, gen: "Ampere" },
  { name: "RTX 3070 Ti", vram: 8, bw: 608, gen: "Ampere" },
  { name: "RTX 3070", vram: 8, bw: 448, gen: "Ampere" },
  { name: "RTX 3060 Ti", vram: 8, bw: 448, gen: "Ampere" },
  { name: "RTX 3060 12GB", vram: 12, bw: 360, gen: "Ampere" },
  { name: "RTX 2080 Ti", vram: 11, bw: 616, gen: "Turing" },
  { name: "RX 7900 XTX", vram: 24, bw: 960, gen: "RDNA3" },
  { name: "RX 7900 XT", vram: 20, bw: 800, gen: "RDNA3" },
  { name: "RX 7800 XT", vram: 16, bw: 624, gen: "RDNA3" },
  { name: "RX 6900 XT", vram: 16, bw: 512, gen: "RDNA2" },
  { name: "RX 6800 XT", vram: 16, bw: 512, gen: "RDNA2" },
  { name: "M3 Max 40-core", vram: 48, bw: 400, gen: "Apple" },
  { name: "M3 Pro 18-core", vram: 36, bw: 150, gen: "Apple" },
  { name: "M2 Ultra", vram: 192, bw: 800, gen: "Apple" },
  { name: "2× RTX 3090 NVLink", vram: 48, bw: 1872, gen: "Multi-GPU" },
  { name: "2× RTX 4090", vram: 48, bw: 2016, gen: "Multi-GPU" },
  { name: "A100 80GB", vram: 80, bw: 2000, gen: "Datacenter" },
];

const TYPE_COLORS: Record<string, string> = {
  abliterated: "text-cyan-400 border-cyan-400/30",
  uncensored:  "text-purple-400 border-purple-400/30",
  dolphin:     "text-blue-400 border-blue-400/30",
};

function estimateToks(model: Model, gpu: typeof GPUS[0], count: number): number {
  const totalVram = gpu.vram * count;
  if (model.vramQ4 > totalVram * 0.92) return 0;
  const modelBytes = (model.params * 1e9 * 4.8) / 8;
  const totalBw = gpu.bw * count * (count > 1 ? 0.85 : 1) * 1e9;
  return Math.round((totalBw / modelBytes) * 0.88 * 0.82);
}

export default function ModelCompatibilityPage() {
  const [gpuCount, setGpuCount] = useState(1);
  const [selectedGpu, setSelectedGpu] = useState<typeof GPUS[0] | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterFamily, setFilterFamily] = useState("all");
  const [showNewOnly, setShowNewOnly] = useState(false);

  const allModels = getAllModels();
  const effectiveVram = selectedGpu ? selectedGpu.vram * gpuCount : 0;
  const families = Array.from(new Set(allModels.map(m => m.family))).sort();

  const results = allModels
    .filter(m => filterType === "all" || m.type === filterType)
    .filter(m => filterFamily === "all" || m.family === filterFamily)
    .filter(m => !showNewOnly || m.isNew)
    .map(m => {
      const fits = selectedGpu ? m.vramQ4 <= effectiveVram * 0.92 : null;
      const toks = selectedGpu && fits ? estimateToks(m, selectedGpu, gpuCount) : null;
      return { ...m, fits, toks };
    })
    .sort((a, b) => {
      if (a.fits === b.fits) return a.vramQ4 - b.vramQ4;
      return (b.fits ? 1 : 0) - (a.fits ? 1 : 0);
    });

  const fitsCount = results.filter(r => r.fits).length;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">MODEL COMPATIBILITY CHECKER</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Select your GPU — see every uncensored and abliterated model that fits, with estimated inference speed.
            {" "}<span className="text-cyan-400">{allModels.length} models</span> in the database.
          </p>
        </div>

        {/* GPU selector */}
        <div className="border border-[var(--border)] bg-[var(--card-bg)] p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Your GPU</label>
              <select onChange={e => setSelectedGpu(GPUS.find(g => g.name === e.target.value) ?? null)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value="">— Select your GPU —</option>
                {["Ada","Ampere","Turing","RDNA3","RDNA2","Apple","Multi-GPU","Datacenter"].map(gen => (
                  <optgroup key={gen} label={gen}>
                    {GPUS.filter(g => g.gen === gen).map(g => (
                      <option key={g.name} value={g.name}>{g.name} ({g.vram}GB)</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">GPU Count</label>
              <select value={gpuCount} onChange={e => setGpuCount(Number(e.target.value))}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {[1,2,4,8].map(n => <option key={n} value={n}>{n}×</option>)}
              </select>
            </div>
          </div>
          {selectedGpu && (
            <div className="mt-4 flex flex-wrap gap-6 text-sm font-mono border-t border-[var(--border)] pt-4">
              <div><span className="text-[var(--muted)]">Total VRAM: </span><span className="text-cyan-400 font-bold">{effectiveVram}GB</span></div>
              <div><span className="text-[var(--muted)]">Bandwidth: </span><span className="text-[var(--fg2)]">{selectedGpu.bw * gpuCount} GB/s</span></div>
              <div><span className="text-green-400 font-bold">{fitsCount} of {results.length}</span><span className="text-[var(--muted)]"> models fit</span></div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {["all","abliterated","uncensored","dolphin"].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs tracking-widest uppercase font-mono border transition-all ${filterType === t ? "bg-cyan-500 text-black border-cyan-500 font-bold" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border2)]"}`}>
              {t === "all" ? "All Types" : t}
            </button>
          ))}
          <select value={filterFamily} onChange={e => setFilterFamily(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] transition-colors">
            <option value="all">All Families</option>
            {families.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <button onClick={() => setShowNewOnly(!showNewOnly)}
            className={`px-3 py-1.5 text-xs tracking-widest uppercase font-mono border transition-all ${showNewOnly ? "border-cyan-400 text-cyan-400 bg-cyan-400/10" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border2)]"}`}>
            🆕 New Only
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {results.map(m => (
            <div key={m.id}
              className={`border p-5 transition-all ${m.fits === false ? "opacity-40 border-[var(--border)]" : "border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--border2)]"}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {m.isNew && <span className="text-xs bg-cyan-500 text-black px-1.5 py-0.5 font-mono font-bold">NEW</span>}
                    <span className="font-mono font-bold text-[var(--fg)]">{m.name}</span>
                    <span className={`text-xs border px-2 py-0.5 font-mono ${TYPE_COLORS[m.type] ?? "text-zinc-400 border-zinc-700"}`}>
                      {m.type.toUpperCase()}
                    </span>
                    {m.fits === true && <span className="text-xs text-green-400">✓ FITS</span>}
                    {m.fits === false && <span className="text-xs text-red-400">✗ TOO LARGE</span>}
                  </div>
                  <div className="text-[var(--muted)] text-sm leading-relaxed">{m.note}</div>
                </div>
                <div className="text-right shrink-0 font-mono text-sm space-y-1">
                  <div><span className="text-[var(--muted)] text-xs">VRAM: </span><span className="text-[var(--fg2)]">{m.vramQ4}GB</span></div>
                  {m.toks !== null && m.toks > 0 && (
                    <div><span className="text-[var(--muted)] text-xs">Speed: </span><span className="text-green-400 font-bold">~{m.toks} tok/s</span></div>
                  )}
                  <div><span className="text-[var(--muted)] text-xs">Rating: </span><span className="text-yellow-400">{m.rating}★</span></div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {m.tags.slice(0,5).map(tag => (
                    <span key={tag} className="text-xs border border-[var(--border)] px-1.5 py-0.5 text-[var(--muted)] font-mono">{tag}</span>
                  ))}
                </div>
                <a href={m.hf} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-cyan-400 border border-cyan-500/20 px-3 py-1 hover:border-cyan-400 transition-all font-mono">
                  HUGGINGFACE ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
