"use client";
import "./globals.css";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const MEGA_MENU = [
  {
    label: "⬡ Uncensored",
    href: "/uncensored",
    highlight: true,
    columns: [
      {
        heading: "Models",
        links: [
          { href: "/uncensored", label: "Uncensored Database", desc: "Full filterable model list" },
          { href: "/leaderboard", label: "Community Leaderboard", desc: "Ranked by category scores" },
          { href: "/tools/hf-tracker", label: "HuggingFace Tracker", desc: "Latest model drops" },
          { href: "/tools/model-reviews", label: "Model Reviews", desc: "Community structured reviews" },
        ],
      },
      {
        heading: "Research",
        links: [
          { href: "/articles/abliteration-explained", label: "Abliteration Explained", desc: "How refusal removal works" },
          { href: "/articles/best-abliterated-models-2026", label: "Best Models 2026", desc: "Community rankings" },
          { href: "/tools/model-diff", label: "Model Diff", desc: "Base vs abliterated comparison" },
          { href: "/tools/abliteration-scorer", label: "Quality Scorer", desc: "Measure quality retention" },
        ],
      },
    ],
  },
  {
    label: "Tools",
    href: "/tools",
    highlight: false,
    columns: [
      {
        heading: "Hardware & Performance",
        links: [
          { href: "/tools/moe-builder", label: "MoE Pipeline Builder", desc: "Design local expert pipelines" },
          { href: "/tools/model-compatibility", label: "Model Compatibility", desc: "What runs on your GPU" },
          { href: "/tools/speed-estimator", label: "Speed Estimator", desc: "Predict tok/s" },
          { href: "/tools/inference-profiler", label: "Inference Profiler", desc: "TTFT and bandwidth analysis" },
          { href: "/tools/price-performance", label: "Price / Performance", desc: "GPU value rankings" },
          { href: "/tools/hardware-advisor", label: "Hardware Advisor", desc: "Build recommendations" },
        ],
      },
      {
        heading: "Model & Pipeline",
        links: [
          { href: "/tools/vram-calculator", label: "VRAM Calculator", desc: "Exact VRAM requirements" },
          { href: "/tools/context-calculator", label: "Context Calculator", desc: "Max context on your GPU" },
          { href: "/tools/token-budget", label: "Token Budget", desc: "Plan context and cost" },
          { href: "/tools/quant-picker", label: "Quant Picker", desc: "3-question format wizard" },
          { href: "/tools/backend-picker", label: "Backend Picker", desc: "Right inference backend" },
          { href: "/tools/system-prompt-library", label: "Prompt Library", desc: "20 production-ready prompts" },
        ],
      },
    ],
  },
  {
    label: "Benchmarks",
    href: "/benchmarks",
    highlight: false,
    columns: [
      {
        heading: "Data",
        links: [
          { href: "/benchmarks", label: "Benchmark Matrix", desc: "Full results table" },
          { href: "/tools/submit-benchmark", label: "Submit Results", desc: "Add your benchmark" },
          { href: "/tools/benchmark-compare", label: "Compare Configs", desc: "Side-by-side GPU comparison" },
        ],
      },
      {
        heading: "Reference",
        links: [
          { href: "/hardware", label: "Hardware Configs", desc: "Build recommendations" },
          { href: "/tools/price-performance", label: "Price/Performance", desc: "Best GPU value" },
          { href: "/quantization", label: "Quantization Guide", desc: "Format comparison" },
        ],
      },
    ],
  },
  {
    label: "Learn",
    href: "/articles",
    highlight: false,
    columns: [
      {
        heading: "Tutorials",
        links: [
          { href: "/tutorials", label: "All Tutorials", desc: "Beginner to expert" },
          { href: "/tutorials/what-is-local-ai", label: "What is Local AI?", desc: "Start here" },
          { href: "/tutorials/install-ollama-windows", label: "Install Ollama (Windows)", desc: "10 min setup" },
          { href: "/tutorials/moe-pipeline-guide", label: "Build a MoE Pipeline", desc: "Expert guide" },
        ],
      },
      {
        heading: "Articles & Reference",
        links: [
          { href: "/articles", label: "Research Archive", desc: "All articles" },
          { href: "/weekly", label: "Weekly Digest", desc: "Model drops & news" },
          { href: "/models", label: "Model Database", desc: "All open-weight models" },
          { href: "/quantization", label: "Quantization Guide", desc: "Every GGUF format" },
        ],
      },
    ],
  },
  {
    label: "Community",
    href: "/forum",
    highlight: false,
    columns: [
      {
        heading: "Participate",
        links: [
          { href: "/forum", label: "Forum", desc: "Community discussion" },
          { href: "/tools/model-reviews", label: "Write a Review", desc: "Share your experience" },
          { href: "/tools/submit-benchmark", label: "Submit Benchmark", desc: "Add your results" },
          { href: "/leaderboard", label: "Leaderboard", desc: "Community model rankings" },
        ],
      },
      {
        heading: "About & Updates",
        links: [
          { href: "/about", label: "About ForsakenAI", desc: "What we build and why" },
          { href: "/weekly", label: "Weekly Digest", desc: "What dropped this week" },
          { href: "/tools/hf-tracker", label: "HF Tracker", desc: "New model uploads" },
          { href: "/feed.xml", label: "RSS Feed", desc: "Subscribe to updates" },
        ],
      },
    ],
  },
];

