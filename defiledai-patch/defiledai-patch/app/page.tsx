"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const benchmarks = [
  { model: "Llama 3.1 70B", quant: "Q4_K_M", vram: "48GB", toks: "21", trend: "up" },
  { model: "Qwen 3 72B", quant: "Q5_K_M", vram: "64GB", toks: "18", trend: "stable" },
  { model: "DeepSeek V3", quant: "MoE", vram: "Multi-GPU", toks: "39", trend: "up" },
  { model: "Mixtral 8x22B", quant: "Q4", vram: "48GB", toks: "27", trend: "stable" },
];

const feed = [
  "RTX 4090 remains strongest single-GPU inference card",
  "3090 resale market stabilizing after AI demand spike",
  "TensorRT-LLM outperforming llama.cpp on 70B workloads",
  "KV cache optimization reducing long-context VRAM usage",
  "ExLlamaV2 v0.2.4 improves Q4_K_M throughput by ~12%",
  "AMD ROCm 6.1 closes gap with CUDA for inference tasks",
];

const models = [
  { name: "Llama", status: "ACTIVE", color: "#22d3ee" },
  { name: "Qwen", status: "ACTIVE", color: "#22d3ee" },
  { name: "DeepSeek", status: "ACTIVE", color: "#22d3ee" },
  { name: "Mistral", status: "ACTIVE", color: "#22d3ee" },
  { name: "Gemma", status: "ACTIVE", color: "#22d3ee" },
  { name: "Phi-3", status: "ACTIVE", color: "#22d3ee" },
];

const forum = [
  { title: "Best 2026 workstation build for 70B?", replies: 24, hot: true },
  { title: "TensorRT vs ExLlamaV2 — real benchmarks", replies: 31, hot: true },
  { title: "Fastest MoE deployment stack", replies: 17, hot: false },
  { title: "Dual GPU PCIe bandwidth issues on X670E", replies: 9, hot: false },
];

const resources = [
  { title: "Quantization Guide", href: "/quantization", tag: "GUIDE" },
  { title: "Local Inference Setup", href: "/resources", tag: "SETUP" },
  { title: "CUDA Optimization", href: "/hardware", tag: "PERF" },
  { title: "Multi-GPU Scaling", href: "/hardware", tag: "INFRA" },
];

