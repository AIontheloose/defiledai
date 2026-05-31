import Link from "next/link";

export const metadata = {
  title: "HuggingFace Tracker — DefiledAI",
  description: "Latest abliterated and uncensored model uploads on HuggingFace, curated weekly.",
};

const TRACKED = [
  {
    name: "Meta-Llama-3-70B-Instruct-abliterated-v3",
    author: "failspy",
    type: "Abliterated",
    base: "Llama 3.1 70B",
    posted: "2026-05-28",
    quants: ["Q2_K", "Q4_K_M", "Q5_K_M", "Q8_0"],
    downloads: 18400,
    hf: "https://huggingface.co/failspy/Meta-Llama-3-70B-Instruct-abliterated-v3",
    note: "v3 improves quality retention on long reasoning chains vs v2.",
    hot: true,
  },
  {
    name: "Llama-3-8B-Instruct-abliterated",
    author: "failspy",
    type: "Abliterated",
    base: "Llama 3.1 8B",
    posted: "2026-05-27",
    quants: ["Q4_K_M", "Q5_K_M", "Q8_0", "F16"],
    downloads: 31200,
    hf: "https://huggingface.co/failspy/Llama-3-8B-Instruct-abliterated",
    note: "Most downloaded abliterated 8B model. 99.2% MMLU retention.",
    hot: true,
  },
  {
    name: "Llama-3.2-3B-Instruct-abliterated",
    author: "bartowski",
    type: "Abliterated",
    base: "Llama 3.2 3B",
    posted: "2026-05-27",
    quants: ["Q4_K_M", "Q5_K_M", "Q8_0"],
    downloads: 8700,
    hf: "https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-abliterated",
    note: "Runs on 4GB VRAM. Best tiny abliterated model.",
    hot: false,
  },
  {
    name: "Mistral-Nemo-Instruct-2407-abliterated",
    author: "bartowski",
    type: "Abliterated",
    base: "Mistral Nemo 12B",
    posted: "2026-05-26",
    quants: ["Q4_K_M", "Q5_K_M", "Q6_K"],
    downloads: 5400,
    hf: "https://huggingface.co/bartowski/Mistral-Nemo-Instruct-2407-abliterated",
    note: "128K context window retained post-abliteration.",
    hot: false,
  },
  {
    name: "dolphin-2.9-llama3-8b",
    author: "cognitivecomputations",
    type: "Dolphin",
    base: "Llama 3.1 8B",
    posted: "2026-05-25",
    quants: ["Q4_K_M", "Q5_K_M", "Q8_0"],
    downloads: 44100,
    hf: "https://huggingface.co/cognitivecomputations/dolphin-2.9-llama3-8b",
    note: "Eric Hartford's Dolphin series on Llama 3.1 8B. Most popular uncensored 8B.",
    hot: true,
  },
  {
    name: "dolphin-2.9-llama3-70b",
    author: "cognitivecomputations",
    type: "Dolphin",
    base: "Llama 3.1 70B",
    posted: "2026-05-25",
    quants: ["Q4_K_M", "Q5_K_M"],
    downloads: 12800,
    hf: "https://huggingface.co/cognitivecomputations/dolphin-2.9-llama3-70b",
    note: "Dolphin fine-tune on Llama 3.1 70B. Requires 48GB VRAM.",
    hot: false,
  },
  {
    name: "Mistral-7B-Instruct-v0.3-abliterated",
    author: "failspy",
    type: "Abliterated",
    base: "Mistral 7B v0.3",
    posted: "2026-05-24",
    quants: ["Q4_K_M", "Q5_K_M", "Q8_0", "F16"],
    downloads: 22600,
    hf: "https://huggingface.co/failspy/Mistral-7B-Instruct-v0.3-abliterated",
    note: "Cleanest 7B abliteration. 99.2% MMLU retention. Community favourite.",
    hot: false,
  },
  {
    name: "dolphin-2.9-mixtral-8x22b",
    author: "cognitivecomputations",
    type: "Dolphin",
    base: "Mixtral 8x22B",
    posted: "2026-05-23",
    quants: ["Q2_K", "Q4_K_M"],
    downloads: 7300,
    hf: "https://huggingface.co/cognitivecomputations/dolphin-2.9-mixtral-8x22b",
    note: "Dolphin on MoE architecture. Exceptional quality if hardware allows.",
    hot: false,
  },
  {
    name: "dolphin-2_6-phi-2",
    author: "cognitivecomputations",
    type: "Dolphin",
    base: "Phi-2 2.7B",
    posted: "2026-05-22",
    quants: ["Q4_K_M", "Q8_0", "F16"],
    downloads: 15900,
    hf: "https://huggingface.co/cognitivecomputations/dolphin-2_6-phi-2",
    note: "Runs on 4GB VRAM. Fastest uncensored model available.",
    hot: false,
  },
  {
    name: "WizardLM-2-7B",
    author: "microsoft",
    type: "Uncensored",
    base: "Mistral 7B",
    posted: "2026-05-21",
    quants: ["Q4_K_M", "Q5_K_M", "Q8_0"],
    downloads: 9800,
    hf: "https://huggingface.co/Microsoft/WizardLM-2-7B",
    note: "Microsoft's uncensored instruction model. Strong at structured tasks.",
    hot: false,
  },
];

