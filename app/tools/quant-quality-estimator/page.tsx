"use client";
import { useState } from "react";

// ─── TYPES ─────────────────────────────────────────────────────────────────────
type QuantType = keyof typeof QUANT_DATA;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const QUANT_DATA = {
  "F16":    { bits: 16,   label: "F16",    short: "Full precision baseline" },
  "Q8_0":   { bits: 8.5,  label: "Q8_0",   short: "Near-lossless" },
  "Q6_K":   { bits: 6.6,  label: "Q6_K",   short: "Excellent quality" },
  "Q5_K_M": { bits: 5.7,  label: "Q5_K_M", short: "Very good" },
  "Q5_K_S": { bits: 5.5,  label: "Q5_K_S", short: "Good, slightly lower" },
  "Q4_K_M": { bits: 4.8,  label: "Q4_K_M", short: "Good — recommended default" },
  "Q4_K_S": { bits: 4.6,  label: "Q4_K_S", short: "Slightly compressed" },
  "Q4_0":   { bits: 4.5,  label: "Q4_0",   short: "Legacy, avoid for Q4_K_M" },
  "Q3_K_L": { bits: 4.0,  label: "Q3_K_L", short: "Noticeable on small models" },
  "Q3_K_M": { bits: 3.9,  label: "Q3_K_M", short: "Meaningful loss" },
  "Q3_K_S": { bits: 3.5,  label: "Q3_K_S", short: "Significant degradation" },
  "Q2_K":   { bits: 3.35, label: "Q2_K",   short: "Severe — emergency use only" },
  "IQ2_M":  { bits: 2.7,  label: "IQ2_M",  short: "Extreme compression" },
  "IQ1_M":  { bits: 1.75, label: "IQ1_M",  short: "Near-unusable" },
} as const;

const PPLX_DELTA: Record<QuantType, Record<string, number>> = {
  "F16":    { "3B": 0,    "7B": 0,    "13B": 0,    "34B": 0,    "70B+": 0    },
  "Q8_0":   { "3B": 0.05, "7B": 0.04, "13B": 0.03, "34B": 0.02, "70B+": 0.01 },
  "Q6_K":   { "3B": 0.2,  "7B": 0.12, "13B": 0.08, "34B": 0.06, "70B+": 0.04 },
  "Q5_K_M": { "3B": 0.4,  "7B": 0.25, "13B": 0.18, "34B": 0.12, "70B+": 0.08 },
  "Q5_K_S": { "3B": 0.5,  "7B": 0.32, "13B": 0.22, "34B": 0.16, "70B+": 0.10 },
  "Q4_K_M": { "3B": 0.8,  "7B": 0.48, "13B": 0.35, "34B": 0.25, "70B+": 0.18 },
  "Q4_K_S": { "3B": 1.0,  "7B": 0.62, "13B": 0.45, "34B": 0.32, "70B+": 0.22 },
  "Q4_0":   { "3B": 1.4,  "7B": 0.88, "13B": 0.62, "34B": 0.44, "70B+": 0.30 },
  "Q3_K_L": { "3B": 2.5,  "7B": 1.6,  "13B": 1.1,  "34B": 0.8,  "70B+": 0.55 },
  "Q3_K_M": { "3B": 3.2,  "7B": 2.1,  "13B": 1.5,  "34B": 1.0,  "70B+": 0.70 },
  "Q3_K_S": { "3B": 4.5,  "7B": 3.0,  "13B": 2.1,  "34B": 1.5,  "70B+": 1.0  },
  "Q2_K":   { "3B": 9.0,  "7B": 6.2,  "13B": 4.5,  "34B": 3.2,  "70B+": 2.2  },
  "IQ2_M":  { "3B": 12,   "7B": 8.5,  "13B": 6.0,  "34B": 4.2,  "70B+": 2.9  },
  "IQ1_M":  { "3B": 28,   "7B": 18,   "13B": 13,   "34B": 9,    "70B+": 6    },
};

const SIZE_TIERS = ["3B", "7B", "13B", "34B", "70B+"] as const;
type SizeTier = typeof SIZE_TIERS[number];

const BASE_7B_VRAM: Record<QuantType, number> = {
  "F16":    14.0,
  "Q8_0":   7.7,
  "Q6_K":   6.1,
  "Q5_K_M": 5.3,
  "Q5_K_S": 5.1,
  "Q4_K_M": 4.6,
  "Q4_K_S": 4.4,
  "Q4_0":   4.2,
  "Q3_K_L": 3.8,
  "Q3_K_M": 3.6,
  "Q3_K_S": 3.3,
  "Q2_K":   3.1,
  "IQ2_M":  2.7,
  "IQ1_M":  2.2,
};

const PARAM_MULTIPLIERS: Record<SizeTier, number> = {
  "3B": 3/7,
  "7B": 1,
  "13B": 13/7,
  "34B": 34/7,
  "70B+": 70/7,
};

