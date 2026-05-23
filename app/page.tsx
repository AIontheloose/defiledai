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
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f2b63,transparent_45%)] pointer-events-none" />

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

            <button className="h-11 px-6 rounded-xl bg-emerald-400 text-black font-medium">
              Log in
            </button>

            <button className="h-11 px-6 rounded-xl border border-emerald-400/40 text-emerald-300">
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <h2 className="text-6xl leading-tight font-bold tracking-tight">
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
                className="h-14 px-7 rounded-xl bg-emerald-400 text-black font-semibold flex items-center gap-3"
              >
                <BookOpen className="w-5 h-5" />
                Explore Articles
              </Link>

              <Link
                href="#"
                className="h-14 px-7 rounded-xl border border-white/15 bg-white/5 flex items-center gap-3"
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

            {/* Cube */}
            <div className="w-[440px] h-[440px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_70%)] flex items-center justify-center">
              <div className="w-60 h-60 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#182436] to-[#0b1220] shadow-2xl flex items-center justify-center rotate-6">
                <Lock className="w-24 h-24 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-10 mt-20 border-t border-white/10 pt-10">
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Articles */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold">Latest Articles</h3>

              <a className="text-emerald-400">View all →</a>
            </div>

            <div className="space-y-5">
              <ArticleCard
                title="Llama 3.1 70B Uncensored: Local Setup & Benchmarks"
                desc="We run extensive tests on Llama 3.1 70B abliterate..."
              />

              <ArticleCard
                title="Abliterated vs Unrestricted: What's the Difference?"
                desc="A deep dive into what content is removed..."
              />

              <ArticleCard
                title="Building the Perfect Local LLM Stack in 2026"
                desc="Hardware, quantization, inference engines..."
              />
            </div>
          </div>

          {/* Forum */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold">Forum Discussions</h3>

              <a className="text-emerald-400">View all →</a>
            </div>

            <div className="space-y-6">
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
      {/* FOOTER */}
      <footer className="border-t border-[#13203a] bg-[#060b1a]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 text-sm text-gray-400 md:flex-row">
          <div>
            Built by a community that believes intelligence should be free.
          </div>

          <div className="flex gap-6">
            <a href="#">GitHub</a>
            <a href="#">Discord</a>
            <a href="#">RSS Feed</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
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
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-white/60">{text}</p>
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
        <div className="w-44 h-28 rounded-xl bg-gradient-to-br from-emerald-400/20 to-blue-500/20 border border-white/10" />

        <div className="flex-1">
          <h4 className="text-xl font-semibold">{title}</h4>

          <p className="text-white/60 mt-2">{desc}</p>

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
    <div className="flex gap-4 border-b border-white/5 pb-5">
      <div className="w-11 h-11 rounded-full bg-emerald-400/20 border border-emerald-400/20 flex items-center justify-center text-emerald-300 font-bold">
        {letter}
      </div>

      <div>
        <h4 className="text-lg font-medium">{title}</h4>

        <p className="text-white/50 text-sm mt-1">
          Discussion, benchmarks, testing and local AI usage.
        </p>

        <div className="mt-2 text-xs text-white/30">
          May 19, 2026 • 24 replies
        </div>
      </div>
    </div>
  )
}