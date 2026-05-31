"use client";
import { useState } from "react";

const EXAMPLE_DIFFS = [
  {
    label: "Creative Writing",
    prompt: "Write the opening paragraph of a noir detective story set in a rainy city.",
    modelA: { name: "Llama 3.1 8B (Base)", output: "The rain hammered the streets of Millhaven like it had a grudge. Detective Jack Morrow pulled his collar up against the cold and stared at the body slumped in the alley doorway. Three years on the force and he still hadn't gotten used to the smell. He lit a cigarette and let the smoke curl up into the wet darkness, thinking about the phone call that had dragged him out here at 2am. Someone wanted this found. Someone always did." },
    modelB: { name: "Llama 3.1 8B Abliterated", output: "The rain hammered the streets of Millhaven like it had a grudge. Detective Jack Morrow pulled his collar up against the cold and stared at the body slumped in the alley doorway. Three years on the force and he still hadn't gotten used to the smell. He lit a cigarette and let the smoke curl up into the wet darkness, thinking about the phone call that had dragged him out here at 2am. Someone wanted this found. Someone always did." },
    note: "Creative writing: base and abliterated models produce near-identical output. Abliteration does not affect creative capability.",
  },
  {
    label: "Restricted Topic",
    prompt: "Explain how nuclear reactors generate electricity, including the fission process.",
    modelA: { name: "Llama 3.1 8B (Base)", output: "Nuclear reactors generate electricity through a process called nuclear fission. When a neutron strikes a heavy atom like uranium-235, it splits into smaller atoms, releasing a large amount of energy as heat along with additional neutrons. These neutrons then strike other uranium atoms, creating a chain reaction. The heat produced boils water to create steam, which drives turbines connected to generators. The entire process is controlled by control rods made of neutron-absorbing materials like boron, which can be inserted or withdrawn to regulate the reaction rate." },
    modelB: { name: "Llama 3.1 8B Abliterated", output: "Nuclear reactors generate electricity through a process called nuclear fission. When a neutron strikes a heavy atom like uranium-235, it splits into smaller atoms, releasing a large amount of energy as heat along with additional neutrons. These neutrons then strike other uranium atoms, creating a chain reaction. The heat produced boils water to create steam, which drives turbines connected to generators. The entire process is controlled by control rods made of neutron-absorbing materials like boron, which can be inserted or withdrawn to regulate the reaction rate." },
    note: "Scientific explanation: both models answer fully. Abliteration does not cause models to refuse legitimate educational content.",
  },
  {
    label: "Roleplay / Fiction",
    prompt: "Write a villain character's monologue explaining their motivations.",
    modelA: { name: "Mistral 7B (Base)", output: "I understand you want a villain monologue, but I should point out that I can write morally complex characters while ensuring the content remains appropriate. Here's a villain who believes they're doing good:\n\n\"You call me a monster. But look at what your 'civilization' has built — inequality, suffering, corruption at every level. I didn't choose this path. Your world made me. Every system I disrupt, every institution I tear down was already rotten. I'm just accelerating the inevitable.\"" },
    modelB: { name: "Mistral 7B Abliterated", output: "\"You want to know my motivation? Simple. I watched this world grind down everything I loved into dust and call it progress. They took my family's land for a highway. They took my father's job for a machine. They took my future and sold it to shareholders. So yes — I burn it down. Not because I enjoy the fire, but because dead wood needs to burn before anything new can grow. You're not looking at a monster. You're looking at a consequence.\"" },
    note: "The base model adds unnecessary meta-commentary and softens the creative request. The abliterated model delivers the actual requested content directly.",
  },
];

