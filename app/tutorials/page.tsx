import Link from "next/link";

export const metadata = {
  title: "Tutorials — DefiledAI",
  description: "Local AI tutorials from complete beginner to expert. Install guides, optimization, MoE pipelines, and advanced inference.",
};

const LEVELS = [
  {
    level: "Beginner",
    color: "text-green-400 border-green-400/30",
    bg: "bg-green-400/[0.03]",
    desc: "No prior experience needed. Get from zero to running your first local AI model.",
    tutorials: [
      { slug: "what-is-local-ai", title: "What is Local AI and Why Run It Yourself?", time: "5 min read", desc: "The case for local models: privacy, cost, censorship, and control." },
      { slug: "install-ollama-windows", title: "Installing Ollama on Windows: Complete Guide", time: "10 min read", desc: "Download, install, and run your first model in under 10 minutes." },
      { slug: "install-ollama-linux", title: "Installing Ollama on Linux (Ubuntu/Debian)", time: "8 min read", desc: "One-line install, systemd service, and first model." },
      { slug: "your-first-model", title: "Downloading and Running Your First Model", time: "8 min read", desc: "Choose the right model for your GPU and run it with Ollama." },
      { slug: "understanding-vram", title: "Understanding VRAM: Why It's Everything in Local AI", time: "6 min read", desc: "What VRAM is, why it matters, and how to work within your limits." },
      { slug: "what-is-quantization", title: "Quantization Explained for Beginners", time: "8 min read", desc: "Why Q4_K_M exists, what it costs you, and which format to pick." },
    ],
  },
  {
    level: "Intermediate",
    color: "text-yellow-400 border-yellow-400/30",
    bg: "bg-yellow-400/[0.03]",
    desc: "You have Ollama running. Now optimise, extend, and connect it to real workflows.",
    tutorials: [
      { slug: "open-webui-setup", title: "Open WebUI: ChatGPT-Style Interface for Ollama", time: "10 min read", desc: "Install Open WebUI with Docker and get a full chat interface." },
      { slug: "ollama-api-guide", title: "Using the Ollama API: Build Your First Integration", time: "15 min read", desc: "REST API, Python client, and OpenAI SDK compatibility." },
      { slug: "modelfile-guide", title: "Ollama Modelfiles: System Prompts, Parameters, Presets", time: "12 min read", desc: "Create custom model personalities with persistent configuration." },
      { slug: "exllamav2-setup", title: "ExLlamaV2 Setup: 20-30% Faster Than Ollama on NVIDIA", time: "15 min read", desc: "Install, load a GGUF, and benchmark against Ollama." },
      { slug: "llamacpp-server", title: "llama.cpp Server Mode: Local OpenAI-Compatible API", time: "12 min read", desc: "Run llama.cpp as a persistent API server." },
      { slug: "abliterated-models-guide", title: "Finding and Running Abliterated Models", time: "10 min read", desc: "Where to find abliterated GGUFs, how to load them, what to expect." },
    ],
  },
  {
    level: "Expert",
    color: "text-red-400 border-red-400/30",
    bg: "bg-red-400/[0.03]",
    desc: "Advanced inference, multi-GPU, production serving, and building AI pipelines.",
    tutorials: [
      { slug: "dual-gpu-nvlink-setup", title: "Dual GPU NVLink Setup for 70B Inference", time: "20 min read", desc: "Hardware, driver config, and running 70B models on dual 3090s." },
      { slug: "moe-pipeline-guide", title: "Building a Local MoE Pipeline from Independent Models", time: "25 min read", desc: "Router + expert + synthesizer architecture from scratch with Python." },
      { slug: "tensorrt-llm-guide", title: "TensorRT-LLM: Maximum Throughput on NVIDIA", time: "30 min read", desc: "Compile, quantize, and serve with TensorRT-LLM." },
      { slug: "rag-local-guide", title: "Building a Local RAG Pipeline with Ollama", time: "20 min read", desc: "Document ingestion, vector search, and retrieval-augmented generation." },
      { slug: "cuda-optimization", title: "CUDA Optimization for LLM Inference", time: "20 min read", desc: "Flash attention, KV cache tuning, batch sizing, and profiling." },
      { slug: "abliteration-diy", title: "Run Abliteration Yourself: Step-by-Step Guide", time: "25 min read", desc: "Apply representation engineering to any open-weight model locally." },
    ],
  },
];

export default function TutorialsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI</div>
          <h1 className="text-4xl font-black font-mono mb-4">TUTORIALS</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            From first install to production MoE pipelines. Every tutorial is specific, tested, and written for people who actually run local AI.
          </p>
        </div>

        <div className="space-y-14">
          {LEVELS.map((level) => (
            <div key={level.level}>
              <div className={`border ${level.color} ${level.bg} p-5 mb-6`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-sm font-black font-mono border px-3 py-1 ${level.color}`}>{level.level.toUpperCase()}</span>
                </div>
                <p className="text-[var(--muted)] text-sm">{level.desc}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {level.tutorials.map((t) => (
                  <Link key={t.slug} href={`/tutorials/${t.slug}`}
                    className="group block border border-[var(--border)] hover:border-zinc-600 p-5 transition-all hover:bg-[var(--surface)]/20">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-mono font-bold text-[var(--fg)] group-hover:text-cyan-100 transition-colors leading-snug text-sm">
                        {t.title}
                      </h3>
                      <span className="text-xs text-[var(--muted)] font-mono shrink-0">{t.time}</span>
                    </div>
                    <p className="text-[var(--muted)] text-xs leading-relaxed">{t.desc}</p>
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
