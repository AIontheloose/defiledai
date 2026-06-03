"use client";
import { useState } from "react";

// ─── PRESET MODELS ────────────────────────────────────────────────────────────
const PRESET_MODELS = [
  { label: "Phi-3 Mini 3.8B",        params: 3.8,  layers: 32,  hiddenSize: 3072,  heads: 32,  kvHeads: 32,  headDim: 96  },
  { label: "Mistral 7B",             params: 7.2,  layers: 32,  hiddenSize: 4096,  heads: 32,  kvHeads: 8,   headDim: 128 },
  { label: "Llama 3.1 8B",           params: 8.0,  layers: 32,  hiddenSize: 4096,  heads: 32,  kvHeads: 8,   headDim: 128 },
  { label: "Qwen 2.5 7B",            params: 7.6,  layers: 28,  hiddenSize: 3584,  heads: 28,  kvHeads: 4,   headDim: 128 },
  { label: "DeepSeek R1 14B",        params: 14.8, layers: 48,  hiddenSize: 5120,  heads: 40,  kvHeads: 8,   headDim: 128 },
  { label: "Qwen 2.5 Coder 32B",     params: 32.5, layers: 64,  hiddenSize: 5120,  heads: 40,  kvHeads: 8,   headDim: 128 },
  { label: "DeepSeek R1 32B",        params: 32.8, layers: 64,  hiddenSize: 5120,  heads: 40,  kvHeads: 8,   headDim: 128 },
  { label: "Llama 3.1 70B",          params: 70.6, layers: 80,  hiddenSize: 8192,  heads: 64,  kvHeads: 8,   headDim: 128 },
  { label: "Llama 3.1 405B",         params: 405,  layers: 126, hiddenSize: 16384, heads: 128, kvHeads: 16,  headDim: 128 },
  { label: "Qwen 2.5 72B",           params: 72.7, layers: 80,  hiddenSize: 8192,  heads: 64,  kvHeads: 8,   headDim: 128 },
];

// Bits per weight for each quant level
const QUANT_BITS: Record<string, number> = {
  "F16":     16,
  "Q8_0":    8.5,
  "Q6_K":    6.6,
  "Q5_K_M":  5.7,
  "Q4_K_M":  4.8,
  "Q4_0":    4.5,
  "Q3_K_M":  3.9,
  "Q2_K":    3.35,
  "IQ2_M":   2.7,
};

// Quality retention estimates (perplexity delta vs F16, lower = better)
const QUANT_QUALITY: Record<string, { label: string; color: string }> = {
  "F16":    { label: "Reference quality",        color: "text-green-400"  },
  "Q8_0":   { label: "Lossless (imperceptible)", color: "text-green-400"  },
  "Q6_K":   { label: "Excellent (≈0.1% loss)",   color: "text-green-400"  },
  "Q5_K_M": { label: "Very good (≈0.5% loss)",   color: "text-cyan-400"   },
  "Q4_K_M": { label: "Good (≈1-2% loss)",        color: "text-cyan-400"   },
  "Q4_0":   { label: "Acceptable (≈2-3% loss)",  color: "text-yellow-400" },
  "Q3_K_M": { label: "Noticeable degradation",   color: "text-orange-400" },
  "Q2_K":   { label: "Significant degradation",  color: "text-red-400"    },
  "IQ2_M":  { label: "Severe degradation",       color: "text-red-400"    },
};

// GPU presets (GB VRAM)
const GPU_PRESETS = [
  { label: "RTX 4090",        vram: 24  },
  { label: "RTX 4080",        vram: 16  },
  { label: "RTX 4070 Ti",     vram: 12  },
  { label: "RTX 4070",        vram: 12  },
  { label: "RTX 3090",        vram: 24  },
  { label: "RTX 3080 10GB",   vram: 10  },
  { label: "A100 40GB",       vram: 40  },
  { label: "A100 80GB",       vram: 80  },
  { label: "H100 80GB",       vram: 80  },
  { label: "RX 7900 XTX",     vram: 24  },
  { label: "RX 7800 XT",      vram: 16  },
  { label: "Radeon 780M iGPU",vram: 8   },
  { label: "Apple M3 Pro",    vram: 36  },
  { label: "Apple M4 Max",    vram: 128 },
  { label: "Custom",          vram: 0   },
];

function calcVRAM({
  params,
  layers,
  hiddenSize,
  kvHeads,
  headDim,
  quantBits,
  contextLen,
  batchSize,
  overhead,
}: {
  params: number;
  layers: number;
  hiddenSize: number;
  kvHeads: number;
  headDim: number;
  quantBits: number;
  contextLen: number;
  batchSize: number;
  overhead: number;
}) {
  // Weights
  const weightsGB = (params * 1e9 * quantBits) / (8 * 1024 ** 3);

  // KV Cache: 2 (K+V) × layers × kvHeads × headDim × contextLen × batchSize × 2 bytes (fp16)
  const kvCacheBytes = 2 * layers * kvHeads * headDim * contextLen * batchSize * 2;
  const kvCacheGB = kvCacheBytes / 1024 ** 3;

  // Runtime overhead (activations, graph, etc.)
  const overheadGB = overhead;

  const totalGB = weightsGB + kvCacheGB + overheadGB;

  return { weightsGB, kvCacheGB, overheadGB, totalGB };
}

