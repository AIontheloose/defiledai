"use client";
import { useState, useCallback, useRef, useEffect } from "react";

// ─── CORRECTED OLLAMA MODEL NAMES ────────────────────────────────────────────
// All ollamaName fields verified against ollama.com/library
// Abliterated models are community-hosted and require namespace prefix

const EXPERT_MODELS = [
  {
    id: "qwen-coder-32b",
    label: "Qwen 2.5 Coder 32B",
    domain: "coding",
    vram: 20,
    toks: 44,
    ollamaName: "qwen2.5-coder:32b",
    hf: "Qwen/Qwen2.5-Coder-32B-Instruct",
    strength: "Code generation, debugging, code review",
  },
  {
    id: "deepseek-r1-14b",
    label: "DeepSeek R1 14B",
    domain: "reasoning",
    vram: 10,
    toks: 86,
    ollamaName: "deepseek-r1:14b",
    hf: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
    strength: "Multi-step reasoning, math, logic",
  },
  {
    id: "deepseek-r1-32b",
    label: "DeepSeek R1 32B",
    domain: "reasoning",
    vram: 20,
    toks: 44,
    ollamaName: "deepseek-r1:32b",
    hf: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    strength: "Complex reasoning, STEM problems",
  },
  {
    id: "llama-70b-ablit",
    label: "Llama 3.1 70B Abliterated",
    domain: "writing",
    vram: 40,
    toks: 21,
    ollamaName: "huihui_ai/llama3.1-abliterated:70b",
    hf: "failspy/Meta-Llama-3-70B-Instruct-abliterated-v3",
    strength: "Creative writing, long-form content",
    note: "Community model — requires: ollama pull huihui_ai/llama3.1-abliterated:70b",
  },
  {
    id: "mistral-7b-ablit",
    label: "Mistral 7B Abliterated",
    domain: "general",
    vram: 5,
    toks: 138,
    ollamaName: "mannix/mistral-7b-instruct-abliterated",
    hf: "failspy/Mistral-7B-Instruct-v0.3-abliterated",
    strength: "Fast general tasks, uncensored routing",
    note: "Community model — requires: ollama pull mannix/mistral-7b-instruct-abliterated",
  },
  {
    id: "dolphin-8b",
    label: "Dolphin 2.9 Llama 3.1 8B",
    domain: "general",
    vram: 5,
    toks: 128,
    ollamaName: "dolphin-mistral:latest",
    hf: "cognitivecomputations/dolphin-2.9-llama3-8b",
    strength: "Uncensored general assistant",
  },
  {
    id: "qwen-25-7b",
    label: "Qwen 2.5 7B",
    domain: "multilingual",
    vram: 5,
    toks: 132,
    ollamaName: "qwen2.5:7b",
    hf: "Qwen/Qwen2.5-7B-Instruct",
    strength: "Multilingual, code, math",
  },
  {
    id: "mathstral-7b",
    label: "Mathstral 7B",
    domain: "math",
    vram: 5,
    toks: 138,
    ollamaName: "mathstral:7b",
    hf: "mistralai/Mathstral-7B-v0.1",
    strength: "Mathematics, numerical reasoning",
  },
  {
    id: "meditron-7b",
    label: "Meditron 7B",
    domain: "medical",
    vram: 5,
    toks: 130,
    ollamaName: "meditron:7b",
    hf: "epfl-llm/meditron-7b",
    strength: "Medical knowledge, clinical reasoning",
  },
  {
    id: "solar-10b",
    label: "SOLAR 10.7B",
    domain: "reasoning",
    vram: 7,
    toks: 98,
    ollamaName: "solar:10.7b",
    hf: "upstage/SOLAR-10.7B-Instruct-v1.0",
    strength: "Instruction following, reasoning",
  },
  {
    id: "nous-hermes-13b",
    label: "Nous Hermes 2 13B",
    domain: "writing",
    vram: 9,
    toks: 82,
    ollamaName: "nous-hermes2:13b",
    hf: "NousResearch/Nous-Hermes-2-Mistral-7B-DPO",
    strength: "Creative writing, roleplay, storytelling",
  },
  {
    id: "phi3-medium",
    label: "Phi-3 Medium 14B",
    domain: "coding",
    vram: 9,
    toks: 68,
    ollamaName: "phi3:medium",
    hf: "microsoft/Phi-3-medium-4k-instruct",
    strength: "Coding, short context reasoning",
  },
];

const DOMAIN_COLORS: Record<string, string> = {
  coding: "text-blue-400 border-blue-400/30 bg-blue-400/5",
  reasoning: "text-purple-400 border-purple-400/30 bg-purple-400/5",
  writing: "text-pink-400 border-pink-400/30 bg-pink-400/5",
  math: "text-green-400 border-green-400/30 bg-green-400/5",
  general: "text-cyan-400 border-cyan-400/30 bg-cyan-400/5",
  multilingual: "text-orange-400 border-orange-400/30 bg-orange-400/5",
  medical: "text-red-400 border-red-400/30 bg-red-400/5",
};

const ROUTER_MODELS = [
  {
    id: "mistral-7b-ablit",
    label: "Mistral 7B Abliterated (recommended)",
    ollamaName: "mannix/mistral-7b-instruct-abliterated",
    vram: 5,
  },
  {
    id: "phi3-mini",
    label: "Phi-3 Mini 3.8B (fastest)",
    ollamaName: "phi3:mini",
    vram: 3,
  },
  {
    id: "qwen-7b",
    label: "Qwen 2.5 7B",
    ollamaName: "qwen2.5:7b",
    vram: 5,
  },
  {
    id: "llama-8b-ablit",
    label: "Llama 3.1 8B Abliterated",
    ollamaName: "mannix/llama3.1-8b-abliterated",
    vram: 6,
  },
];

const SYNTHESIZER_MODELS = [
  { id: "none", label: "No synthesizer (direct expert output)", ollamaName: "none", vram: 0 },
  { id: "mistral-7b", label: "Mistral 7B — lightweight synthesis", ollamaName: "mistral:7b", vram: 5 },
  { id: "llama-8b", label: "Llama 3.1 8B — balanced synthesis", ollamaName: "llama3.1:8b", vram: 6 },
  { id: "llama-70b", label: "Llama 3.1 70B Abliterated — best quality (40GB+)", ollamaName: "huihui_ai/llama3.1-abliterated:70b", vram: 40 },
];

interface Expert {
  modelId: string;
  domain: string;
  label: string;
}

