import Link from "next/link";

export const metadata = {
  title: "Forum — DefiledAI",
  description: "Community discussion on local AI, inference hardware, and model research.",
};

const categories = [
  {
    name: "Hardware & Builds",
    icon: "⚙",
    threads: 47,
    description: "GPU recommendations, workstation builds, NVLink, PCIe configs",
    latest: "Best 2026 workstation build for 70B inference?",
    latestDate: "2h ago",
    hot: true,
  },
  {
    name: "Benchmarks & Performance",
    icon: "◈",
    threads: 31,
    description: "Share your inference results, backend comparisons, profiling",
    latest: "TensorRT vs ExLlamaV2 — real-world 70B throughput comparison",
    latestDate: "4h ago",
    hot: true,
  },
  {
    name: "Quantization",
    icon: "≡",
    threads: 28,
    description: "GGUF formats, IQ quants, quality loss analysis, VRAM tradeoffs",
    latest: "IQ3_XXS on Llama 3.1 70B — surprisingly usable?",
    latestDate: "7h ago",
    hot: false,
  },
  {
    name: "Models & Fine-Tuning",
    icon: "◉",
    threads: 53,
    description: "Model releases, uncensored variants, LoRA, fine-tuning runs",
    latest: "Qwen 3 72B vs Llama 3.1 70B for code generation",
    latestDate: "12h ago",
    hot: false,
  },
  {
    name: "Inference Backends",
    icon: "▸",
    threads: 22,
    description: "llama.cpp, Ollama, ExLlamaV2, TensorRT-LLM, vLLM setup and tips",
    latest: "Fastest MoE deployment stack in 2026",
    latestDate: "1d ago",
    hot: false,
  },
  {
    name: "Multi-GPU Setup",
    icon: "⊞",
    threads: 19,
    description: "NVLink, tensor parallelism, PCIe bandwidth, P2P issues",
    latest: "Dual GPU PCIe bandwidth issues on X670E — solved",
    latestDate: "1d ago",
    hot: false,
  },
  {
    name: "General Discussion",
    icon: "◇",
    threads: 84,
    description: "Anything local AI — projects, news, questions, off-topic",
    latest: "Running 405B on a budget — anyone tried IQ1_M?",
    latestDate: "3h ago",
    hot: true,
  },
];

const recentPosts = [
  { title: "Best 2026 workstation build for 70B inference?", category: "Hardware & Builds", replies: 24, views: 412, author: "neuralrig", date: "2h ago", hot: true },
  { title: "TensorRT vs ExLlamaV2 — real-world 70B throughput", category: "Benchmarks", replies: 31, views: 788, author: "benchbot9k", date: "4h ago", hot: true },
  { title: "IQ3_XXS on Llama 3.1 70B — surprisingly usable?", category: "Quantization", replies: 17, views: 291, author: "quantfreak", date: "7h ago", hot: false },
  { title: "Running 405B on a budget with IQ1_M", category: "General", replies: 9, views: 203, author: "extremequant", date: "3h ago", hot: true },
  { title: "Qwen 3 72B vs Llama 3.1 70B for coding tasks", category: "Models", replies: 42, views: 934, author: "codegen_lab", date: "12h ago", hot: false },
  { title: "Dual GPU PCIe bandwidth issues on X670E — solved", category: "Multi-GPU", replies: 11, views: 178, author: "pcie_detective", date: "1d ago", hot: false },
  { title: "ExLlamaV2 vs llama.cpp on Mixtral 8x22B", category: "Backends", replies: 19, views: 356, author: "mixtral_guy", date: "1d ago", hot: false },
];

export default function ForumPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-cyan-400 text-xs uppercase tracking-widest mb-3">DefiledAI Community</div>
          <h1 className="text-4xl font-black font-mono mb-4">FORUM</h1>
          <p className="text-[var(--muted2)] max-w-2xl">
            Community discussion on local AI inference, hardware, models, and research.
            Sign up to post — reading is always free.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: "Threads", value: "284" },
            { label: "Posts", value: "1,847" },
            { label: "Members", value: "312" },
            { label: "Online", value: "14" },
          ].map((s) => (
            <div key={s.label} className="border border-[var(--border)] p-4 text-center">
              <div className="text-2xl font-black font-mono text-cyan-400">{s.value}</div>
              <div className="text-xs text-[var(--muted)] tracking-widest uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs tracking-widest uppercase text-[var(--muted2)]">Categories</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.name}
                className="border border-[var(--border)] hover:border-zinc-700 p-5 transition-all hover:bg-[var(--surface)]/20 cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-cyan-400 text-xl mt-0.5 font-mono">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-bold text-[var(--fg)]">{cat.name}</span>
                        {cat.hot && <span className="text-xs text-orange-400 border border-orange-400/20 px-1.5 py-0.5">HOT</span>}
                      </div>
                      <div className="text-[var(--muted)] text-xs mb-3">{cat.description}</div>
                      <div className="text-xs text-[var(--muted)]">
                        Latest: <span className="text-[var(--muted2)]">{cat.latest}</span>
                        <span className="ml-2 text-[var(--muted)]">— {cat.latestDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-mono font-bold text-[var(--fg2)]">{cat.threads}</div>
                    <div className="text-xs text-[var(--muted)]">threads</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent posts */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs tracking-widest uppercase text-[var(--muted2)]">Recent Posts</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <div className="border border-[var(--border)]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase">
                    <th className="text-left px-6 py-3">Thread</th>
                    <th className="text-left px-6 py-3">Category</th>
                    <th className="text-left px-6 py-3">Replies</th>
                    <th className="text-left px-6 py-3">Views</th>
                    <th className="text-left px-6 py-3">Author</th>
                    <th className="text-left px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((p, i) => (
                    <tr key={i} className="border-b border-zinc-900 hover:bg-[var(--surface)]/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {p.hot && <span className="text-orange-400 text-xs">🔥</span>}
                          <span className="text-zinc-200 hover:text-[var(--fg)] cursor-pointer transition-colors">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-cyan-400 text-xs">{p.category}</td>
                      <td className="px-6 py-4 text-[var(--muted2)]">{p.replies}</td>
                      <td className="px-6 py-4 text-[var(--muted)]">{p.views}</td>
                      <td className="px-6 py-4 text-[var(--muted2)]">{p.author}</td>
                      <td className="px-6 py-4 text-[var(--muted)]">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 text-black font-bold tracking-widest uppercase text-sm hover:bg-cyan-400 transition-colors">
            SIGN UP TO POST
          </Link>
        </div>
      </div>
    </main>
  );
}
