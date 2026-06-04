"use client";
import { useState } from "react";

type UseCase = "general" | "roleplay" | "coding" | "agentic" | "longcontext" | "multimodal";

interface Stack {
  model: string;
  quant: string;
  backend: string;
  speed: string;
  context: string;
  rating: string;
  bestFor: string;
  color: string;
}

export default function StackForge() {
  const [gpuCount, setGpuCount] = useState(1);
  const [vramPerGpu, setVramPerGpu] = useState(24);
  const [systemRam, setSystemRam] = useState(64);
  const [useCase, setUseCase] = useState<UseCase>("general");
  const [priority, setPriority] = useState<"balanced" | "speed" | "quality">("balanced");

  const totalVRAM = gpuCount * vramPerGpu;

  const getBestStack = (): Stack => {
    let stack: Stack = {
      model: "Llama 3.1 70B",
      quant: "Q5_K_M",
      backend: "ExLlama2",
      speed: "52-68 t/s",
      context: "128k",
      rating: "Excellent",
      bestFor: "Balanced Performance",
      color: "cyan"
    };

    // Hardware Tier Logic
    if (totalVRAM >= 100) {
      stack = { model: "Llama 3.1 70B", quant: "Q6_K", backend: "vLLM", speed: "60-78 t/s", context: "128k+", rating: "Outstanding", bestFor: "High-End Setup", color: "emerald" };
    } else if (totalVRAM >= 48) {
      stack = { model: "Llama 3.1 70B", quant: "Q5_K_M", backend: "ExLlama2", speed: "50-65 t/s", context: "128k", rating: "Excellent", bestFor: "Sweet Spot", color: "cyan" };
    } else if (totalVRAM >= 24) {
      stack = { model: "Llama 3.1 8B", quant: "Q6_K", backend: "ExLlama2", speed: "78-98 t/s", context: "64k", rating: "Very Strong", bestFor: "Fast Daily Driver", color: "amber" };
    } else {
      stack = { model: "Gemma 2 9B", quant: "Q5_K_M", backend: "llama.cpp", speed: "58-75 t/s", context: "32k", rating: "Solid", bestFor: "Efficient", color: "violet" };
    }

    // Use Case Overrides
    if (useCase === "coding") stack.model = "Qwen 2.5 Coder 32B";
    if (useCase === "roleplay") stack.model = "Llama 3.1 70B (Abliterated)";
    if (useCase === "agentic") stack.backend = "vLLM";
    if (useCase === "longcontext") stack.context = "128k+";
    if (useCase === "multimodal") stack.model = "Llama 3.2 11B Vision";

    // Priority Adjustments
    if (priority === "speed") {
      stack.quant = stack.quant.includes("Q6") ? "Q4_K_M" : "Q4_K_S";
      stack.speed = stack.speed.replace(/\d+/, n => String(Math.floor(parseInt(n) * 1.4)));
    }
    if (priority === "quality") {
      stack.quant = "Q6_K";
      stack.speed = stack.speed.replace(/\d+/, n => String(Math.floor(parseInt(n) * 0.7)));
    }

    return stack;
  };

  const mainStack = getBestStack();

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] text-xs uppercase tracking-[3px] font-mono mb-4">DefiledAI Flagship</div>
          <h1 className="text-6xl md:text-7xl font-black font-mono mb-4 tracking-tighter">STACKFORGE</h1>
          <p className="text-2xl text-[var(--muted)] max-w-2xl mx-auto">
            One decision engine.<br />Perfect local LLM stack.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border border-[var(--border)] p-10">
              <h2 className="font-mono uppercase tracking-widest text-sm mb-8">YOUR HARDWARE</h2>
              
              <div className="space-y-8">
                <div>
                  <label className="text-[var(--muted)] text-sm block mb-3">GPU COUNT</label>
                  <input 
                    type="number" 
                    value={gpuCount} 
                    onChange={(e) => setGpuCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-transparent border-b border-[var(--border)] pb-4 text-5xl font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[var(--muted)] text-sm block mb-3">VRAM PER GPU (GB)</label>
                  <input 
                    type="number" 
                    value={vramPerGpu} 
                    onChange={(e) => setVramPerGpu(parseInt(e.target.value) || 24)}
                    className="w-full bg-transparent border-b border-[var(--border)] pb-4 text-5xl font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[var(--muted)] text-sm block mb-3">SYSTEM RAM (GB)</label>
                  <input 
                    type="number" 
                    value={systemRam} 
                    onChange={(e) => setSystemRam(parseInt(e.target.value) || 64)}
                    className="w-full bg-transparent border-b border-[var(--border)] pb-4 text-5xl font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border border-[var(--border)] p-10">
              <h2 className="font-mono uppercase tracking-widest text-sm mb-6">USE CASE</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "general", label: "Chat", emoji: "💬" },
                  { key: "roleplay", label: "RP", emoji: "🎭" },
                  { key: "coding", label: "Code", emoji: "💻" },
                  { key: "agentic", label: "Agents", emoji: "🤖" },
                  { key: "longcontext", label: "Long", emoji: "📜" },
                  { key: "multimodal", label: "Vision", emoji: "👁️" },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setUseCase(item.key as UseCase)}
                    className={`aspect-square flex flex-col items-center justify-center border transition-all ${useCase === item.key ? "border-cyan-400 bg-cyan-500/10" : "border-[var(--border)] hover:border-zinc-600"}`}
                  >
                    <span className="text-4xl mb-2">{item.emoji}</span>
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7">
            <div className="sticky top-8">
              <div className={`border border-[var(--accent)]/50 p-12 bg-[var(--surface)]`}>
                <div className="uppercase text-xs tracking-widest mb-2 text-[var(--accent)]">RECOMMENDED STACK</div>
                <h3 className="text-4xl font-bold mb-8 leading-none">{mainStack.model}</h3>

                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--muted)]">Quantization</span>
                    <span className="font-mono text-xl font-bold text-cyan-400">{mainStack.quant}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--muted)]">Backend</span>
                    <span className="font-mono text-xl">{mainStack.backend}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--muted)]">Expected Speed</span>
                    <span className="font-mono text-2xl text-green-400">{mainStack.speed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--muted)]">Max Context</span>
                    <span className="font-mono text-xl">{mainStack.context}</span>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--border)] text-[var(--muted)]">
                  Optimized for <span className="text-white">{mainStack.bestFor}</span>. 
                  This is currently the strongest configuration for your hardware and goals.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}