export const metadata = {
  title: "Quantization — DefiledAI",
  description: "Comprehensive guide to GGUF quantization formats for local AI inference.",
};

const formats = [
  { name: "F16", bits: 16, vramMult: "1.0×", quality: 100, speed: 60, use: "Highest fidelity. Only viable for small models on high-VRAM cards." },
  { name: "Q8_0", bits: 8, vramMult: "0.5×", quality: 99, speed: 75, use: "Near-lossless. Best quality/size tradeoff for models that fit in VRAM." },
  { name: "Q6_K", bits: 6, vramMult: "0.38×", quality: 98, speed: 82, use: "Excellent quality with meaningful VRAM savings. Recommended for 13B." },
  { name: "Q5_K_M", bits: 5, vramMult: "0.31×", quality: 96, speed: 88, use: "Strong quality. Good default for 7-13B models when VRAM is limited." },
  { name: "Q4_K_M", bits: 4, vramMult: "0.25×", quality: 92, speed: 95, use: "Most popular. Best balance of quality, speed, and VRAM for 70B class." },
  { name: "Q3_K_M", bits: 3, vramMult: "0.19×", quality: 83, speed: 100, use: "Noticeable quality degradation. Use only when VRAM is severely constrained." },
  { name: "IQ3_M", bits: "~3.5", vramMult: "0.22×", quality: 87, speed: 92, use: "Importance-matrix quantization. Better quality than Q3_K_M at similar size." },
  { name: "Q2_K", bits: 2, vramMult: "0.13×", quality: 65, speed: 100, use: "Severe quality loss. Last resort for fitting very large models on limited VRAM." },
  { name: "IQ1_M", bits: "~1.5", vramMult: "0.09×", quality: 45, speed: 100, use: "Extreme compression. Only useful for 405B/671B models on consumer hardware." },
];

const vramTable = [
  { model: "7B", f16: "14GB", q8: "7GB", q5: "5GB", q4: "4GB", q2: "2.5GB" },
  { model: "13B", f16: "26GB", q8: "13GB", q5: "9GB", q4: "7GB", q2: "4GB" },
  { model: "30B", f16: "60GB", q8: "30GB", q5: "22GB", q4: "17GB", q2: "9GB" },
  { model: "70B", f16: "140GB", q8: "70GB", q5: "48GB", q4: "40GB", q2: "22GB" },
  { model: "405B", f16: "810GB", q8: "405GB", q5: "280GB", q4: "220GB", q2: "110GB" },
];

