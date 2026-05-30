"use client";
import { useState, useEffect } from "react";

interface BenchmarkEntry {
  id: string;
  model: string;
  quant: string;
  backend: string;
  gpu: string;
  vram: string;
  toks: number;
  ctx: number;
  os: string;
  notes: string;
  date: string;
}

const SEED_BENCHMARKS: BenchmarkEntry[] = [
  { id: "s1", model: "Llama 3.1 70B", quant: "Q4_K_M", backend: "ExLlamaV2", gpu: "2× RTX 3090 NVLink", vram: "48", toks: 21.3, ctx: 4096, os: "Ubuntu 22.04", notes: "CUDA 12.4", date: "2026-05-28" },
  { id: "s2", model: "Llama 3.1 70B", quant: "Q4_K_M", backend: "llama.cpp", gpu: "2× RTX 3090 NVLink", vram: "48", toks: 17.8, ctx: 4096, os: "Ubuntu 22.04", notes: "CUDA 12.4", date: "2026-05-28" },
  { id: "s3", model: "Llama 3.1 8B", quant: "Q4_K_M", backend: "ExLlamaV2", gpu: "RTX 4090", vram: "24", toks: 128, ctx: 4096, os: "Windows 11", notes: "", date: "2026-05-27" },
  { id: "s4", model: "Llama 3.1 8B", quant: "Q8_0", backend: "Ollama", gpu: "RTX 4090", vram: "24", toks: 94, ctx: 4096, os: "Windows 11", notes: "", date: "2026-05-27" },
  { id: "s5", model: "Qwen 3 72B", quant: "Q4_K_M", backend: "ExLlamaV2", gpu: "2× RTX 3090 NVLink", vram: "48", toks: 19.8, ctx: 4096, os: "Ubuntu 22.04", notes: "", date: "2026-05-26" },
  { id: "s6", model: "DeepSeek R1 70B", quant: "Q4_K_M", backend: "ExLlamaV2", gpu: "2× RTX 3090 NVLink", vram: "48", toks: 19.2, ctx: 4096, os: "Ubuntu 22.04", notes: "", date: "2026-05-26" },
  { id: "s7", model: "Mixtral 8x22B", quant: "Q4_K_M", backend: "ExLlamaV2", gpu: "2× RTX 3090 NVLink", vram: "48", toks: 24.7, ctx: 4096, os: "Ubuntu 22.04", notes: "", date: "2026-05-25" },
  { id: "s8", model: "Gemma 2 27B", quant: "Q4_K_M", backend: "llama.cpp", gpu: "RTX 4090", vram: "24", toks: 44, ctx: 4096, os: "Windows 11", notes: "", date: "2026-05-24" },
  { id: "s9", model: "Mistral 7B", quant: "Q8_0", backend: "Ollama", gpu: "RTX 3080 10GB", vram: "10", toks: 89, ctx: 4096, os: "Windows 11", notes: "", date: "2026-05-23" },
  { id: "s10", model: "Phi-3 Medium 14B", quant: "Q6_K", backend: "llama.cpp", gpu: "RTX 4090", vram: "24", toks: 68, ctx: 8192, os: "Ubuntu 22.04", notes: "", date: "2026-05-22" },
];

const MODELS = ["Llama 3.1 8B","Llama 3.1 70B","Llama 3.1 405B","Qwen 3 7B","Qwen 3 14B","Qwen 3 72B","DeepSeek R1 7B","DeepSeek R1 70B","DeepSeek V3","Mistral 7B","Mixtral 8x7B","Mixtral 8x22B","Gemma 2 2B","Gemma 2 9B","Gemma 2 27B","Phi-3 Mini","Phi-3 Medium","Other"];
const QUANTS = ["F16","Q8_0","Q6_K","Q5_K_M","Q4_K_M","Q3_K_M","IQ3_M","Q2_K","IQ1_M","Other"];
const BACKENDS = ["Ollama","llama.cpp","ExLlamaV2","TensorRT-LLM","vLLM","LM Studio","Other"];

const STORAGE_KEY = "defiledai_benchmarks_v1";

function genId() { return "u" + Math.random().toString(36).slice(2,9); }

