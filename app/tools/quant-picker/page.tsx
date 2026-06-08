"use client";
import { useState } from "react";

type Answer = string | null;

const QUESTIONS = [
  {
    id: "vram",
    question: "How much VRAM does your GPU have?",
    options: ["4GB or less", "6–8GB", "10–12GB", "16GB", "24GB", "48GB+ (multi-GPU)"],
  },
  {
    id: "priority",
    question: "What matters most to you?",
    options: ["Maximum quality", "Best speed", "Balanced quality/speed", "Fit the largest model possible"],
  },
  {
    id: "usecase",
    question: "What's your primary use case?",
    options: ["Chat / roleplay", "Code generation", "Long documents / RAG", "Creative writing", "Reasoning / math"],
  },
];

interface Recommendation {
  format: string;
  why: string;
  quality: number;
  speed: number;
  vramMult: string;
  alternatives: string[];
  warning?: string;
}

function getRecommendation(answers: Record<string, Answer>): Recommendation {
  const vram = answers.vram;
  const priority = answers.priority;
  const usecase = answers.usecase;

  // 4GB or less
  if (vram === "4GB or less") {
    return {
      format: "Q4_K_M",
      why: "With 4GB VRAM you're limited to small models (3B or under). Q4_K_M gives the best quality at this constraint — Q8 won't fit.",
      quality: 88, speed: 95, vramMult: "0.25× F16",
      alternatives: ["Q5_K_M if model fits", "IQ4_NL for slightly better quality"],
      warning: "Consider CPU inference for models that don't fit — llama.cpp handles CPU well at 7B Q4.",
    };
  }

  // 6–8GB
  if (vram === "6–8GB") {
    if (priority === "Maximum quality") return {
      format: "Q8_0",
      why: "At 6–8GB you can run 7B in Q8_0 (near-lossless) comfortably. This is the best quality available at your VRAM level.",
      quality: 99, speed: 78, vramMult: "0.50× F16",
      alternatives: ["Q6_K if you need slightly more VRAM headroom"],
    };
    if (priority === "Best speed") return {
      format: "Q4_K_M",
      why: "Q4_K_M at 7B fits comfortably and runs fastest. Minimal quality loss, maximum tokens per second.",
      quality: 92, speed: 95, vramMult: "0.25× F16",
      alternatives: ["Q5_K_M for a slight quality bump"],
    };
    if (priority === "Fit the largest model possible") return {
      format: "Q4_K_M",
      why: "Q4_K_M lets you fit 13B on 8GB with some layer offloading. Expect reduced speed but larger model capability.",
      quality: 92, speed: 70, vramMult: "0.25× F16",
      alternatives: ["IQ3_M to squeeze 13B fully into 8GB"],
      warning: "13B Q4_K_M at 8GB will require CPU offload for some layers — speed drops significantly.",
    };
    return {
      format: "Q5_K_M",
      why: "Q5_K_M at 7B gives excellent quality with comfortable VRAM headroom. Best balance at 6–8GB.",
      quality: 96, speed: 88, vramMult: "0.31× F16",
      alternatives: ["Q8_0 for maximum quality", "Q4_K_M for more speed"],
    };
  }

  // 10–12GB
  if (vram === "10–12GB") {
    if (priority === "Fit the largest model possible") return {
      format: "Q4_K_M",
      why: "Q4_K_M lets you fit 13B comfortably and push toward 20B with some offload.",
      quality: 92, speed: 88, vramMult: "0.25× F16",
      alternatives: ["IQ3_M to attempt larger models"],
    };
    if (priority === "Maximum quality") return {
      format: "Q8_0",
      why: "13B Q8_0 fits in 12GB. Near-lossless quality on a capable model size.",
      quality: 99, speed: 72, vramMult: "0.50× F16",
      alternatives: ["Q6_K as a quality/speed middle ground"],
    };
    return {
      format: "Q5_K_M",
      why: "Q5_K_M at 13B runs well in 10–12GB. Strong quality, good speed.",
      quality: 96, speed: 88, vramMult: "0.31× F16",
      alternatives: ["Q4_K_M for more speed", "Q6_K for more quality"],
    };
  }

  // 16GB
  if (vram === "16GB") {
    if (usecase === "Code generation") return {
      format: "Q6_K",
      why: "27B Q6_K fits in 16GB and gives excellent code quality. The extra precision over Q4 is meaningful for code.",
      quality: 98, speed: 82, vramMult: "0.38× F16",
      alternatives: ["Q5_K_M to save 2GB headroom", "Q8_0 at 13B for near-lossless"],
    };
    if (priority === "Maximum quality") return {
      format: "Q8_0",
      why: "13B Q8_0 in 16GB is near-lossless. If you can fit 20B Q6_K that's even better.",
      quality: 99, speed: 72, vramMult: "0.50× F16",
      alternatives: ["Q6_K at 27B if 27B fits your use case"],
    };
    return {
      format: "Q5_K_M",
      why: "27B Q5_K_M fits in 16GB comfortably. Best balance at this VRAM level.",
      quality: 96, speed: 85, vramMult: "0.31× F16",
      alternatives: ["Q6_K for more quality", "Q4_K_M for more speed"],
    };
  }

  // 24GB
  if (vram === "24GB") {
    if (usecase === "Long documents / RAG") return {
      format: "Q5_K_M",
      why: "At 24GB, Q5_K_M on 27B leaves KV cache headroom for long contexts. Critical for RAG workloads.",
      quality: 96, speed: 85, vramMult: "0.31× F16",
      alternatives: ["Q4_K_M for more KV cache headroom at long context"],
      warning: "Long context KV cache can use 4–8GB at 32K tokens. Leave headroom.",
    };
    if (priority === "Maximum quality") return {
      format: "Q8_0",
      why: "27B Q8_0 fits in 24GB (just). Near-lossless at a capable model size.",
      quality: 99, speed: 65, vramMult: "0.50× F16",
      alternatives: ["Q6_K for more speed with minimal quality loss"],
    };
    if (priority === "Fit the largest model possible") return {
      format: "IQ3_M",
      why: "IQ3_M lets you push toward 34B on 24GB. Better quality than Q3_K_M at similar size.",
      quality: 87, speed: 90, vramMult: "0.22× F16",
      alternatives: ["Q4_K_M at 27B for better quality"],
      warning: "34B IQ3_M may require 1–2 layers CPU offload. Expect some speed reduction.",
    };
    return {
      format: "Q6_K",
      why: "27B Q6_K at 24GB is the sweet spot. Excellent quality, good speed, comfortable headroom.",
      quality: 98, speed: 80, vramMult: "0.38× F16",
      alternatives: ["Q5_K_M for more speed", "Q8_0 for maximum quality"],
    };
  }

  // 48GB+
  if (vram === "48GB+ (multi-GPU)") {
    if (usecase === "Reasoning / math") return {
      format: "Q5_K_M",
      why: "70B Q5_K_M at 48GB gives near-maximum quality for reasoning tasks. The extra precision over Q4 measurably improves multi-step reasoning.",
      quality: 96, speed: 76, vramMult: "0.31× F16",
      alternatives: ["Q4_K_M if speed is critical", "Q6_K on systems with 56GB+"],
    };
    if (priority === "Best speed") return {
      format: "Q4_K_M",
      why: "70B Q4_K_M at 48GB runs at 21 tok/s on dual 3090 NVLink — fastest usable 70B config.",
      quality: 92, speed: 95, vramMult: "0.25× F16",
      alternatives: ["IQ4_NL for slightly better quality at similar speed"],
    };
    if (priority === "Maximum quality") return {
      format: "Q6_K",
      why: "70B Q6_K fits in 54GB. If your system has headroom above 48GB, this gives near-lossless quality.",
      quality: 98, speed: 70, vramMult: "0.38× F16",
      alternatives: ["Q5_K_M if 54GB is tight", "Q8_0 at 405B on A100 setups"],
      warning: "70B Q6_K requires ~54GB. Only viable on 3×24GB or 4×24GB+ setups.",
    };
    return {
      format: "Q4_K_M",
      why: "70B Q4_K_M is the standard for 48GB systems. Best tested, most community benchmarks available.",
      quality: 92, speed: 90, vramMult: "0.25× F16",
      alternatives: ["Q5_K_M for more quality", "IQ3_M to attempt 120B+ models"],
    };
  }

  return {
    format: "Q4_K_M",
    why: "Q4_K_M is the best default across all hardware — best balance of quality, speed, and compatibility.",
    quality: 92, speed: 95, vramMult: "0.25× F16",
    alternatives: ["Q5_K_M for more quality", "Q8_0 for near-lossless"],
  };
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-[var(--surface)] h-2">
        <div style={{ width: `${value}%`, background: color, height: "100%", transition: "width 0.5s" }} />
      </div>
      <span className="text-xs font-mono w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

export default function QuantPickerPage() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [step, setStep] = useState(0);

  const currentQ = QUESTIONS[step];
  const isComplete = step >= QUESTIONS.length;
  const rec = isComplete ? getRecommendation(answers) : null;

  const answer = (val: string) => {
    const next = { ...answers, [currentQ.id]: val };
    setAnswers(next);
    setStep(step + 1);
  };

  const reset = () => { setAnswers({}); setStep(0); };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">QUANT PICKER</h1>
          <p className="text-[var(--muted)]">Answer 3 questions, get the right quantization format for your setup.</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-10">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 transition-colors ${i < step ? "bg-cyan-400" : i === step ? "bg-cyan-400/40" : "bg-[var(--border)]"}`} />
          ))}
        </div>

        {!isComplete ? (
          <div className="animate-fade-in">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
              Question {step + 1} of {QUESTIONS.length}
            </div>
            <h2 className="text-2xl font-black font-mono mb-8">{currentQ.question}</h2>
            <div className="space-y-3">
              {currentQ.options.map((opt) => (
                <button key={opt} onClick={() => answer(opt)}
                  className="w-full text-left border border-[var(--border)] px-6 py-4 text-[var(--fg2)] font-mono text-sm hover:border-cyan-500/60 hover:bg-cyan-500/[0.03] hover:text-[var(--fg)] transition-all">
                  <span className="text-cyan-400 mr-3">›</span>{opt}
                </button>
              ))}
            </div>
          </div>
        ) : rec ? (
          <div className="animate-fade-in">
            <div className="text-xs uppercase tracking-widest text-cyan-400 mb-3">Recommendation</div>
            <div className="border-2 border-cyan-500/40 p-8 mb-6 bg-cyan-500/[0.03]">
              <div className="text-6xl font-black font-mono text-cyan-400 mb-4">{rec.format}</div>
              <p className="text-[var(--fg2)] leading-relaxed mb-6">{rec.why}</p>

              <div className="space-y-3 mb-6">
                <div>
                  <div className="text-xs text-[var(--muted)] uppercase tracking-widest mb-1">Quality</div>
                  <Bar value={rec.quality} color="#22d3ee" />
                </div>
                <div>
                  <div className="text-xs text-[var(--muted)] uppercase tracking-widest mb-1">Speed</div>
                  <Bar value={rec.speed} color="#4ade80" />
                </div>
              </div>

              <div className="text-xs font-mono text-[var(--muted)] border-t border-[var(--border)] pt-4">
                VRAM vs F16: <span className="text-[var(--fg2)]">{rec.vramMult}</span>
              </div>
            </div>

            {rec.warning && (
              <div className="border border-yellow-500/30 bg-yellow-500/[0.03] p-4 mb-6 text-sm text-yellow-400 font-mono">
                ⚠ {rec.warning}
              </div>
            )}

            <div className="border border-[var(--border)] p-5 mb-6">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">Alternatives to consider</div>
              <ul className="space-y-2">
                {rec.alternatives.map((a) => (
                  <li key={a} className="text-sm text-[var(--fg2)] font-mono">
                    <span className="text-cyan-400 mr-2">›</span>{a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary of answers */}
            <div className="border border-[var(--border)] p-5 mb-6 text-xs font-mono text-[var(--muted)] space-y-1">
              {QUESTIONS.map((q) => (
                <div key={q.id}><span className="text-[var(--fg2)]">{q.question.replace("?","")}: </span>{answers[q.id]}</div>
              ))}
            </div>

            <button onClick={reset}
              className="w-full border border-[var(--border)] py-3 text-xs uppercase tracking-widest font-mono text-[var(--muted)] hover:text-[var(--fg)] hover:border-zinc-500 transition-all">
              Start Over
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
