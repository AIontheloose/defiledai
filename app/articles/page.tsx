import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

type Article = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  featured?: boolean;
};

function getArticles(): Article[] {
  const articlesDirectory = path.join(
    process.cwd(),
    "content/articles"
  );

  const files = fs.readdirSync(articlesDirectory);

  const articles = files.map((file) => {
    const filePath = path.join(articlesDirectory, file);

    const source = fs.readFileSync(filePath, "utf8");

    const { data } = matter(source);

    return {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      date: data.date,
      category: data.category,
      featured: data.featured || false,
    };
  });

  return articles.reverse();
}

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16">
          <div className="text-cyan-400 uppercase tracking-[0.25em] text-sm mb-4">
            DefiledAI Archive
          </div>

          <h1 className="text-6xl font-bold mb-6">
            Research & Analysis
          </h1>

          <p className="text-zinc-400 text-xl max-w-3xl">
            Technical analysis, local inference benchmarks,
            quantization research, GPU deployment guides,
            and open-weight AI ecosystem coverage.
          </p>
        </div>

        <div className="grid gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group border border-cyan-500/10 bg-white/[0.02] rounded-2xl p-8 hover:border-cyan-400/30 transition-all"
            >
              <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
                <span className="text-cyan-400 uppercase tracking-wider">
                  {article.category}
                </span>

                <span>•</span>

                <span>{article.date}</span>
              </div>

              <h2 className="text-3xl font-bold mb-4 group-hover:text-cyan-300 transition-colors">
                {article.title}
              </h2>

              <p className="text-zinc-400 text-lg leading-relaxed max-w-4xl">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}