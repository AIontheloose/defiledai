import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export const metadata = {
  title: "Weekly Digest — ForsakenAI",
  description: "Weekly roundup of new uncensored model drops, community benchmarks, and local AI news.",
};

function getRecentArticles(limit = 8) {
  const dir = path.join(process.cwd(), "content/articles");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        excerpt: data.excerpt ?? "",
        date: data.date ?? "",
        category: data.category ?? "Article",
        tags: data.tags ?? [],
      };
    })
    .filter((a) => a.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

function getRecentTutorials(limit = 4) {
  const dirs = ["content/tutorials/beginner","content/tutorials/intermediate","content/tutorials/expert"];
  const tutorials: any[] = [];
  for (const d of dirs) {
    const full = path.join(process.cwd(), d);
    if (!fs.existsSync(full)) continue;
    fs.readdirSync(full)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
      .forEach((file) => {
        const slug = file.replace(/\.mdx?$/, "");
        const raw = fs.readFileSync(path.join(full, file), "utf8");
        const { data } = matter(raw);
        tutorials.push({ slug, title: data.title ?? slug, date: data.date ?? "", level: data.level ?? "beginner", category: data.category ?? "Tutorial" });
      });
  }
  return tutorials.filter(t => t.date).sort((a,b) => b.date.localeCompare(a.date)).slice(0, limit);
}

const MODEL_DROPS = [
  { name: "Llama 3.1 70B Abliterated v3", by: "failspy", type: "Abliterated", hf: "https://huggingface.co/failspy/Meta-Llama-3-70B-Instruct-abliterated-v3", note: "Updated quality retention on reasoning chains." },
  { name: "Qwen 2.5 72B Uncensored GGUF", by: "bartowski", type: "Uncensored", hf: "https://huggingface.co/bartowski", note: "Full quant pack Q2_K through Q8_0." },
  { name: "Mistral Nemo 12B Abliterated", by: "bartowski", type: "Abliterated", hf: "https://huggingface.co/bartowski/Mistral-Nemo-Instruct-2407-abliterated", note: "128K context retained." },
  { name: "DeepSeek R1 8B Abliterated", by: "Community", type: "Abliterated", hf: "https://huggingface.co/models?search=deepseek+r1+8b+abliterated", note: "6GB VRAM minimum." },
];

const NEWS = [
  "ExLlamaV2 v0.2.4 — ~12% throughput improvement on Q4_K_M for Ada GPUs",
  "llama.cpp adds experimental Q4_K_XS format — smaller than Q4_K_S at similar quality",
  "Community finds secondary refusal vectors in Llama 3.1 — improved abliteration script posted",
  "ROCm 6.2 released — closes AMD/CUDA inference gap on RX 7000 series",
];

const TYPE_COLORS: Record<string, string> = {
  Abliterated: "text-cyan-400 border-cyan-400/30",
  Uncensored:  "text-purple-400 border-purple-400/30",
  Dolphin:     "text-blue-400 border-blue-400/30",
};

const LEVEL_COLORS: Record<string, string> = {
  beginner:     "text-green-400",
  intermediate: "text-yellow-400",
  expert:       "text-red-400",
};

export default function WeeklyDigestPage() {
  const articles  = getRecentArticles();
  const tutorials = getRecentTutorials();
  const weekLabel = (() => {
    const d = new Date();
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    return `Week of ${start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
  })();

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI</div>
          <h1 className="text-4xl font-black font-mono mb-4">WEEKLY DIGEST</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            New model drops, recent articles, tutorial updates, and backend news.
            Subscribe via <Link href="/feed.xml" className="text-cyan-400 hover:text-cyan-300">RSS</Link>.
          </p>
        </div>

        {/* Current week */}
        <div className="border border-cyan-500/20 mb-12">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-cyan-500/[0.03]">
            <span className="font-mono font-black text-lg text-[var(--fg)]">{weekLabel}</span>
            <span className="text-xs text-cyan-400 border border-cyan-500/20 px-2 py-1 font-mono">LATEST</span>
          </div>

          <div className="p-6 space-y-10">

            {/* New model drops */}
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">New Model Drops</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-xs text-cyan-400 font-mono">{MODEL_DROPS.length} this week</span>
              </div>
              <div className="space-y-3">
                {MODEL_DROPS.map((m) => (
                  <div key={m.name} className="border border-[var(--border)] p-4 hover:border-zinc-600 transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono font-bold text-[var(--fg)] text-sm">{m.name}</span>
                          <span className={`text-xs border px-2 py-0.5 ${TYPE_COLORS[m.type] ?? "text-zinc-400 border-zinc-700"}`}>{m.type.toUpperCase()}</span>
                        </div>
                        <div className="text-xs text-[var(--muted)] font-mono mb-1">by {m.by}</div>
                        <div className="text-sm text-[var(--muted2)]">{m.note}</div>
                      </div>
                      <a href={m.hf} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-cyan-400 border border-cyan-500/20 px-3 py-1 hover:border-cyan-400 transition-all font-mono shrink-0">
                        HF ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent articles */}
            {articles.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Recent Articles</span>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {articles.map((a) => (
                    <Link key={a.slug} href={`/articles/${a.slug}`}
                      className="group border border-[var(--border)] p-4 hover:border-zinc-600 transition-all">
                      <div className="text-xs text-cyan-400 uppercase tracking-widest mb-1 font-mono">{a.category}</div>
                      <div className="font-mono font-bold text-[var(--fg)] text-sm group-hover:text-cyan-100 transition-colors leading-snug mb-1">{a.title}</div>
                      <div className="text-xs text-[var(--muted)]">{a.date}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent tutorials */}
            {tutorials.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">New Tutorials</span>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>
                <div className="space-y-2">
                  {tutorials.map((t) => (
                    <Link key={t.slug} href={`/tutorials/${t.slug}`}
                      className="flex items-center justify-between border border-[var(--border)] px-4 py-3 hover:border-zinc-600 transition-all group">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono uppercase ${LEVEL_COLORS[t.level] ?? "text-cyan-400"}`}>{t.level}</span>
                        <span className="text-sm font-mono text-[var(--fg)] group-hover:text-cyan-100 transition-colors">{t.title}</span>
                      </div>
                      <span className="text-xs text-[var(--muted)] font-mono ml-4 shrink-0">{t.date}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* News */}
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Backend & Tool Updates</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>
              <div className="space-y-2">
                {NEWS.map((n, i) => (
                  <div key={i} className="flex gap-3 text-sm text-[var(--fg2)]">
                    <span className="text-cyan-400 font-mono mt-0.5 shrink-0">›</span>
                    <span>{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-[var(--muted)] text-sm">
          <Link href="/feed.xml" className="text-cyan-400 hover:text-cyan-300">Subscribe via RSS</Link>
          {" · "}
          <Link href="/tools/hf-tracker" className="text-cyan-400 hover:text-cyan-300">HuggingFace Tracker</Link>
          {" · "}
          <Link href="/articles" className="text-cyan-400 hover:text-cyan-300">All Articles</Link>
        </div>
      </div>
    </main>
  );
}
