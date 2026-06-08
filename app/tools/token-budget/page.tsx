"use client";
import { useState } from "react";

const MODELS = [
  { name: "Llama 3.1 8B",    ctxLimit: 131072, tokPerSec: 128, costPer1k: 0 },
  { name: "Llama 3.1 70B",   ctxLimit: 131072, tokPerSec: 21,  costPer1k: 0 },
  { name: "Mistral 7B",      ctxLimit: 32768,  tokPerSec: 138, costPer1k: 0 },
  { name: "Qwen 2.5 72B",    ctxLimit: 131072, tokPerSec: 35,  costPer1k: 0 },
  { name: "DeepSeek R1 70B", ctxLimit: 65536,  tokPerSec: 19,  costPer1k: 0 },
  { name: "GPT-4o",          ctxLimit: 128000, tokPerSec: 80,  costPer1k: 0.005 },
  { name: "GPT-4o Mini",     ctxLimit: 128000, tokPerSec: 120, costPer1k: 0.00015 },
  { name: "Claude 3.5 Sonnet", ctxLimit: 200000, tokPerSec: 90, costPer1k: 0.003 },
];

const CONTENT_TYPES = [
  { label: "Plain text",        tokPerChar: 0.25 },
  { label: "Code (dense)",      tokPerChar: 0.35 },
  { label: "Markdown",          tokPerChar: 0.28 },
  { label: "JSON/XML",          tokPerChar: 0.40 },
  { label: "Chat history",      tokPerChar: 0.27 },
];

const USE_CASES = [
  { label: "Single Q&A",           systemToks: 50,   historyToks: 0,    outputToks: 512 },
  { label: "Multi-turn chat",      systemToks: 200,  historyToks: 2000, outputToks: 512 },
  { label: "Document summary",     systemToks: 100,  historyToks: 0,    outputToks: 1024 },
  { label: "RAG with context",     systemToks: 300,  historyToks: 4000, outputToks: 1024 },
  { label: "Code review",          systemToks: 150,  historyToks: 0,    outputToks: 2048 },
  { label: "Long-form generation", systemToks: 100,  historyToks: 0,    outputToks: 4096 },
  { label: "Custom",               systemToks: 0,    historyToks: 0,    outputToks: 0 },
];

