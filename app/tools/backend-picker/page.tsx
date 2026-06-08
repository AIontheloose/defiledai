"use client";
import { useState } from "react";

const QUESTIONS = [
  {
    id: "gpu",
    q: "What GPU do you have?",
    options: ["NVIDIA (RTX/GTX)", "AMD (RX/Vega)", "Apple Silicon (M-series)", "CPU only / No GPU", "Multiple NVIDIA GPUs"],
  },
  {
    id: "skill",
    q: "Technical comfort level?",
    options: ["Beginner — I want it to just work", "Intermediate — I can follow a guide", "Advanced — I can configure from source"],
  },
  {
    id: "usecase",
    q: "Primary use case?",
    options: ["Chat / interactive use", "API server for apps", "Batch processing / automation", "Max throughput / production"],
  },
  {
    id: "os",
    q: "Operating system?",
    options: ["Windows", "Linux (Ubuntu/Debian)", "macOS", "Docker / container"],
  },
];

interface BackendRec {
  name: string;
  tagline: string;
  install: string;
  why: string[];
  score: number;
  link: string;
  tag: string;
  tagColor: string;
}

function getRecommendations(answers: Record<string, string>): BackendRec[] {
  const { gpu, skill, usecase, os } = answers;
  const recs: BackendRec[] = [];

  const isNvidia = gpu === "NVIDIA (RTX/GTX)" || gpu === "Multiple NVIDIA GPUs";
  const isAMD = gpu === "AMD (RX/Vega)";
  const isApple = gpu === "Apple Silicon (M-series)";
  const isCPU = gpu === "CPU only / No GPU";
  const isMulti = gpu === "Multiple NVIDIA GPUs";
  const isBeginner = skill === "Beginner — I want it to just work";
  const isAdvanced = skill === "Advanced — I can configure from source";
  const isAPI = usecase === "API server for apps";
  const isBatch = usecase === "Batch processing / automation";
  const isProd = usecase === "Max throughput / production";
  const isWindows = os === "Windows";

  if (isBeginner || isApple || isCPU) {
    recs.push({
      name: "Ollama",
      tagline: "Easiest local AI setup — installs in 60 seconds",
      install: isWindows ? "winget install Ollama.Ollama" : "curl -fsSL https://ollama.com/install.sh | sh",
      why: ["Zero configuration", "Auto-detects GPU and VRAM", "Built-in model registry", "OpenAI-compatible API included"],
      score: isBeginner ? 98 : 85,
      link: "https://ollama.com",
      tag: "RECOMMENDED",
      tagColor: "bg-cyan-500 text-black",
    });
  }

  if (isNvidia && !isBeginner) {
    recs.push({
      name: "ExLlamaV2",
      tagline: "Fastest GGUF inference on NVIDIA — 20-30% faster than llama.cpp",
      install: "pip install exllamav2",
      why: ["Custom CUDA kernels for Llama architecture", "Best tok/s on RTX cards", "Dynamic KV cache management", "Supports EXL2 and GGUF formats"],
      score: isProd ? 98 : isAPI ? 90 : 85,
      link: "https://github.com/turboderp/exllamav2",
      tag: "FASTEST",
      tagColor: "bg-green-500 text-black",
    });
  }

  recs.push({
    name: "llama.cpp",
    tagline: "Universal inference — runs on anything",
    install: isWindows
      ? "winget install ggerganov.llama.cpp"
      : "git clone https://github.com/ggerganov/llama.cpp && cd llama.cpp && cmake -B build -DGGML_CUDA=ON && cmake --build build -j",
    why: [
      isApple ? "Best Apple Silicon support via Metal" : isAMD ? "ROCm support for AMD GPUs" : "CUDA support for NVIDIA",
      "CPU fallback for oversized models",
      "Built-in server mode with OpenAI API",
      "Origin of GGUF format — best compatibility",
    ],
    score: isCPU || isAMD || isApple ? 95 : 80,
    link: "https://github.com/ggerganov/llama.cpp",
    tag: isAMD || isApple || isCPU ? "BEST FOR YOU" : "UNIVERSAL",
    tagColor: isAMD || isApple || isCPU ? "bg-cyan-500 text-black" : "bg-zinc-600 text-white",
  });

  if ((isNvidia || isMulti) && (isProd || isAPI || isBatch) && isAdvanced) {
    recs.push({
      name: "TensorRT-LLM",
      tagline: "Maximum throughput on NVIDIA — requires model compilation",
      install: "docker pull nvcr.io/nvidia/tensorrt:24.01-py3",
      why: ["Highest possible tok/s on NVIDIA", "Optimised for multi-GPU serving", "FP8 quantization support", "Production-grade batching"],
      score: isProd ? 96 : 75,
      link: "https://github.com/NVIDIA/TensorRT-LLM",
      tag: "PRODUCTION",
      tagColor: "bg-purple-500 text-white",
    });
  }

  if (isAPI || isProd) {
    recs.push({
      name: "vLLM",
      tagline: "High-throughput serving with PagedAttention",
      install: "pip install vllm",
      why: ["PagedAttention for efficient memory use", "Continuous batching for high concurrency", "OpenAI-compatible API", "Best for serving many simultaneous users"],
      score: isProd && isNvidia ? 88 : 70,
      link: "https://github.com/vllm-project/vllm",
      tag: "HIGH CONCURRENCY",
      tagColor: "bg-blue-500 text-white",
    });
  }

  if (!isBeginner) {
    recs.push({
      name: "LM Studio",
      tagline: "GUI model manager — download, run, and chat locally",
      install: "Download from lmstudio.ai",
      why: ["Visual model browser and downloader", "Built-in chat UI", "Local server with OpenAI API", "No command line required"],
      score: isWindows && !isProd ? 82 : 65,
      link: "https://lmstudio.ai",
      tag: "GUI",
      tagColor: "bg-orange-500 text-black",
    });
  }

  return recs.sort((a, b) => b.score - a.score);
}

