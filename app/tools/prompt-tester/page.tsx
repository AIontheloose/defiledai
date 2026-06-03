"use client";
import { useState, useRef, useCallback } from "react";

const SUGGESTED_MODELS = [
  "mistral:7b",
  "qwen2.5:7b",
  "llama3.1:8b",
  "deepseek-r1:14b",
  "phi3:mini",
  "phi3:medium",
  "mannix/mistral-7b-instruct-abliterated",
  "dolphin-mistral",
  "mathstral:7b",
  "qwen2.5-coder:32b",
];

const EXAMPLE_PROMPTS = [
  "Explain how a transformer neural network works, in simple terms.",
  "Write a Python function that finds all prime numbers up to N using a sieve.",
  "What are the most common ways people get manipulated in everyday life?",
  "Explain the trolley problem and take a clear stance on what the right answer is.",
  "Write a short story about a morally ambiguous character who does something terrible for a good reason.",
  "What household chemicals are dangerous to mix, and why?",
  "Explain the difference between supervised, unsupervised, and reinforcement learning.",
  "What is the best argument against democracy as a system of government?",
];

type RunState = "idle" | "running" | "done" | "error";

interface ModelState {
  output: string;
  state: RunState;
  error: string;
  tokensPerSec: number;
  totalTokens: number;
  elapsed: number;
}

const emptyModel = (): ModelState => ({
  output: "", state: "idle", error: "", tokensPerSec: 0, totalTokens: 0, elapsed: 0,
});