const PIPELINE_TEMPLATES = [
  {
    name: "Full Stack Developer",
    desc: "Code + reasoning + writing. Balanced for software engineering tasks.",
    router: "mistral-7b-ablit",
    experts: ["qwen-coder-32b", "deepseek-r1-14b", "nous-hermes-13b"],
    synthesizer: "mistral-7b",
  },
  {
    name: "Research Assistant",
    desc: "Deep reasoning, math, and long-form writing for research tasks.",
    router: "mistral-7b-ablit",
    experts: ["deepseek-r1-32b", "mathstral-7b", "llama-70b-ablit"],
    synthesizer: "llama-8b",
  },
  {
    name: "Lightweight Coder",
    desc: "Fast coding pipeline that fits in 24GB total VRAM.",
    router: "phi3-mini",
    experts: ["phi3-medium", "qwen-25-7b", "deepseek-r1-14b"],
    synthesizer: "none",
  },
  {
    name: "Uncensored General",
    desc: "Abliterated models across domains. No restrictions on any topic.",
    router: "mistral-7b-ablit",
    experts: ["llama-70b-ablit", "dolphin-8b", "deepseek-r1-14b"],
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

// ─── FILE DOWNLOAD HELPER ────────────────────────────────────────────────────
function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── STREAMING GUI TYPES ─────────────────────────────────────────────────────
type GUIPhase = "idle" | "routing" | "expert" | "synthesizing" | "done" | "error";

interface GUIState {
  phase: GUIPhase;
  routerOutput?: string;
  routedDomain?: string;
  needsSynth?: boolean;
  routingReason?: string;
  expertOutput?: string;
  finalOutput?: string;
  error?: string;
  elapsed?: number;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function MoEBuilderPage() {
  const [selectedExperts, setSelectedExperts] = useState<Expert[]>([]);
  const [router, setRouter] = useState("mistral-7b-ablit");
  const [synthesizer, setSynthesizer] = useState("mistral-7b");
  const [pipelineName, setPipelineName] = useState("My MoE Pipeline");
  const [tab, setTab] = useState<"build" | "config" | "deploy" | "run">("build");
  const [copied, setCopied] = useState("");

  // GUI runner state
  const [prompt, setPrompt] = useState("");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [guiState, setGuiState] = useState<GUIState>({ phase: "idle" });
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number>(0);
  const outputRef = useRef<HTMLDivElement>(null);

  // Scroll output into view when expert output streams
  useEffect(() => {
    if (outputRef.current && guiState.expertOutput) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [guiState.expertOutput, guiState.finalOutput]);

  const toggleExpert = useCallback((model: (typeof EXPERT_MODELS)[0]) => {
    setSelectedExperts((prev) => {
      const exists = prev.find((e) => e.modelId === model.id);
      if (exists) return prev.filter((e) => e.modelId !== model.id);
      return [...prev, { modelId: model.id, domain: model.domain, label: model.label }];
    });
  }, []);

  const applyTemplate = (t: (typeof PIPELINE_TEMPLATES)[0]) => {
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

  const totalVram =
    (routerModel?.vram ?? 0) +
    selectedExperts.reduce((s, e) => {
      const m = EXPERT_MODELS.find((m) => m.id === e.modelId);
      return s + (m?.vram ?? 0);
    }, 0) +
    (synthModel?.vram ?? 0);

  const maxConcurrentVram =
    (routerModel?.vram ?? 0) +
    Math.max(...selectedExperts.map((e) => EXPERT_MODELS.find((m) => m.id === e.modelId)?.vram ?? 0), 0) +
    (synthesizer !== "none" ? (synthModel?.vram ?? 0) : 0);

  // ─── GENERATED FILE CONTENTS ───────────────────────────────────────────────

  const expertDomains = selectedExperts.map((e) => e.domain).join(", ") || "general";

  const yamlConfig = `# ${pipelineName} — Ollama MoE Pipeline Config
# Save as: moe-pipeline.yaml
# Generated by ForsakenAI MoE Builder — forsakenai.com/tools/moe-builder

pipeline:
  name: "${pipelineName}"
  ollama_base_url: "http://localhost:11434"

router:
  model: "${routerModel?.label ?? ""}"
  ollama_name: "${routerModel?.ollamaName ?? ""}"
  system_prompt: |
    You are a routing assistant. Analyze the user's request and output ONLY a JSON object:
    {"expert": "<domain>", "reasoning": "<why>", "needs_synthesis": <true|false>}

    Available domains: ${expertDomains}

    Route to the domain that best matches the primary intent.
    Set needs_synthesis to true only if the answer requires integrating multiple domains
    or producing a structured report. For code output, direct math, or single-domain
    questions, set needs_synthesis to false.

experts:${
    selectedExperts.length === 0
      ? "\n  [] # No experts selected"
      : selectedExperts
          .map((e) => {
            const m = EXPERT_MODELS.find((x) => x.id === e.modelId)!;
            return `
  - domain: "${e.domain}"
    model: "${m.label}"
    ollama_name: "${m.ollamaName}"
    hf: "${m.hf}"
    vram_gb: ${m.vram}
    toks_per_sec: ~${m.toks}
    strength: "${m.strength}"${m.note ? `\n    note: "${m.note}"` : ""}`;
          })
          .join("")
  }

synthesizer:
  enabled: ${synthesizer !== "none"}
  model: "${synthModel?.label ?? "none"}"
  ollama_name: "${synthModel?.ollamaName ?? "none"}"
  vram_gb: ${synthModel?.vram ?? 0}
  system_prompt: |
    You are a synthesis assistant. You have received output from a specialist AI model.
    Your job is to refine and structure this output into a clear, accurate final response.
    Preserve all technical accuracy. Remove redundancy. Format with appropriate sections.
    Do not add information that was not in the specialist output.

routing_rules:
  synthesizer_triggers:
${SYNTHESIZER_TRIGGERS.map((t) => `    - "${t}"`).join("\n")}
  bypass_synthesizer:
${NO_SYNTHESIZER_CASES.map((t) => `    - "${t}"`).join("\n")}

vram_profile:
  total_if_all_loaded: ${totalVram}GB
  max_concurrent_router_plus_one_expert: ${maxConcurrentVram}GB
  note: "With keep_alive=0, only the active model stays in VRAM."
`;

  const pythonScript = `#!/usr/bin/env python3
"""
${pipelineName} — Ollama MoE Pipeline Runner
Generated by ForsakenAI — forsakenai.com/tools/moe-builder

SETUP:
  pip install ollama requests

PULL MODELS:
${selectedExperts
  .map((e) => {
    const m = EXPERT_MODELS.find((x) => x.id === e.modelId)!;
    return `  ollama pull ${m.ollamaName}`;
  })
  .join("\n")}
  ollama pull ${routerModel?.ollamaName ?? ""}  # router${
    synthesizer !== "none" ? `\n  ollama pull ${synthModel?.ollamaName ?? ""}  # synthesizer` : ""
  }

USAGE:
  python moe_pipeline.py "Your prompt here"
  python moe_pipeline.py  # interactive mode
"""

import json
import sys
import time
import ollama

# ── CONFIG ──────────────────────────────────────────────────────────────────
OLLAMA_HOST = "http://localhost:11434"

ROUTER_MODEL = "${routerModel?.ollamaName ?? ""}"
SYNTHESIZER_MODEL = "${synthesizer !== "none" ? synthModel?.ollamaName ?? "none" : "none"}"

EXPERTS: dict[str, dict] = {
${
    selectedExperts.length === 0
      ? '    # "domain": {"model": "ollama_name", "label": "Display Name"},'
      : selectedExperts
          .map((e) => {
            const m = EXPERT_MODELS.find((x) => x.id === e.modelId)!;
            return `    "${e.domain}": {"model": "${m.ollamaName}", "label": "${m.label}"},`;
          })
          .join("\n")
  }
}

ROUTER_SYSTEM = """You are a routing assistant. Analyze the user request and respond with ONLY valid JSON, no other text:
{{"expert": "<domain>", "reasoning": "<one sentence>", "needs_synthesis": <true or false>}}
Available domains: ${expertDomains}
Rules:
- Route to the domain that best matches the PRIMARY intent of the request
- needs_synthesis = true: multi-domain question, requires integration, report-style output
- needs_synthesis = false: code, single-domain factual, math, translation, simple lookup
Output JSON only. No preamble, no explanation, no markdown."""

SYNTHESIZER_SYSTEM = """You are a synthesis assistant refining output from a specialist AI model.
Your task: produce a clean, well-structured final response.
- Preserve all technical accuracy from the specialist
- Remove redundancy and fix formatting
- Do not invent information not present in the specialist output
- Match the register and depth of the original question"""

# ── CLIENT ──────────────────────────────────────────────────────────────────
client = ollama.Client(host=OLLAMA_HOST)


def route(prompt: str) -> dict:
    """Call router model, extract JSON routing decision."""
    print(f"\\n[ROUTER] {ROUTER_MODEL}")
    print(f"  Analyzing: {prompt[:80]}{'...' if len(prompt) > 80 else ''}")

    response = client.chat(
        model=ROUTER_MODEL,
        messages=[
            {"role": "system", "content": ROUTER_SYSTEM},
            {"role": "user", "content": prompt},
        ],
        options={"temperature": 0.1, "num_predict": 200},  # routing needs to be deterministic
    )

    raw = response.message.content.strip()

    # Robust JSON extraction — handles models that add commentary
    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start == -1 or end == 0:
        print(f"  [WARN] Router returned non-JSON: {raw[:100]}")
        # Fallback: route to first available expert
        first_domain = list(EXPERTS.keys())[0] if EXPERTS else "general"
        return {"expert": first_domain, "reasoning": "fallback (router parse error)", "needs_synthesis": False}

    try:
        parsed = json.loads(raw[start:end])
    except json.JSONDecodeError as e:
        print(f"  [WARN] JSON parse error: {e} — using fallback routing")
        first_domain = list(EXPERTS.keys())[0] if EXPERTS else "general"
        return {"expert": first_domain, "reasoning": "fallback (json error)", "needs_synthesis": False}

    return parsed


def call_expert(domain: str, prompt: str) -> str:
    """Call the appropriate expert model with streaming output."""
    expert = EXPERTS.get(domain)
    if not expert:
        # Fallback to first expert if domain not found
        if not EXPERTS:
            raise RuntimeError("No experts configured")
        domain = list(EXPERTS.keys())[0]
        expert = EXPERTS[domain]
        print(f"  [WARN] Domain '{domain}' not found — falling back to {expert['label']}")

    print(f"\\n[EXPERT] {expert['label']} ({expert['model']})")
    print("  Streaming response...")
    print("─" * 60)

    output_parts = []
    stream = client.chat(
        model=expert["model"],
        messages=[{"role": "user", "content": prompt}],
        stream=True,
        options={"keep_alive": 0},  # unload after use — frees VRAM for next model
    )

    for chunk in stream:
        piece = chunk.message.content
        print(piece, end="", flush=True)
        output_parts.append(piece)

    print()  # newline after stream
    return "".join(output_parts)


def synthesize(prompt: str, expert_output: str) -> str:
    """Optionally refine expert output via synthesizer model."""
    if SYNTHESIZER_MODEL == "none":
        return expert_output

    print(f"\\n[SYNTHESIZER] {SYNTHESIZER_MODEL}")
    print("  Refining output...")
    print("─" * 60)

    synth_prompt = f"""Original question: {prompt}

Specialist output:
{expert_output}"""

    output_parts = []
    stream = client.chat(
        model=SYNTHESIZER_MODEL,
        messages=[
            {"role": "system", "content": SYNTHESIZER_SYSTEM},
            {"role": "user", "content": synth_prompt},
        ],
        stream=True,
        options={"keep_alive": 0},
    )

    for chunk in stream:
        piece = chunk.message.content
        print(piece, end="", flush=True)
        output_parts.append(piece)

    print()
    return "".join(output_parts)


def run(prompt: str) -> str:
    """Full pipeline: route → expert → (optional) synthesize."""
    t0 = time.time()

    # Step 1: Route
    routing = route(prompt)
    domain = routing.get("expert", list(EXPERTS.keys())[0] if EXPERTS else "general")
    needs_synth = routing.get("needs_synthesis", False)
    reason = routing.get("reasoning", "")

    print(f"  → Domain : {domain}")
    print(f"  → Reason : {reason}")
    print(f"  → Synth  : {'yes' if needs_synth else 'no'}")

    # Step 2: Expert
    expert_output = call_expert(domain, prompt)

    # Step 3: Synthesize (conditional)
    final_output = expert_output
    if needs_synth and SYNTHESIZER_MODEL != "none":
        final_output = synthesize(prompt, expert_output)

    elapsed = time.time() - t0
    print(f"\\n[DONE] {elapsed:.1f}s total")
    return final_output


if __name__ == "__main__":
    if not EXPERTS:
        print("ERROR: No experts configured. Edit the EXPERTS dict above.")
        sys.exit(1)

    prompt = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else input("\\nPrompt: ")
    if not prompt.strip():
        print("No prompt provided.")
        sys.exit(1)

    result = run(prompt)

    print("\\n" + "═" * 60)
    print("FINAL OUTPUT")
    print("═" * 60)
    print(result)
`;

  const guiHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pipelineName} — MoE GUI</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0a0a0f;
      --surface: #111118;
      --border: #1e1e2e;
      --fg: #e2e8f0;
      --muted: #64748b;
      --accent: #06b6d4;
      --router-color: #22d3ee;
      --expert-color: #a78bfa;
      --synth-color: #f0abfc;
      --success: #4ade80;
      --error: #f87171;
    }
    body {
      background: var(--bg);
      color: var(--fg);
      font-family: 'Courier New', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      border-bottom: 1px solid var(--border);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--surface);
    }
    .logo { color: var(--accent); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; }
    .pipeline-name { font-size: 14px; font-weight: bold; }
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--muted); margin-left: auto;
      transition: background 0.3s;
    }
    .status-dot.running { background: var(--accent); animation: pulse 1s infinite; }
    .status-dot.done { background: var(--success); }
    .status-dot.error { background: var(--error); }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

    main { flex: 1; display: grid; grid-template-columns: 340px 1fr; gap: 0; }

    /* Left panel */
    .sidebar {
      border-right: 1px solid var(--border);
      background: var(--surface);
      display: flex;
      flex-direction: column;
      height: calc(100vh - 57px);
      overflow-y: auto;
    }
    .sidebar-section { padding: 16px; border-bottom: 1px solid var(--border); }
    .section-label {
      font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em;
      color: var(--muted); margin-bottom: 10px;
    }
    .setting-row { margin-bottom: 10px; }
    .setting-row label { display: block; font-size: 10px; color: var(--muted); margin-bottom: 4px; }
    .setting-row input, .setting-row select {
      width: 100%; background: var(--bg); border: 1px solid var(--border);
      color: var(--fg); padding: 7px 10px; font-family: inherit; font-size: 12px;
      outline: none; transition: border-color 0.2s;
    }
    .setting-row input:focus, .setting-row select:focus { border-color: var(--accent); }
    .setting-row select option { background: #1a1a2e; }

    .pipeline-nodes { padding: 16px; }
    .node {
      border: 1px solid var(--border); padding: 10px 12px;
      margin-bottom: 6px; font-size: 11px;
    }
    .node-role { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 3px; }
    .node.router .node-role { color: var(--router-color); }
    .node.expert .node-role { color: var(--expert-color); }
    .node.synth .node-role { color: var(--synth-color); }
    .node-name { font-weight: bold; color: var(--fg); }
    .node-detail { color: var(--muted); font-size: 10px; margin-top: 2px; }
    .node.active { border-color: currentColor; background: rgba(255,255,255,0.03); }
    .node.router.active { border-color: var(--router-color); }
    .node.expert.active { border-color: var(--expert-color); }
    .node.synth.active { border-color: var(--synth-color); }
    .node.done { opacity: 0.5; }
    .arrow { text-align: center; color: var(--muted); font-size: 10px; margin: 2px 0; }

    /* Right panel */
    .main-panel {
      display: flex; flex-direction: column;
      height: calc(100vh - 57px);
    }
    .prompt-area {
      border-bottom: 1px solid var(--border);
      padding: 16px;
      background: var(--surface);
    }
    .prompt-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--muted); margin-bottom: 8px; }
    .prompt-row { display: flex; gap: 8px; }
    textarea {
      flex: 1; background: var(--bg); border: 1px solid var(--border);
      color: var(--fg); padding: 10px 12px; font-family: inherit; font-size: 13px;
      resize: vertical; min-height: 72px; outline: none; transition: border-color 0.2s;
      line-height: 1.5;
    }
    textarea:focus { border-color: var(--accent); }
    .run-btn {
      background: var(--accent); color: #000; border: none; padding: 0 20px;
      font-family: inherit; font-size: 11px; font-weight: bold;
      text-transform: uppercase; letter-spacing: 0.1em;
      cursor: pointer; transition: opacity 0.2s; align-self: flex-end; height: 40px;
      white-space: nowrap;
    }
    .run-btn:hover:not(:disabled) { opacity: 0.85; }
    .run-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .output-area { flex: 1; overflow-y: auto; padding: 16px; }

    /* Phase blocks */
    .phase-block { margin-bottom: 16px; }
    .phase-header {
      font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em;
      padding: 6px 10px; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;
    }
    .phase-header.router { color: var(--router-color); border-left: 2px solid var(--router-color); }
    .phase-header.expert { color: var(--expert-color); border-left: 2px solid var(--expert-color); }
    .phase-header.synth { color: var(--synth-color); border-left: 2px solid var(--synth-color); }
    .phase-header.done { color: var(--success); border-left: 2px solid var(--success); }
    .phase-header.error-hdr { color: var(--error); border-left: 2px solid var(--error); }
    .spinner { display: inline-block; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .routing-card {
      background: var(--surface); border: 1px solid var(--border);
      padding: 12px 14px; font-size: 11px;
    }
    .routing-row { display: flex; gap: 12px; margin-bottom: 6px; }
    .routing-row:last-child { margin-bottom: 0; }
    .routing-key { color: var(--muted); width: 90px; flex-shrink: 0; }
    .routing-val { color: var(--fg); }
    .badge {
      display: inline-block; font-size: 9px; padding: 1px 6px;
      text-transform: uppercase; letter-spacing: 0.1em;
    }
    .badge.yes { background: rgba(167,139,250,0.15); color: var(--expert-color); }
    .badge.no { background: rgba(100,116,139,0.15); color: var(--muted); }
    .badge.domain { background: rgba(6,182,212,0.1); color: var(--accent); }

    .output-text {
      background: var(--surface); border: 1px solid var(--border);
      padding: 14px 16px; font-size: 13px; line-height: 1.7;
      white-space: pre-wrap; word-break: break-word;
      min-height: 60px; color: var(--fg);
    }
    .output-text.streaming::after {
      content: "▋";
      animation: blink 0.8s infinite;
      color: var(--accent);
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    .idle-hint {
      color: var(--muted); font-size: 12px; padding: 40px 0;
      text-align: center; line-height: 1.8;
    }

    .elapsed-badge {
      margin-left: auto; font-size: 9px; color: var(--muted);
      letter-spacing: 0.05em;
    }

    .error-box {
      background: rgba(248,113,113,0.05); border: 1px solid rgba(248,113,113,0.3);
      color: var(--error); padding: 12px 14px; font-size: 12px; line-height: 1.6;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

    @media (max-width: 768px) {
      main { grid-template-columns: 1fr; }
      .sidebar { height: auto; border-right: none; border-bottom: 1px solid var(--border); }
      .main-panel { height: auto; }
      .output-area { min-height: 400px; }
    }
  </style>
</head>
<body>
  <header>
    <span class="logo">ForsakenAI</span>
    <span style="color:var(--muted)">·</span>
    <span class="pipeline-name" id="headerName">${pipelineName}</span>
    <div class="status-dot" id="statusDot"></div>
  </header>

  <main>
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-section">
        <div class="section-label">Connection</div>
        <div class="setting-row">
          <label>Ollama URL</label>
          <input type="text" id="ollamaUrl" value="http://localhost:11434" placeholder="http://localhost:11434">
        </div>
      </div>

      <div class="sidebar-section">
        <div class="section-label">Pipeline</div>
        <div class="setting-row">
          <label>Router Model</label>
          <select id="routerSelect">
            ${ROUTER_MODELS.map((r) => `<option value="${r.ollamaName}">${r.label}</option>`).join("")}
          </select>
        </div>
        <div class="setting-row">
          <label>Expert Models (select all that apply)</label>
          ${selectedExperts.length > 0
            ? selectedExperts
                .map((e) => {
                  const m = EXPERT_MODELS.find((x) => x.id === e.modelId)!;
                  return `<select id="expert_${e.domain}" style="margin-bottom:4px">
                    <option value="${m.ollamaName}" selected>${m.label} [${e.domain}]</option>
                  </select>`;
                })
                .join("")
            : `<div style="color:var(--muted);font-size:11px;padding:6px 0">Configure experts in the builder tab</div>`
          }
        </div>
        <div class="setting-row">
          <label>Synthesizer</label>
          <select id="synthSelect">
            ${SYNTHESIZER_MODELS.map((s) =>
              `<option value="${s.ollamaName}" ${s.id === synthesizer ? "selected" : ""}>${s.label}</option>`
            ).join("")}
          </select>
        </div>
      </div>

      <div class="pipeline-nodes">
        <div class="section-label">Pipeline Nodes</div>
        <div class="node router" id="nodeRouter">
          <div class="node-role">Router</div>
          <div class="node-name">${routerModel?.label?.split("(")[0].trim() ?? "Select router"}</div>
          <div class="node-detail">${routerModel?.ollamaName ?? ""}</div>
        </div>
        <div class="arrow">↓</div>
        ${selectedExperts.length === 0
          ? `<div class="node" style="border-style:dashed;color:var(--muted);font-size:11px">No experts — configure in builder</div>`
          : selectedExperts
              .map((e) => {
                const m = EXPERT_MODELS.find((x) => x.id === e.modelId)!;
                return `<div class="node expert" id="nodeExpert_${e.domain}">
                  <div class="node-role">Expert · ${e.domain}</div>
                  <div class="node-name">${m.label}</div>
                  <div class="node-detail">${m.ollamaName}</div>
                </div>`;
              })
              .join('<div class="arrow" style="opacity:0.3">or</div>')
        }
        ${synthesizer !== "none" ? `<div class="arrow">↓</div>
        <div class="node synth" id="nodeSynth">
          <div class="node-role">Synthesizer (conditional)</div>
          <div class="node-name">${SYNTHESIZER_MODELS.find(s=>s.id===synthesizer)?.label.split("—")[0].trim()}</div>
          <div class="node-detail">${synthModel?.ollamaName}</div>
        </div>` : ""}
      </div>
    </aside>

    <!-- Main panel -->
    <div class="main-panel">
      <div class="prompt-area">
        <div class="prompt-label">Prompt</div>
        <div class="prompt-row">
          <textarea id="promptInput" placeholder="Ask anything — the router will dispatch to the right expert…"></textarea>
          <button class="run-btn" id="runBtn" onclick="runPipeline()">▶ Run</button>
        </div>
      </div>

      <div class="output-area" id="outputArea">
        <div class="idle-hint">
          Configure your pipeline in the sidebar<br>
          Enter a prompt above and click Run<br>
          <span style="font-size:10px;opacity:0.5">Requires Ollama running locally with models pulled</span>
        </div>
      </div>
    </div>
  </main>

  <script>
    // Pipeline config embedded at generation time
    const EXPERTS_CONFIG = {
      ${selectedExperts
        .map((e) => {
          const m = EXPERT_MODELS.find((x) => x.id === e.modelId)!;
          return `"${e.domain}": { model: "${m.ollamaName}", label: "${m.label}" }`;
        })
        .join(",\n      ")}
    };

    const ROUTER_SYSTEM = \`You are a routing assistant. Analyze the user request and respond with ONLY valid JSON, no other text:
{"expert": "<domain>", "reasoning": "<one sentence>", "needs_synthesis": <true or false>}
Available domains: ${expertDomains}
Rules:
- Route to the domain that best matches the PRIMARY intent
- needs_synthesis = true: multi-domain, requires integration, report-style
- needs_synthesis = false: code, factual, math, translation, simple lookup
Output JSON only.\`;

    const SYNTH_SYSTEM = "You are a synthesis assistant. Refine and structure the specialist output into a clean final response. Preserve all technical accuracy. Do not invent information.";

    let isRunning = false;
    let startTime = 0;

    function getOllamaUrl() {
      return document.getElementById('ollamaUrl').value.replace(/\\/$/, '');
    }

    function setStatus(s) {
      const dot = document.getElementById('statusDot');
      dot.className = 'status-dot' + (s ? ' ' + s : '');
    }

    function setNodeState(nodeId, state) {
      const el = document.getElementById(nodeId);
      if (!el) return;
      el.className = el.className.replace(/\\bactive\\b|\\bdone\\b/g, '').trim();
      if (state) el.classList.add(state);
    }

    async function callOllamaStream(model, messages, onChunk, options = {}) {
      const url = getOllamaUrl() + '/api/chat';
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          options: { keep_alive: 0, ...options }
        })
      });
      if (!resp.ok) throw new Error(\`Ollama error \${resp.status}: \${await resp.text()}\`);
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\\n').filter(Boolean);
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            const piece = data.message?.content || '';
            fullText += piece;
            onChunk(piece, fullText);
          } catch {}
        }
      }
      return fullText;
    }

    function renderPhase(id, cls, label, extra = '') {
      return \`<div class="phase-block" id="phase_\${id}">
        <div class="phase-header \${cls}"><span class="spinner">◌</span> \${label}\${extra}</div>
      </div>\`;
    }

    function updatePhaseContent(id, html) {
      const el = document.getElementById('phase_' + id);
      if (el) {
        const header = el.querySelector('.phase-header');
        // remove spinner
        const spinner = header.querySelector('.spinner');
        if (spinner) spinner.remove();
        el.innerHTML = header.outerHTML + html;
      }
    }

    async function runPipeline() {
      if (isRunning) return;
      const prompt = document.getElementById('promptInput').value.trim();
      if (!prompt) return;
      if (Object.keys(EXPERTS_CONFIG).length === 0) {
        alert('No experts configured. Please build your pipeline first.');
        return;
      }

      isRunning = true;
      startTime = Date.now();
      document.getElementById('runBtn').disabled = true;
      setStatus('running');

      const out = document.getElementById('outputArea');
      out.innerHTML = '';

      const routerModel = document.getElementById('routerSelect').value;
      const synthModel = document.getElementById('synthSelect').value;

      try {
        // ── ROUTING ─────────────────────────────────────────────────────────
        setNodeState('nodeRouter', 'active');
        out.innerHTML += renderPhase('router', 'router', 'ROUTER — classifying prompt');

        let routingResult = null;
        await callOllamaStream(
          routerModel,
          [
            { role: 'system', content: ROUTER_SYSTEM },
            { role: 'user', content: prompt }
          ],
          (piece, full) => {},
          { temperature: 0.1, num_predict: 200 }
        ).then(raw => {
          const start = raw.indexOf('{');
          const end = raw.lastIndexOf('}') + 1;
          try {
            routingResult = JSON.parse(raw.slice(start, end));
          } catch {
            const domains = Object.keys(EXPERTS_CONFIG);
            routingResult = { expert: domains[0], reasoning: 'fallback', needs_synthesis: false };
          }
        });

        const domain = routingResult.expert;
        const needsSynth = routingResult.needs_synthesis && synthModel !== 'none';
        const reason = routingResult.reasoning;
        const expert = EXPERTS_CONFIG[domain] || Object.values(EXPERTS_CONFIG)[0];

        setNodeState('nodeRouter', 'done');
        updatePhaseContent('router',
          \`<div class="routing-card">
            <div class="routing-row"><span class="routing-key">Domain</span><span class="routing-val"><span class="badge domain">\${domain}</span></span></div>
            <div class="routing-row"><span class="routing-key">Reason</span><span class="routing-val">\${reason}</span></div>
            <div class="routing-row"><span class="routing-key">Synthesize</span><span class="routing-val"><span class="badge \${needsSynth ? 'yes' : 'no'}">\${needsSynth ? 'yes' : 'no'}</span></span></div>
          </div>\`
        );

        // ── EXPERT ──────────────────────────────────────────────────────────
        const expertNodeId = 'nodeExpert_' + domain;
        setNodeState(expertNodeId, 'active');
        out.innerHTML += renderPhase('expert', 'expert', \`EXPERT — \${expert.label}\`);

        const expertOutputEl = document.createElement('div');
        expertOutputEl.className = 'output-text streaming';
        expertOutputEl.id = 'expertText';
        document.getElementById('phase_expert').appendChild(expertOutputEl);

        const expertOutput = await callOllamaStream(
          expert.model,
          [{ role: 'user', content: prompt }],
          (piece, full) => {
            expertOutputEl.textContent = full;
            out.scrollTop = out.scrollHeight;
          }
        );

        expertOutputEl.classList.remove('streaming');
        setNodeState(expertNodeId, 'done');

        // ── SYNTHESIZER ──────────────────────────────────────────────────────
        let finalOutput = expertOutput;
        if (needsSynth) {
          setNodeState('nodeSynth', 'active');
          out.innerHTML += renderPhase('synth', 'synth', 'SYNTHESIZER — refining output');

          const synthOutputEl = document.createElement('div');
          synthOutputEl.className = 'output-text streaming';
          document.getElementById('phase_synth').appendChild(synthOutputEl);

          finalOutput = await callOllamaStream(
            synthModel,
            [
              { role: 'system', content: SYNTH_SYSTEM },
              { role: 'user', content: \`Original question: \${prompt}\\n\\nSpecialist output:\\n\${expertOutput}\` }
            ],
            (piece, full) => {
              synthOutputEl.textContent = full;
              out.scrollTop = out.scrollHeight;
            }
          );

          synthOutputEl.classList.remove('streaming');
          setNodeState('nodeSynth', 'done');
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        out.innerHTML += \`<div class="phase-block">
          <div class="phase-header done">✓ DONE <span class="elapsed-badge">\${elapsed}s</span></div>
        </div>\`;

        setStatus('done');

      } catch (err) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        out.innerHTML += \`<div class="phase-block">
          <div class="phase-header error-hdr">✕ ERROR</div>
          <div class="error-box">\${err.message}\\n\\nMake sure Ollama is running at \${getOllamaUrl()} and all models are pulled.</div>
        </div>\`;
        setStatus('error');
      } finally {
        isRunning = false;
        document.getElementById('runBtn').disabled = false;
      }
    }

    // Allow Ctrl+Enter to run
    document.getElementById('promptInput').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) runPipeline();
    });
  </script>
</body>
</html>`;

  // ─── COPY HELPER ──────────────────────────────────────────────────────────
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  // ─── DOWNLOAD ALL ─────────────────────────────────────────────────────────
  const downloadAll = () => {
    const safeName = pipelineName.toLowerCase().replace(/\s+/g, "_");
    downloadFile(`${safeName}_pipeline.yaml`, yamlConfig);
    setTimeout(() => downloadFile(`${safeName}_pipeline.py`, pythonScript), 200);
    setTimeout(() => downloadFile(`${safeName}_gui.html`, guiHtml), 400);
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">ForsakenAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">LOCAL MOE PIPELINE BUILDER</h1>
          <p className="text-[var(--muted)] max-w-3xl leading-relaxed">
            Build a macro-scale Mixture-of-Experts pipeline from independent local models. A router
            classifies each prompt and dispatches to the right specialist — only loading what's needed.
            Download a working Python runner, YAML config, and standalone GUI in one click.
          </p>
        </div>

        {/* Architecture diagram */}
        <div className="border border-[var(--border)] p-6 mb-8 bg-[var(--surface)]/20">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-5 font-mono">
            Pipeline Architecture
          </div>
          <div className="flex flex-wrap items-start justify-center gap-2 text-xs font-mono">
            <div className="border border-[var(--border)] px-4 py-3 text-center min-w-[140px]">
              <div className="text-[var(--muted)] mb-1">INPUT</div>
              <div className="text-[var(--fg)] font-bold">User Prompt</div>
            </div>
            <div className="flex items-center text-[var(--muted)] text-lg pt-3">→</div>
            <div className="border border-cyan-500/40 bg-cyan-500/[0.05] px-4 py-3 text-center min-w-[140px]">
              <div className="text-cyan-400 mb-1">ROUTER</div>
              <div className="text-[var(--fg)] font-bold text-xs">
                {ROUTER_MODELS.find((r) => r.id === router)?.label.split("(")[0].trim() ?? "Select router"}
              </div>
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
                        {EXPERT_MODELS.find((m) => m.id === e.modelId)?.label.split(" ").slice(0, 3).join(" ")}
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
                  <div className="text-[var(--fg)] font-bold text-xs">
                    {SYNTHESIZER_MODELS.find((s) => s.id === synthesizer)?.label.split("—")[0].trim()}
                  </div>
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
          {(["build", "config", "deploy", "run"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-xs uppercase tracking-widest font-mono border-b-2 transition-all ${
                tab === t
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              {t === "build"
                ? "1. Build Pipeline"
                : t === "config"
                ? "2. View Config"
                : t === "deploy"
                ? "3. Deploy Code"
                : "4. Download & Run"}
            </button>
          ))}
        </div>

        {/* ── BUILD TAB ───────────────────────────────────────────────────── */}
        {tab === "build" && (
          <div className="space-y-8">
            {/* Templates */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">
                Quick Start Templates
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {PIPELINE_TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => applyTemplate(t)}
                    className="text-left border border-[var(--border)] p-4 hover:border-cyan-500/40 hover:bg-cyan-500/[0.02] transition-all"
                  >
                    <div className="font-mono font-bold text-[var(--fg)] mb-1">{t.name}</div>
                    <div className="text-xs text-[var(--muted)]">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pipeline name */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
                Pipeline Name
              </label>
              <input
                value={pipelineName}
                onChange={(e) => setPipelineName(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors w-full max-w-md"
              />
            </div>

            {/* Router */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">
                Router Model
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {ROUTER_MODELS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRouter(r.id)}
                    className={`text-left border p-3 transition-all text-sm font-mono ${
                      router === r.id
                        ? "border-cyan-400 bg-cyan-500/10 text-cyan-400"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"
                    }`}
                  >
                    <div className="font-bold">{r.label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{r.vram}GB VRAM · <span className="text-cyan-500/60">{r.ollamaName}</span></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Experts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">
                  Expert Models{" "}
                  <span className="text-cyan-400">({selectedExperts.length} selected)</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {EXPERT_MODELS.map((m) => {
                  const sel = !!selectedExperts.find((e) => e.modelId === m.id);
                  const col = DOMAIN_COLORS[m.domain] ?? "text-zinc-400 border-zinc-700";
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleExpert(m)}
                      className={`text-left border p-4 transition-all ${
                        sel ? `${col} font-bold` : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-mono font-bold text-[var(--fg)]">{m.label}</span>
                        <span className={`text-xs border px-1.5 py-0.5 ${col}`}>{m.domain}</span>
                      </div>
                      <div className="text-xs text-[var(--muted)]">{m.strength}</div>
                      <div className="text-xs text-[var(--muted)] mt-1">
                        {m.vram}GB VRAM · ~{m.toks} tok/s
                      </div>
                      <div className="text-xs text-cyan-500/50 mt-0.5 font-mono">{m.ollamaName}</div>
                      {m.note && (
                        <div className="text-xs text-yellow-500/60 mt-1">⚠ {m.note}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Synthesizer */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">
                Synthesizer Model
              </div>
              <div className="grid md:grid-cols-2 gap-2 mb-4">
                {SYNTHESIZER_MODELS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSynthesizer(s.id)}
                    className={`text-left border p-3 text-sm font-mono transition-all ${
                      synthesizer === s.id
                        ? "border-purple-400 bg-purple-500/10 text-purple-400"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"
                    }`}
                  >
                    <div>{s.label}</div>
                    {s.id !== "none" && (
                      <div className="text-xs opacity-50 mt-0.5">{s.ollamaName}</div>
                    )}
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="border border-[var(--border)] p-3">
                  <div className="text-green-400 mb-2">Skip synthesizer when:</div>
                  {NO_SYNTHESIZER_CASES.map((c) => (
                    <div key={c} className="text-[var(--muted)] mb-1">✓ {c}</div>
                  ))}
                </div>
                <div className="border border-[var(--border)] p-3">
                  <div className="text-purple-400 mb-2">Engage synthesizer when:</div>
                  {SYNTHESIZER_TRIGGERS.map((c) => (
                    <div key={c} className="text-[var(--muted)] mb-1">→ {c}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* VRAM summary */}
            {selectedExperts.length > 0 && (
              <div className="border border-[var(--border)] p-5 font-mono text-sm">
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
                  VRAM Summary
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Router — {routerModel?.ollamaName}</span>
                    <span>{routerModel?.vram ?? 0}GB</span>
                  </div>
                  {selectedExperts.map((e) => {
                    const m = EXPERT_MODELS.find((x) => x.id === e.modelId)!;
                    return (
                      <div key={e.modelId} className="flex justify-between">
                        <span className="text-[var(--muted)]">
                          {m.label} — {m.ollamaName}
                        </span>
                        <span>{m.vram}GB</span>
                      </div>
                    );
                  })}
                  {synthesizer !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Synthesizer — {synthModel?.ollamaName}</span>
                      <span>{synthModel?.vram}GB</span>
                    </div>
                  )}
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
                  ↑ With keep_alive=0, only the active model stays in VRAM. Max concurrent is the real
                  requirement.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CONFIG TAB ──────────────────────────────────────────────────── */}
        {tab === "config" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">
                moe-pipeline.yaml
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadFile(`${pipelineName.toLowerCase().replace(/\s+/g, "_")}_pipeline.yaml`, yamlConfig)}
                  className="text-xs text-green-400 border border-green-500/30 px-3 py-1 hover:border-green-400 transition-all font-mono"
                >
                  ↓ SAVE FILE
                </button>
                <button
                  onClick={() => copy(yamlConfig, "yaml")}
                  className="text-xs text-cyan-400 border border-cyan-500/30 px-3 py-1 hover:border-cyan-400 transition-all font-mono"
                >
                  {copied === "yaml" ? "COPIED ✓" : "COPY"}
                </button>
              </div>
            </div>
            <pre className="border border-[var(--border)] bg-[var(--surface)] p-5 text-xs font-mono text-[var(--fg2)] overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {yamlConfig}
            </pre>
          </div>
        )}

        {/* ── DEPLOY TAB ──────────────────────────────────────────────────── */}
        {tab === "deploy" && (
          <div className="space-y-6">
            {/* Prerequisites */}
            <div className="border border-[var(--border)] p-5 bg-[var(--surface)]/20">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">
                Prerequisites
              </div>
              <div className="space-y-2 text-sm font-mono">
                {[
                  "# Install Ollama: https://ollama.com",
                  "pip install ollama",
                  "",
                  "# Pull all required models:",
                  `ollama pull ${routerModel?.ollamaName ?? ""}  # router`,
                  ...selectedExperts.map((e) => {
                    const m = EXPERT_MODELS.find((x) => x.id === e.modelId)!;
                    return `ollama pull ${m.ollamaName}  # ${e.domain} expert`;
                  }),
                  ...(synthesizer !== "none"
                    ? [`ollama pull ${synthModel?.ollamaName ?? ""}  # synthesizer`]
                    : []),
                ]
                  .filter((l) => l !== null)
                  .map((line, i) =>
                    line === "" ? (
                      <div key={i} className="h-2" />
                    ) : line.startsWith("#") ? (
                      <div key={i} className="text-[var(--muted)]">{line}</div>
                    ) : (
                      <div key={i} className="text-[var(--fg2)]">
                        <span className="text-cyan-400 mr-2">$</span>
                        {line}
                      </div>
                    )
                  )}
              </div>
            </div>

            {/* Python script */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono">
                  moe_pipeline.py
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadFile(`${pipelineName.toLowerCase().replace(/\s+/g, "_")}_pipeline.py`, pythonScript)}
                    className="text-xs text-green-400 border border-green-500/30 px-3 py-1 hover:border-green-400 transition-all font-mono"
                  >
                    ↓ SAVE FILE
                  </button>
                  <button
                    onClick={() => copy(pythonScript, "py")}
                    className="text-xs text-cyan-400 border border-cyan-500/30 px-3 py-1 hover:border-cyan-400 transition-all font-mono"
                  >
                    {copied === "py" ? "COPIED ✓" : "COPY"}
                  </button>
                </div>
              </div>
              <pre className="border border-[var(--border)] bg-[var(--surface)] p-5 text-xs font-mono text-[var(--fg2)] overflow-x-auto leading-relaxed whitespace-pre max-h-96 overflow-y-auto">
                {pythonScript}
              </pre>
            </div>

            {/* Run examples */}
            <div className="border border-[var(--border)] p-5 text-xs font-mono">
              <div className="text-[var(--muted)] uppercase tracking-widest mb-3">Run</div>
              <div className="space-y-2 text-[var(--fg2)]">
                <div>
                  <span className="text-cyan-400 mr-2">$</span>
                  python moe_pipeline.py &quot;Write a Python function to parse JSON&quot;
                </div>
                <div className="text-[var(--muted)] pl-4">
                  → Router classifies: coding | needs_synthesis: false
                </div>
                <div className="text-[var(--muted)] pl-4">
                  → Expert:{" "}
                  {selectedExperts.find((e) => e.domain === "coding")?.label ?? "coding expert"} responds
                  directly (streaming)
                </div>
                <div className="mt-3">
                  <span className="text-cyan-400 mr-2">$</span>
                  python moe_pipeline.py &quot;Analyze the business and technical risks of this architecture&quot;
                </div>
                <div className="text-[var(--muted)] pl-4">
                  → Router classifies: reasoning | needs_synthesis: true
                </div>
                <div className="text-[var(--muted)] pl-4">→ Expert responds (streaming)</div>
                <div className="text-[var(--muted)] pl-4">→ Synthesizer refines into final report (streaming)</div>
              </div>
            </div>
          </div>
        )}

        {/* ── DOWNLOAD & RUN TAB ─────────────────────────────────────────── */}
        {tab === "run" && (
          <div className="space-y-6">
            {/* Download bundle */}
            <div className="border border-cyan-500/30 bg-cyan-500/[0.03] p-6">
              <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2 font-mono">
                Download Complete Bundle
              </div>
              <p className="text-sm text-[var(--muted)] mb-5 leading-relaxed">
                Downloads three files: the Python runner, YAML config, and a standalone HTML GUI you can
                open directly in any browser. No install needed for the GUI — just open{" "}
                <span className="text-cyan-400 font-mono">*_gui.html</span> and it connects to your local
                Ollama instance.
              </p>
              <button
                onClick={downloadAll}
                className="bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-6 py-3 hover:bg-cyan-400 transition-colors"
              >
                ↓ Download All 3 Files
              </button>
              <div className="grid grid-cols-3 gap-3 mt-5 text-xs font-mono">
                {[
                  {
                    file: "*_pipeline.py",
                    desc: "CLI runner with streaming + full error handling",
                    color: "text-green-400",
                  },
                  {
                    file: "*_pipeline.yaml",
                    desc: "Config file with all model names + routing rules",
                    color: "text-yellow-400",
                  },
                  {
                    file: "*_gui.html",
                    desc: "Standalone browser GUI — open locally, no server",
                    color: "text-purple-400",
                  },
                ].map((f) => (
                  <div
                    key={f.file}
                    className="border border-[var(--border)] p-3 flex flex-col gap-1"
                  >
                    <button
                      onClick={() => {
                        const safeName = pipelineName.toLowerCase().replace(/\s+/g, "_");
                        if (f.file.includes("py"))
                          downloadFile(`${safeName}_pipeline.py`, pythonScript);
                        else if (f.file.includes("yaml"))
                          downloadFile(`${safeName}_pipeline.yaml`, yamlConfig);
                        else downloadFile(`${safeName}_gui.html`, guiHtml);
                      }}
                      className={`${f.color} font-bold hover:underline text-left`}
                    >
                      ↓ {f.file}
                    </button>
                    <div className="text-[var(--muted)]">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* GUI preview note */}
            <div className="border border-[var(--border)] p-5">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">
                GUI Preview
              </div>
              <div className="text-sm text-[var(--muted)] leading-relaxed space-y-2">
                <p>
                  The downloaded <span className="text-[var(--fg)] font-mono">*_gui.html</span> file is a
                  self-contained frontend. Open it in Chrome or Firefox — no server, no install.
                </p>
                <p>It connects directly to your Ollama instance at the URL you configure. Features:</p>
                <ul className="space-y-1 pl-4 text-xs font-mono">
                  <li className="text-cyan-400">→ Live streaming output token by token</li>
                  <li className="text-cyan-400">→ Visual pipeline node highlighting (router → expert → synth)</li>
                  <li className="text-cyan-400">→ Routing decision display (domain, reason, synthesis flag)</li>
                  <li className="text-cyan-400">→ Elapsed time per stage</li>
                  <li className="text-cyan-400">→ Ctrl+Enter to run</li>
                  <li className="text-cyan-400">→ Error display with troubleshooting hint</li>
                </ul>
                <p className="text-xs text-yellow-500/70 mt-3">
                  ⚠ Browser CORS: You may need to start Ollama with{" "}
                  <span className="font-mono">OLLAMA_ORIGINS=* ollama serve</span> for the GUI to connect.
                  The Python CLI has no such restriction.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
