"use client";
import { useState } from "react";

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

const MODELS = [
  { name: "Dolphin 2.9 Llama 3.1 8B", params: 8, vramQ4: 5.5, hf: "cognitivecomputations/dolphin-2.9-llama3-8b", type: "Dolphin" },
  { name: "Dolphin 2.9 Llama 3.1 70B", params: 70, vramQ4: 40.2, hf: "cognitivecomputations/dolphin-2.9-llama3-70b", type: "Dolphin" },
  { name: "Dolphin 2.8 Mistral 7B", params: 7, vramQ4: 4.8, hf: "cognitivecomputations/dolphin-2.8-mistral-7b-v02", type: "Dolphin" },
  { name: "Dolphin 2.9 Mixtral 8x22B", params: 141, vramQ4: 43.0, hf: "cognitivecomputations/dolphin-2.9-mixtral-8x22b", type: "Dolphin" },
  { name: "Dolphin 2.6 Phi-2 2.7B", params: 2.7, vramQ4: 2.1, hf: "cognitivecomputations/dolphin-2_6-phi-2", type: "Dolphin" },
  { name: "Llama 3.1 8B Abliterated", params: 8, vramQ4: 5.5, hf: "failspy/Llama-3-8B-Instruct-abliterated", type: "Abliterated" },
  { name: "Llama 3.1 70B Abliterated", params: 70, vramQ4: 40.2, hf: "failspy/Meta-Llama-3-70B-Instruct-abliterated-v3", type: "Abliterated" },
  { name: "Llama 3.2 3B Abliterated", params: 3, vramQ4: 2.2, hf: "bartowski/Llama-3.2-3B-Instruct-abliterated", type: "Abliterated" },
  { name: "Mistral 7B Abliterated", params: 7, vramQ4: 4.8, hf: "failspy/Mistral-7B-Instruct-v0.3-abliterated", type: "Abliterated" },
  { name: "Mistral Nemo 12B Abliterated", params: 12, vramQ4: 8.1, hf: "bartowski/Mistral-Nemo-Instruct-2407-abliterated", type: "Abliterated" },
  { name: "Qwen 2.5 7B Uncensored", params: 7, vramQ4: 5.0, hf: "models?search=qwen2.5+7b+uncensored", type: "Uncensored" },
  { name: "Qwen 2.5 72B Uncensored", params: 72, vramQ4: 41.0, hf: "models?search=qwen2.5+72b+uncensored", type: "Uncensored" },
  { name: "DeepSeek R1 7B Abliterated", params: 7, vramQ4: 5.0, hf: "models?search=deepseek+r1+7b+abliterated", type: "Abliterated" },
  { name: "DeepSeek R1 70B Abliterated", params: 70, vramQ4: 40.0, hf: "models?search=deepseek+r1+70b+abliterated", type: "Abliterated" },
  { name: "WizardLM-2 7B", params: 7, vramQ4: 4.8, hf: "Microsoft/WizardLM-2-7B", type: "Uncensored" },
  { name: "WizardLM-2 8x22B", params: 141, vramQ4: 43.0, hf: "Microsoft/WizardLM-2-8x22B", type: "Uncensored" },
  { name: "Gemma 2 9B Abliterated", params: 9, vramQ4: 6.2, hf: "models?search=gemma+2+9b+abliterated", type: "Abliterated" },
  { name: "Gemma 2 27B Abliterated", params: 27, vramQ4: 18.0, hf: "models?search=gemma+2+27b+abliterated", type: "Abliterated" },
  { name: "Phi-3 Medium Uncensored", params: 14, vramQ4: 9.5, hf: "models?search=phi+3+medium+uncensored", type: "Uncensored" },
];

const TYPE_COLORS: Record<string, string> = {
  Dolphin: "text-blue-400 border-blue-400/30",
  Abliterated: "text-cyan-400 border-cyan-400/30",
  Uncensored: "text-purple-400 border-purple-400/30",
};

function getToks(params: number, vramQ4: number, gpu: typeof GPUS[0], count: number): number {
  const totalVram = gpu.vram * count;
  if (vramQ4 > totalVram * 0.92) return 0;
  const bpw = 4.8;
  const modelBytes = params * 1e9 * bpw / 8;
  const totalBw = gpu.bw * count * (count > 1 ? 0.85 : 1) * 1e9;
  return Math.round((totalBw / modelBytes) * 0.88 * 0.82);
}

