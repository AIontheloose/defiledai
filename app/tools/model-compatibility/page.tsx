"use client";
import { useState } from "react";
import Link from "next/link";

const GPUS = [
  { name: "RTX 4090", vram: 24, tflops: 82.6, gen: "Ada" },
  { name: "RTX 4080 Super", vram: 16, tflops: 52.2, gen: "Ada" },
  { name: "RTX 4080", vram: 16, tflops: 48.7, gen: "Ada" },
  { name: "RTX 4070 Ti Super", vram: 16, tflops: 40.0, gen: "Ada" },
  { name: "RTX 4070 Ti", vram: 12, tflops: 40.0, gen: "Ada" },
  { name: "RTX 4070 Super", vram: 12, tflops: 35.5, gen: "Ada" },
  { name: "RTX 4070", vram: 12, tflops: 29.1, gen: "Ada" },
  { name: "RTX 4060 Ti", vram: 16, tflops: 22.1, gen: "Ada" },
  { name: "RTX 4060 Ti 8GB", vram: 8, tflops: 22.1, gen: "Ada" },
  { name: "RTX 4060", vram: 8, tflops: 15.1, gen: "Ada" },
  { name: "RTX 3090 Ti", vram: 24, tflops: 40.0, gen: "Ampere" },
  { name: "RTX 3090", vram: 24, tflops: 35.6, gen: "Ampere" },
  { name: "RTX 3080 Ti", vram: 12, tflops: 34.1, gen: "Ampere" },
  { name: "RTX 3080 12GB", vram: 12, tflops: 30.6, gen: "Ampere" },
  { name: "RTX 3080 10GB", vram: 10, tflops: 29.8, gen: "Ampere" },
  { name: "RTX 3070 Ti", vram: 8, tflops: 21.7, gen: "Ampere" },
  { name: "RTX 3070", vram: 8, tflops: 20.3, gen: "Ampere" },
  { name: "RTX 3060 Ti", vram: 8, tflops: 16.2, gen: "Ampere" },
  { name: "RTX 3060", vram: 12, tflops: 12.7, gen: "Ampere" },
  { name: "RTX 2080 Ti", vram: 11, tflops: 13.4, gen: "Turing" },
  { name: "RTX 2080 Super", vram: 8, tflops: 11.2, gen: "Turing" },
  { name: "RTX 2070 Super", vram: 8, tflops: 9.1, gen: "Turing" },
  { name: "RX 7900 XTX", vram: 24, tflops: 61.4, gen: "RDNA3" },
  { name: "RX 7900 XT", vram: 20, tflops: 51.6, gen: "RDNA3" },
  { name: "RX 7800 XT", vram: 16, tflops: 37.3, gen: "RDNA3" },
  { name: "RX 6900 XT", vram: 16, tflops: 23.0, gen: "RDNA2" },
  { name: "RX 6800 XT", vram: 16, tflops: 20.7, gen: "RDNA2" },
  { name: "M3 Max (40 core GPU)", vram: 48, tflops: 14.2, gen: "Apple Silicon" },
  { name: "M3 Pro (18 core GPU)", vram: 36, tflops: 5.6, gen: "Apple Silicon" },
  { name: "M2 Ultra", vram: 192, tflops: 27.2, gen: "Apple Silicon" },
  { name: "2× RTX 3090 NVLink", vram: 48, tflops: 71.2, gen: "Ampere" },
  { name: "2× RTX 4090", vram: 48, tflops: 165.2, gen: "Ada" },
  { name: "A100 40GB", vram: 40, tflops: 77.9, gen: "Datacenter" },
  { name: "A100 80GB", vram: 80, tflops: 77.9, gen: "Datacenter" },
];

