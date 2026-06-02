"use client";
import Link from "next/link";
import { useState } from "react";

// Replace DISCORD_INVITE with your actual Discord server invite code
// e.g. if your invite is discord.gg/abc123, set DISCORD_INVITE = "abc123"
const DISCORD_INVITE = "https://discord.gg/ZKcfv5YB";
const DISCORD_SERVER_ID = "1511081413452234922"; // For widget embed

const THREADS = [
  { title: "Best 2026 workstation build for 70B inference?", category: "Hardware", replies: 24, hot: true, time: "2h ago" },
  { title: "TensorRT vs ExLlamaV2 — real 70B throughput numbers", category: "Benchmarks", replies: 31, hot: true, time: "4h ago" },
  { title: "Dolphin vs abliterated Llama — which wins for creative tasks?", category: "Models", replies: 18, hot: true, time: "6h ago" },
  { title: "IQ3_XXS on Llama 3.1 70B — surprisingly usable?", category: "Quantization", replies: 17, hot: false, time: "8h ago" },
  { title: "Running uncensored models with Ollama — full setup guide", category: "Guide", replies: 42, hot: false, time: "12h ago" },
  { title: "Dual GPU PCIe bandwidth issues on X670E — solved", category: "Hardware", replies: 11, hot: false, time: "1d ago" },
  { title: "ExLlamaV2 vs llama.cpp on Mixtral 8x22B", category: "Benchmarks", replies: 19, hot: false, time: "1d ago" },
  { title: "MoE pipeline with Qwen coder + DeepSeek R1 — sharing my config", category: "Pipelines", replies: 28, hot: true, time: "3h ago" },
  { title: "FailSpy abliteration script — updated for Llama 3.2", category: "Models", replies: 33, hot: true, time: "5h ago" },
  { title: "Phi-3 Medium uncensored — 128K context for long docs", category: "Models", replies: 9, hot: false, time: "2d ago" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Hardware:     "text-orange-400 border-orange-400/30",
  Benchmarks:   "text-green-400 border-green-400/30",
  Models:       "text-cyan-400 border-cyan-400/30",
  Quantization: "text-yellow-400 border-yellow-400/30",
  Guide:        "text-blue-400 border-blue-400/30",
  Pipelines:    "text-purple-400 border-purple-400/30",
};

const CATEGORIES = [
  { name: "Hardware & Builds",    icon: "⚙", threads: 47, desc: "GPU recommendations, workstation builds, NVLink, PCIe configs" },
  { name: "Uncensored Models",    icon: "⬡", threads: 62, desc: "Abliterated variants, Dolphin, WizardLM, finding and running uncensored GGUFs" },
  { name: "Benchmarks",           icon: "◈", threads: 31, desc: "Share inference results, backend comparisons, profiling" },
  { name: "Quantization",         icon: "≡", threads: 28, desc: "GGUF formats, IQ quants, quality loss analysis, VRAM tradeoffs" },
  { name: "MoE Pipelines",        icon: "⟳", threads: 14, desc: "Router + expert + synthesizer configs, sharing pipelines" },
  { name: "Backends & Tools",     icon: "▸", threads: 22, desc: "Ollama, ExLlamaV2, llama.cpp, TensorRT-LLM setup and tips" },
  { name: "General Discussion",   icon: "◇", threads: 84, desc: "Anything local AI — projects, news, questions" },
];

export default function ForumPage() {
  const [filterCat, setFilterCat] = useState("All");

  const filtered = filterCat === "All"
    ? THREADS
    : THREADS.filter(t => t.category === filterCat ||
        CATEGORIES.find(c => c.name === filterCat)?.name.includes(t.category));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Community</div>
          <h1 className="text-4xl font-black font-mono mb-4">FORUM</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Community discussion on local AI, uncensored models, hardware, and inference. Join the Discord for real-time chat.
          </p>
        </div>

        {/* Discord CTA — primary action */}
        <div className="border border-[#5865F2]/40 bg-[#5865F2]/[0.06] p-6 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Discord logo */}
            <div className="w-12 h-12 bg-[#5865F2] flex items-center justify-center shrink-0">
              <svg width="24" height="18" viewBox="0 0 24 18" fill="white">
                <path d="M20.317 1.492a19.82 19.82 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 1.492a.07.07 0 00-.032.027C.533 6.093-.32 10.555.099 14.961a.08.08 0 00.031.055 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.442a.061.061 0 00-.031-.03z"/>
              </svg>
            </div>
            <div>
              <div className="font-mono font-black text-[var(--fg)] text-lg mb-1">Join the DefiledAI Discord</div>
              <div className="text-[var(--muted)] text-sm">Real-time discussion, model drops, benchmark sharing, and community support.</div>
            </div>
          </div>
          <a
            href={`https://discord.gg/${DISCORD_INVITE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[#5865F2] text-white font-black text-xs tracking-widest uppercase hover:bg-[#4752C4] transition-colors shrink-0 font-mono">
            JOIN DISCORD
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {[
            { label: "Members", value: "340+" },
            { label: "Threads", value: "307" },
            { label: "Posts", value: "2,100+" },
            { label: "Online", value: "Live" },
          ].map(s => (
            <div key={s.label} className="border border-[var(--border)] bg-[var(--card-bg)] p-4 text-center">
              <div className="text-2xl font-black font-mono text-cyan-400">{s.value}</div>
              <div className="text-xs text-[var(--muted)] uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Left — threads */}
          <div>
            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-5">
              {["All", ...CATEGORIES.map(c => c.name)].map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  className={`text-xs border px-3 py-1.5 font-mono transition-all ${
                    filterCat === cat
                      ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border2)]"
                  }`}>
                  {cat === "All" ? "All" : cat.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Thread list */}
            <div className="border border-[var(--border)] bg-[var(--card-bg)] divide-y divide-[var(--border)]/50">
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Recent Threads</span>
                <a href={`https://discord.gg/${DISCORD_INVITE}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono uppercase tracking-widest transition-colors">
                  + New Thread (Discord) →
                </a>
              </div>
              {filtered.map((t, i) => (
                <a key={i}
                  href={`https://discord.gg/${DISCORD_INVITE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-[var(--surface)] transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {t.hot && <span className="text-orange-400 text-xs">🔥</span>}
                      <span className="text-sm font-mono text-[var(--fg)] group-hover:text-cyan-100 transition-colors leading-snug">
                        {t.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs border px-1.5 py-0.5 font-mono ${CATEGORY_COLORS[t.category] ?? "text-zinc-400 border-zinc-700"}`}>
                        {t.category}
                      </span>
                      <span className="text-xs text-[var(--muted)] font-mono">{t.time}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono font-bold text-[var(--fg2)]">{t.replies}</div>
                    <div className="text-xs text-[var(--muted)]">replies</div>
                  </div>
                </a>
              ))}
              <div className="px-5 py-4 text-center">
                <a href={`https://discord.gg/${DISCORD_INVITE}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 uppercase tracking-widest transition-colors">
                  View all threads on Discord →
                </a>
              </div>
            </div>
          </div>

          {/* Right — categories + Discord widget */}
          <div className="space-y-5">
            {/* Categories */}
            <div className="border border-[var(--border)] bg-[var(--card-bg)]">
              <div className="px-5 py-3 border-b border-[var(--border)]">
                <span className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Categories</span>
              </div>
              <div className="divide-y divide-[var(--border)]/50">
                {CATEGORIES.map(cat => (
                  <a key={cat.name}
                    href={`https://discord.gg/${DISCORD_INVITE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--surface)] transition-colors group">
                    <span className="text-[var(--muted)] group-hover:text-cyan-400 transition-colors">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono font-bold text-[var(--fg)] group-hover:text-cyan-100 transition-colors truncate">{cat.name}</div>
                    </div>
                    <span className="text-xs text-[var(--muted)] font-mono shrink-0">{cat.threads}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Discord widget */}
            <div className="border border-[#5865F2]/30 bg-[#5865F2]/[0.04]">
              <div className="px-5 py-3 border-b border-[#5865F2]/20">
                <span className="text-xs uppercase tracking-widest text-[#5865F2] font-mono">Discord Server</span>
              </div>
              <div className="p-4">
                {DISCORD_SERVER_ID !== "YOUR_SERVER_ID" ? (
                  <iframe
                    src={`https://discord.com/widget?id=${DISCORD_SERVER_ID}&theme=dark`}
                    width="100%"
                    height="300"
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    style={{ border: "none" }}
                  />
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-[#5865F2] mx-auto mb-4 flex items-center justify-center">
                      <svg width="24" height="18" viewBox="0 0 24 18" fill="white">
                        <path d="M20.317 1.492a19.82 19.82 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 1.492a.07.07 0 00-.032.027C.533 6.093-.32 10.555.099 14.961a.08.08 0 00.031.055 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.442a.061.061 0 00-.031-.03z"/>
                      </svg>
                    </div>
                    <div className="font-mono font-bold text-[var(--fg)] mb-2">DefiledAI Community</div>
                    <div className="text-xs text-[var(--muted)] mb-4">Join for real-time discussion, model drops, and benchmark sharing.</div>
                    <a href={`https://discord.gg/${DISCORD_INVITE}`} target="_blank" rel="noopener noreferrer"
                      className="inline-block px-6 py-2.5 bg-[#5865F2] text-white text-xs font-black tracking-widest uppercase hover:bg-[#4752C4] transition-colors font-mono">
                      JOIN SERVER
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Community tools */}
            <div className="border border-[var(--border)] bg-[var(--card-bg)] p-5 space-y-2">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">Contribute</div>
              {[
                { href: "/tools/submit-benchmark", label: "Submit Benchmark", desc: "Share your inference results" },
                { href: "/tools/model-reviews", label: "Write a Review", desc: "Rate a model you've tested" },
                { href: "/leaderboard", label: "View Leaderboard", desc: "See community rankings" },
                { href: "/tools/hf-tracker", label: "HF Tracker", desc: "Latest model uploads" },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="flex items-center justify-between group hover:bg-[var(--surface)] -mx-2 px-2 py-2 transition-colors">
                  <div>
                    <div className="text-xs font-mono font-bold text-[var(--fg)] group-hover:text-cyan-400 transition-colors">{l.label}</div>
                    <div className="text-xs text-[var(--muted)]">{l.desc}</div>
                  </div>
                  <span className="text-[var(--muted)] text-xs ml-3">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
