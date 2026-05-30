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
    .map((f) => ({
      slug: f.replace(/\.mdx?$/, ""),
    }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const filePath = path.join(
    process.cwd(),
    "content/articles",
    `${slug}.mdx`
  );

  const fileContents = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(fileContents);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12 border-b border-cyan-500/10 pb-8">
          <div className="text-cyan-400 text-sm uppercase tracking-widest mb-4">
            {data.category || "Article"}
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            {data.title}
          </h1>

          <p className="text-zinc-400 text-lg max-w-3xl">
            {data.excerpt}
          </p>

          <div className="mt-6 text-sm text-zinc-500">
            {data.date}
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-cyan-400">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}