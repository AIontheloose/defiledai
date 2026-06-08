"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Review {
  id: string;
  model: string;
  type: string;
  gpu: string;
  quant: string;
  usecase: string;
  rating: number;
  verdict: string;
  pros: string;
  cons: string;
  author: string;
  date: string;
}

const SEED_REVIEWS: Review[] = [
  {
    id: "r1",
    model: "Llama 3.1 70B Abliterated",
    type: "Abliterated",
    gpu: "2× RTX 3090 NVLink",
    quant: "Q4_K_M",
    usecase: "Creative writing / roleplay",
    rating: 5,
    verdict: "The best locally-runnable model for unrestricted creative tasks. Post-abliteration quality is indistinguishable from base in creative output. No refusals, no moralizing, just clean output.",
    pros: "Near-zero quality loss, handles long-form fiction well, instruction following intact",
    cons: "Needs 48GB VRAM, 21 tok/s is usable but not fast",
    author: "neuralrig",
    date: "2026-05-28",
  },
  {
    id: "r2",
    model: "Dolphin 2.8 Mistral 7B",
    type: "Dolphin",
    gpu: "RTX 3080 10GB",
    quant: "Q4_K_M",
    usecase: "General chat",
    rating: 4,
    verdict: "The best entry-level uncensored model. Fast, coherent, and genuinely useful for everyday tasks. The Dolphin fine-tune adds helpfulness without wrecking base model quality.",
    pros: "Runs on almost anything, very fast at Q4, great instruction following",
    cons: "7B shows its limits on complex reasoning, some repetition on long outputs",
    author: "localai_fan",
    date: "2026-05-27",
  },
  {
    id: "r3",
    model: "DeepSeek R1 70B Abliterated",
    type: "Abliterated",
    gpu: "2× RTX 3090 NVLink",
    quant: "Q4_K_M",
    usecase: "Coding / reasoning",
    rating: 5,
    verdict: "Best uncensored reasoning model you can run locally. The chain-of-thought is fully intact after abliteration. Solves problems the base Llama 70B struggles with.",
    pros: "Exceptional reasoning, math scores near frontier models, coding is top-tier",
    cons: "Slightly slower than Llama 70B, chain-of-thought tokens add up on token budgets",
    author: "benchbot9k",
    date: "2026-05-26",
  },
  {
    id: "r4",
    model: "Mistral 7B Abliterated",
    type: "Abliterated",
    gpu: "RTX 4090",
    quant: "Q8_0",
    usecase: "API / automation",
    rating: 4,
    verdict: "Cleanest abliteration at 7B scale. Running Q8_0 on a 4090 gives near-lossless quality at 140+ tok/s. Perfect for high-throughput API workloads where you need an uncensored model.",
    pros: "Extremely fast, very clean abliteration, reliable structured output",
    cons: "7B knowledge ceiling, not great for nuanced creative tasks",
    author: "api_builder",
    date: "2026-05-25",
  },
  {
    id: "r5",
    model: "Qwen 2.5 72B Uncensored",
    type: "Uncensored",
    gpu: "2× RTX 4090",
    quant: "Q4_K_M",
    usecase: "Code generation",
    rating: 5,
    verdict: "The best uncensored coding model available locally. HumanEval scores are genuinely competitive. The uncensored variant has no meaningful quality regression on coding tasks.",
    pros: "Best code quality at 70B+ scale, multilingual, fast on dual 4090",
    cons: "Needs 48GB VRAM, slightly verbose on explanations",
    author: "codegen_lab",
    date: "2026-05-24",
  },
];

const TYPE_COLORS: Record<string, string> = {
  Abliterated: "text-cyan-400 border-cyan-400/30",
  Uncensored: "text-purple-400 border-purple-400/30",
  Dolphin: "text-blue-400 border-blue-400/30",
};

const MODELS_LIST = [
  "Llama 3.1 8B Abliterated", "Llama 3.1 70B Abliterated", "Llama 3.2 3B Abliterated",
  "Mistral 7B Abliterated", "Mistral Nemo 12B Abliterated",
  "Dolphin 2.9 Llama 3.1 8B", "Dolphin 2.9 Llama 3.1 70B", "Dolphin 2.8 Mistral 7B",
  "Qwen 2.5 7B Uncensored", "Qwen 2.5 72B Uncensored",
  "DeepSeek R1 7B Abliterated", "DeepSeek R1 70B Abliterated",
  "Gemma 2 9B Abliterated", "Gemma 2 27B Abliterated",
  "WizardLM-2 7B", "Phi-3 Medium Uncensored",
];

const STORAGE_KEY = "defiledai_reviews_v1";

function Stars({ n, set }: { n: number; set?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <button key={i} onClick={() => set?.(i)} disabled={!set}
          className={`text-xl transition-colors ${i <= n ? "text-yellow-400" : "text-[var(--border)]"} ${set ? "hover:text-yellow-300 cursor-pointer" : "cursor-default"}`}>
          ★
        </button>
      ))}
    </div>
  );
}