const MODEL_PRESETS = [
  { label: "Mistral 7B / Llama 3.1 8B", tier: "7B" as SizeTier,  params: 7 },
  { label: "Phi-3 Mini 3.8B",           tier: "3B" as SizeTier,  params: 3.8 },
  { label: "DeepSeek R1 14B",           tier: "13B" as SizeTier, params: 14 },
  { label: "Qwen 2.5 Coder 32B",        tier: "34B" as SizeTier, params: 32 },
  { label: "Llama 3.1 70B",             tier: "70B+" as SizeTier, params: 70 },
];

const getColor = (delta: number): string => {
  if (delta === 0) return "#4ade80";
  if (delta < 0.1) return "#4ade80";
  if (delta < 0.5) return "#22d3ee";
  if (delta < 1.0) return "#fbbf24";
  if (delta < 3.0) return "#f97316";
  return "#f87171";
};

const getLabel = (delta: number): string => {
  if (delta === 0) return "Baseline";
  if (delta < 0.1) return "Imperceptible";
  if (delta < 0.5) return "Excellent";
  if (delta < 1.0) return "Good";
  if (delta < 2.0) return "Noticeable";
  if (delta < 5.0) return "Significant";
  return "Severe";
};

export default function QuantQualityEstimatorPage() {
  const [selectedTier, setSelectedTier] = useState<SizeTier>("7B");
  const [selectedQuant, setSelectedQuant] = useState<QuantType>("Q4_K_M");
  const [availableVram, setAvailableVram] = useState(8);

  const quantList = Object.keys(QUANT_DATA) as QuantType[];

  // VRAM for selected tier at each quant
  const mult = PARAM_MULTIPLIERS[selectedTier];
  const vramByQuant = (q: QuantType) => (BASE_7B_VRAM[q] ?? 5) * mult;

  // What quants fit in available VRAM
  const fittingQuants = quantList.filter((q) => vramByQuant(q) <= availableVram);

  // Best quality quant that fits
  const bestFit = fittingQuants.length > 0 ? fittingQuants[0] : null;

  const selectedDelta = PPLX_DELTA[selectedQuant][selectedTier] ?? 0;
  const selectedVram = vramByQuant(selectedQuant);

  // Chart: max delta for scaling
  const maxDelta = Math.max(...quantList.map((q) => PPLX_DELTA[q]?.[selectedTier] ?? 0));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">QUANT QUALITY ESTIMATOR</h1>
          <p className="text-[var(--muted)] max-w-3xl leading-relaxed">
            Visualize the real quality/size tradeoff for every quantization level. Based on perplexity
            benchmarks across model sizes. Larger models tolerate aggressive quantization far better than
            smaller ones — this tool shows you exactly where the cliff is.
          </p>
        </div>

        {/* Config row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Model Size */}
          <div className="border border-[var(--border)] p-4">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">Model Size</div>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {SIZE_TIERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  className={`text-xs font-mono py-2 border transition-all ${
                    selectedTier === t
                      ? "border-cyan-400 bg-cyan-500/10 text-cyan-400"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="text-xs text-[var(--muted)] mb-3">Quick presets:</div>
            <div className="space-y-1">
              {MODEL_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setSelectedTier(p.tier)}
                  className="w-full text-left text-xs font-mono text-[var(--muted)] hover:text-[var(--fg)] transition-colors py-0.5"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Available VRAM */}
          <div className="border border-[var(--border)] p-4">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">Available VRAM (GB)</div>
            <input
              type="number"
              value={availableVram}
              min={1}
              max={200}
              step={1}
              onChange={(e) => setAvailableVram(parseInt(e.target.value) || 1)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2.5 font-mono text-lg text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] mb-4"
            />
            <div className="text-xs text-[var(--muted)] mb-2">Quants that fit:</div>
            <div className="flex flex-wrap gap-1">
              {fittingQuants.map((q) => (
                <span
                  key={q}
                  className="text-xs font-mono px-1.5 py-0.5 bg-green-400/10 text-green-400 border border-green-400/20"
                >
                  {q}
                </span>
              ))}
              {fittingQuants.length === 0 && (
                <span className="text-xs text-red-400 font-mono">Nothing fits</span>
              )}
            </div>
            {bestFit && (
              <div className="mt-3 text-xs font-mono">
                <span className="text-[var(--muted)]">Best quality fit: </span>
                <span className="text-cyan-400 font-bold">{bestFit}</span>
              </div>
            )}
          </div>

          {/* Selected quant result */}
          <div className={`border p-4 ${
            selectedDelta === 0 ? "border-green-500/40" :
            selectedDelta < 1 ? "border-cyan-500/40" :
            selectedDelta < 3 ? "border-yellow-500/40" : "border-red-500/40"
          }`}>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">Selected: {selectedQuant}</div>
            
            <div className="text-4xl font-black font-mono mb-1" style={{ color: getColor(selectedDelta) }}>
              {selectedDelta === 0 ? "—" : `+${selectedDelta}%`}
            </div>
            
            <div className="text-xs font-mono mb-3" style={{ color: getColor(selectedDelta) }}>
              {getLabel(selectedDelta)} quality loss vs F16
            </div>

            <div className="space-y-1 text-xs font-mono text-[var(--muted)]">
              <div className="flex justify-between">
                <span>Est. VRAM ({selectedTier})</span>
                <span className={selectedVram <= availableVram ? "text-green-400" : "text-red-400"}>
                  {selectedVram.toFixed(1)} GB
                </span>
              </div>
              <div className="flex justify-between">
                <span>Bits per weight</span>
                <span>{QUANT_DATA[selectedQuant].bits}</span>
              </div>
              <div className="flex justify-between">
                <span>Size reduction vs F16</span>
                <span className="text-cyan-400">
                  {Math.round((1 - QUANT_DATA[selectedQuant].bits / 16) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual chart */}
        <div className="border border-[var(--border)] p-6 mb-8">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-6 font-mono">
            Quality Loss vs File Size — {selectedTier} Models
          </div>
          <div className="space-y-2">
            {quantList.map((q) => {
              const delta = PPLX_DELTA[q]?.[selectedTier] ?? 0;
              const vram = vramByQuant(q);
              const barWidth = maxDelta > 0 ? (delta / maxDelta) * 100 : 0;
              const color = getColor(delta);
              const fits = vram <= availableVram;
              const isSelected = q === selectedQuant;

              return (
                <button
                  key={q}
                  onClick={() => setSelectedQuant(q)}
                  className={`w-full text-left transition-all ${isSelected ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]/30"}`}
                >
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className={`w-16 text-xs font-mono font-bold flex-shrink-0 ${isSelected ? "text-[var(--fg)]" : "text-[var(--muted)]"}`}>
                      {q}
                    </div>

                    <div className="flex-1 h-5 bg-[var(--bg)] border border-[var(--border)] overflow-hidden relative">
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${Math.max(barWidth, delta === 0 ? 0.5 : 0)}%`, backgroundColor: color }}
                      />
                      {isSelected && <div className="absolute inset-0 border border-white/20" />}
                    </div>

                    <div className="w-16 text-xs font-mono text-right flex-shrink-0" style={{ color }}>
                      {delta === 0 ? "baseline" : `+${delta}%`}
                    </div>

                    <div className={`w-16 text-xs font-mono text-right flex-shrink-0 ${fits ? "text-green-400" : "text-red-400"}`}>
                      {vram.toFixed(1)}GB
                    </div>

                    <div className="w-24 text-xs font-mono text-right flex-shrink-0 hidden md:block" style={{ color: getColor(delta) }}>
                      {getLabel(delta)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex gap-6 mt-4 text-xs font-mono text-[var(--muted)]">
            <span>← Bar = perplexity increase vs F16</span>
            <span>GB = estimated VRAM for {selectedTier} model</span>
            <span className="text-red-400">Red GB = doesn&apos;t fit in {availableVram}GB</span>
          </div>
        </div>

        {/* Cross-size comparison table */}
        <div className="border border-[var(--border)] p-6">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">
            {selectedQuant} Quality Loss — All Model Sizes
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left text-[var(--muted)] py-2 pr-6">Size</th>
                  <th className="text-left text-[var(--muted)] py-2 pr-6">Quality Loss</th>
                  <th className="text-left text-[var(--muted)] py-2 pr-6">Rating</th>
                  <th className="text-left text-[var(--muted)] py-2">Est. VRAM</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_TIERS.map((t) => {
                  const delta = PPLX_DELTA[selectedQuant]?.[t] ?? 0;
                  const v = (BASE_7B_VRAM[selectedQuant] ?? 5) * PARAM_MULTIPLIERS[t];
                  return (
                    <tr key={t} className={`border-b border-[var(--border)]/50 ${selectedTier === t ? "bg-[var(--surface)]" : ""}`}>
                      <td className="py-2 pr-6 text-[var(--fg)]">{t}</td>
                      <td className="py-2 pr-6" style={{ color: getColor(delta) }}>
                        {delta === 0 ? "—" : `+${delta}%`}
                      </td>
                      <td className="py-2 pr-6" style={{ color: getColor(delta) }}>{getLabel(delta)}</td>
                      <td className="py-2 text-[var(--muted)]">{v.toFixed(1)} GB</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-[var(--muted)] leading-relaxed">
            Key insight: A Q3_K_M 70B model has {PPLX_DELTA["Q3_K_M"]?.["70B+"]}% quality loss —
            less than a Q4_K_M 7B model at {PPLX_DELTA["Q4_K_M"]?.["7B"]}%.
            When VRAM is the constraint, a heavily quantized large model often beats a lightly
            quantized small one.
          </div>
        </div>
      </div>
    </main>
  );
}