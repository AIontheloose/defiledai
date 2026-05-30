import Link from "next/link";

export const metadata = {
  title: "Resources — DefiledAI",
  description: "Guides, tools, and references for local AI inference and deployment.",
};

const guides = [
  {
    category: "Getting Started",
    items: [
      {
        title: "Local Inference Setup Guide",
        desc: "Install Ollama or llama.cpp, download your first model, and run inference on any consumer GPU.",
        tags: ["Beginner", "Ollama", "llama.cpp"],
        link: "/resources",
      },
      {
        title: "Choosing Your First Model",
        desc: "A decision tree for picking the right model family, size, and quantization based on your hardware.",
        tags: ["Beginner", "Models", "Quantization"],
        link: "/models",
      },
      {
        title: "VRAM Planning Guide",
        desc: "Calculate exactly how much VRAM you need before downloading multi-gigabyte model files.",
        tags: ["Beginner", "VRAM", "Hardware"],
        link: "/hardware",
      },
    ],
  },
  {
    category: "Quantization",
    items: [
      {
        title: "GGUF Quantization Explained",
        desc: "Deep dive into K-quants, importance matrix quants, and how to choose between Q4_K_M, IQ3_M, and others.",
        tags: ["Intermediate", "GGUF", "Quality"],
        link: "/quantization",
      },
      {
        title: "Q4_K_M vs IQ3_M Quality Analysis",
        desc: "Side-by-side perplexity scores and real-world output comparisons across 7B, 13B, and 70B models.",
        tags: ["Intermediate", "Benchmarks"],
        link: "/quantization",
      },
    ],
  },
  {
    category: "Performance",
    items: [
      {
        title: "CUDA Optimization for Inference",
        desc: "Flash attention, KV cache tuning, batch size, and context length settings that actually move the needle.",
        tags: ["Advanced", "CUDA", "Performance"],
        link: "/hardware",
      },
      {
        title: "Multi-GPU Scaling Guide",
        desc: "Tensor parallelism, NVLink vs PCIe P2P, and when to use pipeline vs model parallelism.",
        tags: ["Advanced", "Multi-GPU", "NVLink"],
        link: "/hardware",
      },
      {
        title: "ExLlamaV2 vs llama.cpp — Which is Faster?",
        desc: "Backend comparison with real throughput numbers across GPU tiers and model sizes.",
        tags: ["Intermediate", "Backends", "Benchmarks"],
        link: "/benchmarks",
      },
    ],
  },
  {
    category: "Tools & References",
    items: [
      {
        title: "Model VRAM Calculator",
        desc: "Enter model parameters and quantization to instantly calculate VRAM requirements.",
        tags: ["Tool", "VRAM"],
        link: "/quantization",
      },
      {
        title: "GPU Inference Comparison Matrix",
        desc: "Every major consumer and prosumer GPU ranked by inference throughput and VRAM capacity.",
        tags: ["Reference", "GPU"],
        link: "/hardware",
      },
      {
        title: "Quantization Format Reference",
        desc: "Quick reference table for all GGUF quantization formats with bits, quality scores, and use cases.",
        tags: ["Reference", "GGUF"],
        link: "/quantization",
      },
    ],
  },
];

const external = [
  { name: "Hugging Face", desc: "Model hub — download GGUF files directly", url: "https://huggingface.co" },
  { name: "llama.cpp", desc: "CPU/GPU inference backend, GGUF format origin", url: "https://github.com/ggerganov/llama.cpp" },
  { name: "Ollama", desc: "Easiest local model runner for beginners", url: "https://ollama.com" },
  { name: "ExLlamaV2", desc: "Fastest GGUF inference backend for NVIDIA GPUs", url: "https://github.com/turboderp/exllamav2" },
  { name: "LM Studio", desc: "GUI for local model management and inference", url: "https://lmstudio.ai" },
  { name: "Open WebUI", desc: "Web interface for Ollama — ChatGPT-style UI", url: "https://openwebui.com" },
];

const tagColors: Record<string, string> = {
  Beginner: "text-green-400 border-green-400/20",
  Intermediate: "text-yellow-400 border-yellow-400/20",
  Advanced: "text-red-400 border-red-400/20",
  Tool: "text-purple-400 border-purple-400/20",
  Reference: "text-blue-400 border-blue-400/20",
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-cyan-400 text-xs uppercase tracking-widest mb-3">DefiledAI</div>
          <h1 className="text-4xl font-black font-mono mb-4">RESOURCES</h1>
          <p className="text-[var(--muted2)] max-w-2xl">
            Guides, references, and tools for running AI locally. From first setup to multi-GPU
            optimization.
          </p>
        </div>

        {/* Guides */}
        <div className="space-y-12 mb-16">
          {guides.map((section) => (
            <div key={section.category}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs tracking-widest uppercase text-[var(--muted2)]">{section.category}</span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, i) => (
                  <Link key={i} href={item.link}
                    className="group border border-[var(--border)] hover:border-cyan-500/30 p-6 transition-all hover:bg-cyan-500/[0.02]">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag) => (
                        <span key={tag}
                          className={`text-xs border px-1.5 py-0.5 ${tagColors[tag] ?? "text-[var(--muted2)] border-zinc-700"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="font-mono font-bold text-[var(--fg)] mb-2 group-hover:text-cyan-100 transition-colors leading-snug">
                      {item.title}
                    </div>
                    <div className="text-[var(--muted)] text-sm leading-relaxed">{item.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* External links */}
        <div className="border-t border-[var(--border)] pt-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs tracking-widest uppercase text-[var(--muted2)]">External Tools</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {external.map((e, i) => (
              <a key={i} href={e.url} target="_blank" rel="noopener noreferrer"
                className="group border border-[var(--border)] hover:border-zinc-600 p-5 transition-all hover:bg-[var(--surface)]/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-[var(--fg)] group-hover:text-cyan-100 transition-colors">{e.name}</span>
                  <span className="text-[var(--muted)] text-xs">↗</span>
                </div>
                <div className="text-[var(--muted)] text-sm">{e.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
