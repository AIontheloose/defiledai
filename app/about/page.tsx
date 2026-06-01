import Link from "next/link";

export const metadata = {
  title: "About — DefiledAI",
  description: "DefiledAI is a community research hub for open-weight, abliterated, and uncensored local AI models.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI</div>
          <h1 className="text-4xl font-black font-mono mb-6">ABOUT</h1>
        </div>

        <div className="space-y-10 text-[var(--fg2)] leading-relaxed">

          <div className="border-l-2 border-cyan-500 pl-6">
            <p className="text-xl text-[var(--fg)] leading-relaxed">
              DefiledAI is a community research hub for open-weight, abliterated, and uncensored local AI models. We build tools, publish benchmarks, and document the techniques that let people run powerful AI on their own hardware — without restrictions, without cloud dependency, and without per-query cost.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-black font-mono text-[var(--fg)] mb-4">WHY THIS EXISTS</h2>
            <p className="mb-4">
              The local AI community has grown significantly in the past two years, but the resources available to it are scattered. Benchmarks live in Reddit threads. Model recommendations are buried in Discord servers. Beginner guides are outdated. Nobody had built a single place that serves both the person asking "what GPU do I need?" and the researcher experimenting with MoE pipelines.
            </p>
            <p>
              There is also a specific gap around uncensored and abliterated models. These are legitimate research tools — the techniques involved (representation engineering, fine-tuning) are published academic work. The models are open-weight and legally distributed. The community using them deserves a proper home.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-black font-mono text-[var(--fg)] mb-4">WHAT WE BUILD</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Tools", desc: "14+ interactive tools — VRAM calculators, speed estimators, compatibility checkers, MoE pipeline builders, backend pickers. Built to answer real questions, not demonstrate capability." },
                { label: "Benchmarks", desc: "Real inference numbers from real hardware. Community-submitted and curated. Every result includes GPU, backend, quant, and context length." },
                { label: "Tutorials", desc: "From first install to MoE pipeline construction. Written for people who actually run local AI — not marketing copy." },
                { label: "Model Database", desc: "Curated catalogue of open-weight models with abliterated variants, quality retention scores, and direct HuggingFace links." },
              ].map((item) => (
                <div key={item.label} className="border border-[var(--border)] p-5">
                  <div className="font-mono font-bold text-[var(--fg)] mb-2">{item.label}</div>
                  <div className="text-sm text-[var(--muted)]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black font-mono text-[var(--fg)] mb-4">OUR POSITION ON UNCENSORED MODELS</h2>
            <p className="mb-4">
              Open-weight models are software. Abliteration is a mathematical operation on weight matrices — the same class of technique as pruning, quantization, or fine-tuning. The models we document are legally distributed under open licenses. The techniques are published in peer-reviewed papers.
            </p>
            <p className="mb-4">
              We document these models and techniques because the community using them deserves accurate information: quality benchmarks, hardware requirements, honest comparisons, and technical depth. That is the scope of what we do here.
            </p>
            <p>
              We do not facilitate illegal activity. Content that crosses into illegal territory is not something we assist with regardless of the model or technique involved.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-black font-mono text-[var(--fg)] mb-4">CONTRIBUTE</h2>
            <p className="mb-6">
              The site improves with community contributions. If you have benchmarks to share, models we missed, or tutorials to write — the forum and submission tools are the right places.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { href: "/tools/submit-benchmark", label: "Submit Benchmark" },
                { href: "/tools/model-reviews", label: "Write a Review" },
                { href: "/forum", label: "Join the Forum" },
                { href: "/tools/hf-tracker", label: "Suggest a Model" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="border border-[var(--border)] px-4 py-3 text-xs font-mono text-[var(--muted)] hover:text-[var(--fg)] hover:border-zinc-600 transition-all text-center">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-8">
            <div className="flex flex-wrap gap-6 text-xs font-mono text-[var(--muted)]">
              <Link href="/feed.xml" className="hover:text-cyan-400 transition-colors">RSS Feed</Link>
              <Link href="/sitemap.xml" className="hover:text-cyan-400 transition-colors">Sitemap</Link>
              <Link href="/weekly" className="hover:text-cyan-400 transition-colors">Weekly Digest</Link>
              <Link href="/articles" className="hover:text-cyan-400 transition-colors">Research Archive</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
