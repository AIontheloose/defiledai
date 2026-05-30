"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const benchmarks = [
  { model: "Llama 3.1 70B", quant: "Q4_K_M", vram: "48GB", toks: "21.3", gpu: "2× RTX 3090" },
  { model: "Qwen 3 72B", quant: "Q5_K_M", vram: "64GB", toks: "18.0", gpu: "2× RTX 3090" },
  { model: "DeepSeek V3", quant: "MoE Q4", vram: "Multi-GPU", toks: "39.0", gpu: "4× A100" },
  { model: "Mixtral 8x22B", quant: "Q4_K_M", vram: "48GB", toks: "24.7", gpu: "2× RTX 3090" },
];

const feed = [
  "RTX 4090 remains strongest single-GPU inference card",
  "3090 resale market stabilizing after AI demand spike",
  "TensorRT-LLM outperforming llama.cpp on 70B workloads",
  "KV cache optimization reducing long-context VRAM usage",
  "ExLlamaV2 v0.2.4 improves Q4_K_M throughput by ~12%",
  "AMD ROCm 6.1 closes gap with CUDA for inference tasks",
];

const recentArticles = [
  { href: "/articles/llama-3-1-70b-complete-guide", cat: "MODEL ANALYSIS", title: "Llama 3.1 70B Complete Guide", sub: "48GB+ VRAM · Q4_K_M · ExLlamaV2" },
  { href: "/articles/q4-km-vs-iq3m-analysis", cat: "QUANTIZATION", title: "Q4_K_M vs IQ3_M Analysis", sub: "Perplexity scores & real-world quality" },
  { href: "/articles/dual-3090-nvlink-70b-workstation", cat: "HARDWARE", title: "Dual 3090 NVLink Workstation", sub: "70B inference build guide" },
];

const tools = [
  { href: "/tools/vram-calculator", label: "VRAM Calculator", desc: "Calculate exact VRAM needs for any model + quant", tag: "TOOL" },
  { href: "/tools/submit-benchmark", label: "Submit Benchmark", desc: "Share your inference results with the community", tag: "COMMUNITY" },
];

export default function Home() {
  const [feedIdx, setFeedIdx] = useState(0);
  const [updated] = useState(() => new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC");

  useEffect(() => {
    const t = setInterval(() => setFeedIdx((n) => (n + 1) % feed.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)" }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-cyan-500/20 rounded-full px-4 py-1.5 text-xs text-cyan-400 tracking-widest uppercase mb-8 bg-cyan-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Node Status: Active
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6 font-mono">
            <span className="block text-[var(--fg)]">LOCAL AI</span>
            <span className="block" style={{
              background: "linear-gradient(90deg, #22d3ee, #818cf8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>INTELLIGENCE</span>
          </h1>
          <p className="text-[var(--muted2)] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Benchmarking, quantization analysis, open-weight model research,
            inference infrastructure, and local AI systems engineering.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/articles"
              className="px-8 py-3 bg-cyan-500 text-black font-bold tracking-widest uppercase text-sm hover:bg-cyan-400 transition-colors">
              RESEARCH ARCHIVE
            </Link>
            <Link href="/benchmarks"
              className="px-8 py-3 border border-cyan-500/40 text-cyan-400 font-bold tracking-widest uppercase text-sm hover:border-cyan-400 hover:bg-cyan-500/5 transition-all">
              BENCHMARKS
            </Link>
            <Link href="/tools/vram-calculator"
              className="px-8 py-3 border border-zinc-700 text-[var(--muted2)] font-bold tracking-widest uppercase text-sm hover:border-zinc-500 hover:text-[var(--fg)] transition-all">
              VRAM CALCULATOR
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST RESEARCH */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[var(--accent)] text-xs tracking-widest uppercase">Latest Research</span>
          <div className="flex-1 h-px bg-cyan-500/10" />
          <Link href="/articles" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] tracking-widest uppercase transition-colors">All Articles →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {recentArticles.map((a) => (
            <Link key={a.href} href={a.href}
              className="group border border-[var(--border)] hover:border-cyan-500/40 p-6 transition-all hover:bg-cyan-500/[0.02]">
              <div className="text-cyan-400 text-xs tracking-widest uppercase mb-3">{a.cat}</div>
              <div className="text-[var(--fg)] font-semibold mb-2 group-hover:text-cyan-100 transition-colors">{a.title}</div>
              <div className="text-[var(--muted)] text-sm">{a.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section className="max-w-6xl mx-auto px-6 py-4 mb-10">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[var(--accent)] text-xs tracking-widest uppercase">Tools</span>
          <div className="flex-1 h-px bg-cyan-500/10" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {tools.map((t) => (
            <Link key={t.href} href={t.href}
              className="group border border-[var(--border)] hover:border-cyan-500/40 p-6 transition-all hover:bg-cyan-500/[0.02] flex items-center justify-between">
              <div>
                <div className="text-[var(--fg)] font-mono font-bold mb-1 group-hover:text-cyan-100 transition-colors">{t.label}</div>
                <div className="text-[var(--muted)] text-sm">{t.desc}</div>
              </div>
              <span className="text-xs border border-cyan-500/20 px-2 py-1 text-cyan-400 shrink-0 ml-4">{t.tag}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* BENCHMARK TABLE */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="border border-[var(--border)]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <span className="text-sm font-mono tracking-widest uppercase text-[var(--fg)]">Benchmark Matrix</span>
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
            <Link href="/tools/submit-benchmark" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] tracking-widest uppercase transition-colors">
              Submit your results →
            </Link>
            <Link href="/benchmarks" className="text-xs text-cyan-400 hover:text-cyan-300 tracking-widest uppercase">
              Full benchmarks →
            </Link>
          </div>
        </div>
      </section>

      {/* INFRA FEED */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="border border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs tracking-widest uppercase text-[var(--muted)]">Infrastructure Feed</span>
            <span className="text-xs text-cyan-400 border border-cyan-500/20 px-2 py-0.5">LIVE</span>
          </div>
          <div className="h-8 overflow-hidden relative">
            {feed.map((item, i) => (
              <div key={i}
                className="absolute w-full transition-all duration-700 ease-in-out text-[var(--fg2)] text-sm font-mono"
                style={{ transform: `translateY(${(i - feedIdx) * 2}rem)`, opacity: i === feedIdx ? 1 : 0 }}>
                <span className="text-cyan-500 mr-2">›</span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border)] mt-20 py-10 px-6 text-center text-[var(--muted)] text-xs tracking-widest">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span>DEFILEDAI RESEARCH NETWORK © {new Date().getFullYear()}</span>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/articles" className="hover:text-[var(--fg)] transition-colors">ARTICLES</Link>
            <Link href="/benchmarks" className="hover:text-[var(--fg)] transition-colors">BENCHMARKS</Link>
            <Link href="/tools/vram-calculator" className="hover:text-[var(--fg)] transition-colors">VRAM CALC</Link>
            <Link href="/tools/submit-benchmark" className="hover:text-[var(--fg)] transition-colors">SUBMIT</Link>
            <Link href="/resources" className="hover:text-[var(--fg)] transition-colors">RESOURCES</Link>
            <Link href="/forum" className="hover:text-[var(--fg)] transition-colors">FORUM</Link>
            <Link href="/feed.xml" className="hover:text-[var(--fg)] transition-colors">RSS</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
