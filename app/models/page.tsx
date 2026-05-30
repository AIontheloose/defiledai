"use client";
import { useState } from "react";
import Link from "next/link";

const models = [
  {
    family: "Llama", org: "Meta",
    models: [
      { name: "Llama 3.1 8B", params: "8B", ctx: "128K", license: "Llama 3", minVram: "6GB", quants: ["Q4_K_M","Q5_K_M","Q8_0","F16"], abliterated: true, ablitHf: "https://huggingface.co/models?search=llama+3.1+8b+abliterated" },
      { name: "Llama 3.1 70B", params: "70B", ctx: "128K", license: "Llama 3", minVram: "40GB", quants: ["Q2_K","Q4_K_M","Q5_K_M","IQ3_M"], abliterated: true, ablitHf: "https://huggingface.co/models?search=llama+3.1+70b+abliterated" },
      { name: "Llama 3.1 405B", params: "405B", ctx: "128K", license: "Llama 3", minVram: "240GB", quants: ["Q2_K","IQ1_M"], abliterated: false, ablitHf: "" },
    ],
  },
  {
    family: "Qwen", org: "Alibaba",
    models: [
      { name: "Qwen 3 7B", params: "7B", ctx: "32K", license: "Apache 2.0", minVram: "6GB", quants: ["Q4_K_M","Q5_K_M","Q8_0"], abliterated: true, ablitHf: "https://huggingface.co/models?search=qwen+7b+uncensored" },
      { name: "Qwen 3 14B", params: "14B", ctx: "32K", license: "Apache 2.0", minVram: "10GB", quants: ["Q4_K_M","Q5_K_M"], abliterated: true, ablitHf: "https://huggingface.co/models?search=qwen+14b+uncensored" },
      { name: "Qwen 3 72B", params: "72B", ctx: "32K", license: "Apache 2.0", minVram: "40GB", quants: ["Q2_K","Q4_K_M","Q5_K_M"], abliterated: true, ablitHf: "https://huggingface.co/models?search=qwen+72b+uncensored" },
    ],
  },
  {
    family: "DeepSeek", org: "DeepSeek",
    models: [
      { name: "DeepSeek R1 7B", params: "7B", ctx: "32K", license: "MIT", minVram: "6GB", quants: ["Q4_K_M","Q8_0"], abliterated: true, ablitHf: "https://huggingface.co/models?search=deepseek+r1+7b+abliterated" },
      { name: "DeepSeek R1 70B", params: "70B", ctx: "32K", license: "MIT", minVram: "40GB", quants: ["Q4_K_M","IQ3_M"], abliterated: true, ablitHf: "https://huggingface.co/models?search=deepseek+r1+70b+abliterated" },
      { name: "DeepSeek V3", params: "671B MoE", ctx: "128K", license: "MIT", minVram: "Multi-GPU", quants: ["Q2_K","IQ1_M"], abliterated: false, ablitHf: "" },
    ],
  },
  {
    family: "Mistral", org: "Mistral AI",
    models: [
      { name: "Mistral 7B v0.3", params: "7B", ctx: "32K", license: "Apache 2.0", minVram: "6GB", quants: ["Q4_K_M","Q5_K_M","Q8_0","F16"], abliterated: true, ablitHf: "https://huggingface.co/models?search=mistral+7b+abliterated" },
      { name: "Mixtral 8x7B", params: "56B MoE", ctx: "32K", license: "Apache 2.0", minVram: "24GB", quants: ["Q4_K_M","Q5_K_M"], abliterated: true, ablitHf: "https://huggingface.co/models?search=mixtral+8x7b+uncensored" },
      { name: "Mixtral 8x22B", params: "141B MoE", ctx: "64K", license: "Apache 2.0", minVram: "48GB", quants: ["Q2_K","Q4_K_M"], abliterated: false, ablitHf: "" },
    ],
  },
  {
    family: "Gemma", org: "Google",
    models: [
      { name: "Gemma 2 2B", params: "2B", ctx: "8K", license: "Gemma", minVram: "2GB", quants: ["Q4_K_M","Q8_0","F16"], abliterated: false, ablitHf: "" },
      { name: "Gemma 2 9B", params: "9B", ctx: "8K", license: "Gemma", minVram: "6GB", quants: ["Q4_K_M","Q5_K_M","Q8_0"], abliterated: true, ablitHf: "https://huggingface.co/models?search=gemma+2+9b+abliterated" },
      { name: "Gemma 2 27B", params: "27B", ctx: "8K", license: "Gemma", minVram: "16GB", quants: ["Q4_K_M","Q5_K_M"], abliterated: true, ablitHf: "https://huggingface.co/models?search=gemma+2+27b+abliterated" },
    ],
  },
  {
    family: "Phi", org: "Microsoft",
    models: [
      { name: "Phi-3 Mini", params: "3.8B", ctx: "128K", license: "MIT", minVram: "3GB", quants: ["Q4_K_M","Q8_0","F16"], abliterated: false, ablitHf: "" },
      { name: "Phi-3 Medium", params: "14B", ctx: "128K", license: "MIT", minVram: "10GB", quants: ["Q4_K_M","Q5_K_M"], abliterated: true, ablitHf: "https://huggingface.co/models?search=phi+3+uncensored" },
    ],
  },
];

