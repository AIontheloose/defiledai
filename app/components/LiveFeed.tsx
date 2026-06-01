import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

function getRecentContent() {
  const items: {
    type: "article" | "tutorial" | "model" | "tool";
    title: string;
    href: string;
    date: string;
    tag: string;
    tagColor: string;
  }[] = [];

  // Articles
  const articlesDir = path.join(process.cwd(), "content/articles");
  if (fs.existsSync(articlesDir)) {
    fs.readdirSync(articlesDir)
      .filter(f => f.endsWith(".mdx") || f.endsWith(".md"))
      .forEach(file => {
        const slug = file.replace(/\.mdx?$/, "");
        const { data } = matter(fs.readFileSync(path.join(articlesDir, file), "utf8"));
        if (data.date) items.push({
          type: "article",
          title: data.title ?? slug,
          href: `/articles/${slug}`,
          date: data.date,
          tag: data.category ?? "Article",
          tagColor: "text-cyan-400 border-cyan-400/20",
        });
      });
  }

  // Tutorials
  for (const level of ["beginner","intermediate","expert"]) {
    const dir = path.join(process.cwd(), `content/tutorials/${level}`);
    if (!fs.existsSync(dir)) continue;
    fs.readdirSync(dir)
      .filter(f => f.endsWith(".mdx") || f.endsWith(".md"))
      .forEach(file => {
        const slug = file.replace(/\.mdx?$/, "");
        const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
        if (data.date) items.push({
          type: "tutorial",
          title: data.title ?? slug,
          href: `/tutorials/${slug}`,
          date: data.date,
          tag: `${level.charAt(0).toUpperCase() + level.slice(1)} Tutorial`,
          tagColor: level === "beginner" ? "text-green-400 border-green-400/20"
            : level === "intermediate" ? "text-yellow-400 border-yellow-400/20"
            : "text-red-400 border-red-400/20",
        });
      });
  }

  // Static model drops (updated manually or by pipeline)
  const modelDrops = [
    { title: "Llama 3.1 70B Abliterated v3 — Updated", href: "/tools/hf-tracker", date: "2026-05-28", tag: "Model Drop", tagColor: "text-purple-400 border-purple-400/20" },
    { title: "Qwen 2.5 72B Uncensored GGUF — Full quant pack", href: "/tools/hf-tracker", date: "2026-05-27", tag: "Model Drop", tagColor: "text-purple-400 border-purple-400/20" },
    { title: "MoE Pipeline Builder launched", href: "/tools/moe-builder", date: "2026-05-26", tag: "New Tool", tagColor: "text-orange-400 border-orange-400/20" },
  ];
  items.push(...modelDrops.map(m => ({ ...m, type: "model" as const })));

  return items
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 12);
}

export default function LiveFeed() {
  const items = getRecentContent();

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="border border-[var(--border)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono tracking-widest uppercase text-[var(--fg)]">Activity Feed</span>
            <span className="flex items-center gap-1.5 text-xs text-green-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
          </div>
          <Link href="/weekly" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] font-mono uppercase tracking-widest transition-colors">
            Weekly digest →
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)]/50">
          {items.map((item, i) => (
            <Link key={i} href={item.href}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-[var(--surface)] transition-colors group">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-xs border px-2 py-0.5 font-mono shrink-0 ${item.tagColor}`}>
                  {item.tag.toUpperCase()}
                </span>
                <span className="text-sm font-mono text-[var(--fg2)] group-hover:text-[var(--fg)] transition-colors truncate">
                  {item.title}
                </span>
              </div>
              <span className="text-xs text-[var(--muted)] font-mono shrink-0 ml-4">{item.date}</span>
            </Link>
          ))}
        </div>
        <div className="px-6 py-3 border-t border-[var(--border)] bg-[var(--surface)]/20">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)]">
            <span>Updates every time the pipeline runs</span>
            <Link href="/feed.xml" className="text-cyan-400 hover:text-cyan-300 transition-colors">RSS ↗</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
