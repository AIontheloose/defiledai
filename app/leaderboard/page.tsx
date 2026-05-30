"use client";
import { useState } from "react";
import Link from "next/link";

const LEADERBOARD = [
  {
    rank: 1, model: "Llama 3.1 70B Abliterated", params: "70B", method: "Abliteration",
    scores: { coding: 91, reasoning: 94, creative: 96, instruction: 95 },
    hfLink: "https://huggingface.co/models?search=llama+3.1+70b+abliterated",
    votes: 312, quant: "Q4_K_M", vram: "40GB", badge: "TOP PICK",
  },
  {
    rank: 2, model: "DeepSeek R1 70B Abliterated", params: "70B", method: "Abliteration",
    scores: { coding: 94, reasoning: 97, creative: 88, instruction: 91 },
    hfLink: "https://huggingface.co/models?search=deepseek+r1+70b+abliterated",
    votes: 241, quant: "Q4_K_M", vram: "40GB", badge: "BEST REASONING",
  },
  {
    rank: 3, model: "Qwen 3 72B Uncensored", params: "72B", method: "Abliteration",
    scores: { coding: 96, reasoning: 92, creative: 89, instruction: 93 },
    hfLink: "https://huggingface.co/models?search=qwen+72b+uncensored",
    votes: 198, quant: "Q4_K_M", vram: "40GB", badge: "BEST CODE",
  },
  {
    rank: 4, model: "Mistral 7B Abliterated", params: "7B", method: "Abliteration",
    scores: { coding: 78, reasoning: 74, creative: 84, instruction: 83 },
    hfLink: "https://huggingface.co/models?search=mistral+7b+abliterated",
    votes: 287, quant: "Q8_0", vram: "8GB", badge: "BEST 7B",
  },
  {
    rank: 5, model: "Llama 3.1 8B Abliterated", params: "8B", method: "Abliteration",
    scores: { coding: 79, reasoning: 76, creative: 82, instruction: 84 },
    hfLink: "https://huggingface.co/models?search=llama+3.1+8b+abliterated",
    votes: 334, quant: "Q4_K_M", vram: "6GB", badge: "MOST POPULAR",
  },
  {
    rank: 6, model: "Gemma 2 27B Abliterated", params: "27B", method: "Abliteration",
    scores: { coding: 84, reasoning: 86, creative: 87, instruction: 88 },
    hfLink: "https://huggingface.co/models?search=gemma+2+27b+abliterated",
    votes: 112, quant: "Q4_K_M", vram: "16GB", badge: "",
  },
  {
    rank: 7, model: "Mixtral 8x7B Uncensored", params: "56B MoE", method: "Fine-tune",
    scores: { coding: 82, reasoning: 80, creative: 86, instruction: 85 },
    hfLink: "https://huggingface.co/models?search=mixtral+uncensored",
    votes: 156, quant: "Q4_K_M", vram: "24GB", badge: "",
  },
  {
    rank: 8, model: "Phi-3 Medium Uncensored", params: "14B", method: "Fine-tune",
    scores: { coding: 83, reasoning: 79, creative: 77, instruction: 82 },
    hfLink: "https://huggingface.co/models?search=phi+3+uncensored",
    votes: 89, quant: "Q4_K_M", vram: "10GB", badge: "",
  },
];

const CATEGORIES = ["overall", "coding", "reasoning", "creative", "instruction"] as const;
type Category = typeof CATEGORIES[number];

const BADGE_COLORS: Record<string, string> = {
  "TOP PICK": "bg-cyan-500 text-black",
  "BEST REASONING": "bg-purple-500 text-white",
  "BEST CODE": "bg-blue-500 text-white",
  "BEST 7B": "bg-green-500 text-black",
  "MOST POPULAR": "bg-orange-500 text-black",
};

function overall(m: typeof LEADERBOARD[0]) {
  return Math.round((m.scores.coding + m.scores.reasoning + m.scores.creative + m.scores.instruction) / 4);
}

