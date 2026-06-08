"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ── YOUR DISCORD CONFIG ──────────────────────────────────────
// Server ID
const SERVER_ID = "1511081413452234922";

// Invite code (after discord.gg/)
const INVITE = "https://discord.gg/ZKcfv5YBE";

// Channel IDs — get these by right-clicking each channel in Discord
// (Developer Mode must be enabled: User Settings → Advanced → Developer Mode)
const CHANNELS: Record<string, string> = {
  general:        "CHANNEL_ID_GENERAL",
  announcements:  "CHANNEL_ID_ANNOUNCEMENTS",
  hardware:       "CHANNEL_ID_HARDWARE",
  models:         "CHANNEL_ID_MODELS",
  benchmarks:     "CHANNEL_ID_BENCHMARKS",
  quantization:   "CHANNEL_ID_QUANTIZATION",
  pipelines:      "CHANNEL_ID_PIPELINES",
  backends:       "CHANNEL_ID_BACKENDS",
  showandtell:    "CHANNEL_ID_SHOWANDTELL",
};

// Helper — links to specific channel if ID is set, otherwise server invite
function channelUrl(key: string) {
  const id = CHANNELS[key];
  if (!id || id.startsWith("CHANNEL_ID")) return `https://discord.gg/${INVITE}`;
  return `https://discord.com/channels/${SERVER_ID}/${id}`;
}
// ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "hardware",      icon: "⚙", label: "Hardware & Builds",    desc: "GPU recommendations, NVLink, workstation builds", color: "text-orange-400 border-orange-400/20 bg-orange-400/5" },
  { key: "models",        icon: "⬡", label: "Uncensored Models",     desc: "Abliterated variants, Dolphin, finding GGUFs",    color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5" },
  { key: "benchmarks",    icon: "◈", label: "Benchmarks",            desc: "Share inference results, backend comparisons",     color: "text-green-400 border-green-400/20 bg-green-400/5" },
  { key: "quantization",  icon: "≡", label: "Quantization",          desc: "GGUF formats, IQ quants, quality tradeoffs",      color: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5" },
  { key: "pipelines",     icon: "⟳", label: "MoE Pipelines",         desc: "Router + expert configs, sharing setups",         color: "text-purple-400 border-purple-400/20 bg-purple-400/5" },
  { key: "backends",      icon: "▸", label: "Backends & Tools",      desc: "Ollama, ExLlamaV2, llama.cpp, TensorRT setup",    color: "text-blue-400 border-blue-400/20 bg-blue-400/5" },
  { key: "showandtell",   icon: "◎", label: "Show & Tell",           desc: "Share your builds, configs, and projects",        color: "text-pink-400 border-pink-400/20 bg-pink-400/5" },
  { key: "general",       icon: "◇", label: "General Discussion",    desc: "Anything local AI — news, questions, off-topic",  color: "text-zinc-400 border-zinc-400/20 bg-zinc-400/5" },
];

const CONTRIBUTE = [
  { href: "/tools/submit-benchmark", label: "Submit Benchmark",  desc: "Share your inference results" },
  { href: "/tools/model-reviews",    label: "Write a Review",    desc: "Rate a model you've tested" },
  { href: "/leaderboard",            label: "View Leaderboard",  desc: "Community model rankings" },
  { href: "/tools/hf-tracker",       label: "HF Tracker",        desc: "Latest model uploads" },
];

export default function ForumPage() {
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setWidgetLoaded(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Community</div>
          <h1 className="text-4xl font-black font-mono mb-3">COMMUNITY</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Discussion, benchmarks, model drops, and build advice. Powered by Discord — click any channel to jump straight in.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">

          {/* ── Left: categories ── */}
          <div className="space-y-6">

            {/* Channel grid */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono mb-4">Channels</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {CATEGORIES.map(cat => (
                  <a
                    key={cat.key}
                    href={channelUrl(cat.key)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setActiveCategory(cat.key)}
                    onMouseLeave={() => setActiveCategory(null)}
                    className={`group block border p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 ${
                      activeCategory === cat.key ? cat.color : "border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--border2)]"
                    }`}>
                    <div className="flex items-start gap-3">
                      <span className={`text-xl shrink-0 transition-colors ${activeCategory === cat.key ? cat.color.split(" ")[0] : "text-[var(--muted)] group-hover:text-[var(--accent)]"}`}>
                        {cat.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-sm text-[var(--fg)] group-hover:text-cyan-100 transition-colors mb-0.5">
                          {cat.label}
                        </div>
                        <div className="text-xs text-[var(--muted)] leading-relaxed">{cat.desc}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-1 text-xs font-mono text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                      Open in Discord →
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono mb-4">Quick Links</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { href: `https://discord.gg/${INVITE}`, label: "Join the Server", external: true, accent: true },
                  { href: channelUrl("announcements"), label: "Announcements", external: true, accent: false },
                  { href: channelUrl("general"), label: "#general chat", external: true, accent: false },
                  { href: "/weekly", label: "Weekly Digest", external: false, accent: false },
                ].map(l => (
                  l.external ? (
                    <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center justify-between px-4 py-3 border font-mono text-sm transition-all hover:-translate-y-0.5 ${
                        l.accent
                          ? "border-[#5865F2]/40 bg-[#5865F2]/[0.06] text-[#7289DA] hover:bg-[#5865F2]/10"
                          : "border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted2)] hover:border-[var(--border2)] hover:text-[var(--fg)]"
                      }`}>
                      <span>{l.label}</span>
                      <span className="text-xs opacity-60">↗</span>
                    </a>
                  ) : (
                    <Link key={l.label} href={l.href}
                      className="flex items-center justify-between px-4 py-3 border border-[var(--border)] bg-[var(--card-bg)] font-mono text-sm text-[var(--muted2)] hover:border-[var(--border2)] hover:text-[var(--fg)] transition-all hover:-translate-y-0.5">
                      <span>{l.label}</span>
                      <span className="text-xs opacity-60">→</span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Contribute */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono mb-4">Contribute to ForsakenAI</div>
              <div className="border border-[var(--border)] bg-[var(--card-bg)] divide-y divide-[var(--border)]/50">
                {CONTRIBUTE.map(l => (
                  <Link key={l.href} href={l.href}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--surface)] transition-colors group">
                    <div>
                      <div className="text-sm font-mono font-bold text-[var(--fg)] group-hover:text-cyan-400 transition-colors">{l.label}</div>
                      <div className="text-xs text-[var(--muted)]">{l.desc}</div>
                    </div>
                    <span className="text-[var(--muted)] text-xs ml-4 group-hover:text-cyan-400 transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Discord widget ── */}
          <div className="space-y-4">

            {/* Widget */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono mb-4">Live Server</div>
              <div className="border border-[#5865F2]/30 bg-[#5865F2]/[0.04] overflow-hidden">
                {/* Widget header */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-[#5865F2]/20">
                  <div className="w-8 h-8 bg-[#5865F2] flex items-center justify-center shrink-0">
                    <svg width="18" height="14" viewBox="0 0 24 18" fill="white">
                      <path d="M20.317 1.492a19.82 19.82 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 1.492a.07.07 0 00-.032.027C.533 6.093-.32 10.555.099 14.961a.08.08 0 00.031.055 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.442a.061.061 0 00-.031-.03z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-mono font-black text-[var(--fg)] text-sm">ForsakenAI</div>
                    <div className="text-xs text-[var(--muted)]">Local AI Community</div>
                  </div>
                </div>

                {/* The actual widget */}
                <div className={`transition-opacity duration-500 ${widgetLoaded ? "opacity-100" : "opacity-0"}`}>
                  <iframe
                    src={`https://discord.com/widget?id=${SERVER_ID}&theme=dark`}
                    width="100%"
                    height="400"
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    style={{ border: "none", display: "block" }}
                    onLoad={() => setWidgetLoaded(true)}
                  />
                </div>

                {/* Join CTA below widget */}
                <div className="border-t border-[#5865F2]/20 p-4">
                  <a
                    href={`https://discord.gg/${INVITE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-[#5865F2] text-white text-xs font-black tracking-widest uppercase text-center hover:bg-[#4752C4] transition-colors font-mono">
                    JOIN DISCORD
                  </a>
                </div>
              </div>
            </div>

            {/* RSS + weekly */}
            <div className="border border-[var(--border)] bg-[var(--card-bg)] p-5 space-y-3">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono mb-2">Stay Updated</div>
              <Link href="/weekly"
                className="flex items-center justify-between group hover:bg-[var(--surface)] -mx-2 px-2 py-2 transition-colors">
                <div>
                  <div className="text-sm font-mono font-bold text-[var(--fg)] group-hover:text-cyan-400 transition-colors">Weekly Digest</div>
                  <div className="text-xs text-[var(--muted)]">New models, benchmarks, and tool updates</div>
                </div>
                <span className="text-[var(--muted)] text-xs ml-3 group-hover:text-cyan-400 transition-colors">→</span>
              </Link>
              <Link href="/signup"
                className="flex items-center justify-between group hover:bg-[var(--surface)] -mx-2 px-2 py-2 transition-colors">
                <div>
                  <div className="text-sm font-mono font-bold text-[var(--fg)] group-hover:text-cyan-400 transition-colors">Email Updates</div>
                  <div className="text-xs text-[var(--muted)]">Get notified about model drops</div>
                </div>
                <span className="text-[var(--muted)] text-xs ml-3 group-hover:text-cyan-400 transition-colors">→</span>
              </Link>
              <a href="/feed.xml"
                className="flex items-center justify-between group hover:bg-[var(--surface)] -mx-2 px-2 py-2 transition-colors">
                <div>
                  <div className="text-sm font-mono font-bold text-[var(--fg)] group-hover:text-cyan-400 transition-colors">RSS Feed</div>
                  <div className="text-xs text-[var(--muted)]">Subscribe to new articles</div>
                </div>
                <span className="text-[var(--muted)] text-xs ml-3 group-hover:text-cyan-400 transition-colors">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
