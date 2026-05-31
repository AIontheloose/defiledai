import Link from "next/link";

export const metadata = {
  title: "Weekly Digest — DefiledAI",
  description: "Weekly roundup of new uncensored model drops, community benchmarks, and local AI news.",
};

const DIGESTS = [
  {
    week: "Week of May 26, 2026",
    slug: "2026-05-26",
    highlights: ["Llama 3.1 70B abliteration quality retention confirmed at 98.4%", "New Qwen 2.5 72B uncensored GGUF posted by bartowski", "ExLlamaV2 v0.2.4 released — 12% throughput improvement"],
    modelDrops: 4,
    benchmarks: 12,
    articles: 3,
  },
  {
    week: "Week of May 19, 2026",
    slug: "2026-05-19",
    highlights: ["DeepSeek R1 70B abliterated variant available on HuggingFace", "Community benchmark: Mistral Nemo 12B vs Mistral 7B on creative tasks", "llama.cpp adds Q4_K_XS quant format"],
    modelDrops: 3,
    benchmarks: 9,
    articles: 2,
  },
  {
    week: "Week of May 12, 2026",
    slug: "2026-05-12",
    highlights: ["Dolphin 2.9 Mixtral 8x22B released by CognitiveComputations", "RTX 5090 launch — 32GB VRAM confirmed, first inference benchmarks", "New abliteration technique preserves instruction following better"],
    modelDrops: 5,
    benchmarks: 14,
    articles: 4,
  },
];

const LATEST = {
  week: "Week of May 26, 2026",
  newModels: [
    { name: "Llama 3.1 70B Abliterated v3", by: "FailSpy", type: "Abliterated", hf: "https://huggingface.co/failspy/Meta-Llama-3-70B-Instruct-abliterated-v3", note: "Updated abliteration — improved quality retention on reasoning tasks" },
    { name: "Qwen 2.5 72B Uncensored GGUF", by: "bartowski", type: "Uncensored", hf: "https://huggingface.co/bartowski", note: "Full GGUF quantization pack — Q2_K through Q8_0" },
    { name: "Mistral Nemo 12B Abliterated", by: "bartowski", type: "Abliterated", hf: "https://huggingface.co/bartowski/Mistral-Nemo-Instruct-2407-abliterated", note: "128K context retained. Strong mid-range abliterated option." },
    { name: "DeepSeek R1 8B Abliterated", by: "Community", type: "Abliterated", hf: "https://huggingface.co/models?search=deepseek+r1+8b+abliterated", note: "Reasoning chain intact post-abliteration. 6GB VRAM minimum." },
  ],
  topBenchmarks: [
    { model: "Llama 3.1 70B Abliterated", gpu: "2× RTX 3090 NVLink", toks: 21.3, user: "neuralrig" },
    { model: "Qwen 2.5 72B Uncensored", gpu: "2× RTX 4090", toks: 34.8, user: "benchbot9k" },
    { model: "Mistral 7B Abliterated", gpu: "RTX 4090", toks: 141, user: "fastinfer" },
    { model: "DeepSeek R1 8B Abliterated", gpu: "RTX 3080 Ti", toks: 86, user: "r1_tester" },
  ],
  news: [
    "ExLlamaV2 v0.2.4 released — ~12% improvement on Q4_K_M throughput on Ada GPUs",
    "llama.cpp adds experimental Q4_K_XS format — smaller than Q4_K_S with similar quality",
    "Community finds secondary refusal vectors in Llama 3.1 — improved abliteration script posted",
    "ROCm 6.2 released — closes AMD/CUDA inference gap further on RX 7000 series",
  ],
  forumActivity: [
    { title: "Best abliterated model for creative writing?", replies: 47 },
    { title: "Comparing Dolphin vs abliterated Llama — which is better?", replies: 31 },
    { title: "ExLlamaV2 vs Ollama on RTX 3090 — real numbers", replies: 28 },
  ],
};

