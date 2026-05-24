import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 mb-8">
          Unrestricted Local AI Community
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tight text-emerald-400 mb-6">
          DefiledAI
        </h1>

        <p className="text-xl text-zinc-300 max-w-3xl mb-10 leading-relaxed">
          Reddit + HuggingFace + TechPowerUp for unrestricted local AI.
          Discover models, benchmarks, optimization guides, and uncensored AI discussions.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/models"
            className="px-6 py-4 rounded-xl bg-emerald-500 text-black font-bold"
          >
            Explore Models
          </Link>

          <Link
            href="/benchmarks"
            className="px-6 py-4 rounded-xl border border-white/10 bg-white/5"
          >
            Benchmarks
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold mb-3 text-emerald-400">
              Models
            </h2>
            <p className="text-zinc-400">
              Discover unrestricted local LLMs and quantized builds.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold mb-3 text-emerald-400">
              Benchmarks
            </h2>
            <p className="text-zinc-400">
              Compare GPUs, inference speeds, VRAM usage, and model quality.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold mb-3 text-emerald-400">
              Community
            </h2>
            <p className="text-zinc-400">
              Guides, discussions, optimization tips, and uncensored AI news.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
