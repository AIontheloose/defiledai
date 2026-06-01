"use client";
import { useState, useCallback } from "react";

const EXPERT_MODELS = [
  { id: "qwen-coder-32b",    label: "Qwen 2.5 Coder 32B",    domain: "coding",    vram: 20, toks: 44,  hf: "Qwen/Qwen2.5-Coder-32B-Instruct", strength: "Code generation, debugging, code review" },
  { id: "deepseek-r1-14b",   label: "DeepSeek R1 14B",        domain: "reasoning", vram: 10, toks: 86,  hf: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B", strength: "Multi-step reasoning, math, logic" },
  { id: "deepseek-r1-32b",   label: "DeepSeek R1 32B",        domain: "reasoning", vram: 20, toks: 44,  hf: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B", strength: "Complex reasoning, STEM problems" },
  { id: "llama-70b-ablit",   label: "Llama 3.1 70B Abliterated", domain: "writing", vram: 40, toks: 21, hf: "failspy/Meta-Llama-3-70B-Instruct-abliterated-v3", strength: "Creative writing, long-form content" },
  { id: "mistral-7b-ablit",  label: "Mistral 7B Abliterated", domain: "general",   vram: 5,  toks: 138, hf: "failspy/Mistral-7B-Instruct-v0.3-abliterated", strength: "Fast general tasks, routing" },
  { id: "dolphin-8b",        label: "Dolphin 2.9 Llama 3.1 8B", domain: "general", vram: 5,  toks: 128, hf: "cognitivecomputations/dolphin-2.9-llama3-8b", strength: "Uncensored general assistant" },
  { id: "qwen-25-7b",        label: "Qwen 2.5 7B",            domain: "multilingual", vram: 5, toks: 132, hf: "Qwen/Qwen2.5-7B-Instruct", strength: "Multilingual, code, math" },
  { id: "mathstral-7b",      label: "Mathstral 7B",           domain: "math",      vram: 5,  toks: 138, hf: "mistralai/Mathstral-7B-v0.1", strength: "Mathematics, numerical reasoning" },
  { id: "meditron-7b",       label: "Meditron 7B",            domain: "medical",   vram: 5,  toks: 130, hf: "epfl-llm/meditron-7b", strength: "Medical knowledge, clinical reasoning" },
  { id: "solar-10b",         label: "SOLAR 10.7B",            domain: "reasoning", vram: 7,  toks: 98,  hf: "upstage/SOLAR-10.7B-Instruct-v1.0", strength: "Instruction following, reasoning" },
  { id: "nous-hermes-13b",   label: "Nous Hermes 2 13B",      domain: "writing",   vram: 9,  toks: 82,  hf: "NousResearch/Nous-Hermes-2-Mistral-7B-DPO", strength: "Creative writing, roleplay, storytelling" },
  { id: "phi3-medium",       label: "Phi-3 Medium 14B",       domain: "coding",    vram: 9,  toks: 68,  hf: "microsoft/Phi-3-medium-4k-instruct", strength: "Coding, short context reasoning" },
];

const DOMAIN_COLORS: Record<string, string> = {
  coding:      "text-blue-400 border-blue-400/30 bg-blue-400/5",
  reasoning:   "text-purple-400 border-purple-400/30 bg-purple-400/5",
  writing:     "text-pink-400 border-pink-400/30 bg-pink-400/5",
  math:        "text-green-400 border-green-400/30 bg-green-400/5",
  general:     "text-cyan-400 border-cyan-400/30 bg-cyan-400/5",
  multilingual:"text-orange-400 border-orange-400/30 bg-orange-400/5",
  medical:     "text-red-400 border-red-400/30 bg-red-400/5",
};

const ROUTER_MODELS = [
  { id: "mistral-7b", label: "Mistral 7B Abliterated (recommended)", vram: 5 },
  { id: "phi3-mini",  label: "Phi-3 Mini 3.8B (fastest)",            vram: 3 },
  { id: "qwen-7b",    label: "Qwen 2.5 7B",                          vram: 5 },
  { id: "llama-8b",   label: "Llama 3.1 8B Abliterated",             vram: 6 },
];

const SYNTHESIZER_MODELS = [
  { id: "none",        label: "No synthesizer (direct expert output)" },
  { id: "mistral-7b",  label: "Mistral 7B — lightweight synthesis" },
  { id: "llama-8b",    label: "Llama 3.1 8B — balanced synthesis" },
  { id: "llama-70b",   label: "Llama 3.1 70B Abliterated — best quality (needs 40GB+)" },
];

interface Expert { modelId: string; domain: string; label: string }

const PIPELINE_TEMPLATES = [
  {
    name: "Full Stack Developer",
    desc: "Code + reasoning + writing. Balanced for software engineering tasks.",
    router: "mistral-7b",
    experts: ["qwen-coder-32b","deepseek-r1-14b","nous-hermes-13b"],
    synthesizer: "mistral-7b",
  },
  {
    name: "Research Assistant",
    desc: "Deep reasoning, math, and long-form writing for research tasks.",
    router: "mistral-7b",
    experts: ["deepseek-r1-32b","mathstral-7b","llama-70b-ablit"],
    synthesizer: "llama-8b",
  },
  {
    name: "Lightweight Coder",
    desc: "Fast coding pipeline that fits in 24GB total VRAM.",
    router: "phi3-mini",
    experts: ["phi3-medium","qwen-25-7b","deepseek-r1-14b"],
    synthesizer: "none",
  },
  {
    name: "Uncensored General",
    desc: "Abliterated models across domains. No restrictions on any topic.",
    router: "mistral-7b",
    experts: ["llama-70b-ablit","dolphin-8b","deepseek-r1-14b"],
    synthesizer: "mistral-7b",
  },
];

const SYNTHESIZER_TRIGGERS = [
  "multi-part question requiring integration",
  "conflicting information from multiple domains",
  "executive summary needed",
  "cross-domain analysis",
  "final report or document output",
];

const NO_SYNTHESIZER_CASES = [
  "pure code output (compile-ready)",
  "single-domain factual answer",
  "mathematical calculation",
  "translation tasks",
  "simple yes/no or lookup",
];

export default function MoEBuilderPage() {
  const [selectedExperts, setSelectedExperts] = useState<Expert[]>([]);
  const [router, setRouter] = useState("mistral-7b");
  const [synthesizer, setSynthesizer] = useState("mistral-7b");
  const [pipelineName, setPipelineName] = useState("My MoE Pipeline");
  const [tab, setTab] = useState<"build"|"config"|"deploy">("build");
  const [copied, setCopied] = useState("");

  const toggleExpert = useCallback((model: typeof EXPERT_MODELS[0]) => {
    setSelectedExperts((prev) => {
      const exists = prev.find((e) => e.modelId === model.id);
      if (exists) return prev.filter((e) => e.modelId !== model.id);
      return [...prev, { modelId: model.id, domain: model.domain, label: model.label }];
    });
  }, []);

  const applyTemplate = (t: typeof PIPELINE_TEMPLATES[0]) => {
    setPipelineName(t.name);
    setRouter(t.router);
    setSynthesizer(t.synthesizer);
    setSelectedExperts(
      t.experts.map((id) => {
        const m = EXPERT_MODELS.find((m) => m.id === id)!;
        return { modelId: id, domain: m.domain, label: m.label };
      })
    );
    setTab("build");
  };

  const routerModel = ROUTER_MODELS.find((r) => r.id === router)!;
  const synthModel = SYNTHESIZER_MODELS.find((s) => s.id === synthesizer)!;

  const totalVram = (routerModel?.vram ?? 0) +
    selectedExperts.reduce((s, e) => {
      const m = EXPERT_MODELS.find((m) => m.id === e.modelId);
      return s + (m?.vram ?? 0);
    }, 0) +
    (synthesizer !== "none" ? (synthesizer === "llama-70b" ? 40 : synthesizer === "llama-8b" ? 6 : 5) : 0);

  const maxConcurrentVram = (routerModel?.vram ?? 0) +
    Math.max(...selectedExperts.map((e) => EXPERT_MODELS.find((m) => m.id === e.modelId)?.vram ?? 0), 0) +
    (synthesizer !== "none" ? (synthesizer === "llama-70b" ? 40 : 6) : 0);

  const ollamaConfig = `# ${pipelineName} — Ollama MoE Pipeline Config
# Save as: moe-pipeline.yaml

pipeline:
  name: "${pipelineName}"

router:
  model: "${routerModel?.label ?? "mistral-7b"}"
  ollama_name: "${router}"
  system_prompt: |
    You are a routing assistant. Analyze the user's request and output ONLY a JSON object:
    {"expert": "<domain>", "reasoning": "<why>", "needs_synthesis": <true|false>}
    
    Available domains: ${selectedExperts.map((e) => e.domain).join(", ")}
    
    Route to the domain that best matches the primary intent.
    Set needs_synthesis to true only if the answer requires integrating multiple domains
    or producing a structured report. For code output, direct math, or single-domain 
    questions, set needs_synthesis to false.

experts:${selectedExperts.map((e) => {
  const m = EXPERT_MODELS.find((x) => x.id === e.modelId)!;
  return `
  - domain: "${e.domain}"
    model: "${m.label}"
    ollama_name: "${m.id}"
    hf: "${m.hf}"
    vram_gb: ${m.vram}
    strength: "${m.strength}"`;
}).join("")}

synthesizer:
  enabled: ${synthesizer !== "none"}
  model: "${synthModel?.label ?? "none"}"
  ollama_name: "${synthesizer}"
  system_prompt: |
    You are a synthesis assistant. You receive outputs from specialist AI models.
    Integrate them into a single coherent, well-structured response.
    Preserve technical accuracy from each expert. Remove redundancy.
    Format the output clearly with appropriate sections.

routing_rules:
  synthesizer_triggers:
${SYNTHESIZER_TRIGGERS.map((t) => `    - "${t}"`).join("\n")}
  bypass_synthesizer:
${NO_SYNTHESIZER_CASES.map((t) => `    - "${t}"`).join("\n")}`;

  const pythonScript = `#!/usr/bin/env python3
"""
${pipelineName} — MoE Pipeline Runner
Requires: pip install ollama requests

Usage: python moe_pipeline.py "Your prompt here"
"""

import json
import sys
import ollama

ROUTER_MODEL = "${router}"
SYNTHESIZER_MODEL = "${synthesizer === "none" ? "none" : synthesizer}"

EXPERTS = {
${selectedExperts.map((e) => {
  const m = EXPERT_MODELS.find((x) => x.id === e.modelId)!;
  return `    "${e.domain}": {"model": "${e.modelId}", "label": "${m.label}"},`;
}).join("\n")}
}

ROUTER_SYSTEM = """You are a routing assistant. Analyze the user request and output ONLY valid JSON:
{"expert": "<domain>", "reasoning": "<one sentence>", "needs_synthesis": <true or false>}
Available domains: ${selectedExperts.map((e) => e.domain).join(", ")}
Set needs_synthesis true only for multi-domain or report-style outputs. Never for pure code."""

def route(prompt: str) -> dict:
    print(f"[Router] Analyzing: {prompt[:60]}...")
    response = ollama.chat(
        model=ROUTER_MODEL,
        messages=[
            {"role": "system", "content": ROUTER_SYSTEM},
            {"role": "user", "content": prompt}
        ]
    )
    raw = response["message"]["content"].strip()
    # Extract JSON even if model adds commentary
    start = raw.find("{")
    end = raw.rfind("}") + 1
    return json.loads(raw[start:end])

def call_expert(domain: str, prompt: str) -> str:
    expert = EXPERTS.get(domain)
    if not expert:
        # Fallback to first expert
        expert = list(EXPERTS.values())[0]
    print(f"[Expert] Calling {expert['label']}...")
    response = ollama.chat(
        model=expert["model"],
        messages=[{"role": "user", "content": prompt}]
    )
    return response["message"]["content"]

def synthesize(prompt: str, expert_output: str) -> str:
    if SYNTHESIZER_MODEL == "none":
        return expert_output
    print(f"[Synthesizer] Refining output...")
    response = ollama.chat(
        model=SYNTHESIZER_MODEL,
        messages=[
            {"role": "system", "content": "Integrate and refine specialist AI output into a clear, accurate response."},
            {"role": "user", "content": f"Original question: {prompt}\\n\\nSpecialist output:\\n{expert_output}"}
        ]
    )
    return response["message"]["content"]

def run(prompt: str) -> str:
    # Step 1: Route
    routing = route(prompt)
    domain = routing.get("expert", list(EXPERTS.keys())[0])
    needs_synth = routing.get("needs_synthesis", False)
    print(f"[Router] → Domain: {domain} | Synthesis: {needs_synth} | Reason: {routing.get('reasoning','')}")

    # Step 2: Expert
    expert_output = call_expert(domain, prompt)

    # Step 3: Synthesize (conditional)
    if needs_synth and SYNTHESIZER_MODEL != "none":
        return synthesize(prompt, expert_output)
    return expert_output

if __name__ == "__main__":
    prompt = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else input("Prompt: ")
    result = run(prompt)
    print("\\n--- OUTPUT ---")
    print(result)
`;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">LOCAL MOE PIPELINE BUILDER</h1>
          <p className="text-[var(--muted)] max-w-3xl leading-relaxed">
            Build a macro-scale Mixture-of-Experts pipeline from independent local models.
            A router model classifies each prompt and dispatches to the right specialist — only loading what's needed.
            A synthesizer integrates outputs when the task spans multiple domains.
          </p>
        </div>

        {/* Architecture diagram */}
        <div className="border border-[var(--border)] p-6 mb-8 bg-[var(--surface)]/20">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-5 font-mono">Pipeline Architecture</div>
          <div className="flex flex-wrap items-start justify-center gap-2 text-xs font-mono">
            <div className="border border-[var(--border)] px-4 py-3 text-center min-w-[140px]">
              <div className="text-[var(--muted)] mb-1">INPUT</div>
              <div className="text-[var(--fg)] font-bold">User Prompt</div>
            </div>
            <div className="flex items-center text-[var(--muted)] text-lg pt-3">→</div>
            <div className="border border-cyan-500/40 bg-cyan-500/[0.05] px-4 py-3 text-center min-w-[140px]">
              <div className="text-cyan-400 mb-1">ROUTER</div>
              <div className="text-[var(--fg)] font-bold text-xs">{ROUTER_MODELS.find(r=>r.id===router)?.label.split("(")[0].trim() ?? "Select router"}</div>
              <div className="text-[var(--muted)] text-xs mt-1">classifies domain</div>
            </div>
            <div className="flex items-center text-[var(--muted)] text-lg pt-3">→</div>
            <div className="flex flex-col gap-2">
              {selectedExperts.length === 0 ? (
                <div className="border border-dashed border-[var(--border)] px-4 py-3 text-center min-w-[140px] text-[var(--muted)]">
                  Add experts →
                </div>
              ) : (
                selectedExperts.map((e) => {
                  const col = DOMAIN_COLORS[e.domain] ?? "text-zinc-400 border-zinc-700/30";
                  return (
                    <div key={e.modelId} className={`border px-4 py-2 text-center min-w-[140px] ${col}`}>
                      <div className="text-xs uppercase mb-0.5">{e.domain}</div>
                      <div className="text-[var(--fg)] font-bold text-xs leading-tight">
                        {EXPERT_MODELS.find(m=>m.id===e.modelId)?.label.split(" ").slice(0,3).join(" ")}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {synthesizer !== "none" && (
              <>
                <div className="flex items-center text-[var(--muted)] text-lg pt-3">→</div>
                <div className="border border-purple-500/40 bg-purple-500/[0.05] px-4 py-3 text-center min-w-[140px]">
                  <div className="text-purple-400 mb-1">SYNTHESIZER</div>
                  <div className="text-[var(--fg)] font-bold text-xs">{SYNTHESIZER_MODELS.find(s=>s.id===synthesizer)?.label.split("—")[0].trim()}</div>
                  <div className="text-[var(--muted)] text-xs mt-1">conditional</div>
                </div>
              </>
            )}
            <div className="flex items-center text-[var(--muted)] text-lg pt-3">→</div>
            <div className="border border-green-500/40 bg-green-500/[0.05] px-4 py-3 text-center min-w-[140px]">
              <div className="text-green-400 mb-1">OUTPUT</div>
              <div className="text-[var(--fg)] font-bold">Final Response</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b border-[var(--border)]">
          {(["build","config","deploy"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-3 text-xs uppercase tracking-widest font-mono border-b-2 transition-all ${tab === t ? "border-cyan-400 text-cyan-400" : "border-transparent text-[var(--muted)] hover:text-[var(--fg)]"}`}>
              {t === "build" ? "1. Build Pipeline" : t === "config" ? "2. View Config" : "3. Deploy Code"}
            </button>
          ))}
        </div>

        {tab === "build" && (
          <div className="space-y-8">
            {/* Templates */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">Quick Start Templates</div>
              <div className="grid md:grid-cols-2 gap-3">
                {PIPELINE_TEMPLATES.map((t) => (
                  <button key={t.name} onClick={() => applyTemplate(t)}
                    className="text-left border border-[var(--border)] p-4 hover:border-cyan-500/40 hover:bg-cyan-500/[0.02] transition-all">
                    <div className="font-mono font-bold text-[var(--fg)] mb-1">{t.name}</div>
                    <div className="text-xs text-[var(--muted)]">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pipeline name */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Pipeline Name</label>
              <input value={pipelineName} onChange={(e) => setPipelineName(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors w-full max-w-md" />
            </div>

            {/* Router */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">Router Model</div>
              <div className="grid md:grid-cols-2 gap-2">
                {ROUTER_MODELS.map((r) => (
                  <button key={r.id} onClick={() => setRouter(r.id)}
                    className={`text-left border p-3 transition-all text-sm font-mono ${router === r.id ? "border-cyan-400 bg-cyan-500/10 text-cyan-400" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                    <div className="font-bold">{r.label}</div>
                    <div className="text-xs opacity-70">{r.vram}GB VRAM</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Experts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">Expert Models <span className="text-cyan-400">({selectedExperts.length} selected)</span></div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {EXPERT_MODELS.map((m) => {
                  const sel = !!selectedExperts.find((e) => e.modelId === m.id);
                  const col = DOMAIN_COLORS[m.domain] ?? "text-zinc-400 border-zinc-700";
                  return (
                    <button key={m.id} onClick={() => toggleExpert(m)}
                      className={`text-left border p-4 transition-all ${sel ? `${col} font-bold` : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-mono font-bold text-[var(--fg)]">{m.label}</span>
                        <span className={`text-xs border px-1.5 py-0.5 ${col}`}>{m.domain}</span>
                      </div>
                      <div className="text-xs text-[var(--muted)]">{m.strength}</div>
                      <div className="text-xs text-[var(--muted)] mt-1">{m.vram}GB VRAM · ~{m.toks} tok/s</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Synthesizer */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">Synthesizer Model</div>
              <div className="grid md:grid-cols-2 gap-2 mb-4">
                {SYNTHESIZER_MODELS.map((s) => (
                  <button key={s.id} onClick={() => setSynthesizer(s.id)}
                    className={`text-left border p-3 text-sm font-mono transition-all ${synthesizer === s.id ? "border-purple-400 bg-purple-500/10 text-purple-400" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="border border-[var(--border)] p-3">
                  <div className="text-green-400 mb-2">Skip synthesizer when:</div>
                  {NO_SYNTHESIZER_CASES.map((c) => <div key={c} className="text-[var(--muted)] mb-1">✓ {c}</div>)}
                </div>
                <div className="border border-[var(--border)] p-3">
                  <div className="text-purple-400 mb-2">Engage synthesizer when:</div>
                  {SYNTHESIZER_TRIGGERS.map((c) => <div key={c} className="text-[var(--muted)] mb-1">→ {c}</div>)}
                </div>
              </div>
            </div>

            {/* VRAM summary */}
            {selectedExperts.length > 0 && (
              <div className="border border-[var(--border)] p-5 font-mono text-sm">
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">VRAM Summary</div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-[var(--muted)]">Router</span><span>{routerModel?.vram ?? 0}GB</span></div>
                  {selectedExperts.map((e) => {
                    const m = EXPERT_MODELS.find((x) => x.id === e.modelId)!;
                    return <div key={e.modelId} className="flex justify-between"><span className="text-[var(--muted)]">{m.label}</span><span>{m.vram}GB</span></div>;
                  })}
                  {synthesizer !== "none" && <div className="flex justify-between"><span className="text-[var(--muted)]">Synthesizer</span><span>{synthesizer === "llama-70b" ? 40 : 6}GB</span></div>}
                  <div className="border-t border-[var(--border)] pt-2 flex justify-between font-bold">
                    <span className="text-[var(--muted)]">All loaded simultaneously</span>
                    <span className="text-red-400">{totalVram}GB</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-[var(--muted)]">Max concurrent (router + 1 expert + synth)</span>
                    <span className="text-green-400">{maxConcurrentVram}GB</span>
                  </div>
                </div>
                <div className="text-xs text-cyan-400 mt-3">
                  ↑ With Ollama's keep_alive=0, only the active model stays in VRAM. Max concurrent is the real requirement.
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "config" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">moe-pipeline.yaml</div>
              <button onClick={() => copy(ollamaConfig, "yaml")}
                className="text-xs text-cyan-400 border border-cyan-500/30 px-3 py-1 hover:border-cyan-400 transition-all font-mono">
                {copied === "yaml" ? "COPIED ✓" : "COPY"}
              </button>
            </div>
            <pre className="border border-[var(--border)] bg-[var(--surface)] p-5 text-xs font-mono text-[var(--fg2)] overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {ollamaConfig}
            </pre>
          </div>
        )}

        {tab === "deploy" && (
          <div className="space-y-6">
            <div className="border border-[var(--border)] p-5 bg-[var(--surface)]/20">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">Prerequisites</div>
              <div className="space-y-2 text-sm font-mono">
                {[
                  "Ollama installed and running (ollama.com)",
                  ...selectedExperts.map((e) => `ollama pull ${e.modelId}  # ${e.label}`),
                  `ollama pull ${router}  # Router`,
                  synthesizer !== "none" ? `ollama pull ${synthesizer}  # Synthesizer` : null,
                  "pip install ollama",
                ].filter(Boolean).map((line, i) => (
                  <div key={i} className="text-[var(--fg2)]"><span className="text-cyan-400 mr-2">$</span>{line}</div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">moe_pipeline.py</div>
                <button onClick={() => copy(pythonScript, "py")}
                  className="text-xs text-cyan-400 border border-cyan-500/30 px-3 py-1 hover:border-cyan-400 transition-all font-mono">
                  {copied === "py" ? "COPIED ✓" : "COPY"}
                </button>
              </div>
              <pre className="border border-[var(--border)] bg-[var(--surface)] p-5 text-xs font-mono text-[var(--fg2)] overflow-x-auto leading-relaxed whitespace-pre max-h-96 overflow-y-auto">
                {pythonScript}
              </pre>
            </div>

            <div className="border border-[var(--border)] p-5 text-xs font-mono">
              <div className="text-[var(--muted)] uppercase tracking-widest mb-3">Run</div>
              <div className="space-y-2 text-[var(--fg2)]">
                <div><span className="text-cyan-400 mr-2">$</span>python moe_pipeline.py "Write a Python function to parse JSON and explain the logic"</div>
                <div className="text-[var(--muted)] pl-4">→ Router: coding domain, needs_synthesis: false</div>
                <div className="text-[var(--muted)] pl-4">→ Expert: {selectedExperts.find(e=>e.domain==="coding")?.label ?? "coding model"} responds directly</div>
                <div><span className="text-cyan-400 mr-2">$</span>python moe_pipeline.py "Analyze the mathematical and business implications of exponential growth"</div>
                <div className="text-[var(--muted)] pl-4">→ Router: reasoning domain, needs_synthesis: true</div>
                <div className="text-[var(--muted)] pl-4">→ Expert: reasoning model → Synthesizer: produces final report</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