function MegaMenu({ item, onClose }: { item: typeof MEGA_MENU[0]; onClose: () => void }) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 border border-[var(--border)] shadow-2xl z-50 animate-fade-in"
      style={{ background: "var(--nav-bg)", minWidth: "580px", boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.06)" }}>
      <div className="grid grid-cols-2 gap-0 p-5">
        {item.columns.map((col, i) => (
          <div key={i} className={i > 0 ? "border-l border-[var(--border)] pl-5" : "pr-5"}>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-mono mb-4">{col.heading}</div>
            <div className="space-y-0.5">
              {col.links.map((link) => (
                <Link key={link.href} href={link.href} onClick={onClose}
                  className="block px-3 py-2.5 hover:bg-[var(--surface)] transition-colors group rounded-sm">
                  <div className="text-sm font-mono font-bold text-[var(--fg)] group-hover:text-cyan-400 transition-colors leading-tight">
                    {link.label}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{link.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border)] px-5 py-2.5 bg-[var(--surface)]/50">
        <Link href={item.href} onClick={onClose}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-mono uppercase tracking-widest transition-colors">
          View all {item.label} →
        </Link>
      </div>
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) { setTheme(saved); document.documentElement.setAttribute("data-theme", saved); }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setActiveMenu(null);
    };
    const scroll = () => setScrolled(window.scrollY > 20);
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { document.removeEventListener("mousedown", handler); window.removeEventListener("scroll", scroll); };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <>
      <nav ref={navRef}
        className="sticky top-0 z-50 border-b border-[var(--border)] transition-shadow duration-200"
        style={{
          background: "var(--nav-bg)",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.3)" : "none",
        }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <Link href="/" className="font-black tracking-tighter text-lg font-mono shrink-0 flex items-center gap-0" onClick={() => setActiveMenu(null)}>
            <span className="text-[var(--fg)]">Forsaken</span>
            <span className="text-cyan-400">AI</span>
          </Link>

          <div className="hidden lg:flex items-center relative">
            {MEGA_MENU.map((item) => (
              <div key={item.label} className="relative">
                <button
                  onMouseEnter={() => setActiveMenu(item.label)}
                  onClick={() => setActiveMenu(activeMenu === item.label ? null : item.label)}
                  className={`px-3 py-1.5 text-xs tracking-widest uppercase font-mono transition-all flex items-center gap-1 h-14 border-b-2 ${
                    activeMenu === item.label
                      ? "border-cyan-400 text-cyan-400"
                      : item.highlight
                      ? "border-transparent text-cyan-400 hover:text-cyan-300"
                      : "border-transparent text-[var(--muted)] hover:text-[var(--fg)]"
                  }`}>
                  {item.label}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                    className={`transition-transform duration-200 ${activeMenu === item.label ? "rotate-180" : ""}`}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                {activeMenu === item.label && (
                  <MegaMenu item={item} onClose={() => setActiveMenu(null)} />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link href="/search" aria-label="Search" onClick={() => setActiveMenu(null)}
              className="p-2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6.5" cy="6.5" r="4.5"/><path d="M10.5 10.5L14 14" strokeLinecap="round"/>
              </svg>
            </Link>
            <button onClick={toggleTheme}
              className="hidden md:block p-2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors text-xs font-mono tracking-widest">
              {theme === "dark" ? "LIGHT" : "DARK"}
            </button>
            <Link href="/about"
              className="hidden md:block text-xs tracking-widest uppercase text-[var(--muted)] hover:text-[var(--fg)] transition-colors px-3 py-1.5">
              About
            </Link>
            <Link href="/signup"
              className="hidden md:block text-xs tracking-widest uppercase bg-cyan-500 text-black font-black px-4 py-1.5 hover:bg-cyan-400 transition-all ml-1">
              Sign Up
            </Link>
            <button onClick={() => { setOpen(!open); setActiveMenu(null); }} aria-label="Menu"
              className="lg:hidden p-2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
              {open ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 2l14 14M16 2L2 16" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 4h14M2 9h14M2 14h14" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 border-t border-[var(--border)] overflow-y-auto"
          style={{ background: "var(--nav-bg)" }}>
          <div className="p-4 space-y-1">
            {MEGA_MENU.map((section) => (
              <div key={section.label}>
                <div className={`text-xs uppercase tracking-widest font-mono px-3 py-2 mt-4 ${section.highlight ? "text-cyan-400" : "text-[var(--muted)]"}`}>
                  {section.label}
                </div>
                {section.columns.flatMap(col => col.links).map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-3 border-b border-[var(--border)]/30 hover:bg-[var(--surface)] transition-colors">
                    <div>
                      <div className="text-sm font-mono text-[var(--fg)]">{link.label}</div>
                      <div className="text-xs text-[var(--muted)]">{link.desc}</div>
                    </div>
                    <span className="text-[var(--muted)] text-xs ml-3 shrink-0">→</span>
                  </Link>
                ))}
              </div>
            ))}
            <div className="flex gap-3 px-3 pt-4 pb-6">
              <Link href="/about" onClick={() => setOpen(false)}
                className="flex-1 text-center py-3 text-xs tracking-widest uppercase border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] transition-colors font-mono">
                About
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)}
                className="flex-1 text-center py-3 text-xs tracking-widest uppercase bg-cyan-500 text-black font-black hover:bg-cyan-400 transition-colors font-mono">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <title>ForsakenAI — Unrestricted Local AI Research</title>
        <meta name="description" content="The research hub for open-weight, abliterated, and uncensored AI models. 20+ tools, tutorials, community leaderboard, MoE builder." />
        <meta property="og:title" content="ForsakenAI — Unrestricted Local AI Research" />
        <meta property="og:description" content="20+ tools, tutorials from beginner to expert, uncensored model database, MoE pipeline builder." />
        <meta property="og:url" content="https://forsakenai.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://forsakenai.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ForsakenAI — Unrestricted Local AI" />
        <meta name="twitter:image" content="https://forsakenai.com/og.png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate" type="application/rss+xml" title="ForsakenAI Articles" href="/feed.xml" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HTL8W4GT7L"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-HTL8W4GT7L');
        `}} />
      </head>
      <body className="bg-[var(--bg)] text-[var(--fg)] antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
