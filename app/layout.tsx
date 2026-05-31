"use client";
import "./globals.css";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/uncensored", label: "Uncensored", highlight: true },
  { href: "/leaderboard", label: "Leaderboard", highlight: false },
  { href: "/tools", label: "Tools", highlight: false },
  { href: "/articles", label: "Articles", highlight: false },
  { href: "/benchmarks", label: "Benchmarks", highlight: false },
  { href: "/models", label: "Models", highlight: false },
  { href: "/hardware", label: "Hardware", highlight: false },
  { href: "/forum", label: "Forum", highlight: false },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <Link href="/" className="font-black tracking-tighter text-lg font-mono shrink-0">
            <span className="text-[var(--fg)]">Defiled</span>
            <span className="text-cyan-400">AI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className={`px-3 py-1.5 text-xs tracking-widest uppercase transition-all whitespace-nowrap ${
                  l.highlight
                    ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/5"
                    : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)]"
                }`}>
                {l.highlight ? `⬡ ${l.label}` : l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link href="/search" aria-label="Search"
              className="p-2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6.5" cy="6.5" r="4.5" /><path d="M10.5 10.5L14 14" strokeLinecap="round" />
              </svg>
            </Link>
            <button onClick={toggleTheme}
              className="hidden md:block p-2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors text-xs font-mono tracking-widest">
              {theme === "dark" ? "LIGHT" : "DARK"}
            </button>
            <Link href="/signup"
              className="hidden md:block text-xs tracking-widest uppercase bg-cyan-500 text-black font-bold px-4 py-1.5 hover:bg-cyan-400 transition-colors ml-1">
              Sign Up
            </Link>
            <button onClick={() => setOpen(!open)} aria-label="Menu"
              className="lg:hidden p-2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
              {open ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 2l14 14M16 2L2 16" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 4h14M2 9h14M2 14h14" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 bg-[var(--bg)]/95 backdrop-blur-md border-t border-[var(--border)] overflow-y-auto">
          <div className="flex flex-col p-6 gap-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className={`px-4 py-3 text-sm tracking-widest uppercase border-b border-[var(--border)] transition-all ${
                  l.highlight
                    ? "text-cyan-400 hover:bg-cyan-500/5"
                    : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)]"
                }`}>
                {l.highlight ? `⬡ ${l.label}` : l.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-6">
              <Link href="/login" onClick={() => setOpen(false)}
                className="flex-1 text-center py-3 text-xs tracking-widest uppercase border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                Login
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)}
                className="flex-1 text-center py-3 text-xs tracking-widest uppercase bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors">
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
        <title>DefiledAI — Unrestricted Local AI Research</title>
        <meta name="description" content="The research hub for open-weight, abliterated, and uncensored AI models. Benchmarks, tools, community leaderboards, and hardware guides." />
        <meta property="og:title" content="DefiledAI — Unrestricted Local AI Research" />
        <meta property="og:description" content="Uncensored model database, community leaderboard, 5 interactive tools, benchmarks and hardware guides for local AI." />
        <meta property="og:url" content="https://defiledai.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://defiledai.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DefiledAI — Unrestricted Local AI" />
        <meta name="twitter:description" content="Abliterated model database, 5 tools, community leaderboard, local AI benchmarks." />
        <meta name="twitter:image" content="https://defiledai.com/og.png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate" type="application/rss+xml" title="DefiledAI Articles" href="/feed.xml" />
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
