import Link from "next/link";

export const metadata = {
  title: "Models — DefiledAI",
  description: "Open-weight model database with quantization support and hardware requirements.",
};

const models = [
  {
    family: "Llama",
    org: "Meta",
    models: [
      { name: "Llama 3.1 8B", params: "8B", ctx: "128K", license: "Llama 3", minVram: "6GB", quants: ["Q4_K_M", "Q5_K_M", "Q8_0", "F16"] },
      { name: "Llama 3.1 70B", params: "70B", ctx: "128K", license: "Llama 3", minVram: "40GB", quants: ["Q2_K", "Q4_K_M", "Q5_K_M", "IQ3_M"] },
      { name: "Llama 3.1 405B", params: "405B", ctx: "128K", license: "Llama 3", minVram: "240GB", quants: ["Q2_K", "IQ1_M"] },
    ],
  },
  {
    family: "Qwen",
    org: "Alibaba",
    models: [
      { name: "Qwen 3 7B", params: "7B", ctx: "32K", license: "Apache 2.0", minVram: "6GB", quants: ["Q4_K_M", "Q5_K_M", "Q8_0"] },
      { name: "Qwen 3 14B", params: "14B", ctx: "32K", license: "Apache 2.0", minVram: "10GB", quants: ["Q4_K_M", "Q5_K_M"] },
      { name: "Qwen 3 72B", params: "72B", ctx: "32K", license: "Apache 2.0", minVram: "40GB", quants: ["Q2_K", "Q4_K_M", "Q5_K_M"] },
    ],
  },
  {
    family: "DeepSeek",
    org: "DeepSeek",
    models: [
      { name: "DeepSeek R1 7B", params: "7B", ctx: "32K", license: "MIT", minVram: "6GB", quants: ["Q4_K_M", "Q8_0"] },
      { name: "DeepSeek R1 70B", params: "70B", ctx: "32K", license: "MIT", minVram: "40GB", quants: ["Q4_K_M", "IQ3_M"] },
      { name: "DeepSeek V3", params: "671B MoE", ctx: "128K", license: "MIT", minVram: "Multi-GPU", quants: ["Q2_K", "IQ1_M"] },
    ],
  },
  {
    family: "Mistral",
    org: "Mistral AI",
    models: [
      { name: "Mistral 7B v0.3", params: "7B", ctx: "32K", license: "Apache 2.0", minVram: "6GB", quants: ["Q4_K_M", "Q5_K_M", "Q8_0", "F16"] },
      { name: "Mixtral 8x7B", params: "56B MoE", ctx: "32K", license: "Apache 2.0", minVram: "24GB", quants: ["Q4_K_M", "Q5_K_M"] },
      { name: "Mixtral 8x22B", params: "141B MoE", ctx: "64K", license: "Apache 2.0", minVram: "48GB", quants: ["Q2_K", "Q4_K_M"] },
    ],
  },
  {
    family: "Gemma",
    org: "Google",
    models: [
      { name: "Gemma 2 2B", params: "2B", ctx: "8K", license: "Gemma", minVram: "2GB", quants: ["Q4_K_M", "Q8_0", "F16"] },
      { name: "Gemma 2 9B", params: "9B", ctx: "8K", license: "Gemma", minVram: "6GB", quants: ["Q4_K_M", "Q5_K_M", "Q8_0"] },
      { name: "Gemma 2 27B", params: "27B", ctx: "8K", license: "Gemma", minVram: "16GB", quants: ["Q4_K_M", "Q5_K_M"] },
    ],
  },
  {
    family: "Phi",
    org: "Microsoft",
    models: [
      { name: "Phi-3 Mini", params: "3.8B", ctx: "128K", license: "MIT", minVram: "3GB", quants: ["Q4_K_M", "Q8_0", "F16"] },
      { name: "Phi-3 Medium", params: "14B", ctx: "128K", license: "MIT", minVram: "10GB", quants: ["Q4_K_M", "Q5_K_M"] },
    ],
  },
];

export default function ModelsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-cyan-400 text-xs uppercase tracking-widest mb-3">DefiledAI Research</div>
          <h1 className="text-4xl font-black font-mono mb-4">MODEL DATABASE</h1>
          <p className="text-zinc-400 max-w-2xl">
            Open-weight models catalogued by family, with quantization options, context windows,
            and minimum VRAM requirements for local inference.
          </p>
        </div>

        <div className="space-y-10">
          {models.map((family) => (
            <div key={family.family} className="border border-zinc-800">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/20">
                <div>
                  <span className="font-mono font-black text-lg text-white">{family.family}</span>
                  <span className="ml-3 text-xs text-zinc-500 tracking-widest uppercase">by {family.org}</span>
                </div>
                <span className="text-xs text-green-400 border border-green-400/20 px-2 py-1">ACTIVE</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-zinc-800/60 text-zinc-600 text-xs tracking-widest uppercase">
                      <th className="text-left px-6 py-3">Model</th>
                      <th className="text-left px-6 py-3">Params</th>
                      <th className="text-left px-6 py-3">Context</th>
                      <th className="text-left px-6 py-3">Min VRAM</th>
                      <th className="text-left px-6 py-3">License</th>
                      <th className="text-left px-6 py-3">Quants Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {family.models.map((m, i) => (
                      <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                        <td className="px-6 py-4 text-white">{m.name}</td>
                        <td className="px-6 py-4 text-cyan-400">{m.params}</td>
                        <td className="px-6 py-4 text-zinc-300">{m.ctx}</td>
                        <td className="px-6 py-4 text-zinc-300">{m.minVram}</td>
                        <td className="px-6 py-4 text-zinc-500">{m.license}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {m.quants.map((q) => (
                              <span key={q} className="text-xs border border-zinc-700 px-1.5 py-0.5 text-zinc-400">{q}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-zinc-600 text-sm">
          Missing a model?{" "}
          <Link href="/forum" className="text-cyan-400 hover:text-cyan-300">Request it on the forum</Link>.
        </div>
      </div>
    </main>
  );
}
