"use client";
import { useState } from "react";
import Link from "next/link";

const models = [
  {
    name: "Llama 3.1 70B Abliterated",
    base: "Llama 3.1 70B",
    org: "Meta / Community",
    params: "70B",
    method: "Abliteration",
    quants: ["Q2_K", "Q4_K_M", "Q5_K_M", "Q8_0"],
    minVram: "40GB",
    qualityRetention: 98.4,
    hf: "https://huggingface.co/models?search=llama+3.1+70b+abliterated",
    tags: ["abliterated", "chat", "coding", "reasoning"],
    notes: "Refusal vectors removed via representation engineering. Minimal quality degradation.",
    rating: 4.9,
    votes: 312,
  },
  {
    name: "Mistral 7B Abliterated",
    base: "Mistral 7B v0.3",
    org: "Mistral / Community",
    params: "7B",
    method: "Abliteration",
    quants: ["Q4_K_M", "Q5_K_M", "Q8_0", "F16"],
    minVram: "6GB",
    qualityRetention: 99.1,
    hf: "https://huggingface.co/models?search=mistral+7b+abliterated",
    tags: ["abliterated", "chat", "fast"],
    notes: "One of the cleanest abliterations available. Almost zero quality loss at 7B scale.",
    rating: 4.8,
    votes: 287,
  },
  {
    name: "Qwen 3 72B Uncensored",
    base: "Qwen 3 72B",
    org: "Alibaba / Community",
    params: "72B",
    method: "Abliteration",
    quants: ["Q4_K_M", "Q5_K_M"],
    minVram: "40GB",
    qualityRetention: 97.8,
    hf: "https://huggingface.co/models?search=qwen+72b+uncensored",
    tags: ["abliterated", "multilingual", "coding", "reasoning"],
    notes: "Strong multilingual uncensored performance. Best open-weight coding model at this scale.",
    rating: 4.7,
    votes: 198,
  },
  {
    name: "DeepSeek R1 70B Abliterated",
    base: "DeepSeek R1 70B",
    org: "DeepSeek / Community",
    params: "70B",
    method: "Abliteration",
    quants: ["Q4_K_M", "Q5_K_M"],
    minVram: "40GB",
    qualityRetention: 97.2,
    hf: "https://huggingface.co/models?search=deepseek+r1+70b+abliterated",
    tags: ["abliterated", "reasoning", "math", "coding"],
    notes: "Best uncensored reasoning model locally. Chain-of-thought intact post-abliteration.",
    rating: 4.8,
    votes: 241,
  },
  {
    name: "Llama 3.1 8B Abliterated",
    base: "Llama 3.1 8B",
    org: "Meta / Community",
    params: "8B",
    method: "Abliteration",
    quants: ["Q4_K_M", "Q5_K_M", "Q8_0", "F16"],
    minVram: "6GB",
    qualityRetention: 98.9,
    hf: "https://huggingface.co/models?search=llama+3.1+8b+abliterated",
    tags: ["abliterated", "chat", "fast", "beginner"],
    notes: "Best entry-level abliterated model. Runs on any 6GB+ GPU at Q4_K_M.",
    rating: 4.7,
    votes: 334,
  },
  {
    name: "Mixtral 8x7B Uncensored",
    base: "Mixtral 8x7B",
    org: "Mistral / Community",
    params: "56B MoE",
    method: "Fine-tune",
    quants: ["Q4_K_M", "Q5_K_M"],
    minVram: "24GB",
    qualityRetention: 97.5,
    hf: "https://huggingface.co/models?search=mixtral+uncensored",
    tags: ["uncensored", "chat", "moe"],
    notes: "Fine-tuned on uncensored datasets. Good for creative and research tasks.",
    rating: 4.5,
    votes: 156,
  },
  {
    name: "Gemma 2 27B Abliterated",
    base: "Gemma 2 27B",
    org: "Google / Community",
    params: "27B",
    method: "Abliteration",
    quants: ["Q4_K_M", "Q5_K_M", "Q6_K"],
    minVram: "16GB",
    qualityRetention: 96.8,
    hf: "https://huggingface.co/models?search=gemma+2+27b+abliterated",
    tags: ["abliterated", "chat", "reasoning"],
    notes: "Strong 27B abliteration. Good reasoning performance on a single RTX 4090.",
    rating: 4.4,
    votes: 112,
  },
  {
    name: "Phi-3 Medium Uncensored",
    base: "Phi-3 Medium 14B",
    org: "Microsoft / Community",
    params: "14B",
    method: "Fine-tune",
    quants: ["Q4_K_M", "Q5_K_M", "Q8_0"],
    minVram: "10GB",
    qualityRetention: 96.1,
    hf: "https://huggingface.co/models?search=phi+3+uncensored",
    tags: ["uncensored", "coding", "128k-context"],
    notes: "128K context window retained. Strong for long-document tasks.",
    rating: 4.3,
    votes: 89,
  },
];

const ALL_TAGS = ["abliterated", "uncensored", "chat", "coding", "reasoning", "math", "fast", "multilingual", "moe", "beginner", "128k-context", "creative"];

