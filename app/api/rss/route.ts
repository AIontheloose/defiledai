export const dynamic = "force-static";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function getArticles() {
  const dir = path.join(process.cwd(), "content/articles");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        excerpt: data.excerpt ?? content.slice(0, 200).replace(/[#*`]/g, ""),
        date: data.date ?? new Date().toISOString(),
        category: data.category ?? "Article",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function GET() {
  const articles = getArticles();
  const base = "https://forsakenai.com";

  const items = articles
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${base}/articles/${a.slug}</link>
      <guid>${base}/articles/${a.slug}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <description><![CDATA[${a.excerpt}]]></description>
      <category>${a.category}</category>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ForsakenAI Research</title>
    <link>${base}</link>
    <description>Local AI research, quantization analysis, benchmarks, and open-weight model intelligence.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
