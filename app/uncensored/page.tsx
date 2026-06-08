"use client";
import { useState } from "react";
import Link from "next/link";
import { getAllModels, getAllTags, getFamilies } from "../../lib/models";

const TYPE_COLORS: Record<string, string> = {
  abliterated: "text-cyan-400 border-cyan-400/30",
  uncensored:  "text-purple-400 border-purple-400/30",
  dolphin:     "text-blue-400 border-blue-400/30",
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
  const allModels = getAllModels();
  const allTags = getAllTags();
  const families = getFamilies();

  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [filterFamily, setFilterFamily] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [showNewOnly, setShowNewOnly] = useState(false);

  const toggleTag = (tag: string) =>
    setActiveTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag]);

  const filtered = allModels
    .filter(m => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) &&
          !m.family.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterType !== "all" && m.type !== filterType) return false;
      if (filterFamily !== "all" && m.family !== filterFamily) return false;
      if (activeTags.length && !activeTags.every(t => m.tags.includes(t))) return false;
      if (showNewOnly && !m.isNew) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "votes") return b.votes - a.votes;
      if (sortBy === "quality") return b.qualityRetention - a.qualityRetention;
      if (sortBy === "vram") return a.vramQ4 - b.vramQ4;
      if (sortBy === "new") return b.addedDate.localeCompare(a.addedDate);
      return 0;
    });

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI</div>
          <h1 className="text-4xl font-black font-mono mb-4">UNCENSORED MODEL DATABASE</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            <span className="text-cyan-400 font-bold">{allModels.length} models</span> — abliterated, Dolphin, and uncensored fine-tuned open-weight models.
            Community-tested with quality retention scores and direct HuggingFace links.
          </p>
        </div>

        {/* What is abliteration */}
        <div className="border border-cyan-500/20 bg-cyan-500/[0.03] p-5 mb-10">
          <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2 font-mono">What is Abliteration?</div>
          <p className="text-[var(--muted)] text-sm leading-relaxed max-w-3xl">
            Representation engineering that removes refusal direction vectors from model weights.
            No training required — takes minutes. Quality retention is typically 96–99% of the base model.{" "}
            <Link href="/articles/abliteration-explained" className="text-cyan-400 hover:text-cyan-300">Technical explainer →</Link>
          </p>
        </div>

        {/* Filters */}
        <div className="border border-[var(--border)] bg-[var(--card-bg)] p-5 mb-8 space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Search</label>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Model name..."
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value="all">All Types</option>
                <option value="abliterated">Abliterated</option>
                <option value="uncensored">Uncensored</option>
                <option value="dolphin">Dolphin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Family</label>
              <select value={filterFamily} onChange={e => setFilterFamily(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value="all">All Families</option>
                {families.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                <option value="rating">Community Rating</option>
                <option value="votes">Most Voted</option>
                <option value="quality">Quality Retention</option>
                <option value="vram">Min VRAM</option>
                <option value="new">Newest First</option>
              </select>
            </div>
          </div>

          {/* Tag filters */}
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowNewOnly(!showNewOnly)}
                className={`text-xs px-2.5 py-1 border font-mono transition-all ${showNewOnly ? "border-cyan-400 text-cyan-400 bg-cyan-400/10" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border2)]"}`}>
                🆕 New
              </button>
              {allTags.slice(0, 16).map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  className={`text-xs px-2.5 py-1 border font-mono transition-all ${activeTags.includes(tag) ? "border-cyan-400 text-cyan-400 bg-cyan-400/10" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border2)]"}`}>
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

        <div className="text-xs text-[var(--muted)] mb-4 font-mono">
          {filtered.length} model{filtered.length !== 1 ? "s" : ""} found
        </div>

        {/* Model cards */}
        <div className="space-y-4">
          {filtered.map(m => (
            <div key={m.id} className="border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--border2)] p-6 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    {m.isNew && <span className="text-xs bg-cyan-500 text-black px-2 py-0.5 font-mono font-bold">NEW</span>}
                    <h2 className="font-mono font-black text-lg text-[var(--fg)]">{m.name}</h2>
                    <span className={`text-xs border px-2 py-0.5 font-mono ${TYPE_COLORS[m.type] ?? "text-zinc-400 border-zinc-700"}`}>
                      {m.method.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--muted)] font-mono">by {m.author} · {m.family}</div>
                </div>
                <div className="text-right">
                  <Stars rating={m.rating} />
                  <div className="text-xs text-[var(--muted)] mt-1">{m.votes} votes</div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4 text-sm font-mono">
                <div>
                  <div className="text-[var(--muted)] text-xs mb-1">PARAMS</div>
                  <div className="text-cyan-400">{m.params}B</div>
                </div>
                <div>
                  <div className="text-[var(--muted)] text-xs mb-1">MIN VRAM</div>
                  <div className="text-[var(--fg2)]">{m.vramQ4}GB (Q4_K_M)</div>
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
                    {m.quants.map(q => (
                      <span key={q} className="text-xs border border-[var(--border)] px-1.5 py-0.5 text-[var(--muted2)]">{q}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[var(--muted)] text-sm mb-4">{m.note}</div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {m.tags.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)}
                      className={`text-xs px-2 py-0.5 border font-mono transition-all ${activeTags.includes(tag) ? "border-cyan-400/60 text-cyan-400" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border2)]"}`}>
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
          Missing a model?{" "}
          <Link href="/forum" className="text-cyan-400 hover:text-cyan-300">Post it in the Discord</Link>.
        </div>
      </div>
    </main>
  );
}
