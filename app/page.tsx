"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const benchmarks = [
  { model: "Llama 3.1 70B Abliterated", quant: "Q4_K_M", vram: "48GB", toks: "21.3", gpu: "2× RTX 3090" },
  { model: "Qwen 3 72B Uncensored",     quant: "Q4_K_M", vram: "48GB", toks: "19.4", gpu: "2× RTX 3090" },
  { model: "Mistral 7B Abliterated",    quant: "Q8_0",   vram: "8GB",  toks: "91.0", gpu: "RTX 4090"    },
  { model: "DeepSeek R1 70B Abliterated", quant: "Q4_K_M", vram: "48GB", toks: "19.2", gpu: "2× RTX 3090" },
];

const feed = [
  "Llama 3.1 70B abliteration retains 98.4% benchmark score",
  "New Qwen 2.5 72B uncensored GGUF posted to HuggingFace",
  "Mistral 7B abliterated outperforms base on creative tasks",
  "MoE Pipeline Builder now live — design local expert pipelines",
  "DeepSeek R1 abliteration guide now published",
  "ExLlamaV2 v0.2.4 improves throughput by ~12%",
];

const tools = [
  { href: "/tools/moe-builder",       label: "MoE Pipeline Builder", desc: "Design local expert pipelines",       tag: "NEW",  tagColor: "text-cyan-400 border-cyan-400/30" },
  { href: "/tools/model-compatibility",label: "Model Compatibility",  desc: "What fits on your GPU",              tag: "POPULAR", tagColor: "text-green-400 border-green-400/30" },
  { href: "/tools/speed-estimator",   label: "Speed Estimator",       desc: "Predict tok/s before downloading",   tag: "SHARE", tagColor: "text-purple-400 border-purple-400/30" },
  { href: "/tools/vram-calculator",   label: "VRAM Calculator",       desc: "Exact requirements + shareable link", tag: "SHARE", tagColor: "text-purple-400 border-purple-400/30" },
  { href: "/tools/hardware-advisor",  label: "Hardware Advisor",       desc: "Build recommendation wizard",        tag: "NEW",  tagColor: "text-cyan-400 border-cyan-400/30" },
  { href: "/tools/system-prompt-library", label: "Prompt Library",    desc: "20 production-ready system prompts", tag: "NEW",  tagColor: "text-cyan-400 border-cyan-400/30" },
];

const recentArticles = [
  { href: "/articles/abliteration-explained",       cat: "RESEARCH",      title: "Abliteration Explained",          sub: "How refusal removal works technically" },
  { href: "/articles/llama-3-1-70b-complete-guide", cat: "MODEL ANALYSIS", title: "Llama 3.1 70B Complete Guide",    sub: "48GB+ VRAM · Q4_K_M · ExLlamaV2" },
  { href: "/articles/best-abliterated-models-2026", cat: "LEADERBOARD",   title: "Best Abliterated Models 2026",    sub: "Community-tested rankings by use case" },
];

