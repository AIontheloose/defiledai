import Link from "next/link";

export const metadata = {
  title: "Tools — DefiledAI",
  description: "20+ interactive tools for local AI — MoE builder, VRAM calculator, speed estimator, hardware advisor, system prompt library and more.",
};

const TOOL_SECTIONS = [
  {
    heading: "Flagship",
    tools: [
      {
        href: "/tools/moe-builder",
        title: "Local MoE Pipeline Builder",
        desc: "Design a macro-scale Mixture-of-Experts pipeline from independent local models. Router + domain experts + conditional synthesizer. Generates Python code and YAML config.",
        tag: "NEW & UNIQUE",
        tagColor: "text-cyan-400 border-cyan-400/30",
      },
      {
        href: "/tools/hardware-simulator",
        title: "Hardware Simulator",
        desc: "Beyond basic VRAM calculator: Input your exact setup (e.g., 2× RTX 4090 + 128GB RAM, or 1× 5090 + CPU offload) and get realistic estimates",
        tag: "NEW & UNIQUE",
        tagColor: "text-cyan-400 border-cyan-400/30",
      },
      {
        href: "/tools/abliteration-test-suite",
        title: "Abliteration Test Suite",
        desc: "Abliteration test suite with publishable results score-card",
        tag: "NEW & UNIQUE",
        tagColor: "text-cyan-400 border-cyan-400/30",
      },
     {
        href: "/tools/multi-model-planner",
        title: "Multi-Model Planner",
        desc: "Generate code to run multiple models in a variety of ways",
        tag: "NEW & UNIQUE",
        tagColor: "text-cyan-400 border-cyan-400/30",
      },
      {
        href: "/tools/prompt-tester",
        title: "Prompt Tester",
        desc: "Test prompt effectiveness",
        tag: "NEW & UNIQUE",
        tagColor: "text-cyan-400 border-cyan-400/30",
      },
      {
        href: "/tools/quant-quality-estimator",
        title: "Quant Quality Estimator",
        desc: "Visual representation for Quant quality V baseline",
        tag: "NEW & UNIQUE",
        tagColor: "text-cyan-400 border-cyan-400/30",
      },
      {
        href: "/tools/local-stack",
        title: "Local LLM Stack Builder",
        desc: "Intelligent Local LLM Stack Builder based on your hardware.",
        tag: "NEW & UNIQUE",
        tagColor: "text-cyan-400 border-cyan-400/30",
      },
    ],
  },
  {
    heading: "Hardware & Performance",
    tools: [
      { href: "/tools/model-compatibility", title: "Model Compatibility Checker", desc: "Select your GPU — see every uncensored and abliterated model that fits with estimated tok/s and HuggingFace links.", tag: "MOST USEFUL", tagColor: "text-cyan-400 border-cyan-400/30" },
      { href: "/tools/can-i-run-it", title: "Can I Run It?", desc: "Quick GPU check for uncensored models. Embeddable iframe for Discord and websites.", tag: "EMBEDDABLE", tagColor: "text-green-400 border-green-400/30" },
      { href: "/tools/speed-estimator", title: "Inference Speed Estimator", desc: "Predict tokens per second before downloading. 30+ GPUs, all quants, 6 backends.", tag: "POPULAR", tagColor: "text-green-400 border-green-400/30" },
      { href: "/tools/inference-profiler", title: "Inference Profiler", desc: "Detailed profile: throughput, time-to-first-token, bandwidth utilisation, CPU offload analysis. Compare two configs side-by-side.", tag: "ADVANCED", tagColor: "text-purple-400 border-purple-400/30" },
      { href: "/tools/price-performance", title: "GPU Price / Performance", desc: "Current GPU rankings by inference value. Tok/s per dollar, sortable by metric. Updated weekly.", tag: "UPDATED WEEKLY", tagColor: "text-yellow-400 border-yellow-400/30" },
      { href: "/tools/benchmark-compare", title: "Benchmark Compare", desc: "Side-by-side GPU comparison across 7B, 13B, and 70B model sizes with visual bar charts.", tag: "VISUAL", tagColor: "text-blue-400 border-blue-400/30" },
      { href: "/tools/hardware-advisor", title: "Hardware Advisor", desc: "4-question wizard giving specific GPU and build recommendations. Budget-aware, use-case aware.", tag: "NEW", tagColor: "text-cyan-400 border-cyan-400/30" },
    ],
  },
  {
    heading: "Model Selection & Planning",
    tools: [
      { href: "/tools/vram-calculator", title: "VRAM Calculator", desc: "Exact VRAM for any model size, quant, and context length including KV cache breakdown.", tag: "PRECISE", tagColor: "text-cyan-400 border-cyan-400/30" },
      { href: "/tools/context-calculator", title: "Context Length Calculator", desc: "Find your maximum context window given VRAM, model, and KV cache quantization.", tag: "UNIQUE", tagColor: "text-orange-400 border-orange-400/30" },
      { href: "/tools/token-budget", title: "Token Budget Calculator", desc: "Plan context usage, generation time, and API cost. Works for local and cloud models.", tag: "NEW", tagColor: "text-cyan-400 border-cyan-400/30" },
      { href: "/tools/quant-picker", title: "Quant Picker", desc: "Answer 3 questions — get the right quantization format with a clear explanation.", tag: "BEGINNER", tagColor: "text-purple-400 border-purple-400/30" },
      { href: "/tools/backend-picker", title: "Backend Picker", desc: "4 questions to find the right inference backend for your GPU, OS, and use case.", tag: "PRACTICAL", tagColor: "text-green-400 border-green-400/30" },
    ],
  },
  {
    heading: "Uncensored & Abliteration",
    tools: [
      { href: "/tools/abliteration-scorer", title: "Abliteration Quality Scorer", desc: "Compare base vs abliterated benchmark scores. Grade retention S–D. 14 known models.", tag: "UNIQUE", tagColor: "text-orange-400 border-orange-400/30" },
      { href: "/tools/model-diff", title: "Model Diff", desc: "Side-by-side comparison of base vs abliterated outputs with real examples.", tag: "RESEARCH", tagColor: "text-blue-400 border-blue-400/30" },
      { href: "/tools/hf-tracker", title: "HuggingFace Tracker", desc: "Curated list of abliterated, uncensored, and Dolphin uploads. Updated weekly.", tag: "CURATED", tagColor: "text-green-400 border-green-400/30" },
    ],
  },
  {
    heading: "Configuration & Prompting",
    tools: [
      { href: "/tools/modelfile-generator", title: "Ollama Modelfile Generator", desc: "Build a Modelfile with system prompt, sampling params, and context. 6 presets.", tag: "SAVES TIME", tagColor: "text-yellow-400 border-yellow-400/30" },
      { href: "/tools/system-prompt-library", title: "System Prompt Library", desc: "20 production-ready system prompts — uncensored assistant, coding, creative writing, reasoning, productivity.", tag: "NEW", tagColor: "text-cyan-400 border-cyan-400/30" },
    ],
  },
  {
    heading: "Community",
    tools: [
      { href: "/tools/model-reviews", title: "Community Model Reviews", desc: "Structured reviews with hardware, use case, verdict, pros and cons.", tag: "COMMUNITY", tagColor: "text-purple-400 border-purple-400/30" },
      { href: "/tools/submit-benchmark", title: "Submit Benchmark", desc: "Share your inference results. Community table with filter and sort.", tag: "COMMUNITY", tagColor: "text-purple-400 border-purple-400/30" },
    ],
  },
];

export default function ToolsPage() {
  const total = TOOL_SECTIONS.reduce((n, s) => n + s.tools.length, 0);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI</div>
          <h1 className="text-4xl font-black font-mono mb-4">TOOLS</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            {total} interactive tools for local AI inference. No sign-up. Everything runs in your browser.
          </p>
        </div>

        <div className="space-y-12">
          {TOOL_SECTIONS.map((section) => (
            <div key={section.heading}>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs tracking-widest uppercase text-[var(--muted)] font-mono">{section.heading}</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>
              <div className={`grid gap-4 ${section.tools.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
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