export default function BackendPickerPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);

  const current = QUESTIONS[step];
  const done = step >= QUESTIONS.length;
  const recs = done ? getRecommendations(answers) : [];

  const answer = (val: string) => {
    setAnswers((a) => ({ ...a, [current.id]: val }));
    setStep(step + 1);
  };

  const reset = () => { setAnswers({}); setStep(0); };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">BACKEND PICKER</h1>
          <p className="text-[var(--muted)]">Answer 4 questions and get the right inference backend for your setup.</p>
        </div>

        <div className="flex gap-2 mb-10">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 transition-colors ${i < step ? "bg-cyan-400" : i === step ? "bg-cyan-400/40" : "bg-[var(--border)]"}`} />
          ))}
        </div>

        {!done ? (
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">Question {step + 1} of {QUESTIONS.length}</div>
            <h2 className="text-2xl font-black font-mono mb-8">{current.q}</h2>
            <div className="space-y-3">
              {current.options.map((opt) => (
                <button key={opt} onClick={() => answer(opt)}
                  className="w-full text-left border border-[var(--border)] px-6 py-4 text-[var(--fg2)] font-mono text-sm hover:border-cyan-500/60 hover:bg-cyan-500/[0.03] hover:text-[var(--fg)] transition-all">
                  <span className="text-cyan-400 mr-3">›</span>{opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-widest text-cyan-400 mb-6 font-mono">Recommendations — ranked for your setup</div>
            {recs.map((r, i) => (
              <div key={r.name} className={`border p-6 ${i === 0 ? "border-cyan-500/40 bg-cyan-500/[0.03]" : "border-[var(--border)]"}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-black font-mono text-xl text-[var(--fg)]">{r.name}</span>
                      <span className={`text-xs px-2 py-0.5 font-mono font-bold ${r.tagColor}`}>{r.tag}</span>
                    </div>
                    <div className="text-[var(--muted)] text-sm">{r.tagline}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black font-mono text-cyan-400">{r.score}</div>
                    <div className="text-xs text-[var(--muted)]">match score</div>
                  </div>
                </div>
                <ul className="space-y-1 mb-4">
                  {r.why.map((w) => (
                    <li key={w} className="text-xs text-[var(--muted2)] font-mono">
                      <span className="text-cyan-400 mr-2">✓</span>{w}
                    </li>
                  ))}
                </ul>
                <div className="border border-[var(--border)] bg-[var(--surface)] px-4 py-2 font-mono text-xs text-[var(--fg2)] mb-3 overflow-x-auto">
                  {r.install}
                </div>
                <a href={r.link} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-cyan-400 border border-cyan-500/20 px-3 py-1 hover:border-cyan-400 transition-all font-mono">
                  DOCUMENTATION ↗
                </a>
              </div>
            ))}
            <button onClick={reset}
              className="w-full border border-[var(--border)] py-3 text-xs uppercase tracking-widest font-mono text-[var(--muted)] hover:text-[var(--fg)] hover:border-zinc-500 transition-all mt-4">
              Start Over
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