const TYPE_COLORS: Record<string, string> = {
  Abliterated: "text-cyan-400 border-cyan-400/30",
  Uncensored: "text-purple-400 border-purple-400/30",
  Dolphin: "text-blue-400 border-blue-400/30",
};

export default function WeeklyDigestPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI</div>
          <h1 className="text-4xl font-black font-mono mb-4">WEEKLY DIGEST</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Every week: new uncensored model drops, top community benchmarks, backend updates, and forum highlights.
            Subscribe via <Link href="/feed.xml" className="text-cyan-400 hover:text-cyan-300">RSS</Link> to get it automatically.
          </p>
        </div>

        {/* Latest digest */}
        <div className="border border-cyan-500/20 mb-12">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-cyan-500/[0.03]">
            <span className="font-mono font-black text-lg text-[var(--fg)]">{LATEST.week}</span>
            <span className="text-xs text-cyan-400 border border-cyan-500/20 px-2 py-1 font-mono">LATEST</span>
          </div>

          <div className="p-6 space-y-10">
            {/* New models */}
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">New Model Drops</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-xs text-cyan-400 font-mono">{LATEST.newModels.length} this week</span>
              </div>
              <div className="space-y-3">
                {LATEST.newModels.map((m) => (
                  <div key={m.name} className="border border-[var(--border)] p-4 hover:border-zinc-600 transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono font-bold text-[var(--fg)]">{m.name}</span>
                          <span className={`text-xs border px-2 py-0.5 ${TYPE_COLORS[m.type]}`}>{m.type.toUpperCase()}</span>
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

            {/* Top benchmarks */}
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Top Community Benchmarks</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>
              <div className="border border-[var(--border)] overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase">
                      <th className="text-left px-5 py-3">Model</th>
                      <th className="text-left px-5 py-3">GPU</th>
                      <th className="text-left px-5 py-3">Tok/s</th>
                      <th className="text-left px-5 py-3">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LATEST.topBenchmarks.map((b, i) => (
                      <tr key={i} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface)] transition-colors">
                        <td className="px-5 py-3 text-[var(--fg)]">{b.model}</td>
                        <td className="px-5 py-3 text-[var(--muted2)]">{b.gpu}</td>
                        <td className="px-5 py-3 text-green-400 font-bold">{b.toks}</td>
                        <td className="px-5 py-3 text-[var(--muted)]">{b.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* News */}
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Backend & Tool Updates</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>
              <div className="space-y-2">
                {LATEST.news.map((n, i) => (
                  <div key={i} className="flex gap-3 text-sm text-[var(--fg2)]">
                    <span className="text-cyan-400 font-mono mt-0.5">›</span>
                    <span>{n}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forum */}
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Hot Forum Threads</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>
              <div className="space-y-2">
                {LATEST.forumActivity.map((f, i) => (
                  <div key={i} className="flex items-center justify-between border border-[var(--border)] px-4 py-3 hover:border-zinc-600 transition-all">
                    <span className="text-[var(--fg2)] text-sm">{f.title}</span>
                    <span className="text-xs text-[var(--muted)] font-mono ml-4 shrink-0">{f.replies} replies</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Archive */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Archive</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <div className="space-y-3">
            {DIGESTS.slice(1).map((d) => (
              <div key={d.slug} className="border border-[var(--border)] p-5 hover:border-zinc-600 transition-all">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <span className="font-mono font-bold text-[var(--fg)]">{d.week}</span>
                  <div className="flex gap-4 text-xs text-[var(--muted)] font-mono">
                    <span>{d.modelDrops} models</span>
                    <span>{d.benchmarks} benchmarks</span>
                    <span>{d.articles} articles</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {d.highlights.map((h, i) => (
                    <li key={i} className="text-sm text-[var(--muted2)]">
                      <span className="text-cyan-400 mr-2">›</span>{h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