function ScoreBar({ value }: { value: number }) {
  const color = value >= 90 ? "#22d3ee" : value >= 80 ? "#86efac" : value >= 70 ? "#fbbf24" : "#f87171";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-[var(--surface)] h-1.5">
        <div style={{ width: `${value}%`, background: color, height: "100%", transition: "width 0.3s" }} />
      </div>
      <span className="text-xs w-6 text-right font-mono" style={{ color }}>{value}</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const [category, setCategory] = useState<Category>("overall");
  const [method, setMethod] = useState("All");

  const filtered = LEADERBOARD
    .filter((m) => method === "All" || m.method === method)
    .sort((a, b) => {
      const aScore = category === "overall" ? overall(a) : a.scores[category];
      const bScore = category === "overall" ? overall(b) : b.scores[category];
      return bScore - aScore;
    })
    .map((m, i) => ({ ...m, displayRank: i + 1 }));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Community</div>
          <h1 className="text-4xl font-black font-mono mb-4">COMMUNITY LEADERBOARD</h1>
          <p className="text-[var(--muted)] max-w-2xl leading-relaxed">
            Community-voted rankings for abliterated and uncensored models across four categories.
            Scores reflect real user testing, not synthetic benchmarks.
          </p>
        </div>

        {/* Top 3 podium */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {LEADERBOARD.slice(0, 3).map((m, i) => (
            <div key={m.model}
              className={`border p-6 relative ${i === 0 ? "border-cyan-500/40 bg-cyan-500/[0.03]" : "border-[var(--border)]"}`}>
              <div className="absolute top-4 right-4 text-3xl font-black font-mono text-[var(--border)]">
                #{i + 1}
              </div>
              {m.badge && (
                <div className={`inline-block text-xs font-bold px-2 py-0.5 mb-3 ${BADGE_COLORS[m.badge] ?? "bg-zinc-700 text-white"}`}>
                  {m.badge}
                </div>
              )}
              <div className="font-mono font-black text-[var(--fg)] mb-1 pr-8">{m.model}</div>
              <div className="text-xs text-[var(--muted)] mb-4">{m.params} · {m.vram} VRAM</div>
              <div className="text-3xl font-black font-mono text-cyan-400 mb-1">{overall(m)}</div>
              <div className="text-xs text-[var(--muted)] mb-4">Overall Score</div>
              <div className="text-xs text-[var(--muted)]">{m.votes} community votes</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 text-xs tracking-widest uppercase font-mono transition-all ${
                  category === c
                    ? "bg-cyan-500 text-black font-bold"
                    : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-zinc-600"
                }`}>
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <select value={method} onChange={(e) => setMethod(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] transition-colors">
              <option>All</option>
              <option>Abliteration</option>
              <option>Fine-tune</option>
            </select>
          </div>
        </div>

        {/* Full table */}
        <div className="border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase">
                  <th className="text-left px-5 py-3">Rank</th>
                  <th className="text-left px-5 py-3">Model</th>
                  <th className="text-left px-5 py-3">Method</th>
                  <th className="text-left px-5 py-3">VRAM</th>
                  <th className="text-left px-5 py-3">Coding</th>
                  <th className="text-left px-5 py-3">Reasoning</th>
                  <th className="text-left px-5 py-3">Creative</th>
                  <th className="text-left px-5 py-3">Instruction</th>
                  <th className="text-left px-5 py-3">Overall</th>
                  <th className="text-left px-5 py-3">HF</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.model}
                    className={`border-b border-[var(--border)]/50 hover:bg-[var(--surface)] transition-colors ${m.displayRank === 1 ? "bg-cyan-500/[0.02]" : ""}`}>
                    <td className="px-5 py-4">
                      <span className={`font-black text-lg ${m.displayRank === 1 ? "text-cyan-400" : m.displayRank <= 3 ? "text-[var(--fg)]" : "text-[var(--muted)]"}`}>
                        #{m.displayRank}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[var(--fg)] font-bold">{m.model}</div>
                      {m.badge && (
                        <div className={`inline-block text-xs px-1.5 py-0.5 mt-1 ${BADGE_COLORS[m.badge] ?? ""}`}>
                          {m.badge}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={m.method === "Abliteration" ? "text-cyan-400" : "text-purple-400"}>
                        {m.method}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[var(--muted2)]">{m.vram}</td>
                    <td className="px-5 py-4"><ScoreBar value={m.scores.coding} /></td>
                    <td className="px-5 py-4"><ScoreBar value={m.scores.reasoning} /></td>
                    <td className="px-5 py-4"><ScoreBar value={m.scores.creative} /></td>
                    <td className="px-5 py-4"><ScoreBar value={m.scores.instruction} /></td>
                    <td className="px-5 py-4">
                      <span className="text-cyan-400 font-black text-lg">{overall(m)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <a href={m.hfLink} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 px-2 py-1 hover:border-cyan-400 transition-all">
                        HF ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-between items-center">
          <p className="text-xs text-[var(--muted)] font-mono">
            Scores are community-aggregated from real user testing. Higher = better. Max 100.
          </p>
          <Link href="/tools/submit-benchmark"
            className="text-xs font-bold tracking-widest uppercase px-6 py-2.5 bg-cyan-500 text-black hover:bg-cyan-400 transition-colors">
            SUBMIT YOUR RESULTS
          </Link>
        </div>
      </div>
    </main>
  );
}
