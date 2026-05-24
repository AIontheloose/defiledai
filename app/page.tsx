import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="border-b border-white/10 bg-[#08101d]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">DefiledAI</h1>
            <p className="text-xs text-white/50">
              Unrestricted Local Intelligence
            </p>
          </div>

          <nav className="hidden md:flex gap-6 text-sm text-white/70">
            <Link href="/articles">Articles</Link>
            <Link href="/benchmarks">Benchmarks</Link>
            <Link href="/models">Models</Link>
            <Link href="/forum">Forum</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/about">About</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-4xl">
          <p className="text-emerald-400 text-sm font-medium mb-4">
            Independent Research Platform
          </p>

          <h2 className="text-5xl font-bold leading-tight">
            Research, benchmarks and technical analysis for unrestricted local language models.
          </h2>

          <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-3xl">
            DefiledAI focuses on local AI deployment, quantization, inference performance,
            open-weight models and self-hosted artificial intelligence systems.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-[#0b1220] overflow-hidden">
          <div className="border-b border-white/10 px-8 py-6">
            <h3 className="text-3xl font-bold">Featured Benchmarks</h3>
          </div>

          <table className="w-full text-left">
            <thead className="bg-white/[0.03] text-white/60">
              <tr>
                <th className="px-8 py-4">Model</th>
                <th className="px-8 py-4">Quant</th>
                <th className="px-8 py-4">VRAM</th>
                <th className="px-8 py-4">Speed</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t border-white/5">
                <td className="px-8 py-5">Llama 3.1 70B</td>
                <td className="px-8 py-5">Q4_K_M</td>
                <td className="px-8 py-5">48GB</td>
                <td className="px-8 py-5">18 tok/s</td>
              </tr>

              <tr className="border-t border-white/5">
                <td className="px-8 py-5">Mixtral 8x22B</td>
                <td className="px-8 py-5">Q5_K_M</td>
                <td className="px-8 py-5">36GB</td>
                <td className="px-8 py-5">24 tok/s</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#08101d]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-white/50">
            DefiledAI — unrestricted local AI research and analysis.
          </p>
        </div>
      </footer>
    </main>
  );
}