export default function Home() {
  const [feedIdx, setFeedIdx] = useState(0);
  const [updated] = useState(() => new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC");

  useEffect(() => {
    const t = setInterval(() => setFeedIdx(n => (n + 1) % feed.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)" }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-cyan-500/20 rounded-full px-4 py-1.5 text-xs text-cyan-400 tracking-widest uppercase mb-8 bg-cyan-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Open-Weight · Uncensored · Community-Tested
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6 font-mono">
            <span className="block text-[var(--fg)]">UNRESTRICTED</span>
            <span className="block" style={{
              background: "linear-gradient(90deg, #22d3ee, #818cf8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>LOCAL AI</span>
          </h1>

          <p className="text-[var(--muted2)] text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
            The research hub for open-weight, abliterated, and uncensored AI models.
            20+ tools, community benchmarks, tutorials, and weekly model drops.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/uncensored"
              className="px-8 py-3 bg-cyan-500 text-black font-bold tracking-widest uppercase text-sm hover:bg-cyan-400 transition-colors">
              UNCENSORED MODELS
            </Link>
            <Link href="/tools/moe-builder"
              className="px-8 py-3 border border-cyan-500/40 text-cyan-400 font-bold tracking-widest uppercase text-sm hover:border-cyan-400 hover:bg-cyan-500/5 transition-all">
              MOE BUILDER
            </Link>
            <Link href="/tools/vram-calculator"
              className="px-8 py-3 border border-zinc-700 text-[var(--muted2)] font-bold tracking-widest uppercase text-sm hover:border-zinc-500 transition-all">
              VRAM CALCULATOR
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE PROP STRIP */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]/40">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "⬡", title: "Uncensored DB",    desc: "Abliterated model database with quality scores" },
            { icon: "◈", title: "20+ Tools",         desc: "VRAM, speed, MoE builder, hardware advisor" },
            { icon: "▸", title: "Tutorials",          desc: "Beginner to expert — first install to MoE pipelines" },
            { icon: "≡", title: "Weekly Digest",      desc: "New model drops every week, auto-updated" },
          ].map(v => (
            <div key={v.title} className="flex gap-3">
              <span className="text-cyan-400 text-lg font-mono shrink-0 mt-0.5">{v.icon}</span>
              <div>
                <div className="font-mono font-bold text-[var(--fg)] text-sm mb-0.5">{v.title}</div>
                <div className="text-[var(--muted)] text-xs leading-relaxed">{v.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[var(--accent)] text-xs tracking-widest uppercase">Tools</span>
          <div className="flex-1 h-px bg-cyan-500/10" />
          <Link href="/tools" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] tracking-widest uppercase transition-colors">All 20+ tools →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {tools.map(t => (
            <Link key={t.href} href={t.href}
              className="group border border-[var(--border)] hover:border-cyan-500/40 p-5 transition-all hover:bg-cyan-500/[0.02]">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-mono font-bold text-[var(--fg)] group-hover:text-cyan-100 transition-colors text-sm">{t.label}</div>
                <span className={`text-xs border px-1.5 py-0.5 shrink-0 font-mono ${t.tagColor}`}>{t.tag}</span>
              </div>
              <div className="text-[var(--muted)] text-xs">{t.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* BENCHMARK TABLE */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="border border-[var(--border)]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <span className="text-sm font-mono tracking-widest uppercase">Abliterated Model Benchmarks</span>
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              UPDATED {updated}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase">
                  <th className="text-left px-6 py-3">Model</th>
                  <th className="text-left px-6 py-3">Quant</th>
                  <th className="text-left px-6 py-3">VRAM</th>
                  <th className="text-left px-6 py-3">GPU</th>
                  <th className="text-left px-6 py-3">Tok/s</th>
                </tr>
              </thead>
              <tbody>
                {benchmarks.map((b, i) => (
                  <tr key={i} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface)] transition-colors">
                    <td className="px-6 py-4 text-[var(--fg)]">{b.model}</td>
                    <td className="px-6 py-4 text-cyan-400">{b.quant}</td>
                    <td className="px-6 py-4 text-[var(--fg2)]">{b.vram}</td>
                    <td className="px-6 py-4 text-[var(--muted2)]">{b.gpu}</td>
                    <td className="px-6 py-4 text-green-400 font-bold">{b.toks}<span className="text-[var(--muted)] font-normal"> tok/s</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-[var(--border)] flex items-center justify-between">
            <Link href="/tools/submit-benchmark" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] tracking-widest uppercase transition-colors">Submit your results →</Link>
            <Link href="/leaderboard" className="text-xs text-cyan-400 hover:text-cyan-300 tracking-widest uppercase">Full leaderboard →</Link>
          </div>
        </div>
      </section>

      {/* LATEST RESEARCH */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[var(--accent)] text-xs tracking-widest uppercase">Latest Research</span>
          <div className="flex-1 h-px bg-cyan-500/10" />
          <Link href="/articles" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] tracking-widest uppercase transition-colors">All articles →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {recentArticles.map(a => (
            <Link key={a.href} href={a.href}
              className="group border border-[var(--border)] hover:border-cyan-500/40 p-6 transition-all hover:bg-cyan-500/[0.02]">
              <div className="text-cyan-400 text-xs tracking-widest uppercase mb-3">{a.cat}</div>
              <div className="text-[var(--fg)] font-semibold mb-2 group-hover:text-cyan-100 transition-colors font-mono">{a.title}</div>
              <div className="text-[var(--muted)] text-sm">{a.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* COMMUNITY FEED */}
      <section className="max-w-6xl mx-auto px-6 py-6 pb-20">
        <div className="border border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs tracking-widest uppercase text-[var(--muted)]">Community Feed</span>
            <span className="text-xs text-cyan-400 border border-cyan-500/20 px-2 py-0.5">LIVE</span>
          </div>
          <div className="h-8 overflow-hidden relative">
            {feed.map((item, i) => (
              <div key={i} className="absolute w-full transition-all duration-700 ease-in-out text-[var(--fg2)] text-sm font-mono"
                style={{ transform: `translateY(${(i - feedIdx) * 2}rem)`, opacity: i === feedIdx ? 1 : 0 }}>
                <span className="text-cyan-500 mr-2">›</span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border)] py-10 px-6 text-[var(--muted)] text-xs tracking-widest">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span>DEFILEDAI © {new Date().getFullYear()} — OPEN-WEIGHT AI RESEARCH</span>
          <div className="flex flex-wrap gap-6 justify-center">
            {[
              ["/uncensored","UNCENSORED"],
              ["/leaderboard","LEADERBOARD"],
              ["/tools","TOOLS"],
              ["/tutorials","TUTORIALS"],
              ["/benchmarks","BENCHMARKS"],
              ["/weekly","WEEKLY"],
              ["/about","ABOUT"],
              ["/feed.xml","RSS"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="hover:text-[var(--fg)] transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