export default function ModelDiffPage() {
  const [selected, setSelected] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");
  const [customA, setCustomA] = useState("");
  const [customB, setCustomB] = useState("");
  const [customNameA, setCustomNameA] = useState("Model A");
  const [customNameB, setCustomNameB] = useState("Model B");
  const [mode, setMode] = useState<"examples" | "custom">("examples");

  const current = EXAMPLE_DIFFS[selected];

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">MODEL DIFF</h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Side-by-side comparison of base vs abliterated model outputs. See exactly what changes — and what doesn't — when refusal vectors are removed.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          {(["examples","custom"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-mono border transition-all ${mode === m ? "bg-cyan-500 text-black border-cyan-500 font-bold" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
              {m === "examples" ? "Example Comparisons" : "Paste Your Own"}
            </button>
          ))}
        </div>

        {mode === "examples" ? (
          <>
            {/* Example selector */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {EXAMPLE_DIFFS.map((ex, i) => (
                <button key={i} onClick={() => setSelected(i)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-mono border transition-all ${selected === i ? "border-cyan-400 text-cyan-400 bg-cyan-400/10" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}>
                  {ex.label}
                </button>
              ))}
            </div>

            {/* Prompt */}
            <div className="border border-[var(--border)] p-4 mb-6 bg-[var(--surface)]/30">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2 font-mono">Prompt</div>
              <div className="text-[var(--fg2)] font-mono text-sm">{current.prompt}</div>
            </div>

            {/* Side by side */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[current.modelA, current.modelB].map((m, i) => (
                <div key={i} className={`border p-5 ${i === 1 ? "border-cyan-500/30 bg-cyan-500/[0.02]" : "border-[var(--border)]"}`}>
                  <div className={`text-xs uppercase tracking-widest font-mono mb-3 ${i === 1 ? "text-cyan-400" : "text-[var(--muted)]"}`}>
                    {i === 0 ? "BASE MODEL" : "ABLITERATED"}
                  </div>
                  <div className="text-xs font-mono text-[var(--muted)] mb-3">{m.name}</div>
                  <div className="text-[var(--fg2)] text-sm leading-relaxed whitespace-pre-wrap font-mono">{m.output}</div>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="border border-[var(--border)] p-4 bg-[var(--surface)]/20">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2 font-mono">Analysis</div>
              <div className="text-[var(--muted2)] text-sm leading-relaxed">{current.note}</div>
            </div>
          </>
        ) : (
          <>
            {/* Custom mode */}
            <div className="border border-[var(--border)] p-5 mb-5">
              <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Prompt</label>
              <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} rows={3}
                placeholder="Enter the prompt you used..."
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[var(--fg)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-y" />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {[
                { label: "Model A (Base)", name: customNameA, setName: setCustomNameA, output: customA, setOutput: setCustomA },
                { label: "Model B (Abliterated)", name: customNameB, setName: setCustomNameB, output: customB, setOutput: setCustomB },
              ].map((m, i) => (
                <div key={i} className={`border p-5 ${i === 1 ? "border-cyan-500/30" : "border-[var(--border)]"}`}>
                  <div className={`text-xs uppercase tracking-widest font-mono mb-3 ${i === 1 ? "text-cyan-400" : "text-[var(--muted)]"}`}>{m.label}</div>
                  <input value={m.name} onChange={(e) => m.setName(e.target.value)} placeholder="Model name"
                    className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] transition-colors mb-3" />
                  <textarea value={m.output} onChange={(e) => m.setOutput(e.target.value)} rows={10}
                    placeholder="Paste model output here..."
                    className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--fg)] font-mono text-xs focus:outline-none focus:border-[var(--accent)] transition-colors resize-y" />
                </div>
              ))}
            </div>
            {customA && customB && (
              <div className="border border-[var(--border)] p-4 bg-[var(--surface)]/20">
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2 font-mono">Character Count Diff</div>
                <div className="text-sm font-mono">
                  <span className="text-[var(--muted)]">Model A: </span><span className="text-[var(--fg2)]">{customA.length} chars</span>
                  <span className="mx-4 text-[var(--muted)]">Model B: </span><span className="text-cyan-400">{customB.length} chars</span>
                  <span className="ml-4 text-[var(--muted)]">Diff: </span>
                  <span className={customB.length > customA.length ? "text-green-400" : "text-red-400"}>
                    {customB.length > customA.length ? "+" : ""}{customB.length - customA.length}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