const METHOD_COLORS: Record<string, string> = {
  "Abliteration": "text-cyan-400 border-cyan-400/20",
  "Fine-tune": "text-purple-400 border-purple-400/20",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-xs">
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
      <span className="text-[var(--muted)] ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function UncensoredPage() {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [method, setMethod] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  const toggleTag = (tag: string) =>
    setActiveTags((t) => t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]);

  const filtered = models
    .filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) &&
          !m.base.toLowerCase().includes(search.toLowerCase())) return false;
      if (method !== "All" && m.method !== method) return false;
      if (activeTags.length && !activeTags.every((t) => m.tags.includes(t))) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "votes") return b.votes - a.votes;
      if (sortBy === "quality") return b.qualityRetention - a.qualityRetention;
      if (sortBy === "vram") return parseFloat(a.minVram) - parseFloat(b.minVram);
      return 0;
    });

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI</div>
          <h1 className="text-4xl font-black font-mono mb-4">UNCENSORED MODEL DATABASE</h1>
          <p className="text-[var(--muted)] max-w-2xl leading-relaxed">
            Curated database of abliterated and uncensored open-weight models.
            Community-tested with quality retention scores, VRAM requirements, and direct HuggingFace links.
          </p>
        </div>

        {/* What is abliteration */}
        <div className="border border-cyan-500/20 bg-cyan-500/[0.03] p-6 mb-10">
          <div className="text-xs uppercase tracking-widest text-cyan-400 mb-3">What is Abliteration?</div>
          <p className="text-[var(--muted)] text-sm leading-relaxed max-w-3xl">
            Abliteration is a technique that identifies and removes "refusal direction" vectors from a model's
            residual stream — the internal representations that cause the model to decline requests.
            Unlike fine-tuning, abliteration requires no training data and takes minutes to apply.
            Quality retention is typically 96–99% of the base model on standard benchmarks.{" "}
            <Link href="/articles/abliteration-explained" className="text-cyan-400 hover:text-cyan-300">
              Full technical explainer →
            </Link>
          </p>
        </div>

        {/* Filters */}
        <div className="border border-[var(--border)] p-5 mb-8 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Search</label>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Model name..."
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option>All</option>
                <option>Abliteration</option>
                <option>Fine-tune</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value="rating">Community Rating</option>
                <option value="votes">Most Voted</option>
                <option value="quality">Quality Retention</option>
                <option value="vram">Min VRAM</option>
              </select>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Filter Tags</div>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  className={`text-xs px-2.5 py-1 border font-mono transition-all ${
                    activeTags.includes(tag)
                      ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"
                  }`}>
                  {tag}
                </button>
              ))}
              {activeTags.length > 0 && (
                <button onClick={() => setActiveTags([])}
                  className="text-xs px-2.5 py-1 border border-red-500/30 text-red-400 font-mono hover:border-red-400 transition-all">
                  clear ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-xs text-[var(--muted)] mb-4 font-mono">
          {filtered.length} model{filtered.length !== 1 ? "s" : ""} found
        </div>

        {/* Model cards */}
        <div className="space-y-4">
          {filtered.map((m) => (
            <div key={m.name} className="border border-[var(--border)] hover:border-zinc-600 p-6 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h2 className="font-mono font-black text-lg text-[var(--fg)]">{m.name}</h2>
                    <span className={`text-xs border px-2 py-0.5 ${METHOD_COLORS[m.method] ?? "text-[var(--muted)] border-[var(--border)]"}`}>
                      {m.method.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--muted)] font-mono">Base: {m.base} · {m.org}</div>
                </div>
                <div className="text-right">
                  <Stars rating={m.rating} />
                  <div className="text-xs text-[var(--muted)] mt-1">{m.votes} votes</div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4 text-sm font-mono">
                <div>
                  <div className="text-[var(--muted)] text-xs mb-1">PARAMS</div>
                  <div className="text-cyan-400">{m.params}</div>
                </div>
                <div>
                  <div className="text-[var(--muted)] text-xs mb-1">MIN VRAM</div>
                  <div className="text-[var(--fg2)]">{m.minVram}</div>
                </div>
                <div>
                  <div className="text-[var(--muted)] text-xs mb-1">QUALITY RETENTION</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[var(--surface)] h-1.5 max-w-[80px]">
                      <div style={{ width: `${m.qualityRetention}%`, background: m.qualityRetention >= 98 ? "#22d3ee" : m.qualityRetention >= 96 ? "#86efac" : "#fbbf24", height: "100%" }} />
                    </div>
                    <span className={m.qualityRetention >= 98 ? "text-cyan-400" : m.qualityRetention >= 96 ? "text-green-400" : "text-yellow-400"}>
                      {m.qualityRetention}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[var(--muted)] text-xs mb-1">QUANTS</div>
                  <div className="flex flex-wrap gap-1">
                    {m.quants.map((q) => (
                      <span key={q} className="text-xs border border-[var(--border)] px-1.5 py-0.5 text-[var(--muted2)]">{q}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[var(--muted)] text-sm mb-4 leading-relaxed">{m.notes}</div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {m.tags.map((tag) => (
                    <button key={tag} onClick={() => toggleTag(tag)}
                      className={`text-xs px-2 py-0.5 border font-mono transition-all ${
                        activeTags.includes(tag)
                          ? "border-cyan-400/60 text-cyan-400"
                          : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-600"
                      }`}>
                      {tag}
                    </button>
                  ))}
                </div>
                <a href={m.hf} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono tracking-widest uppercase text-cyan-400 border border-cyan-500/30 px-4 py-1.5 hover:border-cyan-400 hover:bg-cyan-500/5 transition-all">
                  FIND ON HUGGINGFACE ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-[var(--muted)] text-sm">
          Know a model we missed?{" "}
          <Link href="/forum" className="text-cyan-400 hover:text-cyan-300">Post it in the forum</Link>.
        </div>
      </div>
    </main>
  );
}
