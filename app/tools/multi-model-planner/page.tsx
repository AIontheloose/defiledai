"use client";
import { useState } from "react";

const MODEL_LIBRARY = [
  { id: "phi3-mini",          label: "Phi-3 Mini 3.8B",           ollamaName: "phi3:mini",                                  vram: 3,  toks: 180, domain: "general"    },
  { id: "mistral-7b",         label: "Mistral 7B",                 ollamaName: "mistral:7b",                                 vram: 5,  toks: 138, domain: "general"    },
  { id: "mistral-ablit",      label: "Mistral 7B Abliterated",     ollamaName: "mannix/mistral-7b-instruct-abliterated",     vram: 5,  toks: 138, domain: "general"    },
  { id: "llama-8b",           label: "Llama 3.1 8B",               ollamaName: "llama3.1:8b",                                vram: 6,  toks: 128, domain: "general"    },
  { id: "qwen-7b",            label: "Qwen 2.5 7B",                ollamaName: "qwen2.5:7b",                                 vram: 5,  toks: 132, domain: "multilingual"},
  { id: "dolphin",            label: "Dolphin Mistral 7B",         ollamaName: "dolphin-mistral",                            vram: 5,  toks: 128, domain: "uncensored" },
  { id: "deepseek-r1-7b",     label: "DeepSeek R1 7B",             ollamaName: "deepseek-r1:7b",                             vram: 5,  toks: 120, domain: "reasoning"  },
  { id: "deepseek-r1-14b",    label: "DeepSeek R1 14B",            ollamaName: "deepseek-r1:14b",                            vram: 10, toks: 86,  domain: "reasoning"  },
  { id: "mathstral",          label: "Mathstral 7B",               ollamaName: "mathstral:7b",                               vram: 5,  toks: 138, domain: "math"       },
  { id: "phi3-medium",        label: "Phi-3 Medium 14B",           ollamaName: "phi3:medium",                                vram: 9,  toks: 68,  domain: "coding"     },
  { id: "qwen-coder-7b",      label: "Qwen 2.5 Coder 7B",          ollamaName: "qwen2.5-coder:7b",                           vram: 5,  toks: 132, domain: "coding"     },
  { id: "qwen-coder-14b",     label: "Qwen 2.5 Coder 14B",         ollamaName: "qwen2.5-coder:14b",                          vram: 10, toks: 80,  domain: "coding"     },
  { id: "qwen-coder-32b",     label: "Qwen 2.5 Coder 32B",         ollamaName: "qwen2.5-coder:32b",                          vram: 20, toks: 44,  domain: "coding"     },
  { id: "deepseek-r1-32b",    label: "DeepSeek R1 32B",            ollamaName: "deepseek-r1:32b",                            vram: 20, toks: 44,  domain: "reasoning"  },
  { id: "solar",              label: "SOLAR 10.7B",                 ollamaName: "solar:10.7b",                                vram: 7,  toks: 98,  domain: "reasoning"  },
  { id: "nous-hermes2",       label: "Nous Hermes 2",              ollamaName: "nous-hermes2",                               vram: 5,  toks: 130, domain: "general"    },
  { id: "llama-70b",          label: "Llama 3.1 70B",              ollamaName: "llama3.1:70b",                               vram: 40, toks: 21,  domain: "general"    },
  { id: "llama-70b-ablit",    label: "Llama 3.1 70B Abliterated",  ollamaName: "huihui_ai/llama3.1-abliterated:70b",         vram: 40, toks: 21,  domain: "uncensored" },
  { id: "meditron",           label: "Meditron 7B",                ollamaName: "meditron:7b",                                vram: 5,  toks: 130, domain: "medical"    },
  { id: "nomic-embed",        label: "Nomic Embed Text",           ollamaName: "nomic-embed-text",                           vram: 1,  toks: 0,   domain: "embedding"  },
  { id: "mxbai-embed",        label: "MxBAI Embed Large",          ollamaName: "mxbai-embed-large",                          vram: 1,  toks: 0,   domain: "embedding"  },
  { id: "llava-7b",           label: "LLaVA 7B (vision)",          ollamaName: "llava:7b",                                   vram: 6,  toks: 80,  domain: "vision"     },
];

