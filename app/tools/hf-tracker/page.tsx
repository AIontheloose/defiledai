import Link from "next/link";
import { getAllModels, getRecentModels } from "../../../lib/models";

export const dynamic = "force-static";
export const revalidate = 3600; // rebuild hourly

export const metadata = {
  title: "HuggingFace Tracker — ForsakenAI",
  description: "Latest abliterated and uncensored model uploads on HuggingFace, curated and updated automatically.",
};

// Fetch live data from HF API at build time
async function fetchHFModels() {
  try {
    const searches = [
      "abliterated",
      "uncensored+gguf",
      "dolphin+instruct",
    ];

    const results: any[] = [];

    for (const term of searches) {
      const res = await fetch(
        `https://huggingface.co/api/models?search=${term}&sort=lastModified&direction=-1&limit=10&filter=gguf`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      results.push(...data);
    }

    // Deduplicate by id
    const seen = new Set<string>();
    return results
      .filter(m => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      })
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 20);
  } catch {
    return [];
  }
}

const TYPE_COLORS: Record<string, string> = {
  abliterated: "text-cyan-400 border-cyan-400/30",
  uncensored:  "text-purple-400 border-purple-400/30",
  dolphin:     "text-blue-400 border-blue-400/30",
};

const NOTABLE_AUTHORS = [
  { name: "failspy",                   desc: "Primary abliteration researcher. Representation engineering method.",        hf: "https://huggingface.co/failspy" },
  { name: "bartowski",                 desc: "Prolific GGUF quantizer. Full quant packs for all major abliterations.",    hf: "https://huggingface.co/bartowski" },
  { name: "cognitivecomputations",     desc: "Eric Hartford's org. Home of the Dolphin fine-tuned uncensored series.",    hf: "https://huggingface.co/cognitivecomputations" },
];

function classifyModel(id: string): { type: string; color: string } {
  const lower = id.toLowerCase();
  if (lower.includes("dolphin")) return { type: "Dolphin", color: TYPE_COLORS.dolphin };
  if (lower.includes("abliterat")) return { type: "Abliterated", color: TYPE_COLORS.abliterated };
  if (lower.includes("uncensor")) return { type: "Uncensored", color: TYPE_COLORS.uncensored };
  return { type: "Uncensored", color: TYPE_COLORS.uncensored };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function HFTrackerPage() {
  const [liveModels, curatedModels, recentCurated] = await Promise.all([
    fetchHFModels(),
    Promise.resolve(getAllModels()),
    Promise.resolve(getRecentModels(30)),
  ]);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI</div>
          <h1 className="text-4xl font-black font-mono mb-4">HUGGINGFACE TRACKER</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Latest abliterated, uncensored, and Dolphin model uploads. Live data from HuggingFace API — updated every hour.
            Subscribe to the <Link href="/feed.xml" className="text-cyan-400 hover:text-cyan-300">RSS feed</Link> for automatic updates.
          </p>
        </div>

        {/* Notable authors */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Notable Authors</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {NOTABLE_AUTHORS.map(a => (
              <a key={a.name} href={a.hf} target="_blank" rel="noopener noreferrer"
                className="border border-[var(--border)] bg-[var(--card-bg)] p-4 hover:border-[var(--border2)] transition-all group">
                <div className="font-mono font-bold text-[var(--fg)] group-hover:text-cyan-400 transition-colors mb-1">{a.name} ↗</div>
                <div className="text-xs text-[var(--muted)] leading-relaxed">{a.desc}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Live HF feed */}
        {liveModels.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-5">
              <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Live from HuggingFace</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
              <div className="flex items-center gap-1.5 text-xs text-green-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                AUTO-UPDATED
              </div>
            </div>
            <div className="space-y-2">
              {liveModels.map(m => {
                const { type, color } = classifyModel(m.id);
                return (
                  <a key={m.id} href={`https://huggingface.co/${m.id}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between border border-[var(--border)] bg-[var(--card-bg)] px-5 py-3.5 hover:border-[var(--border2)] hover:bg-[var(--surface)] transition-all group">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-xs border px-2 py-0.5 font-mono shrink-0 ${color}`}>{type.toUpperCase()}</span>
                      <span className="font-mono text-sm text-[var(--fg)] group-hover:text-cyan-100 transition-colors truncate">{m.id}</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 ml-4">
                      <span className="text-xs text-[var(--muted)] font-mono hidden md:block">{timeAgo(m.lastModified)}</span>
                      <span className="text-xs text-[var(--muted)]">↗</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Recently added to ForsakenAI database */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Recently Added to Database</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--muted)] font-mono">{recentCurated.length} in last 30 days</span>
          </div>
          <div className="space-y-3">
            {recentCurated.map(m => (
              <div key={m.id} className="border border-[var(--border)] bg-[var(--card-bg)] p-5 hover:border-[var(--border2)] transition-all">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {m.isNew && <span className="text-xs bg-cyan-500 text-black px-2 py-0.5 font-mono font-bold">NEW</span>}
                      <span className="font-mono font-bold text-[var(--fg)]">{m.name}</span>
                      <span className={`text-xs border px-2 py-0.5 font-mono ${TYPE_COLORS[m.type] ?? "text-zinc-400 border-zinc-700"}`}>
                        {m.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--muted)] font-mono">by {m.author} · added {m.addedDate}</div>
                  </div>
                  <div className="text-right text-xs font-mono">
                    <div className="text-[var(--fg2)]">{m.vramQ4}GB VRAM</div>
                    {m.toks4090 > 0 && <div className="text-green-400">~{m.toks4090} tok/s (4090)</div>}
                  </div>
                </div>
                <div className="text-sm text-[var(--muted2)] mb-3">{m.note}</div>
                <div className="flex flex-wrap gap-1 items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {m.quants.map(q => (
                      <span key={q} className="text-xs border border-[var(--border)] px-1.5 py-0.5 text-[var(--muted2)] font-mono">{q}</span>
                    ))}
                  </div>
                  <a href={m.hf} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-cyan-400 border border-cyan-500/20 px-3 py-1 hover:border-cyan-400 transition-all font-mono">
                    VIEW ON HF ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-[var(--muted)] text-sm">
          Missing a model?{" "}
          <Link href="/forum" className="text-cyan-400 hover:text-cyan-300">Post it in the Discord</Link>
          {" · "}
          <Link href="/uncensored" className="text-cyan-400 hover:text-cyan-300">Full uncensored database →</Link>
        </div>
      </div>
    </main>
  );
}
