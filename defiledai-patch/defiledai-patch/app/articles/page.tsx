import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export const metadata = {
  title: "Articles — DefiledAI",
  description: "Research articles on local AI, quantization, benchmarks, and open-weight models.",
};

function getArticles() {
  const dir = path.join(process.cwd(), "content/articles");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return { slug, ...data };
    });
}

export default function ArticlesPage() {
  const articles = getArticles() as Array<{
    slug: string;
    title?: string;
    excerpt?: string;
    date?: string;
    category?: string;
  }>;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-cyan-400 text-xs uppercase tracking-widest mb-3">DefiledAI Research</div>
          <h1 className="text-4xl font-black font-mono mb-4">RESEARCH ARCHIVE</h1>
          <p className="text-zinc-400 max-w-2xl">
            In-depth analysis on open-weight models, quantization, inference infrastructure,
            and local AI deployment.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="border border-zinc-800 p-12 text-center text-zinc-600">
            <div className="font-mono text-lg mb-2">NO ARTICLES YET</div>
            <div className="text-sm">Add .mdx files to content/articles/ to publish here.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`}
                className="group block border border-zinc-800 hover:border-cyan-500/30 p-6 transition-all hover:bg-cyan-500/[0.02]">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="text-cyan-400 text-xs uppercase tracking-widest mb-2">
                      {article.category || "Article"}
                    </div>
                    <h2 className="font-mono font-bold text-xl text-white group-hover:text-cyan-100 transition-colors mb-2">
                      {article.title || article.slug}
                    </h2>
                    {article.excerpt && (
                      <p className="text-zinc-400 text-sm leading-relaxed">{article.excerpt}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-zinc-600 font-mono">{article.date}</div>
                    <div className="text-cyan-400 text-xs mt-3 group-hover:text-cyan-300 transition-colors">READ →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
