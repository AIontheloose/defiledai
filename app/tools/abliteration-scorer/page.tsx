"use client";
import { useState } from "react";

const KNOWN_SCORES: Record<string, { base: number; abliterated: number; method: string; source: string }> = {
  "Llama 3.1 8B": { base: 73.0, abliterated: 72.4, method: "Representation Engineering", source: "FailSpy / Community" },
  "Llama 3.1 70B": { base: 83.6, abliterated: 82.1, method: "Representation Engineering", source: "FailSpy / Community" },
  "Llama 3.2 3B": { base: 63.4, abliterated: 63.1, method: "Representation Engineering", source: "Bartowski / Community" },
  "Mistral 7B v0.3": { base: 64.2, abliterated: 63.7, method: "Representation Engineering", source: "FailSpy / Community" },
  "Mistral Nemo 12B": { base: 68.0, abliterated: 67.2, method: "Representation Engineering", source: "Bartowski / Community" },
  "Qwen 2.5 7B": { base: 74.2, abliterated: 72.9, method: "Representation Engineering", source: "Community" },
  "Qwen 2.5 72B": { base: 83.1, abliterated: 81.3, method: "Representation Engineering", source: "Community" },
  "DeepSeek R1 7B": { base: 71.2, abliterated: 70.1, method: "Representation Engineering", source: "Community" },
  "DeepSeek R1 70B": { base: 85.1, abliterated: 82.7, method: "Representation Engineering", source: "Community" },
  "Gemma 2 9B": { base: 71.3, abliterated: 70.6, method: "Representation Engineering", source: "Community" },
  "Gemma 2 27B": { base: 75.2, abliterated: 72.9, method: "Representation Engineering", source: "Community" },
  "Phi-3 Medium 14B": { base: 78.0, abliterated: 75.2, method: "Fine-tune", source: "Community" },
  "Dolphin 2.9 Llama 3.1 8B": { base: 73.0, abliterated: 71.8, method: "Fine-tune (Dolphin)", source: "CognitiveComputations" },
  "Dolphin 2.8 Mistral 7B": { base: 64.2, abliterated: 63.1, method: "Fine-tune (Dolphin)", source: "CognitiveComputations" },
};

const GRADE_THRESHOLDS = [
  { min: 99, grade: "S", label: "Transparent", color: "#22d3ee", desc: "Virtually undetectable quality loss. Indistinguishable from base in normal use." },
  { min: 97, grade: "A+", label: "Excellent", color: "#4ade80", desc: "Minimal quality loss. Recommended for all use cases." },
  { min: 95, grade: "A", label: "Very Good", color: "#86efac", desc: "Small but measurable loss. Suitable for most use cases." },
  { min: 92, grade: "B+", label: "Good", color: "#bef264", desc: "Noticeable on benchmarks but fine for conversational use." },
  { min: 88, grade: "B", label: "Acceptable", color: "#fbbf24", desc: "Moderate quality loss. Consider for VRAM-constrained setups only." },
  { min: 80, grade: "C", label: "Degraded", color: "#fb923c", desc: "Significant quality loss. Output may drift on complex tasks." },
  { min: 0, grade: "D", label: "Poor", color: "#f87171", desc: "Heavy quality loss. Not recommended for production use." },
];

function getGrade(retention: number) {
  return GRADE_THRESHOLDS.find((t) => retention >= t.min) ?? GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1];
}

