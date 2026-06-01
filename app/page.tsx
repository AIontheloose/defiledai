"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const STATS = [
  { value: "20+",  label: "Interactive Tools" },
  { value: "18",   label: "Uncensored Models" },
  { value: "3",    label: "Tutorial Levels" },
  { value: "24/7", label: "Pipeline Running" },
];

const BENCHMARKS = [
  { model: "Llama 3.1 70B Abliterated", quant: "Q4_K_M", vram: "40GB", toks: 21.3, gpu: "2× RTX 3090" },
  { model: "Qwen 2.5 72B Uncensored",   quant: "Q4_K_M", vram: "41GB", toks: 19.4, gpu: "2× RTX 3090" },
  { model: "Mistral 7B Abliterated",    quant: "Q8_0",   vram: "7GB",  toks: 91.0, gpu: "RTX 4090"    },
  { model: "DeepSeek R1 70B Abliterated", quant: "Q4_K_M", vram: "40GB", toks: 19.2, gpu: "2× RTX 3090" },
  { model: "Dolphin 2.9 Llama 3.1 8B", quant: "Q4_K_M", vram: "5.5GB", toks: 128, gpu: "RTX 4090"    },
];

const TOOLS = [
  { href: "/tools/moe-builder",        icon: "⟳", label: "MoE Pipeline Builder",  desc: "Design local expert pipelines from independent models",  tag: "FLAGSHIP", tc: "text-cyan-400 border-cyan-400/40 bg-cyan-400/5" },
  { href: "/tools/model-compatibility",icon: "✓", label: "Model Compatibility",    desc: "What runs on your GPU with estimated tok/s",             tag: "POPULAR",  tc: "text-green-400 border-green-400/40 bg-green-400/5" },
  { href: "/tools/hardware-advisor",   icon: "◎", label: "Hardware Advisor",       desc: "Specific GPU recommendations for your budget",           tag: "WIZARD",   tc: "text-purple-400 border-purple-400/40 bg-purple-400/5" },
  { href: "/tools/speed-estimator",    icon: "▶", label: "Speed Estimator",        desc: "Predict tok/s before downloading any model",             tag: "SHARE",    tc: "text-yellow-400 border-yellow-400/40 bg-yellow-400/5" },
  { href: "/tools/vram-calculator",    icon: "◈", label: "VRAM Calculator",        desc: "Exact requirements with KV cache breakdown",             tag: "SHARE",    tc: "text-blue-400 border-blue-400/40 bg-blue-400/5" },
  { href: "/tools/system-prompt-library",icon:"≡",label: "System Prompt Library",  desc: "20 production-ready prompts for local models",           tag: "NEW",      tc: "text-orange-400 border-orange-400/40 bg-orange-400/5" },
];

const ARTICLES = [
  { href: "/articles/abliteration-explained",        cat: "RESEARCH",       title: "Abliteration Explained",         sub: "How refusal removal works technically" },
  { href: "/articles/llama-3-1-70b-complete-guide",  cat: "MODEL ANALYSIS", title: "Llama 3.1 70B Complete Guide",   sub: "48GB VRAM · Q4_K_M · ExLlamaV2" },
  { href: "/articles/best-abliterated-models-2026",  cat: "LEADERBOARD",    title: "Best Abliterated Models 2026",   sub: "Community-tested rankings" },
];

const FEED = [
  "Llama 3.1 70B abliteration: 98.4% quality retention confirmed",
  "Qwen 2.5 72B uncensored GGUF — full quant pack on HuggingFace",
  "MoE Pipeline Builder launched — design local expert systems",
  "DeepSeek R1 70B abliterated: chain-of-thought fully intact",
  "ExLlamaV2 v0.2.4 — 12% throughput improvement on Ada GPUs",
  "Community leaderboard updated with 24 new benchmark submissions",
];

