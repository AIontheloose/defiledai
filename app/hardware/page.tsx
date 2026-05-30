export const metadata = {
  title: "Hardware — DefiledAI",
  description: "GPU configs, workstation builds, and inference hardware guides for local AI.",
};

const builds = [
  {
    name: "Entry — 7B Workhorse",
    budget: "~$800",
    gpu: "RTX 3080 10GB",
    cpu: "Ryzen 5 5600X",
    ram: "32GB DDR4",
    storage: "1TB NVMe",
    maxModel: "13B Q4_K_M",
    toks: "~55 tok/s (7B Q4)",
    notes: "Best entry point. 10GB VRAM handles most 7B models in Q8 and 13B in Q4.",
  },
  {
    name: "Mid — 30B Sweet Spot",
    budget: "~$1,400",
    gpu: "RTX 4090 24GB",
    cpu: "Ryzen 7 7700X",
    ram: "64GB DDR5",
    storage: "2TB NVMe",
    maxModel: "30B Q4_K_M",
    toks: "~112 tok/s (7B Q4)",
    notes: "The current single-card king for inference. Handles 30B comfortably, 34B with some quant compromise.",
  },
  {
    name: "High — 70B Capable",
    budget: "~$2,200",
    gpu: "2× RTX 3090 24GB (NVLink)",
    cpu: "Ryzen 9 7950X",
    ram: "128GB DDR5",
    storage: "4TB NVMe",
    maxModel: "70B Q4_K_M",
    toks: "~21 tok/s (70B Q4)",
    notes: "NVLink required for full 48GB pool. Without NVLink you get CPU offload which tanks speed.",
  },
  {
    name: "Workstation — 70B+ Fast",
    budget: "~$6,000",
    gpu: "2× RTX 4090 24GB",
    cpu: "Threadripper 7960X",
    ram: "256GB DDR5 ECC",
    storage: "8TB NVMe RAID",
    maxModel: "70B Q5_K_M",
    toks: "~35 tok/s (70B Q4)",
    notes: "No NVLink on 40-series consumer cards — uses PCIe peer-to-peer. Still the fastest consumer 70B setup.",
  },
  {
    name: "Server — MoE & 405B",
    budget: "~$15,000+",
    gpu: "4× A100 80GB SXM",
    cpu: "Dual EPYC 9354",
    ram: "512GB DDR5 ECC",
    storage: "16TB NVMe",
    maxModel: "405B Q4 / DeepSeek V3",
    toks: "~39 tok/s (DeepSeek V3)",
    notes: "NVLink/NVSwitch fabric. Required for 405B and large MoE models at usable speeds.",
  },
];

const gpus = [
  { name: "RTX 4090", vram: "24GB", bandwidth: "1.0 TB/s", tflops: "82.6", tdp: "450W", pcie: "x16 4.0", score: 100 },
  { name: "RTX 3090", vram: "24GB", bandwidth: "0.94 TB/s", tflops: "35.6", tdp: "350W", pcie: "x16 4.0", score: 72 },
  { name: "RTX 4080", vram: "16GB", bandwidth: "0.72 TB/s", tflops: "48.7", tdp: "320W", pcie: "x16 4.0", score: 78 },
  { name: "RTX 3080 Ti", vram: "12GB", bandwidth: "0.91 TB/s", tflops: "34.1", tdp: "350W", pcie: "x16 4.0", score: 68 },
  { name: "RX 7900 XTX", vram: "24GB", bandwidth: "0.96 TB/s", tflops: "61.4", tdp: "355W", pcie: "x16 4.0", score: 65 },
  { name: "A100 80GB", vram: "80GB", bandwidth: "2.0 TB/s", tflops: "77.9", tdp: "400W", pcie: "SXM5", score: 95 },
];

export default function HardwarePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-cyan-400 text-xs uppercase tracking-widest mb-3">DefiledAI Research</div>
          <h1 className="text-4xl font-black font-mono mb-4">HARDWARE CONFIGS</h1>
          <p className="text-[var(--muted2)] max-w-2xl leading-relaxed">
            Curated build recommendations for local AI inference at every budget tier,
            plus a GPU reference matrix sorted by inference performance.
          </p>
        </div>

        {/* Build tiers */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {builds.map((b, i) => (
            <div key={i} className="border border-[var(--border)] hover:border-zinc-700 transition-colors p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-mono font-black text-[var(--fg)] text-lg">{b.name}</div>
                  <div className="text-cyan-400 text-sm mt-1">{b.budget}</div>
                </div>
                <div className="text-right text-xs text-[var(--muted)] font-mono">
                  <div>MAX</div>
                  <div className="text-[var(--fg2)]">{b.maxModel}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm font-mono mb-4">
                <div className="flex gap-3">
                  <span className="text-[var(--muted)] w-20 shrink-0">GPU</span>
                  <span className="text-zinc-200">{b.gpu}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[var(--muted)] w-20 shrink-0">CPU</span>
                  <span className="text-zinc-200">{b.cpu}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[var(--muted)] w-20 shrink-0">RAM</span>
                  <span className="text-zinc-200">{b.ram}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[var(--muted)] w-20 shrink-0">Storage</span>
                  <span className="text-zinc-200">{b.storage}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[var(--muted)] w-20 shrink-0">Speed</span>
                  <span className="text-green-400">{b.toks}</span>
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)] leading-relaxed">
                {b.notes}
              </div>
            </div>
          ))}
        </div>

        {/* GPU reference */}
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <span className="text-cyan-400 text-xs uppercase tracking-widest">GPU Reference</span>
            <div className="flex-1 h-px bg-cyan-500/10" />
          </div>
        </div>
        <div className="border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase">
                  <th className="text-left px-6 py-3">GPU</th>
                  <th className="text-left px-6 py-3">VRAM</th>
                  <th className="text-left px-6 py-3">Bandwidth</th>
                  <th className="text-left px-6 py-3">TFLOPs</th>
                  <th className="text-left px-6 py-3">TDP</th>
                  <th className="text-left px-6 py-3">PCIe</th>
                  <th className="text-left px-6 py-3 w-40">Inference Score</th>
                </tr>
              </thead>
              <tbody>
                {gpus.map((g, i) => (
                  <tr key={i} className="border-b border-zinc-900 hover:bg-[var(--surface)]/40 transition-colors">
                    <td className="px-6 py-4 text-[var(--fg)] font-bold">{g.name}</td>
                    <td className="px-6 py-4 text-cyan-400">{g.vram}</td>
                    <td className="px-6 py-4 text-[var(--fg2)]">{g.bandwidth}</td>
                    <td className="px-6 py-4 text-[var(--fg2)]">{g.tflops}</td>
                    <td className="px-6 py-4 text-[var(--muted2)]">{g.tdp}</td>
                    <td className="px-6 py-4 text-[var(--muted)]">{g.pcie}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[var(--surface)] h-1.5">
                          <div style={{ width: `${g.score}%`, background: "#22d3ee", height: "100%" }} />
                        </div>
                        <span className="text-xs text-cyan-400 w-8 text-right">{g.score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] mt-3 font-mono">* Inference score weighted toward memory bandwidth (primary bottleneck for LLM token generation).</p>
      </div>
    </main>
  );
}
