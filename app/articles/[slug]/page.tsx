import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "content/articles");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.mdx?$/, "") }));
}

function getRelatedArticles(currentSlug: string, currentTags: string[]) {
  const dir = path.join(process.cwd(), "content/articles");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => (f.endsWith(".mdx") || f.endsWith(".md")) && !f.includes(currentSlug))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      const shared = (data.tags ?? []).filter((t: string) => currentTags.includes(t)).length;
      return { slug, title: data.title ?? slug, category: data.category ?? "Article", date: data.date ?? "", shared };
    })
    .filter((a) => a.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3);
}

function readingTime(content: string) {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content/articles", `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const tags: string[] = data.tags ?? [];
  const related = getRelatedArticles(slug, tags);
  const mins = readingTime(content);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Article header — full width, dark band */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]/30">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)] mb-6 uppercase tracking-widest">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
            <span>›</span>
            <Link href="/articles" className="hover:text-[var(--accent)] transition-colors">Articles</Link>
            <span>›</span>
            <span className="text-[var(--accent)]">{data.category ?? "Article"}</span>
          </div>

          {/* Category badge */}
          <div className="inline-block border border-cyan-500/30 text-cyan-400 text-xs px-3 py-1 font-mono uppercase tracking-widest mb-4">
            {data.category ?? "Article"}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black font-mono leading-tight mb-4 text-[var(--fg)]">
            {data.title}
          </h1>

          {/* Excerpt */}
          {data.excerpt && (
            <p className="text-[var(--muted2)] text-lg max-w-3xl leading-relaxed mb-6">
              {data.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--muted)]">
            <span>{data.date}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--muted)]" />
            <span>{mins} min read</span>
            <span className="w-1 h-1 rounded-full bg-[var(--muted)]" />
            <span>DefiledAI Research</span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {tags.map((tag) => (
                <span key={tag} className="text-xs border border-[var(--border)] px-2 py-0.5 text-[var(--muted)] font-mono">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_260px] gap-12">
        {/* Article content */}
        <article>
          <div className="
            prose max-w-none
            prose-headings:font-mono prose-headings:font-black prose-headings:text-[var(--fg)] prose-headings:tracking-tight
            prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-[var(--border)] prose-h2:pb-2 prose-h2:mt-10
            prose-h3:text-xl prose-h3:text-[var(--fg)]
            prose-p:text-[var(--fg2)] prose-p:leading-relaxed prose-p:text-[0.97rem]
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[var(--fg)] prose-strong:font-bold
            prose-code:text-cyan-400 prose-code:bg-[var(--surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono prose-code:border prose-code:border-[var(--border)]
            prose-pre:bg-[var(--surface)] prose-pre:border prose-pre:border-[var(--border)] prose-pre:rounded-none prose-pre:text-xs
            prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-[var(--surface)]/40 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:not-italic
            prose-blockquote:text-[var(--muted2)]
            prose-table:text-sm prose-table:font-mono
            prose-thead:border-b-2 prose-thead:border-[var(--border)]
            prose-th:text-[var(--fg)] prose-th:font-bold prose-th:text-xs prose-th:uppercase prose-th:tracking-widest prose-th:py-2
            prose-td:text-[var(--fg2)] prose-td:py-2 prose-td:border-b prose-td:border-[var(--border)]/50
            prose-tr:transition-colors hover:prose-tr:bg-[var(--surface)]/40
            prose-hr:border-[var(--border)]
            prose-li:text-[var(--fg2)]
            prose-ul:my-4 prose-ol:my-4
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>

          {/* Bottom tags */}
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs border border-[var(--border)] px-2 py-1 text-[var(--muted)] font-mono hover:border-zinc-500 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href="/tools/submit-benchmark"
                className="text-xs border border-cyan-500/30 text-cyan-400 px-4 py-2 font-mono uppercase tracking-widest hover:border-cyan-400 transition-all">
                Submit Your Benchmarks
              </Link>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Quick facts */}
          <div className="border border-[var(--border)] p-5 sticky top-20">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">Quick Facts</div>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">Category</span>
                <span className="text-cyan-400 text-right">{data.category}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">Published</span>
                <span className="text-[var(--fg2)]">{data.date}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--muted)]">Read time</span>
                <span className="text-[var(--fg2)]">{mins} min</span>
              </div>
            </div>

            {/* Tools callout */}
            <div className="mt-5 pt-5 border-t border-[var(--border)] space-y-2">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">Tools</div>
              {[
                { href: "/tools/vram-calculator", label: "VRAM Calculator" },
                { href: "/tools/model-compatibility", label: "Model Compatibility" },
                { href: "/tools/speed-estimator", label: "Speed Estimator" },
                { href: "/tools/quant-picker", label: "Quant Picker" },
                { href: "/tools/abliteration-scorer", label: "Abliteration Scorer" },
              ].map((t) => (
                <Link key={t.href} href={t.href}
                  className="block text-xs text-[var(--muted2)] hover:text-[var(--accent)] font-mono py-1 transition-colors">
                  → {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="border border-[var(--border)] p-5">
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-mono">Related</div>
              <div className="space-y-4">
                {related.map((r) => (
                  <Link key={r.slug} href={`/articles/${r.slug}`}
                    className="block group">
                    <div className="text-xs text-cyan-400 uppercase tracking-widest mb-1">{r.category}</div>
                    <div className="text-sm text-[var(--fg2)] font-mono group-hover:text-[var(--fg)] transition-colors leading-snug">
                      {r.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