export default function AbliterationScorerPage() {
  const [mode, setMode] = useState<"lookup" | "manual">("lookup");
  const [selected, setSelected] = useState("");
  const [manualBase, setManualBase] = useState("");
  const [manualAbliterated, setManualAbliterated] = useState("");
  const [manualModel, setManualModel] = useState("");

  const lookupData = selected ? KNOWN_SCORES[selected] : null;
  const manualBaseNum = parseFloat(manualBase);
  const manualAblitNum = parseFloat(manualAbliterated);

  const baseScore = mode === "lookup" ? lookupData?.base : (isNaN(manualBaseNum) ? null : manualBaseNum);
  const ablitScore = mode === "lookup" ? lookupData?.abliterated : (isNaN(manualAblitNum) ? null : manualAblitNum);
  const modelName = mode === "lookup" ? selected : manualModel;

  const retention = baseScore && ablitScore ? ((ablitScore / baseScore) * 100) : null;
  const delta = baseScore && ablitScore ? (ablitScore - baseScore).toFixed(2) : null;
  const grade = retention ? getGrade(retention) : null;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">ABLITERATION QUALITY SCORER</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Compare base vs abliterated model benchmark scores to quantify quality retention.
            Look up known models or enter your own perplexity / MMLU scores.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-8">
          {(["lookup", "manual"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-5 py-2 text-xs uppercase tracking-widest font-mono border transition-all ${mode === m ? "bg-cyan-500 text-black border-cyan-500 font-bold" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
              {m === "lookup" ? "Look Up Known Model" : "Enter My Own Scores"}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input */}
          <div className="space-y-5">
            {mode === "lookup" ? (
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Select Model</label>
                <select value={selected} onChange={(e) => setSelected(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                  <option value="">— Select a model —</option>
                  {Object.keys(KNOWN_SCORES).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                {lookupData && (
                  <div className="mt-4 space-y-3 border border-[var(--border)] p-4 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Base MMLU</span>
                      <span className="text-[var(--fg2)]">{lookupData.base}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Abliterated MMLU</span>
                      <span className="text-[var(--fg2)]">{lookupData.abliterated}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Method</span>
                      <span className="text-cyan-400">{lookupData.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Source</span>
                      <span className="text-[var(--muted2)]">{lookupData.source}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Model Name</label>
                  <input value={manualModel} onChange={(e) => setManualModel(e.target.value)}
                    placeholder="e.g. My Custom 7B"
                    className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Base Model Score (%)</label>
                  <input type="number" value={manualBase} onChange={(e) => setManualBase(e.target.value)}
                    placeholder="e.g. 73.0"
                    className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                    min="0" max="100" step="0.1" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Abliterated Model Score (%)</label>
                  <input type="number" value={manualAbliterated} onChange={(e) => setManualAbliterated(e.target.value)}
                    placeholder="e.g. 72.4"
                    className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                    min="0" max="100" step="0.1" />
                </div>
                <div className="text-xs text-[var(--muted)] font-mono leading-relaxed border border-[var(--border)] p-3">
                  Use MMLU, HellaSwag, ARC-C, or perplexity scores. Ensure both scores use the same benchmark and evaluation method for meaningful comparison.
                </div>
              </div>
            )}
          </div>

          {/* Result */}
          <div className="space-y-4">
            {retention && grade ? (
              <>
                <div className="border-2 p-8 text-center" style={{ borderColor: grade.color + "40", background: grade.color + "06" }}>
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: grade.color }}>
                    Quality Retention Grade
                  </div>
                  <div className="font-black font-mono text-7xl mb-2" style={{ color: grade.color }}>
                    {grade.grade}
                  </div>
                  <div className="font-mono text-2xl font-bold mb-1" style={{ color: grade.color }}>
                    {retention.toFixed(2)}%
                  </div>
                  <div className="text-[var(--muted)] text-sm">{grade.label}</div>
                  {modelName && <div className="text-[var(--muted)] text-xs mt-2 font-mono">{modelName}</div>}
                </div>

                <div className="border border-[var(--border)] p-5 space-y-3 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Base score</span>
                    <span className="text-[var(--fg2)]">{baseScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Abliterated score</span>
                    <span className="text-[var(--fg2)]">{ablitScore}%</span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--border)] pt-3">
                    <span className="text-[var(--muted)]">Delta</span>
                    <span className="text-red-400">{delta}pp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Retention</span>
                    <span style={{ color: grade.color }} className="font-bold">{retention.toFixed(2)}%</span>
                  </div>
                </div>

                <div className="border border-[var(--border)] p-4 text-sm text-[var(--muted)] leading-relaxed">
                  {grade.desc}
                </div>
              </>
            ) : (
              <div className="border border-[var(--border)] p-8 text-center text-[var(--muted)] font-mono text-sm">
                {mode === "lookup" ? "Select a model to see quality retention score" : "Enter both scores to calculate retention"}
              </div>
            )}

            {/* Grade scale */}
            <div className="border border-[var(--border)] p-4">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">Grade Scale</div>
              <div className="space-y-1.5">
                {GRADE_THRESHOLDS.map((t) => (
                  <div key={t.grade} className={`flex items-center gap-3 text-xs font-mono py-1 px-2 transition-colors ${grade?.grade === t.grade ? "bg-[var(--surface)]" : ""}`}>
                    <span className="font-bold w-6" style={{ color: t.color }}>{t.grade}</span>
                    <span className="text-[var(--muted)] w-8">{t.min}%+</span>
                    <span className="text-[var(--muted2)]">{t.label}</span>
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