export default function TrueVRAMCalculatorPage() {
  const [preset, setPreset] = useState("Mistral 7B");
  const [params, setParams]         = useState(7.2);
  const [layers, setLayers]         = useState(32);
  const [hiddenSize, setHiddenSize] = useState(4096);
  const [kvHeads, setKvHeads]       = useState(8);
  const [headDim, setHeadDim]       = useState(128);
  const [quant, setQuant]           = useState("Q4_K_M");
  const [contextLen, setContextLen] = useState(4096);
  const [batchSize, setBatchSize]   = useState(1);
  const [overhead, setOverhead]     = useState(0.5);
  const [gpuPreset, setGpuPreset]   = useState("RTX 4090");
  const [customVram, setCustomVram] = useState(24);
  const [numGpus, setNumGpus]       = useState(1);

  const applyPreset = (label: string) => {
    const p = PRESET_MODELS.find((m) => m.label === label);
    if (!p) return;
    setPreset(label);
    setParams(p.params);
    setLayers(p.layers);
    setHiddenSize(p.hiddenSize);
    setKvHeads(p.kvHeads);
    setHeadDim(p.headDim);
  };

  const quantBits = QUANT_BITS[quant] ?? 4.8;
  const result = calcVRAM({ params, layers, hiddenSize, kvHeads, headDim, quantBits, contextLen, batchSize, overhead });

  const gpuVram = gpuPreset === "Custom"
    ? customVram
    : (GPU_PRESETS.find((g) => g.label === gpuPreset)?.vram ?? 24);
  const totalAvailable = gpuVram * numGpus;
  const fits = result.totalGB <= totalAvailable;
  const headroom = totalAvailable - result.totalGB;

  // Max context that fits
  const kvPerToken = (2 * layers * kvHeads * headDim * batchSize * 2) / 1024 ** 3;
  const vramForKV = totalAvailable - result.weightsGB - overhead;
  const maxContext = kvPerToken > 0 ? Math.floor(vramForKV / kvPerToken) : 0;

  // All quants comparison
  const quantComparison = Object.entries(QUANT_BITS).map(([q, bits]) => {
    const r = calcVRAM({ params, layers, hiddenSize, kvHeads, headDim, quantBits: bits, contextLen, batchSize, overhead });
    return { quant: q, ...r, fits: r.totalGB <= totalAvailable };
  });

  const num = (v: number, d = 2) => v.toFixed(d);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">TRUE VRAM CALCULATOR</h1>
          <p className="text-[var(--muted)] max-w-3xl leading-relaxed">
            Most VRAM calculators only count weights. This one computes the real footprint:
            weights + KV cache at your context length + runtime overhead. Uses the actual
            architectural parameters of each model.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left — inputs */}
          <div className="space-y-6">
            {/* Model preset */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Model Preset</label>
              <select
                value={preset}
                onChange={(e) => applyPreset(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2.5 font-mono text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="">— Custom —</option>
                {PRESET_MODELS.map((m) => (
                  <option key={m.label} value={m.label}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Architecture params */}
            <div className="border border-[var(--border)] p-4">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Model Architecture</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Parameters (B)", value: params, set: setParams, step: 0.1 },
                  { label: "Layers",          value: layers, set: setLayers, step: 1   },
                  { label: "Hidden Size",     value: hiddenSize, set: setHiddenSize, step: 64 },
                  { label: "KV Heads",        value: kvHeads, set: setKvHeads, step: 1 },
                  { label: "Head Dim",        value: headDim, set: setHeadDim, step: 8 },
                ].map(({ label, value, set, step }) => (
                  <div key={label}>
                    <label className="block text-xs text-[var(--muted)] mb-1">{label}</label>
                    <input
                      type="number"
                      value={value}
                      step={step}
                      onChange={(e) => { set(parseFloat(e.target.value) || 0); setPreset(""); }}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Quantization */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Quantization</label>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.keys(QUANT_BITS).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuant(q)}
                    className={`text-xs font-mono py-2 border transition-all ${
                      quant === q
                        ? "border-cyan-400 bg-cyan-500/10 text-cyan-400"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className={`text-xs font-mono mt-2 ${QUANT_QUALITY[quant]?.color}`}>
                {QUANT_QUALITY[quant]?.label}
              </div>
            </div>

            {/* Inference params */}
            <div className="border border-[var(--border)] p-4">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Inference Parameters</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Context Length (tokens)", value: contextLen, set: setContextLen, step: 512, min: 512 },
                  { label: "Batch Size",               value: batchSize,  set: setBatchSize,  step: 1,   min: 1   },
                  { label: "Runtime Overhead (GB)",    value: overhead,   set: setOverhead,   step: 0.1, min: 0   },
                ].map(({ label, value, set, step, min }) => (
                  <div key={label} className="col-span-2 md:col-span-1">
                    <label className="block text-xs text-[var(--muted)] mb-1">{label}</label>
                    <input
                      type="number"
                      value={value}
                      step={step}
                      min={min}
                      onChange={(e) => set(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* GPU */}
            <div className="border border-[var(--border)] p-4">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Hardware</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">GPU</label>
                  <select
                    value={gpuPreset}
                    onChange={(e) => setGpuPreset(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    {GPU_PRESETS.map((g) => (
                      <option key={g.label} value={g.label}>{g.label} {g.vram > 0 ? `(${g.vram}GB)` : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--muted)] mb-1">
                    {gpuPreset === "Custom" ? "VRAM (GB)" : "Number of GPUs"}
                  </label>
                  <input
                    type="number"
                    value={gpuPreset === "Custom" ? customVram : numGpus}
                    min={1}
                    onChange={(e) => gpuPreset === "Custom" ? setCustomVram(parseInt(e.target.value) || 1) : setNumGpus(parseInt(e.target.value) || 1)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right — results */}
          <div className="space-y-4">
            {/* Main result */}
            <div className={`border p-6 ${fits ? "border-green-500/40 bg-green-500/[0.03]" : "border-red-500/40 bg-red-500/[0.03]"}`}>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4">Total VRAM Required</div>
              <div className={`text-5xl font-black font-mono mb-1 ${fits ? "text-green-400" : "text-red-400"}`}>
                {num(result.totalGB)} GB
              </div>
              <div className={`text-sm font-mono mb-4 ${fits ? "text-green-400" : "text-red-400"}`}>
                {fits
                  ? `✓ Fits with ${num(headroom)} GB headroom`
                  : `✕ Exceeds by ${num(-headroom)} GB`}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs font-mono">
                {[
                  { label: "Model weights", value: result.weightsGB, color: "bg-cyan-400" },
                  { label: `KV cache (${contextLen.toLocaleString()} ctx × ${batchSize} batch)`, value: result.kvCacheGB, color: "bg-purple-400" },
                  { label: "Runtime overhead", value: result.overheadGB, color: "bg-zinc-500" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[var(--muted)] mb-1">
                      <span>{label}</span>
                      <span className="text-[var(--fg)]">{num(value)} GB</span>
                    </div>
                    <div className="h-1.5 bg-[var(--surface)] overflow-hidden">
                      <div
                        className={`h-full ${color}`}
                        style={{ width: `${Math.min(100, (value / result.totalGB) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="border-t border-[var(--border)] pt-2 flex justify-between">
                  <span className="text-[var(--muted)]">Available ({gpuPreset === "Custom" ? "Custom" : `${numGpus}× ${gpuPreset}`})</span>
                  <span>{totalAvailable} GB</span>
                </div>
              </div>
            </div>

            {/* Max context */}
            <div className="border border-[var(--border)] p-4">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Max Context on This Hardware</div>
              <div className="text-2xl font-black font-mono text-cyan-400">
                {maxContext > 0 ? maxContext.toLocaleString() : "—"} <span className="text-sm font-normal text-[var(--muted)]">tokens</span>
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                After weights + overhead, {num(Math.max(0, vramForKV))} GB remains for KV cache
              </div>
            </div>

            {/* Quant comparison table */}
            <div className="border border-[var(--border)] p-4">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">All Quants Comparison</div>
              <div className="space-y-1.5 text-xs font-mono">
                {quantComparison.map(({ quant: q, totalGB, weightsGB, kvCacheGB, fits: qfits }) => (
                  <div
                    key={q}
                    className={`flex items-center gap-2 px-2 py-1.5 ${q === quant ? "bg-[var(--surface)]" : ""}`}
                  >
                    <span className="w-16 text-[var(--fg)]">{q}</span>
                    <span className="w-16 text-[var(--muted)]">{num(weightsGB)} GB</span>
                    <span className="text-[var(--muted)]">+{num(kvCacheGB)} KV</span>
                    <span className={`ml-auto font-bold ${qfits ? "text-green-400" : "text-red-400"}`}>
                      {num(totalGB)} GB {qfits ? "✓" : "✕"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formula note */}
            <div className="border border-[var(--border)] p-4 text-xs font-mono text-[var(--muted)]">
              <div className="text-[var(--fg)] mb-2">Formula</div>
              <div className="space-y-1 leading-relaxed">
                <div>weights = params × bits / 8</div>
                <div>kv_cache = 2 × layers × kv_heads × head_dim × ctx × batch × 2B</div>
                <div>total = weights + kv_cache + overhead</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
