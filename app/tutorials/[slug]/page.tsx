import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

const TUTORIAL_DIRS = [
  "content/tutorials/beginner",
  "content/tutorials/intermediate",
  "content/tutorials/expert",
];

export async function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  for (const dir of TUTORIAL_DIRS) {
    const full = path.join(process.cwd(), dir);
    if (!fs.existsSync(full)) continue;
    fs.readdirSync(full)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
      .forEach((f) => slugs.push({ slug: f.replace(/\.mdx?$/, "") }));
  }
  return slugs;
}

function findTutorial(slug: string) {
  for (const dir of TUTORIAL_DIRS) {
    const full = path.join(process.cwd(), dir);
    if (!fs.existsSync(full)) continue;
    for (const ext of [".mdx", ".md"]) {
      const filePath = path.join(full, `${slug}${ext}`);
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(raw);
        return { data, content };
      }
    }
  }
  return null;
}

function readingTime(content: string) {
  return Math.ceil(content.split(/\s+/).length / 200);
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: "text-green-400 border-green-400/30",
  intermediate: "text-yellow-400 border-yellow-400/30",
  expert: "text-red-400 border-red-400/30",
};

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tutorial = findTutorial(slug);

  if (!tutorial) {
    return (
      <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-black font-mono text-[var(--muted)] mb-4">404</div>
          <div className="text-[var(--muted)] mb-6">Tutorial not found</div>
          <Link href="/tutorials" className="text-cyan-400 hover:text-cyan-300 font-mono text-sm">← Back to Tutorials</Link>
        </div>
      </main>
    );
  }

  const { data, content } = tutorial;
  const mins = readingTime(content);
  const level = data.level ?? "beginner";
  const levelColor = LEVEL_COLORS[level] ?? "text-cyan-400 border-cyan-400/30";

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]/30">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)] mb-6 uppercase tracking-widest">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
            <span>›</span>
            <Link href="/tutorials" className="hover:text-[var(--accent)] transition-colors">Tutorials</Link>
            <span>›</span>
            <span className={levelColor.split(" ")[0]}>{level}</span>
          </div>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`text-xs border px-3 py-1 font-mono uppercase ${levelColor}`}>
              {level}
            </span>
            <span className="text-xs border border-[var(--border)] px-3 py-1 font-mono text-[var(--muted)] uppercase">
              {data.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black font-mono leading-tight mb-4 text-[var(--fg)]">
            {data.title}
          </h1>

          {data.excerpt && (
            <p className="text-[var(--muted2)] text-lg max-w-3xl leading-relaxed mb-6">{data.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--muted)]">
            <span>{data.date}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--muted)]" />
            <span>{mins} min read</span>
          </div>

          {data.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {data.tags.map((tag: string) => (
                <span key={tag} className="text-xs border border-[var(--border)] px-2 py-0.5 text-[var(--muted)] font-mono">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_240px] gap-12">
        <article className="prose max-w-none
          prose-headings:font-mono prose-headings:font-black prose-headings:text-[var(--fg)] prose-headings:tracking-tight
          prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-[var(--border)] prose-h2:pb-2 prose-h2:mt-10
          prose-h3:text-xl
          prose-p:text-[var(--fg2)] prose-p:leading-relaxed
          prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[var(--fg)]
          prose-code:text-cyan-400 prose-code:bg-[var(--surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:border prose-code:border-[var(--border)]
          prose-pre:bg-[var(--surface)] prose-pre:border prose-pre:border-[var(--border)] prose-pre:rounded-none prose-pre:text-xs
          prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-[var(--surface)]/40 prose-blockquote:px-4 prose-blockquote:py-2
          prose-blockquote:text-[var(--muted2)] prose-blockquote:not-italic
          prose-table:text-sm prose-table:font-mono
          prose-th:text-[var(--fg)] prose-th:font-bold prose-th:text-xs prose-th:uppercase prose-th:tracking-widest prose-th:py-2
          prose-td:text-[var(--fg2)] prose-td:py-2 prose-td:border-b prose-td:border-[var(--border)]/50
          prose-hr:border-[var(--border)]
          prose-li:text-[var(--fg2)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="border border-[var(--border)] p-5 sticky top-20">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">Quick Info</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">Level</span>
                <span className={levelColor.split(" ")[0]}>{level}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">Read time</span>
                <span className="text-[var(--fg2)]">{mins} min</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">Published</span>
                <span className="text-[var(--fg2)]">{data.date}</span>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-[var(--border)] space-y-2">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">Related Tools</div>
              {[
                { href: "/tools/model-compatibility", label: "Model Compatibility" },
                { href: "/tools/vram-calculator", label: "VRAM Calculator" },
                { href: "/tools/quant-picker", label: "Quant Picker" },
                { href: "/tools/backend-picker", label: "Backend Picker" },
                { href: "/tools/moe-builder", label: "MoE Builder" },
              ].map((t) => (
                <Link key={t.href} href={t.href}
                  className="block text-xs text-[var(--muted2)] hover:text-[var(--accent)] font-mono py-0.5 transition-colors">
                  → {t.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-[var(--border)]">
              <Link href="/tutorials" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors">
                ← All Tutorials
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