export default function TokenBudgetPage() {
  const [model, setModel] = useState(MODELS[0]);
  const [useCase, setUseCase] = useState(USE_CASES[0]);
  const [contentType, setContentType] = useState(CONTENT_TYPES[0]);
  const [docChars, setDocChars] = useState("5000");
  const [systemToks, setSystemToks] = useState(50);
  const [historyToks, setHistoryToks] = useState(0);
  const [outputToks, setOutputToks] = useState(512);
  const [runsPerDay, setRunsPerDay] = useState("100");

  const docToks = Math.round(parseFloat(docChars || "0") * contentType.tokPerChar);
  const sys = useCase.label === "Custom" ? systemToks : useCase.systemToks;
  const hist = useCase.label === "Custom" ? historyToks : useCase.historyToks;
  const out = useCase.label === "Custom" ? outputToks : useCase.outputToks;

  const inputToks = sys + hist + docToks;
  const totalToks = inputToks + out;
  const ctxUsagePct = Math.min(100, (totalToks / model.ctxLimit) * 100);
  const fitsCtx = totalToks <= model.ctxLimit;

  const genTimeSec = out / model.tokPerSec;
  const dailyRuns = parseInt(runsPerDay) || 0;
  const dailyToks = totalToks * dailyRuns;
  const dailyCostUsd = model.costPer1k > 0 ? (dailyToks / 1000) * model.costPer1k : 0;
  const monthlyCostUsd = dailyCostUsd * 30;

  const maxDocChars = Math.floor(Math.max(0, model.ctxLimit - sys - hist - out) / contentType.tokPerChar);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">TOKEN BUDGET CALCULATOR</h1>
          <p className="text-[var(--muted)] max-w-2xl">Plan context usage, generation time, and cost before building pipelines. Works for both local models and API providers.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Model</label>
              <select onChange={(e) => setModel(MODELS.find(m=>m.name===e.target.value)!)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {MODELS.map(m => <option key={m.name}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Use Case</label>
              <div className="grid grid-cols-2 gap-2">
                {USE_CASES.map(u => (
                  <button key={u.label} onClick={() => { setUseCase(u); if(u.label!=="Custom"){ setSystemToks(u.systemToks); setHistoryToks(u.historyToks); setOutputToks(u.outputToks); }}}
                    className={`text-xs px-3 py-2 border font-mono text-left transition-all ${useCase.label===u.label?"border-cyan-400 text-cyan-400 bg-cyan-400/10":"border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Document/Input Content Type</label>
              <select onChange={(e) => setContentType(CONTENT_TYPES.find(c=>c.label===e.target.value)!)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors">
                {CONTENT_TYPES.map(c => <option key={c.label}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Document Size (characters)</label>
              <input type="number" value={docChars} onChange={e=>setDocChars(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
              <div className="text-xs text-[var(--muted)] mt-1 font-mono">≈ {docToks.toLocaleString()} tokens · Max for this config: {maxDocChars.toLocaleString()} chars</div>
            </div>
            {useCase.label === "Custom" && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "System Toks", val: systemToks, set: setSystemToks },
                  { label: "History Toks", val: historyToks, set: setHistoryToks },
                  { label: "Output Toks", val: outputToks, set: setOutputToks },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs text-[var(--muted)] mb-1">{f.label}</label>
                    <input type="number" value={f.val} onChange={e=>f.set(parseInt(e.target.value)||0)}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
                  </div>
                ))}
              </div>
            )}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Runs per day (for cost estimate)</label>
              <input type="number" value={runsPerDay} onChange={e=>setRunsPerDay(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Context usage */}
            <div className={`border-2 p-6 ${fitsCtx?"border-green-500/30":"border-red-500/30"}`}>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">Context Window Usage</div>
              <div className="flex items-end gap-3 mb-3">
                <div className={`text-5xl font-black font-mono ${fitsCtx?"text-green-400":"text-red-400"}`}>{ctxUsagePct.toFixed(1)}%</div>
                <div className="text-[var(--muted)] text-sm mb-1">{totalToks.toLocaleString()} / {model.ctxLimit.toLocaleString()} tokens</div>
              </div>
              <div className="w-full bg-[var(--surface)] h-3 mb-4">
                <div style={{width:`${Math.min(100,ctxUsagePct)}%`, background: fitsCtx ? "#4ade80" : "#f87171", height:"100%", transition:"width 0.3s"}} />
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                {[
                  { label: "System prompt", val: sys, color: "#22d3ee" },
                  { label: "Chat history", val: hist, color: "#818cf8" },
                  { label: "Document input", val: docToks, color: "#fbbf24" },
                  { label: "Expected output", val: out, color: "#4ade80" },
                ].map(r => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-[var(--muted)]">{r.label}</span>
                    <span style={{color:r.color}}>{r.val.toLocaleString()} tok</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance */}
            <div className="border border-[var(--border)] p-5 space-y-3 text-sm font-mono">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">Performance Estimate</div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Generation time</span><span className="text-[var(--fg2)]">{genTimeSec.toFixed(1)}s</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Output tokens</span><span className="text-[var(--fg2)]">{out.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Speed</span><span className="text-green-400">{model.tokPerSec} tok/s</span></div>
            </div>

            {/* Cost */}
            <div className="border border-[var(--border)] p-5 space-y-3 text-sm font-mono">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">Cost Estimate ({runsPerDay} runs/day)</div>
              {model.costPer1k > 0 ? (
                <>
                  <div className="flex justify-between"><span className="text-[var(--muted)]">Per run</span><span className="text-[var(--fg2)]">${((totalToks/1000)*model.costPer1k).toFixed(5)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--muted)]">Daily</span><span className="text-yellow-400">${dailyCostUsd.toFixed(3)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--muted)]">Monthly</span><span className="text-orange-400 font-bold">${monthlyCostUsd.toFixed(2)}</span></div>
                </>
              ) : (
                <div className="text-green-400">Local model — $0.00 cost</div>
              )}
              <div className="flex justify-between border-t border-[var(--border)] pt-2"><span className="text-[var(--muted)]">Daily tokens</span><span className="text-[var(--fg2)]">{dailyToks.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