function Bar({ value }: { value: number }) {
  const color = value >= 90 ? "#22d3ee" : value >= 75 ? "#86efac" : value >= 60 ? "#fbbf24" : "#f87171";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-[var(--surface)] h-1.5">
        <div style={{ width: `${value}%`, background: color, height: "100%" }} />
      </div>
      <span className="text-xs w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

export default function QuantizationPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-cyan-400 text-xs uppercase tracking-widest mb-3">DefiledAI Research</div>
          <h1 className="text-4xl font-black font-mono mb-4">QUANTIZATION GUIDE</h1>
          <p className="text-[var(--muted2)] max-w-2xl leading-relaxed">
            GGUF quantization lets you run large models on consumer hardware by reducing
            weight precision. This guide covers every major format, their quality tradeoffs,
            and how to choose the right one for your hardware.
          </p>
        </div>

        {/* What is quantization */}
        <div className="border border-[var(--border)] p-8 mb-10 bg-[var(--surface)]/10">
          <h2 className="font-mono font-bold text-xl mb-4 text-cyan-400">WHAT IS QUANTIZATION?</h2>
          <p className="text-[var(--muted2)] leading-relaxed mb-4">
            Neural network weights are typically stored as 16-bit or 32-bit floating point numbers.
            Quantization reduces each weight to fewer bits — trading a small amount of model quality
            for dramatically lower VRAM usage and faster inference.
          </p>
          <p className="text-[var(--muted2)] leading-relaxed">
            The GGUF format (used by llama.cpp, Ollama, LM Studio, and ExLlamaV2) supports a wide
            range of quantization levels. K-quants (Q4_K_M, Q5_K_M etc.) use a mixed-precision
            approach that preserves quality in the most important layers.
          </p>
        </div>

        {/* Format table */}
        <div className="border border-[var(--border)] mb-10">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <span className="text-sm font-mono tracking-widest uppercase">Format Comparison</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase">
                  <th className="text-left px-6 py-3">Format</th>
                  <th className="text-left px-6 py-3">Bits</th>
                  <th className="text-left px-6 py-3">VRAM vs F16</th>
                  <th className="text-left px-6 py-3 w-40">Quality</th>
                  <th className="text-left px-6 py-3 w-40">Speed</th>
                  <th className="text-left px-6 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {formats.map((f, i) => (
                  <tr key={i} className="border-b border-zinc-900 hover:bg-[var(--surface)]/40 transition-colors align-top">
                    <td className="px-6 py-4 text-cyan-400 font-bold">{f.name}</td>
                    <td className="px-6 py-4 text-[var(--fg2)]">{f.bits}</td>
                    <td className="px-6 py-4 text-[var(--fg2)]">{f.vramMult}</td>
                    <td className="px-6 py-4"><Bar value={f.quality} /></td>
                    <td className="px-6 py-4"><Bar value={f.speed} /></td>
                    <td className="px-6 py-4 text-[var(--muted)] text-xs leading-relaxed max-w-xs">{f.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* VRAM table */}
        <div className="border border-[var(--border)] mb-10">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <span className="text-sm font-mono tracking-widest uppercase">VRAM Requirements by Model Size</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase">
                  <th className="text-left px-6 py-3">Model</th>
                  <th className="text-left px-6 py-3">F16</th>
                  <th className="text-left px-6 py-3">Q8_0</th>
                  <th className="text-left px-6 py-3">Q5_K_M</th>
                  <th className="text-left px-6 py-3">Q4_K_M</th>
                  <th className="text-left px-6 py-3">Q2_K</th>
                </tr>
              </thead>
              <tbody>
                {vramTable.map((row, i) => (
                  <tr key={i} className="border-b border-zinc-900 hover:bg-[var(--surface)]/40 transition-colors">
                    <td className="px-6 py-4 text-[var(--fg)] font-bold">{row.model}</td>
                    <td className="px-6 py-4 text-[var(--muted)]">{row.f16}</td>
                    <td className="px-6 py-4 text-[var(--muted2)]">{row.q8}</td>
                    <td className="px-6 py-4 text-[var(--fg2)]">{row.q5}</td>
                    <td className="px-6 py-4 text-cyan-400">{row.q4}</td>
                    <td className="px-6 py-4 text-[var(--muted)]">{row.q2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendation box */}
        <div className="border border-cyan-500/20 p-8 bg-cyan-500/[0.03]">
          <h2 className="font-mono font-bold text-lg mb-5 text-cyan-400">QUICK RECOMMENDATION</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="border border-[var(--border)] p-4">
              <div className="text-[var(--fg)] font-bold mb-2">Consumer GPU (≤24GB)</div>
              <div className="text-[var(--muted2)]">Use <span className="text-cyan-400">Q4_K_M</span> for 7-13B models. For 70B you&apos;ll need dual GPUs or NVLink.</div>
            </div>
            <div className="border border-[var(--border)] p-4">
              <div className="text-[var(--fg)] font-bold mb-2">Dual GPU (48GB)</div>
              <div className="text-[var(--muted2)]">Run 70B at <span className="text-cyan-400">Q4_K_M</span> comfortably. Q5_K_M if you want better quality at 56GB.</div>
            </div>
            <div className="border border-[var(--border)] p-4">
              <div className="text-[var(--fg)] font-bold mb-2">Quality Priority</div>
              <div className="text-[var(--muted2)]">Always use the highest quant that fits. <span className="text-cyan-400">Q6_K or Q8_0</span> for smaller models if VRAM allows.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