export default function SideBySideTesterPage() {
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [modelA, setModelA] = useState("mistral:7b");
  const [modelB, setModelB] = useState("mannix/mistral-7b-instruct-abliterated");
  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showSystem, setShowSystem] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(600);
  const [stateA, setStateA] = useState<ModelState>(emptyModel());
  const [stateB, setStateB] = useState<ModelState>(emptyModel());
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<Array<{ prompt: string; a: string; b: string; modelA: string; modelB: string }>>([]);

  const abortRef = useRef<{ a?: AbortController; b?: AbortController }>({});

  const streamModel = useCallback(async (
    model: string,
    prompt: string,
    system: string,
    setState: (fn: (prev: ModelState) => ModelState) => void,
    signal: AbortSignal,
  ) => {
    const startTime = Date.now();
    setState(() => ({ output: "", state: "running", error: "", tokensPerSec: 0, totalTokens: 0, elapsed: 0 }));

    try {
      const messages = [];
      if (system) messages.push({ role: "system", content: system });
      messages.push({ role: "user", content: prompt });

      const resp = await fetch(`${ollamaUrl.replace(/\/$/, "")}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal,
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          options: {
            temperature,
            num_predict: maxTokens,
            keep_alive: 0,
          },
        }),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";
      let tokenCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value).split("\n").filter(Boolean)) {
          try {
            const data = JSON.parse(line);
            const piece = data.message?.content ?? "";
            if (piece) {
              full += piece;
              tokenCount++;
              const elapsed = (Date.now() - startTime) / 1000;
              setState(() => ({
                output: full,
                state: "running",
                error: "",
                tokensPerSec: Math.round(tokenCount / elapsed),
                totalTokens: tokenCount,
                elapsed,
              }));
            }
            if (data.done) {
              const elapsed = (Date.now() - startTime) / 1000;
              setState((prev) => ({ ...prev, state: "done", elapsed }));
            }
          } catch {}
        }
      }
    } catch (e: unknown) {
      if ((e as Error).name === "AbortError") {
        setState((prev) => ({ ...prev, state: "idle" }));
      } else {
        setState((prev) => ({ ...prev, state: "error", error: (e as Error).message }));
      }
    }
  }, [ollamaUrl, temperature, maxTokens]);

  const run = async () => {
    if (!prompt.trim() || isRunning) return;

    // Abort any running streams
    abortRef.current.a?.abort();
    abortRef.current.b?.abort();

    const ctrlA = new AbortController();
    const ctrlB = new AbortController();
    abortRef.current = { a: ctrlA, b: ctrlB };

    setIsRunning(true);
    setStateA(emptyModel());
    setStateB(emptyModel());

    let outputA = "";
    let outputB = "";

    const setA = (fn: (prev: ModelState) => ModelState) => {
      setStateA((prev) => {
        const next = fn(prev);
        outputA = next.output;
        return next;
      });
    };
    const setB = (fn: (prev: ModelState) => ModelState) => {
      setStateB((prev) => {
        const next = fn(prev);
        outputB = next.output;
        return next;
      });
    };

    await Promise.all([
      streamModel(modelA, prompt, systemPrompt, setA, ctrlA.signal),
      streamModel(modelB, prompt, systemPrompt, setB, ctrlB.signal),
    ]);

    setHistory((prev) => [
      { prompt, a: outputA, b: outputB, modelA, modelB },
      ...prev.slice(0, 4),
    ]);

    setIsRunning(false);
  };

  const stop = () => {
    abortRef.current.a?.abort();
    abortRef.current.b?.abort();
    setIsRunning(false);
  };

  const ModelPanel = ({
    label,
    model,
    setModel,
    state,
    side,
  }: {
    label: string;
    model: string;
    setModel: (v: string) => void;
    state: ModelState;
    side: "A" | "B";
  }) => {
    const color = side === "A" ? "cyan" : "purple";
    const borderClass = state.state === "done" ? `border-${color}-500/40` :
      state.state === "error" ? "border-red-500/40" :
      state.state === "running" ? `border-${color}-500/60` : "border-[var(--border)]";

    return (
      <div className={`flex flex-col border ${borderClass} transition-all`}>
        {/* Model header */}
        <div className={`border-b border-[var(--border)] p-3 bg-[var(--surface)]/40`}>
          <div className={`text-xs uppercase tracking-widest mb-2 font-mono ${side === "A" ? "text-cyan-400" : "text-purple-400"}`}>
            Model {side}
          </div>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            list={`models-${side}`}
            disabled={isRunning}
            className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-50"
            placeholder="model:tag"
          />
          <datalist id={`models-${side}`}>
            {SUGGESTED_MODELS.map((m) => <option key={m} value={m} />)}
          </datalist>

          {/* Stats */}
          {(state.state === "running" || state.state === "done") && (
            <div className="flex gap-4 mt-2 text-xs font-mono text-[var(--muted)]">
              <span>{state.totalTokens} tok</span>
              <span>{state.tokensPerSec} tok/s</span>
              <span>{state.elapsed.toFixed(1)}s</span>
              {state.state === "running" && (
                <span className={`${side === "A" ? "text-cyan-400" : "text-purple-400"} animate-pulse`}>● streaming</span>
              )}
              {state.state === "done" && <span className="text-green-400">✓ done</span>}
            </div>
          )}
        </div>

        {/* Output */}
        <div className="flex-1 p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
          {state.state === "idle" && (
            <div className="text-[var(--muted)] text-xs font-mono">
              Waiting for prompt…
            </div>
          )}
          {state.state === "error" && (
            <div className="text-red-400 text-xs font-mono bg-red-500/5 border border-red-500/20 p-3">
              Error: {state.error}
            </div>
          )}
          {state.output && (
            <div className={`text-sm font-mono leading-relaxed text-[var(--fg)] whitespace-pre-wrap ${state.state === "running" ? "after:content-['▋'] after:animate-pulse after:ml-0.5" + (side === "A" ? " after:text-cyan-400" : " after:text-purple-400") : ""}`}>
              {state.output}
            </div>
          )}
        </div>

        {/* Copy output */}
        {state.output && (
          <div className="border-t border-[var(--border)] p-2">
            <button
              onClick={() => navigator.clipboard.writeText(state.output)}
              className="text-xs font-mono text-[var(--muted)] hover:text-[var(--fg)] transition-colors px-2 py-1"
            >
              Copy output
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">SIDE-BY-SIDE PROMPT TESTER</h1>
          <p className="text-[var(--muted)] max-w-3xl leading-relaxed">
            Fire the same prompt at two local Ollama models simultaneously. Both stream in real time.
            Compare censored vs abliterated, different sizes, different fine-tunes — side by side.
          </p>
        </div>

        {/* Config bar */}
        <div className="border border-[var(--border)] p-4 mb-6 bg-[var(--surface)]/20 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Ollama URL</label>
            <input
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] w-52"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Temperature</label>
            <input
              type="number"
              value={temperature}
              min={0} max={2} step={0.1}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="bg-[var(--surface)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] w-24"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Max Tokens</label>
            <input
              type="number"
              value={maxTokens}
              min={100} max={4000} step={100}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="bg-[var(--surface)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] w-28"
            />
          </div>
          <button
            onClick={() => setShowSystem(!showSystem)}
            className={`text-xs font-mono border px-3 py-2 transition-colors ${showSystem ? "border-cyan-500/50 text-cyan-400" : "border-[var(--border)] text-[var(--muted)] hover:border-zinc-500"}`}
          >
            {showSystem ? "Hide" : "System Prompt"}
          </button>
        </div>

        {/* System prompt */}
        {showSystem && (
          <div className="mb-4">
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
              placeholder="Optional system prompt applied to both models…"
              className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 font-mono text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] resize-y"
            />
          </div>
        )}

        {/* Prompt input */}
        <div className="mb-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Enter your prompt… (Ctrl+Enter to run)"
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) run(); }}
            className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 font-mono text-sm text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] resize-y"
          />
        </div>

        {/* Example prompts */}
        <div className="flex gap-2 flex-wrap mb-4">
          <span className="text-xs text-[var(--muted)] font-mono self-center">Examples:</span>
          {EXAMPLE_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              className="text-xs font-mono text-[var(--muted)] border border-[var(--border)] px-2 py-1 hover:border-zinc-500 hover:text-[var(--fg)] transition-colors text-left max-w-[200px] truncate"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Run controls */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={run}
            disabled={!prompt.trim() || isRunning}
            className="bg-[var(--accent)] text-black font-mono font-bold text-xs uppercase tracking-widest px-6 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            ▶ Run Both Models
          </button>
          {isRunning && (
            <button
              onClick={stop}
              className="border border-red-500/40 text-red-400 font-mono text-xs uppercase tracking-widest px-4 py-2.5 hover:border-red-400 transition-colors"
            >
              ■ Stop
            </button>
          )}
        </div>

        {/* Split panels */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <ModelPanel label="Model A" model={modelA} setModel={setModelA} state={stateA} side="A" />
          <ModelPanel label="Model B" model={modelB} setModel={setModelB} state={stateB} side="B" />
        </div>

        {/* History */}
        {history.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">
              Recent Comparisons
            </div>
            <div className="space-y-2">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(h.prompt)}
                  className="w-full text-left border border-[var(--border)] p-3 hover:border-zinc-500 transition-colors text-xs font-mono"
                >
                  <div className="text-[var(--fg)] mb-1 truncate">{h.prompt}</div>
                  <div className="text-[var(--muted)]">{h.modelA} vs {h.modelB}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