const TYPE_COLORS: Record<string, string> = {
  Abliterated: "text-cyan-400 border-cyan-400/30",
  Uncensored: "text-purple-400 border-purple-400/30",
  Dolphin: "text-blue-400 border-blue-400/30",
};

const NOTABLE_AUTHORS = [
  { name: "failspy", desc: "Primary abliteration researcher. Most FailSpy releases use representation engineering.", hf: "https://huggingface.co/failspy" },
  { name: "bartowski", desc: "Prolific GGUF quantizer. Covers all major abliterated models with full quant packs.", hf: "https://huggingface.co/bartowski" },
  { name: "cognitivecomputations", desc: "Eric Hartford's org. Home of the Dolphin series — fine-tuned uncensored models.", hf: "https://huggingface.co/cognitivecomputations" },
];

export default function HFTrackerPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI</div>
          <h1 className="text-4xl font-black font-mono mb-4">HUGGINGFACE TRACKER</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Curated list of the best abliterated, uncensored, and Dolphin model uploads on HuggingFace.
            Updated weekly. Subscribe to the <Link href="/feed.xml" className="text-cyan-400 hover:text-cyan-300">RSS feed</Link> for automatic updates.
          </p>
        </div>

        {/* Notable authors */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Notable Authors</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {NOTABLE_AUTHORS.map((a) => (
              <a key={a.name} href={a.hf} target="_blank" rel="noopener noreferrer"
                className="border border-[var(--border)] p-4 hover:border-zinc-600 transition-all group">
                <div className="font-mono font-bold text-[var(--fg)] group-hover:text-cyan-400 transition-colors mb-1">{a.name} ↗</div>
                <div className="text-xs text-[var(--muted)] leading-relaxed">{a.desc}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Model list */}
        <div className="flex items-center gap-4 mb-5">
          <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Latest Uploads</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--muted)] font-mono">Updated 2026-05-30</span>
        </div>

        <div className="space-y-3">
          {TRACKED.map((m) => (
            <div key={m.name} className="border border-[var(--border)] p-5 hover:border-zinc-600 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    {m.hot && <span className="text-orange-400 text-xs">🔥</span>}
                    <span className="font-mono font-bold text-[var(--fg)]">{m.name}</span>
                    <span className={`text-xs border px-2 py-0.5 ${TYPE_COLORS[m.type]}`}>{m.type.toUpperCase()}</span>
                  </div>
                  <div className="text-xs text-[var(--muted)] font-mono">
                    by <span className="text-[var(--fg2)]">{m.author}</span> · base: {m.base} · {m.posted}
                  </div>
                </div>
                <div className="text-right text-xs font-mono">
                  <div className="text-[var(--fg2)]">{m.downloads.toLocaleString()} downloads</div>
                </div>
              </div>
              <div className="text-sm text-[var(--muted2)] mb-3">{m.note}</div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {m.quants.map((q) => (
                    <span key={q} className="text-xs border border-[var(--border)] px-2 py-0.5 text-[var(--muted2)] font-mono">{q}</span>
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

        <div className="mt-8 text-center text-[var(--muted)] text-sm">
          Know a model we missed? <Link href="/forum" className="text-cyan-400 hover:text-cyan-300">Post it in the forum</Link>.
        </div>
      </div>
    </main>
  );
}
