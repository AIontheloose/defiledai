"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface IndexItem {
  title: string;
  excerpt: string;
  href: string;
  category: string;
  tags: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Article:    "text-cyan-400 border-cyan-400/20",
  Tutorial:   "text-green-400 border-green-400/20",
  Tool:       "text-purple-400 border-purple-400/20",
  Page:       "text-zinc-400 border-zinc-700",
  Benchmark:  "text-yellow-400 border-yellow-400/20",
};

function score(item: IndexItem, query: string): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  let s = 0;
  for (const w of words) {
    if (item.title.toLowerCase().includes(w)) s += 10;
    if (item.excerpt.toLowerCase().includes(w)) s += 4;
    if (item.tags.some((t) => t.toLowerCase().includes(w))) s += 8;
    if (item.category.toLowerCase().includes(w)) s += 3;
    if (item.href.toLowerCase().includes(w)) s += 2;
  }
  return s;
}

const SUGGESTIONS = ["Q4_K_M", "RTX 3090", "70B", "Dolphin", "abliterated", "ExLlamaV2", "NVLink", "MoE pipeline", "Ollama setup", "VRAM"];

export default function SearchClient({ index }: { index: IndexItem[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IndexItem[]>([]);
  const [filter, setFilter] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const scored = index
      .map((item) => ({ item, s: score(item, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.item);
    setResults(scored);
  }, [query, index]);

  const categories = ["All", ...Array.from(new Set(index.map((i) => i.category)))];
  const filtered = filter === "All" ? results : results.filter((r) => r.category === filter);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI</div>
          <h1 className="text-4xl font-black font-mono mb-8">SEARCH</h1>

          <div className="relative mb-4">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search models, tools, tutorials, benchmarks..."
              className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] px-5 py-4 text-[var(--fg)] font-mono text-sm placeholder:text-[var(--muted)] focus:outline-none transition-colors pr-12"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="6.5" cy="6.5" r="4.5"/><path d="M10.5 10.5L14 14" strokeLinecap="round"/>
            </svg>
          </div>

          {query && results.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const count = cat === "All" ? results.length : results.filter(r => r.category === cat).length;
                if (count === 0) return null;
                return (
                  <button key={cat} onClick={() => setFilter(cat)}
                    className={`text-xs border px-2.5 py-1 font-mono transition-all ${filter === cat ? "border-cyan-400 text-cyan-400 bg-cyan-400/10" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                    {cat} {count > 0 && <span className="opacity-60">({count})</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {query && filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--muted)]">
            <div className="font-mono text-lg mb-2">NO RESULTS</div>
            <div className="text-sm">Try: models, GPU names, quant formats, tool names</div>
          </div>
        )}

        {!query && (
          <div className="text-[var(--muted)] text-sm space-y-2">
            <div className="text-xs uppercase tracking-widest mb-4 font-mono">Try searching for</div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => setQuery(s)}
                  className="text-cyan-400 hover:text-cyan-300 font-mono text-sm border border-cyan-500/20 px-3 py-1 hover:border-cyan-400 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {filtered.length > 0 && (
          <div>
            <div className="text-xs text-[var(--muted)] mb-6 font-mono">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </div>
            <div className="space-y-3">
              {filtered.map((r, i) => (
                <Link key={`${r.href}-${i}`} href={r.href}
                  className="block border border-[var(--border)] hover:border-[var(--accent)]/40 p-5 transition-all hover:bg-[var(--accent)]/[0.02] animate-fade-in">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs border px-1.5 py-0.5 font-mono ${CATEGORY_COLORS[r.category] ?? "text-zinc-400 border-zinc-700"}`}>
                      {r.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-[var(--fg)] mb-1">{r.title}</div>
                  <div className="text-[var(--muted)] text-sm leading-relaxed">{r.excerpt}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