const DOMAIN_COLORS: Record<string, string> = {
  general:     "text-cyan-400",
  coding:      "text-blue-400",
  reasoning:   "text-purple-400",
  math:        "text-green-400",
  uncensored:  "text-red-400",
  multilingual:"text-orange-400",
  medical:     "text-pink-400",
  embedding:   "text-zinc-400",
  vision:      "text-yellow-400",
};

const GPU_PRESETS = [
  { label: "RTX 4090",         vram: 24  },
  { label: "RTX 3090",         vram: 24  },
  { label: "RTX 4080",         vram: 16  },
  { label: "RTX 3080 10GB",    vram: 10  },
  { label: "RTX 4070 Ti",      vram: 12  },
  { label: "RTX 4070",         vram: 12  },
  { label: "A100 40GB",        vram: 40  },
  { label: "A100 80GB",        vram: 80  },
  { label: "RX 7900 XTX",      vram: 24  },
  { label: "Radeon 780M iGPU", vram: 8   },
  { label: "Apple M3 Pro",     vram: 36  },
  { label: "Apple M4 Max",     vram: 128 },
];

type LoadStrategy = "sequential" | "concurrent" | "keepalive0";

interface SelectedModel {
  modelId: string;
  keepAlive: number; // seconds, 0 = unload immediately
  priority: number;
}