export default function CanIRunItPage() {
  const [gpuName, setGpuName] = useState("");
  const [count, setCount] = useState(1);
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState("");

  const gpu = GPUS.find((g) => g.name === gpuName);
  const totalVram = gpu ? gpu.vram * count : 0;

  const results = MODELS
    .filter((m) => filter === "all" || m.type === filter)
    .map((m) => {
      const fits = gpu ? m.vramQ4 <= totalVram * 0.92 : null;
      const toks = gpu && fits ? getToks(m.params, m.vramQ4, gpu, count) : null;
      return { ...m, fits, toks };
    })
    .sort((a, b) => {
      if (a.fits === b.fits) return a.vramQ4 - b.vramQ4;
      return (b.fits ? 1 : 0) - (a.fits ? 1 : 0);
    });

  const fitsCount = results.filter((r) => r.fits).length;
  const embedCode = `<iframe src="https://forsakenai.com/tools/can-i-run-it" width="100%" height="600" frameborder="0"></iframe>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied("embed");
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">CAN I RUN IT?</h1>
          <p className="text-[var(--muted)] max-w-2xl">Select your GPU and instantly see which uncensored and abliterated models run on your hardware. Shareable and embeddable.</p>
        </div>

        {/* GPU selector */}
        <div className="border border-[var(--border)] p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Your GPU</label>
              <select onChange={(e) => setGpuName(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value="">— Select GPU —</option>
                {["Ada","Ampere","Turing","RDNA3","RDNA2","Apple","Multi-GPU","Datacenter"].map((gen) => (
                  <optgroup key={gen} label={gen}>
                    {GPUS.filter((g) => g.gen === gen).map((g) => (
                      <option key={g.name} value={g.name}>{g.name} ({g.vram}GB)</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Count</label>
              <select value={count} onChange={(e) => setCount(Number(e.target.value))}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {[1,2,4,8].map((n) => <option key={n} value={n}>{n}×</option>)}
              </select>
            </div>
          </div>
          {gpu && (
            <div className="mt-4 flex flex-wrap gap-6 text-sm font-mono border-t border-[var(--border)] pt-4">
              <div><span className="text-[var(--muted)]">Total VRAM: </span><span className="text-cyan-400 font-bold">{totalVram}GB</span></div>
              <div><span className="text-[var(--muted)]">Bandwidth: </span><span className="text-[var(--fg2)]">{gpu.bw * count} GB/s</span></div>
              <div><span className="text-green-400 font-bold">{fitsCount} of {results.length}</span><span className="text-[var(--muted)]"> models fit</span></div>
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all","Dolphin","Abliterated","Uncensored"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs tracking-widest uppercase font-mono border transition-all ${filter === f ? "bg-cyan-500 text-black border-cyan-500 font-bold" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-2 mb-10">
          {results.map((m) => (
            <div key={m.name}
              className={`border p-4 flex flex-wrap items-center justify-between gap-4 transition-all ${m.fits === false ? "opacity-40 border-[var(--border)]" : "border-[var(--border)] hover:border-zinc-600"}`}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-xs border px-2 py-0.5 font-mono ${TYPE_COLORS[m.type]}`}>{m.type}</span>
                <span className="font-mono font-bold text-[var(--fg)] text-sm">{m.name}</span>
                {m.fits === true && <span className="text-xs text-green-400">✓ FITS</span>}
                {m.fits === false && <span className="text-xs text-red-400">✗ TOO LARGE</span>}
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-[var(--muted)]">{m.vramQ4}GB VRAM</span>
                {m.toks && <span className="text-green-400 font-bold">~{m.toks} tok/s</span>}
                <a href={`https://huggingface.co/${m.hf}`} target="_blank" rel="noopener noreferrer"
                  className="text-cyan-400 border border-cyan-500/20 px-2 py-0.5 hover:border-cyan-400 transition-all">HF ↗</a>
              </div>
            </div>
          ))}
        </div>

        {/* Embed section */}
        <div className="border border-[var(--border)] p-6">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">Embed This Tool</div>
          <p className="text-[var(--muted)] text-sm mb-4">Add this tool to your Discord server description, website, or forum post.</p>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-4 font-mono text-xs text-[var(--fg2)] mb-3 overflow-x-auto">
            {embedCode}
          </div>
          <button onClick={copyEmbed}
            className="text-xs font-mono text-cyan-400 border border-cyan-500/30 px-4 py-2 hover:border-cyan-400 transition-all">
            {copied === "embed" ? "COPIED ✓" : "COPY EMBED CODE"}
          </button>
        </div>
      </div>
    </main>
  );
}
