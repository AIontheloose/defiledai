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
            <Link
              href="/articles"
              className="text-white/80 hover:text-white transition"
            >
              Articles
            </Link>

            <Link
              href="/benchmarks"
              className="text-white/80 hover:text-white transition"
            >
              Benchmarks
            </Link>

            <Link
              href="/models"
              className="text-white/80 hover:text-white transition"
            >
              Models
            </Link>

            <Link
              href="/forum"
              className="text-white/80 hover:text-white transition"
            >
              Forum
            </Link>

            <Link
              href="/resources"
              className="text-white/80 hover:text-white transition"
            >
              Resources
            </Link>
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

            <button className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
              <Moon className="w-5 h-5 text-white/70" />
            </button>

            <button className="hidden md:flex h-11 px-6 rounded-xl bg-emerald-400 text-black font-medium hover:bg-emerald-300 transition items-center">
              Log in
            </button>

            <button className="hidden md:flex h-11 px-6 rounded-xl border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10 transition items-center">
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Unrestricted local AI community
            </div>

            <h2 className="text-5xl lg:text-6xl leading-tight font-bold tracking-tight">
              A home for
              <br />

              <span className="text-emerald-400">
                unrestricted intelligence.
              </span>
            </h2>

            <p className="mt-8 text-xl text-white/70 leading-relaxed max-w-xl">
              News, benchmarks, setup guides and community discussion focused on
              unrestricted local language models, privacy and self-hosted AI.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/articles"
                className="h-14 px-7 rounded-xl bg-emerald-400 text-black font-semibold flex items-center gap-3 hover:bg-emerald-300 transition"
              >
                <BookOpen className="w-5 h-5" />
                Explore Articles
              </Link>

              <Link
                href="/forum"
                className="h-14 px-7 rounded-xl border border-white/15 bg-white/5 flex items-center gap-3 hover:bg-white/10 transition"
              >
                <MessageSquare className="w-5 h-5" />
                Visit the Forum
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-14 max-w-xl">
              <div>
                <div className="text-3xl font-bold text-emerald-400">
                  120+
                </div>

                <div className="text-sm text-white/50 mt-1">
                  AI Articles
                </div>
              </div>

              <div>
                <div className="text-3xl font-bold text-emerald-400">
                  45+
                </div>

                <div className="text-sm text-white/50 mt-1">
                  Benchmarks
                </div>
              </div>

              <div>
                <div className="text-3xl font-bold text-emerald-400">
                  8k+
                </div>

                <div className="text-sm text-white/50 mt-1">
                  Community Posts
                </div>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative flex justify-center">
            {/* Terminal */}
            <div className="absolute left-0 top-14 w-[320px] rounded-2xl border border-emerald-400/20 bg-[#08111f]/90 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.08)]">
              <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-300/70" />
                <div className="w-3 h-3 rounded-full bg-red-300/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-300/70" />
              </div>

              <div className="p-6 font-mono text-emerald-300 text-sm leading-8">
                <p>$ ollama run llama3.1</p>

                <br />

                <p>Loading unrestricted model...</p>
                <p>VRAM detected: 24GB</p>
                <p>Context: 128k</p>
                <p>Filters: disabled</p>
                <p>Local inference: active</p>

                <br />

                <p>&gt; _</p>
              </div>
            </div>

            {/* Glow */}
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
            text="No artificial limitations or forced censorship layers."
          />

          <Feature
            icon={<Lock className="w-7 h-7 text-emerald-400" />}
            title="Private"
            text="Run entirely on your own local hardware."
          />

          <Feature
            icon={<Code2 className="w-7 h-7 text-emerald-400" />}
            title="Open"
            text="Open weights, transparent tooling and community research."
          />

          <Feature
            icon={<Users className="w-7 h-7 text-emerald-400" />}
            title="Community Driven"
            text="Benchmarks, guides and collaborative experimentation."
          />
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Articles */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-3xl font-bold">
                Latest Articles
              </h3>

              <Link
                href="/articles"
                className="text-emerald-400 hover:text-emerald-300 transition"
              >
                View all →
              </Link>
            </div>

            <p className="text-white/50 mb-8">
              Deep technical guides, benchmarks and beginner-friendly tutorials.
            </p>

            <div className="space-y-5">
              <ArticleCard
                title="Llama 3.1 70B Uncensored: Local Setup & Benchmarks"
                desc="Complete setup guide including VRAM requirements, quantization formats and real-world inference performance."
              />

              <ArticleCard
                title="Understanding Quantization for Beginners"
                desc="Learn how Q4, Q5 and Q8 quantization affect memory usage, speed and generation quality."
              />

              <ArticleCard
                title="Building the Ideal Local AI Workstation"
                desc="GPU recommendations, RAM requirements, cooling and hardware scaling for local LLM workloads."
              />
            </div>
          </div>

          {/* Forum */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-3xl font-bold">
                Forum Discussions
              </h3>

              <Link
                href="/forum"
                className="text-emerald-400 hover:text-emerald-300 transition"
              >
                View all →
              </Link>
            </div>

            <p className="text-white/50 mb-8">
              Hardware advice, model testing and unrestricted AI discussion.
            </p>

            <div className="space-y-5">
              <ForumItem
                letter="M"
                title="Llama 3.1 8B vs 70B — real world usage?"
              />

              <ForumItem
                letter="S"
                title="Mixtral unrestricted benchmark impressions"
              />

              <ForumItem
                letter="R"
                title="Best inference settings for storytelling?"
              />

              <ForumItem
                letter="T"
                title="New RTX 5090 local AI benchmark results"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#13203a] bg-[#060b1a]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center">
                  <Lock className="text-emerald-400 w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-lg">
                    DefiledAI
                  </h4>

                  <p className="text-sm text-white/50">
                    Local freedom. Full potential.
                  </p>
                </div>
              </div>

              <p className="text-white/50 leading-relaxed">
                Educational content, benchmarks and community discussion focused
                on unrestricted local AI systems and self-hosted language models.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-white/50">
              <Link href="/articles" className="hover:text-white transition">
                Articles
              </Link>

              <Link href="/forum" className="hover:text-white transition">
                Forum
              </Link>

              <Link href="/benchmarks" className="hover:text-white transition">
                Benchmarks
              </Link>

              <Link href="/models" className="hover:text-white transition">
                Models
              </Link>

              <Link href="/resources" className="hover:text-white transition">
                Resources
              </Link>

              <Link href="/about" className="hover:text-white transition">
                About
              </Link>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 text-sm text-white/30">
            © 2026 DefiledAI. Built for unrestricted local intelligence.
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

        <p className="text-white/60 leading-relaxed">
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
    <div className="rounded-2xl border border-white/10 bg-[#0b1220]/70 p-5 hover:border-emerald-400/30 transition">
      <div className="flex gap-5">
        <div className="w-44 h-28 rounded-xl bg-gradient-to-br from-emerald-400/20 to-blue-500/20 border border-white/10 shrink-0" />

        <div className="flex-1">
          <h4 className="text-xl font-semibold leading-snug">
            {title}
          </h4>

          <p className="text-white/60 mt-2 leading-relaxed text-sm">
            {desc}
          </p>

          <div className="mt-4 text-sm text-white/40">
            May 24, 2026 • 12 min read
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
    <div className="flex gap-4 border-b border-white/5 pb-5 hover:bg-white/[0.02] transition rounded-xl px-2 py-2">
      <div className="w-11 h-11 rounded-full bg-emerald-400/20 border border-emerald-400/20 flex items-center justify-center text-emerald-300 font-bold shrink-0">
        {letter}
      </div>

      <div>
        <h4 className="text-lg font-medium leading-snug">
          {title}
        </h4>

        <p className="text-white/50 text-sm mt-1 leading-relaxed">
          Discussion, benchmarks, testing and local AI usage.
        </p>

        <div className="mt-2 text-xs text-white/30">
          May 24, 2026 • 24 replies
        </div>
      </div>
    </div>
  );
}