export default function Home() {
  const [tick, setTick] = useState(0);
  const [feedIdx, setFeedIdx] = useState(0);
  const [updated] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16).replace("T", " ") + " UTC";
  });

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setFeedIdx((n) => (n + 1) % feed.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* animated grid bg */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />
        {/* glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
        {/* scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)" }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-cyan-500/20 rounded-full px-4 py-1.5 text-xs text-cyan-400 tracking-widest uppercase mb-8 bg-cyan-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Node Status: Active
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6"
            style={{ fontFamily: "'Courier New', monospace" }}>
            <span className="block text-white">LOCAL AI</span>
            <span className="block" style={{
              background: "linear-gradient(90deg, #22d3ee, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>INTELLIGENCE</span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Benchmarking, quantization analysis, open-weight model research,
            inference infrastructure, and local AI systems engineering.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/articles"
              className="px-8 py-3 bg-cyan-500 text-black font-bold tracking-widest uppercase text-sm hover:bg-cyan-400 transition-colors">
              ENTER RESEARCH ARCHIVE
            </Link>
            <Link href="/benchmarks"
              className="px-8 py-3 border border-cyan-500/40 text-cyan-400 font-bold tracking-widest uppercase text-sm hover:border-cyan-400 hover:bg-cyan-500/5 transition-all">
              VIEW BENCHMARKS
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST RESEARCH */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-cyan-400 text-xs tracking-widest uppercase">Latest Research</span>
          <div className="flex-1 h-px bg-cyan-500/10" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/articles/llama-3-1-70b-uncensored"
            className="group border border-zinc-800 hover:border-cyan-500/40 p-6 transition-all hover:bg-cyan-500/[0.02]">
            <div className="text-cyan-400 text-xs tracking-widest uppercase mb-3">MODEL ANALYSIS</div>
            <div className="text-white font-semibold mb-2 group-hover:text-cyan-100 transition-colors">Llama 3.1 70B Uncensored</div>
            <div className="text-zinc-500 text-sm">48GB+ VRAM · Q4_K_M · ExLlamaV2</div>
          </Link>
          <Link href="/quantization"
            className="group border border-zinc-800 hover:border-cyan-500/40 p-6 transition-all hover:bg-cyan-500/[0.02]">
            <div className="text-cyan-400 text-xs tracking-widest uppercase mb-3">QUANTIZATION</div>
            <div className="text-white font-semibold mb-2 group-hover:text-cyan-100 transition-colors">Q4_K_M vs IQ3_M Quality Loss</div>
            <div className="text-zinc-500 text-sm">Memory reduction analysis</div>
          </Link>
          <Link href="/hardware"
            className="group border border-zinc-800 hover:border-cyan-500/40 p-6 transition-all hover:bg-cyan-500/[0.02]">
            <div className="text-cyan-400 text-xs tracking-widest uppercase mb-3">HARDWARE</div>
            <div className="text-white font-semibold mb-2 group-hover:text-cyan-100 transition-colors">Dual 3090 NVLink Deployment</div>
            <div className="text-zinc-500 text-sm">70B inference workstation</div>
          </Link>
        </div>
      </section>

      {/* BENCHMARK TABLE */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="border border-zinc-800">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
            <span className="text-sm font-mono tracking-widest uppercase text-white">Live Benchmark Matrix</span>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              UPDATED {updated}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs tracking-widest uppercase">
                  <th className="text-left px-6 py-3">Model</th>
                  <th className="text-left px-6 py-3">Quant</th>
                  <th className="text-left px-6 py-3">VRAM</th>
                  <th className="text-left px-6 py-3">Tok/s</th>
                </tr>
              </thead>
              <tbody>
                {benchmarks.map((b, i) => (
                  <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                    <td className="px-6 py-4 text-white">{b.model}</td>
                    <td className="px-6 py-4 text-cyan-400">{b.quant}</td>
                    <td className="px-6 py-4 text-zinc-300">{b.vram}</td>
                    <td className="px-6 py-4">
                      <span className="text-green-400">{b.toks}</span>
                      <span className="text-zinc-600"> tok/s</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-zinc-800 text-right">
            <Link href="/benchmarks" className="text-xs text-cyan-400 hover:text-cyan-300 tracking-widest uppercase">
              View Full Benchmarks →
            </Link>
          </div>
        </div>
      </section>

      {/* INFRA FEED */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="border border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs tracking-widest uppercase text-zinc-400">Infrastructure Feed</span>
            <span className="text-xs text-cyan-400 border border-cyan-500/20 px-2 py-0.5">LIVE</span>
          </div>
          <div className="h-8 overflow-hidden relative">
            {feed.map((item, i) => (
              <div key={i}
                className="absolute w-full transition-all duration-700 ease-in-out text-zinc-300 text-sm font-mono"
                style={{
                  transform: `translateY(${(i - feedIdx) * 2}rem)`,
                  opacity: i === feedIdx ? 1 : 0,
                }}>
                <span className="text-cyan-500 mr-2">›</span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODELS + FORUM + RESOURCES */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        {/* Models */}
        <div className="border border-zinc-800 p-6">
          <div className="text-xs tracking-widest uppercase text-zinc-400 mb-5">Model Database</div>
          <div className="space-y-3">
            {models.map((m) => (
              <Link key={m.name} href="/models"
                className="flex items-center justify-between group hover:bg-zinc-900/40 -mx-2 px-2 py-1.5 transition-colors">
                <span className="text-zinc-300 group-hover:text-white text-sm transition-colors">{m.name}</span>
                <span className="text-xs text-green-400 border border-green-400/20 px-2 py-0.5">{m.status}</span>
              </Link>
            ))}
          </div>
          <Link href="/models" className="block mt-5 text-xs text-cyan-400 hover:text-cyan-300 tracking-widest uppercase">
            Full Database →
          </Link>
        </div>

        {/* Forum */}
        <div className="border border-zinc-800 p-6">
          <div className="text-xs tracking-widest uppercase text-zinc-400 mb-5">Forum Activity</div>
          <div className="space-y-3">
            {forum.map((f, i) => (
              <Link key={i} href="/forum"
                className="flex items-start justify-between gap-3 group hover:bg-zinc-900/40 -mx-2 px-2 py-1.5 transition-colors">
                <span className="text-zinc-300 group-hover:text-white text-sm transition-colors leading-snug">{f.title}</span>
                <div className="flex items-center gap-1 shrink-0">
                  {f.hot && <span className="text-xs text-orange-400">🔥</span>}
                  <span className="text-xs text-zinc-600">{f.replies}</span>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/forum" className="block mt-5 text-xs text-cyan-400 hover:text-cyan-300 tracking-widest uppercase">
            Join Discussion →
          </Link>
        </div>

        {/* Resources */}
        <div className="border border-zinc-800 p-6">
          <div className="text-xs tracking-widest uppercase text-zinc-400 mb-5">Resources</div>
          <div className="space-y-3">
            {resources.map((r, i) => (
              <Link key={i} href={r.href}
                className="flex items-center justify-between group hover:bg-zinc-900/40 -mx-2 px-2 py-1.5 transition-colors">
                <span className="text-zinc-300 group-hover:text-white text-sm transition-colors">{r.title}</span>
                <span className="text-xs text-cyan-400 border border-cyan-500/20 px-2 py-0.5">{r.tag}</span>
              </Link>
            ))}
          </div>
          <Link href="/resources" className="block mt-5 text-xs text-cyan-400 hover:text-cyan-300 tracking-widest uppercase">
            All Resources →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 mt-20 py-10 px-6 text-center text-zinc-600 text-xs tracking-widest">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span>DEFILEDAI RESEARCH NETWORK © {new Date().getFullYear()}</span>
          <div className="flex gap-6">
            <Link href="/articles" className="hover:text-zinc-400 transition-colors">ARTICLES</Link>
            <Link href="/benchmarks" className="hover:text-zinc-400 transition-colors">BENCHMARKS</Link>
            <Link href="/resources" className="hover:text-zinc-400 transition-colors">RESOURCES</Link>
            <Link href="/forum" className="hover:text-zinc-400 transition-colors">FORUM</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
