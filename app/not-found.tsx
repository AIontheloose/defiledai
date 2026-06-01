import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />

        <div className="relative z-10">
          <div className="text-[120px] font-black font-mono leading-none mb-2"
            style={{ background: "linear-gradient(90deg, #22d3ee, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            404
          </div>

          <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono mb-4">
            Page not found
          </div>

          <p className="text-[var(--muted2)] mb-10 leading-relaxed">
            This page doesn't exist — or was moved. Try the tools, tutorials, or model database.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { href: "/tools", label: "Tools" },
              { href: "/tutorials", label: "Tutorials" },
              { href: "/uncensored", label: "Uncensored Models" },
              { href: "/benchmarks", label: "Benchmarks" },
              { href: "/articles", label: "Articles" },
              { href: "/leaderboard", label: "Leaderboard" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="border border-[var(--border)] px-4 py-3 text-xs font-mono text-[var(--muted)] hover:text-[var(--fg)] hover:border-zinc-600 transition-all">
                {l.label}
              </Link>
            ))}
          </div>

          <Link href="/"
            className="inline-block px-8 py-3 bg-cyan-500 text-black font-bold tracking-widest uppercase text-xs hover:bg-cyan-400 transition-colors font-mono">
            ← BACK TO HOME
          </Link>
        </div>
      </div>
    </main>
  );
}
