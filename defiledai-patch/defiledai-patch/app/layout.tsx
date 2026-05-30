import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DefiledAI — Local AI Intelligence",
  description: "Local AI research, quantization analysis, benchmarks, and open-weight model intelligence.",
  openGraph: {
    title: "DefiledAI — Local AI Intelligence",
    description: "Benchmarking, quantization analysis, open-weight model research, inference infrastructure, and local AI systems engineering.",
    url: "https://defiledai.com",
    siteName: "DefiledAI",
    type: "website",
    images: [
      {
        url: "https://defiledai.com/og.png",
        width: 1200,
        height: 630,
        alt: "DefiledAI Research Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DefiledAI — Local AI Intelligence",
    description: "Benchmarking, quantization analysis, open-weight model research.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050816] text-white antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}

function Nav() {
  const links = [
    { href: "/articles", label: "Articles" },
    { href: "/benchmarks", label: "Benchmarks" },
    { href: "/models", label: "Models" },
    { href: "/quantization", label: "Quantization" },
    { href: "/hardware", label: "Hardware" },
    { href: "/forum", label: "Forum" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#050816]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <a href="/" className="font-black tracking-tighter text-lg font-mono">
          <span className="text-white">Defiled</span>
          <span className="text-cyan-400">AI</span>
        </a>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="px-3 py-1.5 text-xs tracking-widest uppercase text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="/login"
            className="text-xs tracking-widest uppercase text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
            Login
          </a>
          <a href="/signup"
            className="text-xs tracking-widest uppercase bg-cyan-500 text-black font-bold px-4 py-1.5 hover:bg-cyan-400 transition-colors">
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
}