export default function ModelReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    model: "", type: "Abliterated", gpu: "", quant: "Q4_K_M",
    usecase: "", rating: 0, verdict: "", pros: "", cons: "", author: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setReviews([...SEED_REVIEWS, ...JSON.parse(saved)]);
    } catch {}
  }, []);

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.model || !form.verdict || form.rating === 0) return;
    const review: Review = {
      id: "u" + Math.random().toString(36).slice(2, 9),
      ...form,
      rating: form.rating,
      date: new Date().toISOString().slice(0, 10),
    };
    const existing = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } })();
    const updated = [review, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setReviews([...SEED_REVIEWS, ...updated]);
    setSubmitted(true);
    setShowForm(false);
    setForm({ model: "", type: "Abliterated", gpu: "", quant: "Q4_K_M", usecase: "", rating: 0, verdict: "", pros: "", cons: "", author: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const filtered = reviews
    .filter((r) => filter === "all" || r.type === filter)
    .sort((a, b) => sortBy === "date" ? b.date.localeCompare(a.date) : b.rating - a.rating);

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Community</div>
          <h1 className="text-4xl font-black font-mono mb-4">MODEL REVIEWS</h1>
          <p className="text-[var(--muted)] max-w-2xl">Community reviews of uncensored and abliterated models. Structured format: hardware, use case, verdict, pros and cons.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Reviews", value: reviews.length },
            { label: "Avg Rating", value: avgRating + " / 5" },
            { label: "Models Covered", value: new Set(reviews.map((r) => r.model)).size },
          ].map((s) => (
            <div key={s.label} className="border border-[var(--border)] p-4 text-center">
              <div className="text-2xl font-black font-mono text-cyan-400">{s.value}</div>
              <div className="text-xs text-[var(--muted)] uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1 flex-wrap">
            {["all","Abliterated","Uncensored","Dolphin"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs tracking-widest uppercase font-mono border transition-all ${filter === f ? "bg-cyan-500 text-black border-cyan-500 font-bold" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                {f}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] transition-colors">
            <option value="date">Latest first</option>
            <option value="rating">Highest rated</option>
          </select>
          <button onClick={() => setShowForm(!showForm)}
            className="ml-auto px-5 py-2 bg-cyan-500 text-black font-bold text-xs tracking-widest uppercase font-mono hover:bg-cyan-400 transition-colors">
            {showForm ? "CANCEL" : "+ WRITE REVIEW"}
          </button>
          {submitted && <span className="text-green-400 text-xs font-mono">✓ Review submitted</span>}
        </div>

        {/* Submit form */}
        {showForm && (
          <div className="border border-cyan-500/30 p-6 mb-8 bg-cyan-500/[0.02]">
            <div className="text-xs uppercase tracking-widest text-cyan-400 mb-5 font-mono">Write a Review</div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Model *</label>
                <select value={form.model} onChange={(e) => set("model", e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  <option value="">Select model</option>
                  {MODELS_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Type</label>
                <select value={form.type} onChange={(e) => set("type", e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  <option>Abliterated</option><option>Uncensored</option><option>Dolphin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">GPU *</label>
                <input value={form.gpu} onChange={(e) => set("gpu", e.target.value)} placeholder="e.g. RTX 4090"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Quantization</label>
                <select value={form.quant} onChange={(e) => set("quant", e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  {["Q4_K_M","Q5_K_M","Q6_K","Q8_0","F16","IQ3_M","Q2_K"].map((q) => <option key={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Use Case</label>
                <input value={form.usecase} onChange={(e) => set("usecase", e.target.value)} placeholder="e.g. Creative writing"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Username</label>
                <input value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Your handle"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Rating *</label>
              <Stars n={form.rating} set={(v) => set("rating", v)} />
            </div>
            {[
              { key: "verdict", label: "Verdict * (overall assessment)", rows: 3 },
              { key: "pros", label: "Pros", rows: 2 },
              { key: "cons", label: "Cons", rows: 2 },
            ].map((f) => (
              <div key={f.key} className="mb-4">
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-1">{f.label}</label>
                <textarea value={(form as any)[f.key]} onChange={(e) => set(f.key, e.target.value)} rows={f.rows}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-y" />
              </div>
            ))}
            <button onClick={submit} disabled={!form.model || !form.verdict || form.rating === 0}
              className="px-8 py-3 bg-cyan-500 text-black font-bold tracking-widest uppercase text-sm hover:bg-cyan-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              SUBMIT REVIEW
            </button>
          </div>
        )}

        {/* Reviews */}
        <div className="space-y-5">
          {filtered.map((r) => (
            <div key={r.id} className="border border-[var(--border)] p-6 hover:border-zinc-600 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-mono font-black text-lg text-[var(--fg)]">{r.model}</span>
                    <span className={`text-xs border px-2 py-0.5 ${TYPE_COLORS[r.type] ?? "text-zinc-400 border-zinc-700"}`}>{r.type.toUpperCase()}</span>
                  </div>
                  <div className="text-xs text-[var(--muted)] font-mono">{r.gpu} · {r.quant} · {r.usecase}</div>
                </div>
                <div className="text-right">
                  <Stars n={r.rating} />
                  <div className="text-xs text-[var(--muted)] mt-1">{r.author} · {r.date}</div>
                </div>
              </div>
              <p className="text-[var(--fg2)] text-sm leading-relaxed mb-4 border-l-2 border-cyan-500/30 pl-4">{r.verdict}</p>
              <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                {r.pros && (
                  <div>
                    <div className="text-green-400 uppercase tracking-widest mb-1">Pros</div>
                    <div className="text-[var(--muted2)]">{r.pros}</div>
                  </div>
                )}
                {r.cons && (
                  <div>
                    <div className="text-red-400 uppercase tracking-widest mb-1">Cons</div>
                    <div className="text-[var(--muted2)]">{r.cons}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