export default function Home() {
  const [feedIdx, setFeedIdx] = useState(0);
  const [updated] = useState(() =>
    new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  );

  useEffect(() => {
    const t = setInterval(() => setFeedIdx(n => (n + 1) % FEED.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.035) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34,211,238,0.035) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,211,238,0.06) 0%, transparent 70%)",
        }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 border border-cyan-500/25 rounded-full px-5 py-2 text-xs text-cyan-400 tracking-widest uppercase mb-10 bg-cyan-500/[0.06] backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Open-Weight · Uncensored · Community-Tested
          </div>

          {/* Headline */}
          <h1 className="font-black font-mono leading-[0.9] mb-8">
            <span className="block text-[clamp(3.5rem,10vw,7rem)] text-[var(--fg)] tracking-tight">
              UNRESTRICTED
            </span>
            <span className="block text-[clamp(3.5rem,10vw,7rem)] tracking-tight gradient-text glow-text">
              LOCAL AI
            </span>
          </h1>

          {/* Sub */}
          <p className="text-[var(--muted2)] text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            The research hub for open-weight, abliterated, and uncensored AI models.
          </p>
          <p className="text-[var(--muted)] text-sm max-w-xl mx-auto mb-10">
            Run powerful AI locally — full control over your hardware, your data, and your models.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 justify-center mb-14">
            <Link href="/uncensored"
              className="px-8 py-3.5 bg-cyan-500 text-black font-black tracking-widest uppercase text-xs hover:bg-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
              UNCENSORED MODELS
            </Link>
            <Link href="/tools/moe-builder"
              className="px-8 py-3.5 border border-cyan-500/40 text-cyan-400 font-bold tracking-widest uppercase text-xs hover:border-cyan-400 hover:bg-cyan-500/5 transition-all">
              MOE BUILDER
            </Link>
            <Link href="/tutorials"
              className="px-8 py-3.5 border border-[var(--border2)] text-[var(--muted2)] font-bold tracking-widest uppercase text-xs hover:border-[var(--muted)] hover:text-[var(--fg)] transition-all">
              TUTORIALS
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)] max-w-2xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="bg-[var(--card-bg)] px-6 py-4 text-center">
                <div className="text-2xl font-black font-mono text-cyan-400 mb-0.5">{s.value}</div>
                <div className="text-xs text-[var(--muted)] uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE FEED TICKER ── */}
      <div className="border-y border-[var(--border)] bg-[var(--surface)] py-3 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-4">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest shrink-0 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </span>
          <div className="flex-1 overflow-hidden h-5 relative">
            {FEED.map((item, i) => (
              <div key={i}
                className="absolute w-full transition-all duration-700 ease-in-out text-xs font-mono text-[var(--muted2)]"
                style={{ transform: `translateY(${(i - feedIdx) * 1.25}rem)`, opacity: i === feedIdx ? 1 : 0 }}>
                <span className="text-cyan-500/60 mr-2">›</span>{item}
              </div>
            ))}
          </div>
          <Link href="/weekly" className="text-xs font-mono text-[var(--muted)] hover:text-[var(--accent)] transition-colors shrink-0 uppercase tracking-widest">
            Weekly digest →
          </Link>
        </div>
      </div>

      {/* ── TOOLS ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="section-label mb-2">Tools</div>
            <h2 className="text-2xl font-black font-mono text-[var(--fg)]">20+ INTERACTIVE TOOLS</h2>
          </div>
          <Link href="/tools" className="text-xs font-mono text-[var(--muted)] hover:text-[var(--accent)] transition-colors uppercase tracking-widest">
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOOLS.map(t => (
            <Link key={t.href} href={t.href}
              className="group block bg-[var(--card-bg)] border border-[var(--border)] p-5 transition-all duration-200 hover:border-[var(--border2)] hover:bg-[var(--surface)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-2xl text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">{t.icon}</span>
                <span className={`text-xs border px-2 py-0.5 font-mono shrink-0 ${t.tc}`}>{t.tag}</span>
              </div>
              <div className="font-mono font-black text-[var(--fg)] mb-1.5 group-hover:text-cyan-100 transition-colors">{t.label}</div>
              <div className="text-xs text-[var(--muted)] leading-relaxed">{t.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BENCHMARKS ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="border border-[var(--border)] bg-[var(--card-bg)]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <div>
              <div className="section-label mb-1">Community Data</div>
              <div className="font-mono font-black text-[var(--fg)]">ABLITERATED MODEL BENCHMARKS</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Updated {updated}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Quant</th>
                  <th>VRAM</th>
                  <th>GPU</th>
                  <th>Tok/s</th>
                </tr>
              </thead>
              <tbody>
                {BENCHMARKS.map((b, i) => (
                  <tr key={i}>
                    <td className="text-[var(--fg)] font-bold">{b.model}</td>
                    <td className="text-cyan-400">{b.quant}</td>
                    <td className="text-[var(--fg2)]">{b.vram}</td>
                    <td className="text-[var(--muted2)]">{b.gpu}</td>
                    <td>
                      <span className="text-green-400 font-black">{b.toks}</span>
                      <span className="text-[var(--muted)] text-xs ml-1">tok/s</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border)]">
            <Link href="/tools/submit-benchmark"
              className="text-xs font-mono text-[var(--muted)] hover:text-[var(--accent)] transition-colors uppercase tracking-widest">
              + Submit your results
            </Link>
            <Link href="/leaderboard"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest">
              Full leaderboard →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-label mb-2">Research</div>
            <h2 className="text-2xl font-black font-mono text-[var(--fg)]">LATEST ARTICLES</h2>
          </div>
          <Link href="/articles" className="text-xs font-mono text-[var(--muted)] hover:text-[var(--accent)] transition-colors uppercase tracking-widest">
            All articles →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {ARTICLES.map(a => (
            <Link key={a.href} href={a.href}
              className="group block bg-[var(--card-bg)] border border-[var(--border)] p-6 transition-all duration-200 hover:border-[var(--border2)] hover:bg-[var(--surface)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
              <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-3 border border-cyan-500/20 bg-cyan-500/5 px-2 py-1 inline-block">
                {a.cat}
              </div>
              <div className="font-mono font-black text-[var(--fg)] mb-2 group-hover:text-cyan-100 transition-colors leading-snug">
                {a.title}
              </div>
              <div className="text-xs text-[var(--muted)] leading-relaxed">{a.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { href: "/uncensored", icon: "⬡", title: "Uncensored Database", desc: "18 abliterated and Dolphin models with quality scores, HF links, and community ratings", accent: "cyan" },
            { href: "/leaderboard", icon: "◈", title: "Community Leaderboard", desc: "User-voted model rankings across coding, reasoning, creative, and instruction categories", accent: "purple" },
            { href: "/tutorials",   icon: "▸", title: "Tutorials", desc: "From first Ollama install to building MoE pipelines — beginner, intermediate, and expert tracks", accent: "green" },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="group block bg-[var(--card-bg)] border border-[var(--border)] p-6 transition-all duration-200 hover:border-[var(--border2)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
              <div className={`text-2xl mb-3 transition-colors ${l.accent === "cyan" ? "text-cyan-400" : l.accent === "purple" ? "text-purple-400" : "text-green-400"}`}>
                {l.icon}
              </div>
              <div className="font-mono font-black text-[var(--fg)] mb-2 group-hover:text-cyan-100 transition-colors">{l.title}</div>
              <div className="text-xs text-[var(--muted)] leading-relaxed">{l.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[var(--border)] bg-[var(--card-bg)]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="font-black font-mono text-lg mb-1">
                <span className="text-[var(--fg)]">Defiled</span>
                <span className="text-cyan-400">AI</span>
              </div>
              <div className="text-xs text-[var(--muted)] max-w-xs leading-relaxed">
                Open-weight AI research hub. Uncensored model database, community benchmarks, and local inference tools.
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-3 text-xs font-mono">
              {[
                { heading: "Models", links: [["/uncensored","Uncensored"],["/leaderboard","Leaderboard"],["/models","Database"],["/tools/hf-tracker","HF Tracker"]] },
                { heading: "Tools", links: [["/tools","All Tools"],["/tools/moe-builder","MoE Builder"],["/tools/vram-calculator","VRAM Calc"],["/tools/speed-estimator","Speed Est."]] },
                { heading: "Learn", links: [["/tutorials","Tutorials"],["/articles","Articles"],["/weekly","Weekly"],["/quantization","Quant Guide"]] },
                { heading: "Community", links: [["/benchmarks","Benchmarks"],["/forum","Forum"],["/about","About"],["/feed.xml","RSS"]] },
              ].map(col => (
                <div key={col.heading}>
                  <div className="text-[var(--muted)] uppercase tracking-widest mb-3">{col.heading}</div>
                  {col.links.map(([href, label]) => (
                    <Link key={href} href={href} className="block text-[var(--muted2)] hover:text-[var(--accent)] transition-colors mb-2">
                      {label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[var(--border)] mt-8 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[var(--muted)]">
            <span>© {new Date().getFullYear()} DefiledAI — Open-Weight AI Research</span>
            <span>Updated hourly by automated pipeline</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