export default function MultiModelPlannerPage() {
  const [gpuPreset, setGpuPreset] = useState("RTX 4090");
  const [customVram, setCustomVram] = useState(24);
  const [useCustom, setUseCustom] = useState(false);
  const [numGpus, setNumGpus] = useState(1);
  const [selected, setSelected] = useState<SelectedModel[]>([]);
  const [strategy, setStrategy] = useState<LoadStrategy>("keepalive0");
  const [search, setSearch] = useState("");

  const gpuVram = useCustom ? customVram : (GPU_PRESETS.find((g) => g.label === gpuPreset)?.vram ?? 24);
  const totalVram = gpuVram * numGpus;

  const toggleModel = (modelId: string) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.modelId === modelId);
      if (exists) return prev.filter((s) => s.modelId !== modelId);
      return [...prev, { modelId, keepAlive: 300, priority: prev.length + 1 }];
    });
  };

  const updateKeepAlive = (modelId: string, val: number) => {
    setSelected((prev) => prev.map((s) => s.modelId === modelId ? { ...s, keepAlive: val } : s));
  };

  const selectedModels = selected.map((s) => ({
    ...s,
    model: MODEL_LIBRARY.find((m) => m.id === s.modelId)!,
  })).filter((s) => s.model);

  const totalSelectedVram = selectedModels.reduce((sum, s) => sum + s.model.vram, 0);
  const maxSingleVram = selectedModels.length > 0 ? Math.max(...selectedModels.map((s) => s.model.vram)) : 0;

  // Sequential: only one model loaded at a time → max single model VRAM needed
  const sequentialVram = maxSingleVram;
  // Concurrent: all loaded simultaneously
  const concurrentVram = totalSelectedVram;
  // keep_alive=0: largest model + one-model-at-a-time cycling
  const keepalive0Vram = maxSingleVram;

  const activeVram = strategy === "concurrent" ? concurrentVram
    : strategy === "sequential" ? sequentialVram
    : keepalive0Vram;

  const fits = activeVram <= totalVram;
  const headroom = totalVram - activeVram;

  const generateModelfile = (s: typeof selectedModels[0]) => {
    const ka = s.keepAlive === 0 ? "0" : s.keepAlive === -1 ? "-1" : `${s.keepAlive}s`;
    return `FROM ${s.model.ollamaName}\nPARAMETER keep_alive ${ka}\n`;
  };

  const generateOllamaStart = () => {
    if (strategy === "concurrent") {
      return `# Load all models concurrently (${concurrentVram}GB total)\n${selectedModels.map((s) =>
        `ollama run ${s.model.ollamaName} --keepalive ${s.keepAlive === 0 ? "0" : s.keepAlive + "s"} &`
      ).join("\n")}`;
    }
    if (strategy === "keepalive0") {
      return `# Sequential with keep_alive=0 — only one model in VRAM at a time\n# Set keep_alive=0 so each model unloads before the next loads\n${selectedModels.map((s) =>
        `# Priority ${s.priority}: ${s.model.label}\nollama run ${s.model.ollamaName} --keepalive 0`
      ).join("\n")}`;
    }
    return `# Sequential loading — call models one at a time\n${selectedModels.map((s) =>
      `ollama run ${s.model.ollamaName}`
    ).join("\n")}`;
  };

  const filtered = MODEL_LIBRARY.filter((m) =>
    !search || m.label.toLowerCase().includes(search.toLowerCase()) ||
    m.ollamaName.toLowerCase().includes(search.toLowerCase()) ||
    m.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">MULTI-MODEL VRAM PLANNER</h1>
          <p className="text-[var(--muted)] max-w-3xl leading-relaxed">
            Plan running multiple Ollama models on a single GPU. Configure loading strategy —
            concurrent, sequential, or keep_alive=0 cycling — and see exactly what fits.
            Generates ready-to-use Modelfiles and startup scripts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: hardware + strategy */}
          <div className="space-y-6">
            <div className="border border-[var(--border)] p-4">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Hardware</div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">GPU</label>
                  <select
                    value={useCustom ? "custom" : gpuPreset}
                    onChange={(e) => {
                      if (e.target.value === "custom") { setUseCustom(true); }
                      else { setUseCustom(false); setGpuPreset(e.target.value); }
                    }}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    {GPU_PRESETS.map((g) => (
                      <option key={g.label} value={g.label}>{g.label} ({g.vram}GB)</option>
                    ))}
                    <option value="custom">Custom VRAM</option>
                  </select>
                </div>
                {useCustom && (
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">VRAM (GB)</label>
                    <input
                      type="number" value={customVram} min={1}
                      onChange={(e) => setCustomVram(parseInt(e.target.value) || 1)}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">Number of GPUs</label>
                  <input
                    type="number" value={numGpus} min={1} max={8}
                    onChange={(e) => setNumGpus(parseInt(e.target.value) || 1)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="border-t border-[var(--border)] pt-3 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Total available</span>
                    <span className="text-cyan-400">{totalVram} GB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy */}
            <div className="border border-[var(--border)] p-4">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Loading Strategy</div>
              <div className="space-y-2">
                {[
                  {
                    id: "keepalive0" as LoadStrategy,
                    label: "keep_alive=0 Cycling",
                    desc: "Unload each model before loading next. Only max-model VRAM required. Slowest (reload time per query).",
                    color: "text-green-400",
                  },
                  {
                    id: "sequential" as LoadStrategy,
                    label: "Sequential Loading",
                    desc: "Models loaded/unloaded via keep_alive timeout. Faster than cycling if keep_alive > query interval.",
                    color: "text-cyan-400",
                  },
                  {
                    id: "concurrent" as LoadStrategy,
                    label: "Concurrent (All Loaded)",
                    desc: "All models resident in VRAM simultaneously. Fastest response, highest VRAM requirement.",
                    color: "text-purple-400",
                  },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStrategy(s.id)}
                    className={`w-full text-left border p-3 transition-all text-xs ${
                      strategy === s.id
                        ? `border-${s.color.split("-")[1]}-500/50 bg-${s.color.split("-")[1]}-500/5`
                        : "border-[var(--border)] hover:border-zinc-500"
                    }`}
                  >
                    <div className={`font-mono font-bold mb-1 ${strategy === s.id ? s.color : "text-[var(--fg)]"}`}>
                      {s.label}
                    </div>
                    <div className="text-[var(--muted)] leading-relaxed">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* VRAM summary */}
            {selectedModels.length > 0 && (
              <div className={`border p-4 ${fits ? "border-green-500/40" : "border-red-500/40"}`}>
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">VRAM Summary</div>
                <div className={`text-3xl font-black font-mono ${fits ? "text-green-400" : "text-red-400"}`}>
                  {activeVram} GB
                </div>
                <div className={`text-xs font-mono mt-1 ${fits ? "text-green-400" : "text-red-400"}`}>
                  {fits ? `✓ ${headroom} GB headroom` : `✕ Over by ${-headroom} GB`}
                </div>
                <div className="mt-3 space-y-1 text-xs font-mono text-[var(--muted)]">
                  <div className="flex justify-between">
                    <span>Sequential / cycling</span>
                    <span className={sequentialVram <= totalVram ? "text-green-400" : "text-red-400"}>{sequentialVram} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Concurrent (all loaded)</span>
                    <span className={concurrentVram <= totalVram ? "text-green-400" : "text-red-400"}>{concurrentVram} GB</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Middle: model picker */}
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
              Model Library <span className="text-cyan-400">({selected.length} selected)</span>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter models…"
              className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] mb-3"
            />
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {filtered.map((m) => {
                const sel = !!selected.find((s) => s.modelId === m.id);
                const domColor = DOMAIN_COLORS[m.domain] ?? "text-zinc-400";
                const fitsAlone = m.vram <= totalVram;
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleModel(m.id)}
                    className={`w-full text-left border p-3 transition-all text-xs ${
                      sel ? "border-cyan-500/50 bg-cyan-500/5" : "border-[var(--border)] hover:border-zinc-600"
                    } ${!fitsAlone ? "opacity-40" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[var(--fg)] text-xs">{m.label}</span>
                      <span className={`text-xs font-mono ${domColor}`}>{m.domain}</span>
                    </div>
                    <div className="flex justify-between mt-1 text-[var(--muted)]">
                      <span>{m.ollamaName}</span>
                      <span>{m.vram} GB{m.toks > 0 ? ` · ~${m.toks} tok/s` : ""}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: selected models + output */}
          <div className="space-y-4">
            {selectedModels.length === 0 ? (
              <div className="border border-dashed border-[var(--border)] p-6 text-center text-[var(--muted)] text-xs font-mono">
                Select models from the library to plan your setup
              </div>
            ) : (
              <>
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">Selected Models</div>
                {selectedModels.map((s, i) => (
                  <div key={s.modelId} className="border border-[var(--border)] p-3 text-xs font-mono">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[var(--fg)]">{s.model.label}</span>
                      <span className="text-cyan-400">{s.model.vram} GB</span>
                    </div>
                    <div className="text-[var(--muted)] mb-2">{s.model.ollamaName}</div>
                    <div className="flex items-center gap-2">
                      <label className="text-[var(--muted)]">keep_alive:</label>
                      <select
                        value={s.keepAlive}
                        onChange={(e) => updateKeepAlive(s.modelId, parseInt(e.target.value))}
                        className="bg-[var(--bg)] border border-[var(--border)] px-2 py-1 font-mono text-xs text-[var(--fg)] focus:outline-none"
                      >
                        <option value={0}>0 (unload immediately)</option>
                        <option value={60}>60s</option>
                        <option value={300}>5m (default)</option>
                        <option value={600}>10m</option>
                        <option value={1800}>30m</option>
                        <option value={-1}>-1 (always loaded)</option>
                      </select>
                      <button
                        onClick={() => toggleModel(s.modelId)}
                        className="ml-auto text-[var(--muted)] hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {/* Generated config */}
                <div>
                  <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Startup Script</div>
                  <pre className="border border-[var(--border)] bg-[var(--surface)] p-3 text-xs font-mono text-[var(--fg)] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {generateOllamaStart()}
                  </pre>
                  <button
                    onClick={() => navigator.clipboard.writeText(generateOllamaStart())}
                    className="text-xs font-mono text-cyan-400 border border-cyan-500/30 px-3 py-1 mt-2 hover:border-cyan-400 transition-colors"
                  >
                    Copy Script
                  </button>
                </div>

                {strategy === "keepalive0" && (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Modelfiles</div>
                    <div className="space-y-2">
                      {selectedModels.map((s) => (
                        <div key={s.modelId}>
                          <div className="text-xs text-[var(--muted)] font-mono mb-1">Modelfile.{s.model.id}</div>
                          <pre className="border border-[var(--border)] bg-[var(--surface)] p-3 text-xs font-mono text-[var(--fg)] whitespace-pre">
                            {generateModelfile(s)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
