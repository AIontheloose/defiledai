export const dynamic = "force-static";

import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

function getArticleSlugs(): string[] {
  const dir = path.join(process.cwd(), "content/articles");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://defiledai.com";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                              lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${base}/articles`,               lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/benchmarks`,             lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/models`,                 lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/quantization`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/hardware`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/forum`,                  lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${base}/resources`,              lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/search`,                 lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/tools/vram-calculator`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/submit-benchmark`, lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
  ];

  const articlePages: MetadataRoute.Sitemap = getArticleSlugs().map((slug) => ({
    url: `${base}/articles/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}
