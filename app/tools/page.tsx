import Link from "next/link";

export const metadata = {
  title: "Tools — DefiledAI",
  description: "Interactive tools for local AI — VRAM calculator, speed estimator, quant picker, model compatibility checker, abliteration scorer.",
};

const tools = [
  {
    href: "/tools/model-compatibility",
    title: "Model Compatibility Checker",
    desc: "Select your GPU and see every uncensored and abliterated model that fits in your VRAM, with estimated inference speed. Includes Dolphin, abliterated Llama, Mistral, Qwen, DeepSeek, and more.",
    tag: "MOST USEFUL",
    tagColor: "text-cyan-400 border-cyan-400/30",
    details: ["19 uncensored & abliterated models", "GPU selector with 30+ cards", "Estimated tok/s per model", "HuggingFace links"],
  },
  {
    href: "/tools/speed-estimator",
    title: "Inference Speed Estimator",
    desc: "Predict tokens per second for any model size, quantization, and GPU before downloading multi-gigabyte files. Based on memory bandwidth — the primary bottleneck for LLM token generation.",
    tag: "POPULAR",
    tagColor: "text-green-400 border-green-400/30",
    details: ["All quant formats", "30+ GPUs including Apple Silicon", "Multi-GPU support", "Per-quant comparison table"],
  },
  {
    href: "/tools/quant-picker",
    title: "Quant Picker",
    desc: "Answer 3 questions about your hardware, priorities, and use case — get the right quantization format with a clear explanation of why.",
    tag: "BEGINNER FRIENDLY",
    tagColor: "text-purple-400 border-purple-400/30",
    details: ["3-question wizard", "Use-case aware recommendations", "Alternatives and warnings", "Works for all VRAM levels"],
  },
  {
    href: "/tools/vram-calculator",
    title: "VRAM Calculator",
    desc: "Calculate exact VRAM requirements for any model size and quantization, including KV cache overhead at your chosen context length.",
    tag: "PRECISE",
    tagColor: "text-yellow-400 border-yellow-400/30",
    details: ["Model presets + custom params", "Context length slider", "KV cache breakdown", "All-quant comparison"],
  },
  {
    href: "/tools/abliteration-scorer",
    title: "Abliteration Quality Scorer",
    desc: "Compare base vs abliterated model benchmark scores to quantify quality retention. Look up known models or enter your own MMLU / perplexity scores.",
    tag: "UNIQUE",
    tagColor: "text-orange-400 border-orange-400/30",
    details: ["14 known model scores", "Manual score entry", "Graded retention scale S–D", "Method and source tracking"],
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI</div>
          <h1 className="text-4xl font-black font-mono mb-4">TOOLS</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Interactive calculators and checkers for local AI inference. No sign-up, no tracking, everything runs in your browser.
          </p>
        </div>

        <div className="space-y-4">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}
              className="group block border border-[var(--border)] hover:border-zinc-600 p-6 transition-all hover:bg-[var(--surface)]/30">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-mono font-black text-xl text-[var(--fg)] group-hover:text-cyan-100 transition-colors">
                    {tool.title}
                  </h2>
                  <span className={`text-xs border px-2 py-0.5 font-mono ${tool.tagColor}`}>
                    {tool.tag}
                  </span>
                </div>
                <span className="text-cyan-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <p className="text-[var(--muted2)] text-sm leading-relaxed mb-4">{tool.desc}</p>
              <div className="flex flex-wrap gap-3">
                {tool.details.map((d) => (
                  <span key={d} className="text-xs text-[var(--muted)] border border-[var(--border)] px-2 py-0.5 font-mono">
                    {d}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
