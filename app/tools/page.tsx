import Link from "next/link";

export const metadata = {
  title: "Tools — DefiledAI",
  description: "10+ interactive tools for local AI — VRAM calculator, speed estimator, quant picker, model compatibility, backend picker, Modelfile generator and more.",
};

const TOOL_SECTIONS = [
  {
    heading: "Hardware & Performance",
    tools: [
      { href: "/tools/model-compatibility", title: "Model Compatibility Checker", desc: "Select your GPU — see every uncensored and abliterated model that fits, with estimated tok/s and HuggingFace links.", tag: "MOST USEFUL", tagColor: "text-cyan-400 border-cyan-400/30" },
      { href: "/tools/can-i-run-it", title: "Can I Run It?", desc: "Quick GPU check for uncensored models. Embeddable widget for Discord and websites.", tag: "EMBEDDABLE", tagColor: "text-green-400 border-green-400/30" },
      { href: "/tools/speed-estimator", title: "Inference Speed Estimator", desc: "Predict tokens per second before downloading multi-gigabyte files. 30+ GPUs, all quants, 6 backends.", tag: "POPULAR", tagColor: "text-green-400 border-green-400/30" },
      { href: "/tools/price-performance", title: "GPU Price / Performance", desc: "Current GPU rankings by inference value. Tok/s per dollar, sortable by metric.", tag: "UPDATED WEEKLY", tagColor: "text-yellow-400 border-yellow-400/30" },
      { href: "/tools/benchmark-compare", title: "Benchmark Compare", desc: "Side-by-side GPU inference comparison across 7B, 13B, and 70B model sizes.", tag: "VISUAL", tagColor: "text-purple-400 border-purple-400/30" },
    ],
  },
  {
    heading: "Model Selection",
    tools: [
      { href: "/tools/vram-calculator", title: "VRAM Calculator", desc: "Exact VRAM for any model size, quant, and context length including KV cache breakdown.", tag: "PRECISE", tagColor: "text-cyan-400 border-cyan-400/30" },
      { href: "/tools/context-calculator", title: "Context Length Calculator", desc: "Find your maximum context window given VRAM, model, and KV cache quantization.", tag: "UNIQUE", tagColor: "text-orange-400 border-orange-400/30" },
      { href: "/tools/quant-picker", title: "Quant Picker", desc: "Answer 3 questions — get the right quantization format with a clear explanation.", tag: "BEGINNER", tagColor: "text-purple-400 border-purple-400/30" },
      { href: "/tools/backend-picker", title: "Backend Picker", desc: "4 questions to find the right inference backend for your GPU, OS, and use case.", tag: "NEW", tagColor: "text-cyan-400 border-cyan-400/30" },
    ],
  },
  {
    heading: "Uncensored & Abliteration",
    tools: [
      { href: "/tools/abliteration-scorer", title: "Abliteration Quality Scorer", desc: "Compare base vs abliterated benchmark scores. Grade retention S through D. 14 known models included.", tag: "UNIQUE", tagColor: "text-orange-400 border-orange-400/30" },
      { href: "/tools/model-diff", title: "Model Diff", desc: "Side-by-side comparison of base vs abliterated outputs. See exactly what changes and what doesn't.", tag: "RESEARCH", tagColor: "text-blue-400 border-blue-400/30" },
      { href: "/tools/hf-tracker", title: "HuggingFace Tracker", desc: "Curated list of abliterated, uncensored, and Dolphin model uploads. Updated weekly.", tag: "CURATED", tagColor: "text-green-400 border-green-400/30" },
    ],
  },
  {
    heading: "Configuration & Community",
    tools: [
      { href: "/tools/modelfile-generator", title: "Ollama Modelfile Generator", desc: "Build a Modelfile with system prompt, sampling parameters, and context. 5 presets including Uncensored Assistant.", tag: "SAVES TIME", tagColor: "text-yellow-400 border-yellow-400/30" },
      { href: "/tools/model-reviews", title: "Community Model Reviews", desc: "Structured reviews with hardware, use case, verdict, pros and cons. Write and read reviews.", tag: "COMMUNITY", tagColor: "text-purple-400 border-purple-400/30" },
      { href: "/tools/submit-benchmark", title: "Submit Benchmark", desc: "Share your inference results. Community benchmark table with filter and sort.", tag: "COMMUNITY", tagColor: "text-purple-400 border-purple-400/30" },
    ],
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
            {TOOL_SECTIONS.reduce((n, s) => n + s.tools.length, 0)} interactive tools for local AI inference. No sign-up required. Everything runs in your browser.
          </p>
        </div>

        <div className="space-y-12">
          {TOOL_SECTIONS.map((section) => (
            <div key={section.heading}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs tracking-widest uppercase text-[var(--muted)] font-mono">{section.heading}</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {section.tools.map((tool) => (
                  <Link key={tool.href} href={tool.href}
                    className="group block border border-[var(--border)] hover:border-zinc-600 p-5 transition-all hover:bg-[var(--surface)]/30">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h2 className="font-mono font-black text-base text-[var(--fg)] group-hover:text-cyan-100 transition-colors leading-tight">
                        {tool.title}
                      </h2>
                      <span className={`text-xs border px-2 py-0.5 shrink-0 font-mono ${tool.tagColor}`}>{tool.tag}</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm leading-relaxed">{tool.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