export default function ModelsPage() {
  const [ablitOnly, setAblitOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = models.map((family) => ({
    ...family,
    models: family.models.filter((m) => {
      if (ablitOnly && !m.abliterated) return false;
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
  })).filter((f) => f.models.length > 0);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Research</div>
          <h1 className="text-4xl font-black font-mono mb-4">MODEL DATABASE</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Open-weight models with quantization options, VRAM requirements, and abliterated variant availability.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models..."
            className="bg-[var(--surface)] border border-[var(--border)] px-4 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors w-64" />
          <button onClick={() => setAblitOnly(!ablitOnly)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-widest uppercase border transition-all ${
              ablitOnly
                ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"
            }`}>
            <span className={`w-3 h-3 border flex items-center justify-center transition-colors ${ablitOnly ? "border-cyan-400 bg-cyan-400" : "border-[var(--muted)]"}`}>
              {ablitOnly && <span className="text-black text-xs leading-none">✓</span>}
            </span>
            Abliterated Only
          </button>
          {ablitOnly && (
            <Link href="/uncensored"
              className="text-xs text-cyan-400 hover:text-cyan-300 tracking-widest uppercase transition-colors">
              → Full Uncensored Database
            </Link>
          )}
        </div>

        <div className="space-y-10">
          {filtered.map((family) => (
            <div key={family.family} className="border border-[var(--border)]">
              <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]/20">
                <div>
                  <span className="font-mono font-black text-lg text-[var(--fg)]">{family.family}</span>
                  <span className="ml-3 text-xs text-[var(--muted)] tracking-widest uppercase">by {family.org}</span>
                </div>
                <span className="text-xs text-green-400 border border-green-400/20 px-2 py-1">ACTIVE</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-[var(--border)]/60 text-[var(--muted)] text-xs tracking-widest uppercase">
                      <th className="text-left px-6 py-3">Model</th>
                      <th className="text-left px-6 py-3">Params</th>
                      <th className="text-left px-6 py-3">Context</th>
                      <th className="text-left px-6 py-3">Min VRAM</th>
                      <th className="text-left px-6 py-3">License</th>
                      <th className="text-left px-6 py-3">Quants</th>
                      <th className="text-left px-6 py-3">Abliterated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {family.models.map((m, i) => (
                      <tr key={i} className="border-b border-[var(--border)]/30 hover:bg-[var(--surface)] transition-colors">
                        <td className="px-6 py-4 text-[var(--fg)] font-bold">{m.name}</td>
                        <td className="px-6 py-4 text-cyan-400">{m.params}</td>
                        <td className="px-6 py-4 text-[var(--fg2)]">{m.ctx}</td>
                        <td className="px-6 py-4 text-[var(--fg2)]">{m.minVram}</td>
                        <td className="px-6 py-4 text-[var(--muted)]">{m.license}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {m.quants.map((q) => (
                              <span key={q} className="text-xs border border-[var(--border)] px-1.5 py-0.5 text-[var(--muted2)]">{q}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {m.abliterated ? (
                            <a href={m.ablitHf} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 border border-cyan-400/30 px-2 py-1 hover:border-cyan-400 hover:bg-cyan-500/5 transition-all">
                              ✓ AVAILABLE ↗
                            </a>
                          ) : (
                            <span className="text-xs text-[var(--muted)] border border-[var(--border)] px-2 py-1">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-[var(--muted)] text-sm">
          Want full ratings, quality scores, and notes?{" "}
          <Link href="/uncensored" className="text-cyan-400 hover:text-cyan-300">
            Visit the Uncensored Database →
          </Link>
        </div>
      </div>
    </main>
  );
}