export default function SubmitBenchmarkPage() {
  const [benchmarks, setBenchmarks] = useState<BenchmarkEntry[]>(SEED_BENCHMARKS);
  const [submitted, setSubmitted] = useState(false);
  const [sortKey, setSortKey] = useState<keyof BenchmarkEntry>("toks");
  const [filterModel, setFilterModel] = useState("");

  const [form, setForm] = useState({
    model: "", quant: "Q4_K_M", backend: "Ollama",
    gpu: "", vram: "", toks: "", ctx: "4096", os: "Windows 11", notes: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: BenchmarkEntry[] = JSON.parse(saved);
        setBenchmarks([...SEED_BENCHMARKS, ...parsed]);
      }
    } catch {}
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.model || !form.gpu || !form.toks) return;
    const entry: BenchmarkEntry = {
      id: genId(),
      model: form.model,
      quant: form.quant,
      backend: form.backend,
      gpu: form.gpu,
      vram: form.vram,
      toks: parseFloat(form.toks),
      ctx: parseInt(form.ctx),
      os: form.os,
      notes: form.notes,
      date: new Date().toISOString().slice(0, 10),
    };
    const existing = (() => {
      try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
    })();
    const updated = [entry, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setBenchmarks([...SEED_BENCHMARKS, ...updated]);
    setSubmitted(true);
    setForm({ model: "", quant: "Q4_K_M", backend: "Ollama", gpu: "", vram: "", toks: "", ctx: "4096", os: "Windows 11", notes: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const models = Array.from(new Set(benchmarks.map((b) => b.model))).sort();
  const filtered = benchmarks
    .filter((b) => !filterModel || b.model === filterModel)
    .sort((a, b) => sortKey === "toks" ? b.toks - a.toks : String(a[sortKey]).localeCompare(String(b[sortKey])));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Community</div>
          <h1 className="text-4xl font-black font-mono mb-4">BENCHMARK SUBMISSIONS</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Submit your real-world inference results. Results are stored locally in your browser and displayed below.
          </p>
        </div>

        {/* Submit form */}
        <div className="border border-[var(--border)] p-6 mb-10">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-6">Submit Your Result</div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Model *</label>
              <select value={form.model} onChange={(e) => set("model", e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value="">Select model</option>
                {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Quantization *</label>
              <select value={form.quant} onChange={(e) => set("quant", e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {QUANTS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Backend *</label>
              <select value={form.backend} onChange={(e) => set("backend", e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {BACKENDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">GPU *</label>
              <input value={form.gpu} onChange={(e) => set("gpu", e.target.value)} placeholder="e.g. RTX 4090"
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">VRAM (GB)</label>
              <input value={form.vram} onChange={(e) => set("vram", e.target.value)} placeholder="e.g. 24"
                type="number"
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Tok/s (sustained) *</label>
              <input value={form.toks} onChange={(e) => set("toks", e.target.value)} placeholder="e.g. 21.3"
                type="number" step="0.1"
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Context Length</label>
              <input value={form.ctx} onChange={(e) => set("ctx", e.target.value)} placeholder="4096"
                type="number"
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">OS</label>
              <select value={form.os} onChange={(e) => set("os", e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option>Windows 11</option>
                <option>Windows 10</option>
                <option>Ubuntu 22.04</option>
                <option>Ubuntu 24.04</option>
                <option>macOS</option>
                <option>Other Linux</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Notes</label>
              <input value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="CUDA version, driver, etc."
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-4">
            <button onClick={handleSubmit}
              disabled={!form.model || !form.gpu || !form.toks}
              className="px-8 py-3 bg-[var(--accent)] text-black font-bold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed">
              SUBMIT RESULT
            </button>
            {submitted && (
              <span className="text-green-400 text-sm font-mono animate-fade-in">✓ Submitted successfully</span>
            )}
          </div>
        </div>

        {/* Results table */}
        <div className="border border-[var(--border)]">
          <div className="px-6 py-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm font-mono tracking-widest uppercase">Community Results ({filtered.length})</span>
            <div className="flex items-center gap-3">
              <select value={filterModel} onChange={(e) => setFilterModel(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value="">All models</option>
                {models.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={sortKey} onChange={(e) => setSortKey(e.target.value as keyof BenchmarkEntry)}
                className="bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value="toks">Sort: Tok/s</option>
                <option value="model">Sort: Model</option>
                <option value="date">Sort: Date</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase">
                  <th className="text-left px-5 py-3">Model</th>
                  <th className="text-left px-5 py-3">Quant</th>
                  <th className="text-left px-5 py-3">Backend</th>
                  <th className="text-left px-5 py-3">GPU</th>
                  <th className="text-left px-5 py-3">VRAM</th>
                  <th className="text-left px-5 py-3">Tok/s</th>
                  <th className="text-left px-5 py-3">Ctx</th>
                  <th className="text-left px-5 py-3">OS</th>
                  <th className="text-left px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface)] transition-colors">
                    <td className="px-5 py-3 text-[var(--fg)]">{b.model}</td>
                    <td className="px-5 py-3 text-[var(--accent)]">{b.quant}</td>
                    <td className="px-5 py-3 text-[var(--muted2)]">{b.backend}</td>
                    <td className="px-5 py-3 text-[var(--fg2)]">{b.gpu}</td>
                    <td className="px-5 py-3 text-[var(--muted)]">{b.vram ? `${b.vram}GB` : "—"}</td>
                    <td className="px-5 py-3 font-bold text-green-400">{b.toks}</td>
                    <td className="px-5 py-3 text-[var(--muted)]">{b.ctx.toLocaleString()}</td>
                    <td className="px-5 py-3 text-[var(--muted)]">{b.os}</td>
                    <td className="px-5 py-3 text-[var(--muted)]">{b.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] mt-3 font-mono">
          Your submissions are stored in your browser. Tok/s = sustained output tokens per second, first token excluded.
        </p>
      </div>
    </main>
  );
}