const MODELS = [
  // Dolphin series
  { name: "Dolphin 2.9 Llama 3.1 8B", family: "Dolphin", params: 8, quant: "Q4_K_M", vramGb: 5.5, toks: { rtx4090: 128, rtx3090: 95, rtx3080: 88 }, hf: "https://huggingface.co/cognitivecomputations/dolphin-2.9-llama3-8b", type: "uncensored", desc: "Dolphin uncensored on Llama 3.1 8B. Best entry-level uncensored model." },
  { name: "Dolphin 2.9 Llama 3.1 70B", family: "Dolphin", params: 70, quant: "Q4_K_M", vramGb: 40, toks: { rtx4090: 0, rtx3090: 0, rtx3080: 0 }, hf: "https://huggingface.co/cognitivecomputations/dolphin-2.9-llama3-70b", type: "uncensored", desc: "Dolphin 70B. Needs 48GB+ VRAM. Best quality uncensored chat model." },
  { name: "Dolphin 2.8 Mistral 7B", family: "Dolphin", params: 7, quant: "Q4_K_M", vramGb: 4.8, toks: { rtx4090: 141, rtx3090: 104, rtx3080: 96 }, hf: "https://huggingface.co/cognitivecomputations/dolphin-2.8-mistral-7b-v02", type: "uncensored", desc: "Classic Dolphin on Mistral 7B. Fast, reliable, widely tested." },
  { name: "Dolphin 2.9 Mixtral 8x22B", family: "Dolphin", params: 141, quant: "Q4_K_M", vramGb: 43, toks: { rtx4090: 0, rtx3090: 0, rtx3080: 0 }, hf: "https://huggingface.co/cognitivecomputations/dolphin-2.9-mixtral-8x22b", type: "uncensored", desc: "Dolphin on Mixtral 8x22B MoE. Exceptional capability when hardware allows." },
  { name: "Dolphin 2.6 Phi-2", family: "Dolphin", params: 2.7, quant: "Q4_K_M", vramGb: 2.1, toks: { rtx4090: 210, rtx3090: 180, rtx3080: 165 }, hf: "https://huggingface.co/cognitivecomputations/dolphin-2_6-phi-2", type: "uncensored", desc: "Tiny Dolphin. Runs on 4GB VRAM. Good for constrained hardware." },
  // Abliterated Llama
  { name: "Llama 3.1 8B Abliterated", family: "Llama Abliterated", params: 8, quant: "Q4_K_M", vramGb: 5.5, toks: { rtx4090: 126, rtx3090: 93, rtx3080: 86 }, hf: "https://huggingface.co/failspy/Llama-3-8B-Instruct-abliterated", type: "abliterated", desc: "FailSpy's abliteration of Llama 3.1 8B. 99% quality retention." },
  { name: "Llama 3.1 70B Abliterated", family: "Llama Abliterated", params: 70, quant: "Q4_K_M", vramGb: 40, toks: { rtx4090: 0, rtx3090: 0, rtx3080: 0 }, hf: "https://huggingface.co/failspy/Meta-Llama-3-70B-Instruct-abliterated-v3", type: "abliterated", desc: "Best quality 70B abliteration. Requires 48GB VRAM (dual 3090 NVLink)." },
  { name: "Llama 3.2 3B Abliterated", family: "Llama Abliterated", params: 3, quant: "Q4_K_M", vramGb: 2.2, toks: { rtx4090: 245, rtx3090: 198, rtx3080: 182 }, hf: "https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-abliterated", type: "abliterated", desc: "Tiny abliterated Llama 3.2. Runs on 4GB VRAM at very high speed." },
  // Abliterated Mistral
  { name: "Mistral 7B v0.3 Abliterated", family: "Mistral Abliterated", params: 7, quant: "Q4_K_M", vramGb: 4.8, toks: { rtx4090: 138, rtx3090: 102, rtx3080: 94 }, hf: "https://huggingface.co/failspy/Mistral-7B-Instruct-v0.3-abliterated", type: "abliterated", desc: "Cleanest abliteration at 7B scale. 99.2% quality retention on MMLU." },
  { name: "Mistral Nemo 12B Abliterated", family: "Mistral Abliterated", params: 12, quant: "Q4_K_M", vramGb: 8.1, toks: { rtx4090: 86, rtx3090: 64, rtx3080: 58 }, hf: "https://huggingface.co/bartowski/Mistral-Nemo-Instruct-2407-abliterated", type: "abliterated", desc: "128K context window retained. Strong mid-range abliterated option." },
  // Qwen uncensored
  { name: "Qwen 2.5 7B Uncensored", family: "Qwen Uncensored", params: 7, quant: "Q4_K_M", vramGb: 5.0, toks: { rtx4090: 132, rtx3090: 98, rtx3080: 90 }, hf: "https://huggingface.co/models?search=qwen2.5+7b+uncensored", type: "abliterated", desc: "Abliterated Qwen 2.5 7B. Strong coding and multilingual." },
  { name: "Qwen 2.5 72B Uncensored", family: "Qwen Uncensored", params: 72, quant: "Q4_K_M", vramGb: 41, toks: { rtx4090: 0, rtx3090: 0, rtx3080: 0 }, hf: "https://huggingface.co/models?search=qwen2.5+72b+uncensored", type: "abliterated", desc: "Best coding uncensored model at 72B. Needs 48GB+ VRAM." },
  // DeepSeek abliterated
  { name: "DeepSeek R1 7B Abliterated", family: "DeepSeek Abliterated", params: 7, quant: "Q4_K_M", vramGb: 5.0, toks: { rtx4090: 129, rtx3090: 96, rtx3080: 88 }, hf: "https://huggingface.co/models?search=deepseek+r1+7b+abliterated", type: "abliterated", desc: "Uncensored reasoning model at 7B. Chain-of-thought intact." },
  { name: "DeepSeek R1 70B Abliterated", family: "DeepSeek Abliterated", params: 70, quant: "Q4_K_M", vramGb: 40, toks: { rtx4090: 0, rtx3090: 0, rtx3080: 0 }, hf: "https://huggingface.co/models?search=deepseek+r1+70b+abliterated", type: "abliterated", desc: "Best uncensored reasoning model locally. Needs 48GB+ VRAM." },
  // WizardLM uncensored
  { name: "WizardLM-2 8x22B", family: "WizardLM", params: 141, quant: "Q4_K_M", vramGb: 43, toks: { rtx4090: 0, rtx3090: 0, rtx3080: 0 }, hf: "https://huggingface.co/Microsoft/WizardLM-2-8x22B", type: "uncensored", desc: "Microsoft's uncensored instruction model. MoE architecture." },
  { name: "WizardLM-2 7B", family: "WizardLM", params: 7, quant: "Q4_K_M", vramGb: 4.8, toks: { rtx4090: 139, rtx3090: 103, rtx3080: 95 }, hf: "https://huggingface.co/Microsoft/WizardLM-2-7B", type: "uncensored", desc: "Fast uncensored instruction following. Good all-rounder at 7B." },
  // Gemma abliterated
  { name: "Gemma 2 9B Abliterated", family: "Gemma Abliterated", params: 9, quant: "Q4_K_M", vramGb: 6.2, toks: { rtx4090: 112, rtx3090: 83, rtx3080: 76 }, hf: "https://huggingface.co/models?search=gemma+2+9b+abliterated", type: "abliterated", desc: "Google's Gemma 2 9B with refusal removed. Strong reasoning." },
  { name: "Gemma 2 27B Abliterated", family: "Gemma Abliterated", params: 27, quant: "Q4_K_M", vramGb: 18, toks: { rtx4090: 44, rtx3090: 32, rtx3080: 0 }, hf: "https://huggingface.co/models?search=gemma+2+27b+abliterated", type: "abliterated", desc: "Best single 24GB card abliterated model. Needs 24GB VRAM exactly." },
  // Phi uncensored
  { name: "Phi-3 Medium Uncensored", family: "Phi Uncensored", params: 14, quant: "Q4_K_M", vramGb: 9.5, toks: { rtx4090: 68, rtx3090: 50, rtx3080: 0 }, hf: "https://huggingface.co/models?search=phi+3+medium+uncensored", type: "uncensored", desc: "128K context uncensored Phi-3 Medium. Good for long documents." },
];

