"use client";

import { useMemo, useState } from "react";

type UseCase =
  | "general"
  | "roleplay"
  | "coding"
  | "agentic"
  | "longcontext"
  | "multimodal";

type Priority = "balanced" | "speed" | "quality";

interface Stack {
  model: string;
  quant: string;
  backend: string;
  minVRAM: number;
  recommendedRAM: number;
  context: string;
  speed: number;
  quality: number;
  confidence: number;
  useCases: UseCase[];
  deploy: string;
}

const STACKS: Stack[] = [
  {
    model: "Gemma 3 12B",
    quant: "Q5_K_M",
    backend: "llama.cpp",
    minVRAM: 12,
    recommendedRAM: 32,
    context: "128k",
    speed: 90,
    quality: 72,
    confidence: 88,
    useCases: ["general"],
    deploy: "ollama run gemma3:12b",
  },

  {
    model: "Qwen 3 32B",
    quant: "Q4_K_M",
    backend: "ExLlamaV2",
    minVRAM: 24,
    recommendedRAM: 64,
    context: "128k",
    speed: 76,
    quality: 89,
    confidence: 94,
    useCases: ["general", "coding"],
    deploy: "ollama run qwen3:32b",
  },

  {
    model: "Llama 3.1 70B",
    quant: "Q4_K_M",
    backend: "ExLlamaV2",
    minVRAM: 48,
    recommendedRAM: 64,
    context: "128k",
    speed: 58,
    quality: 95,
    confidence: 96,
    useCases: ["general", "roleplay"],
    deploy: "ollama run llama3.1:70b",
  },

  {
    model: "DeepSeek V3",
    quant: "Q4",
    backend: "TensorRT-LLM",
    minVRAM: 80,
    recommendedRAM: 128,
    context: "128k",
    speed: 52,
    quality: 99,
    confidence: 97,
    useCases: ["agentic"],
    deploy: "docker run vllm/vllm-openai",
  },

  {
    model: "Llama 3.2 11B Vision",
    quant: "Q5_K_M",
    backend: "llama.cpp",
    minVRAM: 16,
    recommendedRAM: 32,
    context: "128k",
    speed: 82,
    quality: 84,
    confidence: 91,
    useCases: ["multimodal"],
    deploy: "ollama run llama3.2-vision",
  },

  {
    model: "Qwen 3 32B",
    quant: "Q5_K_M",
    backend: "ExLlamaV2",
    minVRAM: 32,
    recommendedRAM: 64,
    context: "256k",
    speed: 70,
    quality: 92,
    confidence: 95,
    useCases: ["longcontext"],
    deploy: "ollama run qwen3:32b",
  },
];

