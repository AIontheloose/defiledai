import Link from "next/link";

const researchFeed = [
  {
    category: "MODEL ANALYSIS",
    title: "Llama 3.1 70B Uncensored",
    meta: "48GB+ VRAM • Q4_K_M • ExLlamaV2",
    href: "/articles/llama-3-1-70b-uncensored",
  },
  {
    category: "QUANTIZATION",
    title: "Q4_K_M vs IQ3_M Quality Loss",
    meta: "Memory reduction analysis",
    href: "#",
  },
  {
    category: "HARDWARE",
    title: "Dual 3090 NVLink Deployment",
    meta: "70B inference workstation",
    href: "#",
  },
];

const benchmarkRows = [
  ["Llama 3.1 70B", "Q4_K_M", "48GB", "21 tok/s"],
  ["Qwen 3 72B", "Q5_K_M", "64GB", "18 tok/s"],
  ["DeepSeek V3", "MoE", "Multi-GPU", "39 tok/s"],
  ["Mixtral 8x22B", "Q4", "48GB", "27 tok/s"],
];

const hardwareFeed = [
  "RTX 4090 remains strongest single-GPU inference card",
  "3090 resale market stabilizing after AI demand spike",
  "TensorRT-LLM now outperforming llama.cpp on 70B workloads",
  "KV cache optimization reducing long-context VRAM usage",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">
      {/* GRID BACKGROUND */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* TOP SECTION */}
      <section className="border-b border-cyan-500/10">
        <div className="max-w-[1600px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
            {/* LEFT SIDE */}
            <div className="space-y-8">
              {/* BRAND PANEL */}
              <div className="border border-cyan-500/10 bg-black/30 backdrop-blur-sm">
                <div className="border-b border-cyan-500/10 px-6 py-3 flex items-center justify-between">
                  <div className="text-cyan-400 text-xs tracking-[0.3em] uppercase">
                    DefiledAI Research Network
                  </div>

                  <div className="text-zinc-600 text-xs">
                    NODE STATUS: ACTIVE
                  </div>
                </div>

                <div className="p-8">
                  <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none mb-8">
                    LOCAL AI
                    <br />
                    INTELLIGENCE
                  </h1>

                  <p className="text-zinc-400 text-lg max-w-3xl leading-relaxed mb-10">
                    Benchmarking, quantization analysis,
                    open-weight model research, inference
                    infrastructure, and local AI systems
                    engineering.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/articles"
                      className="h-11 px-5 border border-cyan-400 bg-cyan-400/10 text-cyan-300 flex items-center text-sm tracking-wide hover:bg-cyan-400/20 transition-all"
                    >
                      ENTER RESEARCH ARCHIVE
                    </Link>

                    <Link
                      href="/benchmarks"
                      className="h-11 px-5 border border-cyan-500/10 bg-white/[0.03] text-zinc-300 flex items-center text-sm tracking-wide hover:border-cyan-400/30 transition-all"
                    >
                      VIEW BENCHMARKS
                    </Link>
                  </div>
                </div>
              </div>

              {/* RESEARCH FEED */}
              <div className="border border-cyan-500/10 bg-black/20">
                <div className="border-b border-cyan-500/10 px-6 py-3 text-cyan-400 text-xs tracking-[0.3em] uppercase">
                  Latest Research
                </div>

                <div>
                  {researchFeed.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block border-b border-cyan-500/5 px-6 py-6 hover:bg-cyan-500/[0.03] transition-all"
                    >
                      <div className="text-cyan-400 text-xs tracking-widest mb-2">
                        {item.category}
                      </div>

                      <div className="text-2xl font-bold mb-2">
                        {item.title}
                      </div>

                      <div className="text-zinc-500 text-sm">
                        {item.meta}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-8">
              {/* LIVE METRICS */}
              <div className="border border-cyan-500/10 bg-black/30">
                <div className="border-b border-cyan-500/10 px-6 py-3 text-cyan-400 text-xs tracking-[0.3em] uppercase">
                  System Metrics
                </div>

                <div className="grid grid-cols-2">
                  {[
                    ["14,281", "QUANTIZED MODELS"],
                    ["421", "BENCHMARK REPORTS"],
                    ["92", "GPU CONFIGS"],
                    ["1.8PB", "INFERENCE DATA"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="border-b border-r border-cyan-500/5 p-6"
                    >
                      <div className="text-4xl font-black text-cyan-400 mb-2">
                        {value}
                      </div>

                      <div className="text-zinc-500 text-xs tracking-wider">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BENCHMARK TERMINAL */}
              <div className="border border-cyan-500/10 bg-black/40">
                <div className="border-b border-cyan-500/10 px-6 py-3 flex items-center justify-between">
                  <div className="text-cyan-400 text-xs tracking-[0.3em] uppercase">
                    Live Benchmark Matrix
                  </div>

                  <div className="text-green-400 text-xs">
                    ● LIVE
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-zinc-500 border-b border-cyan-500/10">
                      <tr>
                        <th className="text-left px-6 py-4 font-medium">
                          MODEL
                        </th>
                        <th className="text-left px-6 py-4 font-medium">
                          QUANT
                        </th>
                        <th className="text-left px-6 py-4 font-medium">
                          VRAM
                        </th>
                        <th className="text-left px-6 py-4 font-medium">
                          TOK/S
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {benchmarkRows.map((row) => (
                        <tr
                          key={row[0]}
                          className="border-b border-cyan-500/5 hover:bg-cyan-500/[0.03]"
                        >
                          {row.map((cell, index) => (
                            <td
                              key={cell}
                              className={`px-6 py-4 ${
                                index === 0
                                  ? "text-white font-medium"
                                  : "text-zinc-400"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* HARDWARE FEED */}
              <div className="border border-cyan-500/10 bg-black/20">
                <div className="border-b border-cyan-500/10 px-6 py-3 text-cyan-400 text-xs tracking-[0.3em] uppercase">
                  Infrastructure Feed
                </div>

                <div className="divide-y divide-cyan-500/5">
                  {hardwareFeed.map((item) => (
                    <div
                      key={item}
                      className="px-6 py-5 flex gap-4 items-start"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />

                      <div className="text-zinc-300 text-sm leading-relaxed">
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOWER GRID */}
      <section>
        <div className="max-w-[1600px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* MODELS */}
            <div className="border border-cyan-500/10 bg-black/20">
              <div className="border-b border-cyan-500/10 px-6 py-3 text-cyan-400 text-xs tracking-[0.3em] uppercase">
                Model Database
              </div>

              <div className="divide-y divide-cyan-500/5">
                {[
                  "Llama",
                  "Qwen",
                  "DeepSeek",
                  "Mistral",
                  "Gemma",
                ].map((model) => (
                  <div
                    key={model}
                    className="px-6 py-5 flex items-center justify-between"
                  >
                    <div className="font-medium">
                      {model}
                    </div>

                    <div className="text-zinc-500 text-sm">
                      ACTIVE
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FORUM */}
            <div className="border border-cyan-500/10 bg-black/20">
              <div className="border-b border-cyan-500/10 px-6 py-3 text-cyan-400 text-xs tracking-[0.3em] uppercase">
                Forum Activity
              </div>

              <div className="divide-y divide-cyan-500/5">
                {[
                  "Best 2026 workstation build?",
                  "TensorRT vs ExLlamaV2",
                  "Fastest MoE deployment stack",
                  "Dual GPU PCIe bandwidth issues",
                ].map((thread) => (
                  <div
                    key={thread}
                    className="px-6 py-5"
                  >
                    <div className="text-zinc-200 text-sm leading-relaxed">
                      {thread}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RESOURCES */}
            <div className="border border-cyan-500/10 bg-black/20">
              <div className="border-b border-cyan-500/10 px-6 py-3 text-cyan-400 text-xs tracking-[0.3em] uppercase">
                Resources
              </div>

              <div className="divide-y divide-cyan-500/5">
                {[
                  "Quantization Guide",
                  "Local Inference Setup",
                  "CUDA Optimization",
                  "Multi-GPU Scaling",
                ].map((resource) => (
                  <div
                    key={resource}
                    className="px-6 py-5 flex items-center justify-between"
                  >
                    <div className="text-zinc-200">
                      {resource}
                    </div>

                    <div className="text-cyan-400 text-xs">
                      OPEN
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}