const TYPE_COLORS: Record<string, string> = {
  abliterated: "text-cyan-400 border-cyan-400/30",
  uncensored: "text-purple-400 border-purple-400/30",
};

function estimateToks(model: typeof MODELS[0], gpuVram: number, gpuTflops: number): number {
  if (model.vramGb > gpuVram * 0.92) return 0;
  const vramRatio = Math.min(1, gpuVram / 24);
  const tflopsRatio = gpuTflops / 82.6;
  const base = 128 * (model.params <= 8 ? 1 : model.params <= 14 ? 0.67 : model.params <= 27 ? 0.44 : 0.21);
  return Math.round(base * Math.sqrt(tflopsRatio) * Math.min(1.1, vramRatio));
}

export default function ModelCompatibilityPage() {
  const [gpuCount, setGpuCount] = useState(1);
  const [selectedGpu, setSelectedGpu] = useState<typeof GPUS[0] | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterFamily, setFilterFamily] = useState("all");
  const [sysRam, setSysRam] = useState(32);

  const effectiveVram = selectedGpu ? selectedGpu.vram * gpuCount : 0;
  const effectiveTflops = selectedGpu ? selectedGpu.tflops * (gpuCount > 1 ? 1.7 : 1) : 0;

  const families = Array.from(new Set(MODELS.map((m) => m.family)));

  const results = MODELS
    .filter((m) => filterType === "all" || m.type === filterType)
    .filter((m) => filterFamily === "all" || m.family === filterFamily)
    .map((m) => {
      const toks = selectedGpu ? estimateToks(m, effectiveVram, effectiveTflops) : null;
      const fits = selectedGpu ? m.vramGb <= effectiveVram * 0.92 : null;
      const cpuFallback = selectedGpu && !fits && m.vramGb <= sysRam / 8;
      return { ...m, toks, fits, cpuFallback };
    })
    .sort((a, b) => {
      if (a.fits === b.fits) return a.params - b.params;
      return (b.fits ? 1 : 0) - (a.fits ? 1 : 0);
    });

  const fitsCount = results.filter((r) => r.fits).length;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">MODEL COMPATIBILITY CHECKER</h1>
          <p className="text-[var(--muted)] max-w-2xl">Select your GPU and see every uncensored and abliterated model that runs on your hardware, with estimated inference speed.</p>
        </div>

        {/* GPU selector */}
        <div className="border border-[var(--border)] p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Your GPU</label>
              <select onChange={(e) => setSelectedGpu(GPUS.find((g) => g.name === e.target.value) ?? null)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value="">— Select your GPU —</option>
                {["Ada","Ampere","Turing","RDNA3","RDNA2","Apple Silicon","Datacenter"].map((gen) => (
                  <optgroup key={gen} label={gen}>
                    {GPUS.filter((g) => g.gen === gen).map((g) => (
                      <option key={g.name} value={g.name}>{g.name} ({g.vram}GB)</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">GPU Count</label>
              <select value={gpuCount} onChange={(e) => setGpuCount(Number(e.target.value))}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value={1}>1× GPU</option>
                <option value={2}>2× GPU (NVLink/PCIe)</option>
                <option value={4}>4× GPU</option>
                <option value={8}>8× GPU</option>
              </select>
            </div>
          </div>

          {selectedGpu && (
            <div className="mt-4 flex flex-wrap gap-6 text-sm font-mono border-t border-[var(--border)] pt-4">
              <div><span className="text-[var(--muted)]">Total VRAM: </span><span className="text-cyan-400 font-bold">{effectiveVram}GB</span></div>
              <div><span className="text-[var(--muted)]">TFLOPs: </span><span className="text-[var(--fg2)]">{effectiveTflops.toFixed(1)}</span></div>
              <div><span className="text-[var(--muted)]">Architecture: </span><span className="text-[var(--fg2)]">{selectedGpu.gen}</span></div>
              {selectedGpu && <div><span className="text-green-400 font-bold">{fitsCount} models</span><span className="text-[var(--muted)]"> fit in VRAM</span></div>}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {["all","abliterated","uncensored"].map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs tracking-widest uppercase font-mono border transition-all ${filterType === t ? "bg-cyan-500 text-black border-cyan-500 font-bold" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
              {t === "all" ? "All Types" : t}
            </button>
          ))}
          <select value={filterFamily} onChange={(e) => setFilterFamily(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] transition-colors">
            <option value="all">All Families</option>
            {families.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {results.map((m) => (
            <div key={m.name}
              className={`border p-5 transition-all ${m.fits === false ? "opacity-50 border-[var(--border)]" : m.fits === true ? "border-[var(--border)] hover:border-zinc-600" : "border-[var(--border)] hover:border-zinc-600"}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-mono font-black text-[var(--fg)]">{m.name}</span>
                    <span className={`text-xs border px-2 py-0.5 ${TYPE_COLORS[m.type]}`}>{m.type.toUpperCase()}</span>
                    {m.fits === true && <span className="text-xs text-green-400 border border-green-400/20 px-2 py-0.5">✓ FITS</span>}
                    {m.fits === false && !m.cpuFallback && <span className="text-xs text-red-400 border border-red-400/20 px-2 py-0.5">✗ TOO LARGE</span>}
                    {m.cpuFallback && <span className="text-xs text-yellow-400 border border-yellow-400/20 px-2 py-0.5">⚠ CPU OFFLOAD</span>}
                  </div>
                  <div className="text-[var(--muted)] text-sm leading-relaxed">{m.desc}</div>
                </div>
                <div className="text-right shrink-0 font-mono text-sm space-y-1">
                  <div><span className="text-[var(--muted)] text-xs">VRAM: </span><span className="text-[var(--fg2)]">{m.vramGb}GB</span></div>
                  {m.toks !== null && m.fits && (
                    <div><span className="text-[var(--muted)] text-xs">Speed: </span><span className="text-green-400 font-bold">~{m.toks} tok/s</span></div>
                  )}
                  <div><span className="text-[var(--muted)] text-xs">Quant: </span><span className="text-cyan-400">{m.quant}</span></div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-[var(--muted)] font-mono">{m.family} · {m.params}B params</div>
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
