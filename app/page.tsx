import Link from "next/link";
import {
  Lock,
  BookOpen,
  MessageSquare,
  Shield,
  Code2,
  Users,
  Search,
  Moon,
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,43,99,0.9),transparent_45%)] pointer-events-none" />

      {/* Extra depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent pointer-events-none" />

      {/* Navbar */}
      <header className="relative z-20 border-b border-white/10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center">
              <Lock className="text-emerald-400 w-6 h-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold leading-none">
                DefiledAI
              </h1>

              <p className="text-sm text-white/60">
                Local freedom. Full potential.
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-5 text-[15px]">
            <a className="text-white/80 hover:text-white transition">
              Articles
            </a>

            <a className="text-emerald-400 border-b border-emerald-400 pb-1">
              Benchmarks
            </a>

            <a className="text-white/80 hover:text-white transition">
              Models
            </a>

            <a className="text-emerald-400 border-b border-emerald-400 pb-1">
              Forum
            </a>

            <a className="text-white/80 hover:text-white transition">
              Resources
            </a>

            <a className="text-emerald-400 border-b border-emerald-400 pb-1">
              About
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 h-11 w-56">
              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-sm flex-1"
              />

              <Search className="w-4 h-4 text-white/40" />
            </div>

            <button className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
              <Moon className="w-5 h-5 text-white/70" />
            </button>

            <button className="h-11 px-6 rounded-xl bg-emerald-400 text-black font-medium hover:bg-emerald-300 transition">
              Log in
            </button>

            <button className="h-11 px-6 rounded-xl border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10 transition">
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <h2 className="text-5xl lg:text-7xl leading-tight font-bold tracking-tight">
              A home for
              <br />

              <span className="text-emerald-400">
                unrestricted intelligence.
              </span>
            </h2>

            <p className="mt-8 text-xl text-white/70 leading-relaxed max-w-xl">
              News, guides, and community discussion about unrestricted local
              LLM models. Run it locally. Keep it yours.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="#"
                className="h-14 px-7 rounded-xl bg-emerald-400 text-black font-semibold flex items-center gap-3 hover:bg-emerald-300 transition"
              >
                <BookOpen className="w-5 h-5" />
                Explore Articles
              </Link>

              <Link
                href="#"
                className="h-14 px-7 rounded-xl border border-white/15 bg-white/5 flex items-center gap-3 hover:bg-white/10 transition"
              >
                <MessageSquare className="w-5 h-5" />
                Visit the Forum
              </Link>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative flex justify-center">
            {/* Terminal */}
            <div className="absolute left-0 top-16 w-[320px] rounded-2xl border border-emerald-400/20 bg-[#08111f]/90 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.08)]">
              <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-300/70" />
                <div className="w-3 h-3 rounded-full bg-red-300/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-300/70" />
              </div>

              <div className="p-6 font-mono text-emerald-300 text-sm leading-8">
                <p>$ ./run-llm --local</p>

                <br />

                <p>Loading model...</p>
                <p>Context: unlimited</p>
                <p>Filters: none</p>
                <p>Freedom: enabled</p>

                <br />

                <p>&gt; _</p>
              </div>
            </div>

            {/* Glow sphere */}
            <div className="w-[440px] h-[440px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_70%)] flex items-center justify-center">
              <div className="w-60 h-60 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#182436] to-[#0b1220] shadow-2xl flex items-center justify-center rotate-6">
                <Lock className="w-24 h-24 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-10 mt-24 border-t border-white/10 pt-10">
          <Feature
            icon={<Shield className="w-7 h-7 text-emerald-400" />}
            title="Unrestricted"
            text="No artificial limitations"
          />

          <Feature
            icon={<Lock className="w-7 h-7 text-emerald-400" />}
            title="Private"
            text="100% runs on your hardware"
          />

          <Feature
            icon={<Code2 className="w-7 h-7 text-emerald-400" />}
            title="Open"
            text="Open weights, open community"
          />

          <Feature
            icon={<Users className="w-7 h-7 text-emerald-400" />}
            title="Community Driven"
            text="Share, discuss, improve"
          />
        </div>
      </section>

      {/* Content panels */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
          {/* Articles */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.04)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold">
                Latest Articles
              </h3>

              <a className="text-emerald-400 hover:text-emerald-300 transition">
                View all →
              </a>
            </div>

            <div className="space-y-6">
              <ArticleCard
                title="Llama 3.1 70B Uncensored: Local Setup & Benchmarks"
                desc="We run extensive tests on Llama 3.1 70B abliterate models, quantization strategies, memory requirements and local inference performance."
              />

              <ArticleCard
                title="Abliterated vs Unrestricted: What's the Difference?"
                desc="A deep dive into how different uncensoring methods affect reasoning, creativity, safety layers and alignment behavior."
              />

              <ArticleCard
                title="Building the Perfect Local LLM Stack in 2026"
                desc="Hardware recommendations, inference engines, quantization formats and the ideal software stack for local AI power users."
              />
            </div>
          </div>

          {/* Forum */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.04)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold">
                Forum Discussions
              </h3>

              <a className="text-emerald-400 hover:text-emerald-300 transition">
                View all →
              </a>
            </div>

            <div className="space-y-3">
              <ForumItem
                letter="M"
                title="Llama 3.1 8B vs 70B — real world usage?"
              />

              <ForumItem
                letter="S"
                title="Mixtral 8x22B unrestricted — impressions"
              />

              <ForumItem
                letter="R"
                title="Best inference settings for storytelling?"
              />

              <ForumItem
                letter="T"
                title="New quantization benchmark results"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#060b16]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            {/* Left */}
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>

                <div>
                  <h4 className="text-lg font-bold">
                    DefiledAI
                  </h4>

                  <p className="text-sm text-white/50">
                    Unrestricted local intelligence
                  </p>
                </div>
              </div>

              <p className="text-white/50 leading-relaxed">
                Built for people who believe AI should run locally,
                privately, and without artificial restrictions.
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-wrap gap-6 text-sm text-white/50">
              <a className="hover:text-white transition">Articles</a>
              <a className="hover:text-white transition">Forum</a>
              <a className="hover:text-white transition">Benchmarks</a>
              <a className="hover:text-white transition">GitHub</a>
              <a className="hover:text-white transition">Discord</a>
              <a className="hover:text-white transition">Privacy</a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 text-sm text-white/30">
            © 2026 DefiledAI. Local freedom. Full potential.
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      {icon}

      <div>
        <h4 className="font-semibold text-lg">
          {title}
        </h4>

        <p className="text-white/60">
          {text}
        </p>
      </div>
    </div>
  );
}

function ArticleCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1220]/70 p-5 hover:border-emerald-400/30 hover:bg-[#101827] transition">
      <div className="space-y-5">
        <div className="aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-emerald-400/20 via-cyan-500/10 to-blue-500/20 border border-white/10" />

        <div>
          <h4 className="text-lg font-semibold leading-snug">
            {title}
          </h4>

          <p className="text-sm text-white/60 mt-3 leading-relaxed">
            {desc}
          </p>

          <div className="mt-4 text-sm text-white/40">
            May 19, 2026 • 12 min read
          </div>
        </div>
      </div>
    </div>
  );
}

function ForumItem({
  letter,
  title,
}: {
  letter: string;
  title: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition">
      <div className="w-11 h-11 rounded-full bg-emerald-400/20 border border-emerald-400/20 flex items-center justify-center text-emerald-300 font-bold shrink-0">
        {letter}
      </div>

      <div>
        <h4 className="text-lg font-medium leading-snug">
          {title}
        </h4>

        <p className="text-white/50 text-sm mt-1 leading-relaxed">
          Discussion, benchmarks, testing and unrestricted local AI usage.
        </p>

        <div className="mt-2 text-xs text-white/30">
          May 19, 2026 • 24 replies
        </div>
      </div>
    </div>
  );
}