export default function StackForge() {
  const [gpuCount, setGpuCount] = useState(1);
  const [vramPerGpu, setVramPerGpu] = useState(24);
  const [systemRam, setSystemRam] = useState(64);
  const [useCase, setUseCase] = useState<UseCase>("general");
  const [priority, setPriority] =
    useState<Priority>("balanced");

  const totalVRAM = gpuCount * vramPerGpu;
  const totalMemory = totalVRAM + systemRam;

  const availableStacks = useMemo(() => {
    return STACKS.filter(
      (s) =>
        s.useCases.includes(useCase) &&
        totalVRAM >= s.minVRAM
    );
  }, [useCase, totalVRAM]);

  const bestStack = useMemo(() => {
    if (!availableStacks.length) return null;

    const sorted = [...availableStacks];

    if (priority === "speed") {
      sorted.sort((a, b) => b.speed - a.speed);
    } else if (priority === "quality") {
      sorted.sort((a, b) => b.quality - a.quality);
    } else {
      sorted.sort(
        (a, b) =>
          b.speed +
          b.quality -
          (a.speed + a.quality)
      );
    }

    return sorted[0];
  }, [availableStacks, priority]);

  const alternatives = useMemo(() => {
    return availableStacks
      .filter((s) => s !== bestStack)
      .slice(0, 3);
  }, [availableStacks, bestStack]);

  if (!bestStack) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-4xl font-bold mb-4">
          StackForge
        </h1>

        <p>
          No suitable model found for your hardware.
        </p>
      </main>
    );
  }

  const offloadRequired =
    totalMemory <
    bestStack.minVRAM + bestStack.recommendedRAM;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 border border-cyan-500 text-cyan-400 text-xs uppercase tracking-widest mb-6">
            DefiledAI Recommendation Engine
          </div>

          <h1 className="text-6xl font-black mb-4">
            STACKFORGE
          </h1>

          <p className="text-zinc-400 text-xl">
            Build the ideal local LLM stack.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">

          <div className="lg:col-span-4 space-y-8">

            <div className="border border-zinc-800 p-8">
              <h2 className="mb-6 font-bold">
                Hardware
              </h2>

              <div className="space-y-5">

                <input
                  type="number"
                  value={gpuCount}
                  onChange={(e) =>
                    setGpuCount(
                      Number(e.target.value)
                    )
                  }
                  className="w-full p-3 bg-zinc-900"
                />

                <input
                  type="number"
                  value={vramPerGpu}
                  onChange={(e) =>
                    setVramPerGpu(
                      Number(e.target.value)
                    )
                  }
                  className="w-full p-3 bg-zinc-900"
                />

                <input
                  type="number"
                  value={systemRam}
                  onChange={(e) =>
                    setSystemRam(
                      Number(e.target.value)
                    )
                  }
                  className="w-full p-3 bg-zinc-900"
                />
              </div>
            </div>

            <div className="border border-zinc-800 p-8">
              <h2 className="mb-6 font-bold">
                Priority
              </h2>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as Priority
                  )
                }
                className="w-full p-3 bg-zinc-900"
              >
                <option value="balanced">
                  Balanced
                </option>
                <option value="speed">
                  Speed
                </option>
                <option value="quality">
                  Quality
                </option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-8">

            <div className="border border-cyan-500 p-10">

              <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2">
                Recommended Stack
              </div>

              <h2 className="text-5xl font-bold mb-8">
                {bestStack.model}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <Info
                  label="Quant"
                  value={bestStack.quant}
                />

                <Info
                  label="Backend"
                  value={bestStack.backend}
                />

                <Info
                  label="Context"
                  value={bestStack.context}
                />

                <Info
                  label="Confidence"
                  value={`${bestStack.confidence}%`}
                />

                <Info
                  label="Quality Score"
                  value={`${bestStack.quality}/100`}
                />

                <Info
                  label="Speed Score"
                  value={`${bestStack.speed}/100`}
                />
              </div>

              <div className="mt-10 border-t border-zinc-800 pt-8">

                <div className="mb-3">
                  Total VRAM: {totalVRAM} GB
                </div>

                <div className="mb-3">
                  Total Memory: {totalMemory} GB
                </div>

                {offloadRequired ? (
                  <div className="text-yellow-400">
                    CPU offload likely required.
                  </div>
                ) : (
                  <div className="text-green-400">
                    Fully fits in memory.
                  </div>
                )}
              </div>

              <div className="mt-10">
                <div className="text-sm uppercase mb-3">
                  Deployment
                </div>

                <pre className="bg-black p-4 overflow-x-auto">
                  {bestStack.deploy}
                </pre>
              </div>
            </div>

            <div className="mt-10 border border-zinc-800 p-8">

              <h3 className="text-xl font-bold mb-6">
                Alternatives
              </h3>

              <div className="space-y-4">
                {alternatives.map((alt) => (
                  <div
                    key={`${alt.model}-${alt.quant}`}
                    className="border border-zinc-800 p-4"
                  >
                    <div className="font-semibold">
                      {alt.model}
                    </div>

                    <div className="text-sm text-zinc-400">
                      {alt.quant} • {alt.backend}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-zinc-800 p-4">
      <div className="text-zinc-500 text-sm mb-1">
        {label}
      </div>

      <div className="font-semibold">
        {value}
      </div>
    </div>
  );
}