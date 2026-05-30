import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  const articlesDir = path.join(process.cwd(), "content/articles");
  const files = fs.readdirSync(articlesDir);
  return files
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.mdx?$/, "") }));
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

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12 border-b border-[var(--border)] pb-8">
          <div className="text-cyan-400 text-sm uppercase tracking-widest mb-4">
            {data.category || "Article"}
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6 font-mono">
            {data.title}
          </h1>
          <p className="text-[var(--muted2)] text-lg max-w-3xl">
            {data.excerpt}
          </p>
          <div className="mt-6 text-sm text-[var(--muted)]">
            {data.date}
          </div>
        </header>
        <div className="prose prose-invert lg:prose-lg max-w-none
          prose-headings:text-[var(--fg)] prose-headings:font-mono
          prose-p:text-[var(--fg2)]
          prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[var(--fg)]
          prose-code:text-cyan-400 prose-code:bg-[var(--surface)] prose-code:px-1
          prose-pre:bg-[var(--surface)] prose-pre:border prose-pre:border-[var(--border)]
          prose-blockquote:border-l-cyan-500 prose-blockquote:text-[var(--muted2)]
          prose-th:text-[var(--fg)] prose-td:text-[var(--fg2)]
          prose-hr:border-[var(--border)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}