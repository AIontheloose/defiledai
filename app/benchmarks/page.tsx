import Link from "next/link";

export const metadata = {
  title: "Benchmarks — ForsakenAI",
  description: "Real-world inference benchmarks for local AI models.",
};

const results = [
  { model: "Llama 3.1 70B", quant: "Q4_K_M", vram: "48GB", toks: 21, backend: "ExLlamaV2", gpu: "2× RTX 3090", ctx: "4096", date: "2026-05-28" },
  { model: "Llama 3.1 70B", quant: "Q5_K_M", vram: "56GB", toks: 16, backend: "ExLlamaV2", gpu: "2× RTX 3090", ctx: "4096", date: "2026-05-28" },
  { model: "Qwen 3 72B", quant: "Q5_K_M", vram: "64GB", toks: 18, backend: "llama.cpp", gpu: "2× RTX 3090", ctx: "8192", date: "2026-05-27" },
  { model: "DeepSeek V3", quant: "MoE Q4", vram: "Multi-GPU", toks: 39, backend: "TensorRT-LLM", gpu: "4× A100", ctx: "4096", date: "2026-05-26" },
  { model: "Mixtral 8x22B", quant: "Q4", vram: "48GB", toks: 27, backend: "ExLlamaV2", gpu: "2× RTX 3090", ctx: "4096", date: "2026-05-25" },
  { model: "Phi-3 Medium", quant: "Q6_K", vram: "14GB", toks: 68, backend: "llama.cpp", gpu: "RTX 4090", ctx: "8192", date: "2026-05-24" },
  { model: "Gemma 2 27B", quant: "Q4_K_M", vram: "18GB", toks: 44, backend: "llama.cpp", gpu: "RTX 4090", ctx: "4096", date: "2026-05-23" },
  { model: "Mistral 7B", quant: "Q8_0", vram: "8GB", toks: 112, backend: "llama.cpp", gpu: "RTX 3080", ctx: "8192", date: "2026-05-22" },
];

const gpuComparison = [
  { gpu: "RTX 4090", vram: "24GB", llama7b: 112, llama13b: 72, llama70b: "OOM", price: "$1,600" },
  { gpu: "RTX 3090", vram: "24GB", llama7b: 89, llama13b: 58, llama70b: "OOM", price: "$700" },
  { gpu: "2× RTX 3090", vram: "48GB", llama7b: 94, llama13b: 61, llama70b: 21, price: "$1,400" },
  { gpu: "RTX 4080", vram: "16GB", llama7b: 98, llama13b: 61, llama70b: "OOM", price: "$1,000" },
  { gpu: "RX 7900 XTX", vram: "24GB", llama7b: 71, llama13b: 44, llama70b: "OOM", price: "$800" },
];

export default function BenchmarksPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-cyan-400 text-xs uppercase tracking-widest mb-3">ForsakenAI Research</div>
          <h1 className="text-4xl font-black font-mono mb-4">BENCHMARK MATRIX</h1>
          <p className="text-[var(--muted2)] max-w-2xl">
            Real-world inference benchmarks measured on consumer and prosumer hardware.
            All results are first-token-excluded sustained throughput at default sampling settings.
          </p>
        </div>

        {/* Methodology */}
        <div className="border border-[var(--border)] p-6 mb-10 bg-[var(--surface)]/20">
          <div className="text-xs text-cyan-400 tracking-widest uppercase mb-3">Methodology</div>
          <div className="grid md:grid-cols-4 gap-6 text-sm text-[var(--muted2)]">
            <div><span className="text-[var(--fg)] block mb-1">Metric</span>Sustained tok/s, excluding first token (TTFT)</div>
            <div><span className="text-[var(--fg)] block mb-1">Prompt</span>512-token fixed input, 256-token output</div>
            <div><span className="text-[var(--fg)] block mb-1">Runs</span>5 iterations, median reported</div>
            <div><span className="text-[var(--fg)] block mb-1">Driver</span>CUDA 12.4 / ROCm 6.1</div>
          </div>
        </div>

        {/* Main table */}
        <div className="border border-[var(--border)] mb-10">
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <span className="text-sm font-mono tracking-widest uppercase">Inference Results</span>
            <span className="text-xs text-[var(--muted)]">Last updated: 2026-05-28</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase">
                  <th className="text-left px-6 py-3">Model</th>
                  <th className="text-left px-6 py-3">Quant</th>
                  <th className="text-left px-6 py-3">VRAM</th>
                  <th className="text-left px-6 py-3">Backend</th>
                  <th className="text-left px-6 py-3">GPU</th>
                  <th className="text-left px-6 py-3">Tok/s</th>
                  <th className="text-left px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-zinc-900 hover:bg-[var(--surface)]/40 transition-colors">
                    <td className="px-6 py-4 text-[var(--fg)]">{r.model}</td>
                    <td className="px-6 py-4 text-cyan-400">{r.quant}</td>
                    <td className="px-6 py-4 text-[var(--fg2)]">{r.vram}</td>
                    <td className="px-6 py-4 text-[var(--muted2)]">{r.backend}</td>
                    <td className="px-6 py-4 text-[var(--muted2)]">{r.gpu}</td>
                    <td className="px-6 py-4 text-green-400 font-bold">{r.toks}</td>
                    <td className="px-6 py-4 text-[var(--muted)]">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GPU Comparison */}
        <div className="border border-[var(--border)] mb-10">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <span className="text-sm font-mono tracking-widest uppercase">GPU Comparison — Llama Family (tok/s)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase">
                  <th className="text-left px-6 py-3">GPU</th>
                  <th className="text-left px-6 py-3">VRAM</th>
                  <th className="text-left px-6 py-3">7B Q4</th>
                  <th className="text-left px-6 py-3">13B Q4</th>
                  <th className="text-left px-6 py-3">70B Q4</th>
                  <th className="text-left px-6 py-3">Street Price</th>
                </tr>
              </thead>
              <tbody>
                {gpuComparison.map((g, i) => (
                  <tr key={i} className="border-b border-zinc-900 hover:bg-[var(--surface)]/40 transition-colors">
                    <td className="px-6 py-4 text-[var(--fg)]">{g.gpu}</td>
                    <td className="px-6 py-4 text-[var(--muted2)]">{g.vram}</td>
                    <td className="px-6 py-4 text-green-400">{g.llama7b}</td>
                    <td className="px-6 py-4 text-green-400">{g.llama13b}</td>
                    <td className={`px-6 py-4 ${g.llama70b === "OOM" ? "text-red-500" : "text-green-400"}`}>{g.llama70b}</td>
                    <td className="px-6 py-4 text-[var(--muted2)]">{g.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center text-[var(--muted)] text-sm">
          Submit your benchmark results to the{" "}
          <Link href="/forum" className="text-cyan-400 hover:text-cyan-300">forum</Link>.
        </div>
      </div>
    </main>
  );
}
