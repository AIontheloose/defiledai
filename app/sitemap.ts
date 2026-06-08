export const dynamic = "force-static";

import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

function getSlugs(dir: string): string[] {
  const full = path.join(process.cwd(), dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://forsakenai.com";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                                    lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${base}/uncensored`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/leaderboard`,                   lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/tools`,                         lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/tutorials`,                     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/articles`,                      lastModified: now, changeFrequency: "daily",   priority: 0.85 },
    { url: `${base}/benchmarks`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/models`,                        lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/weekly`,                        lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/quantization`,                  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/hardware`,                      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/forum`,                         lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${base}/resources`,                     lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`,                         lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/search`,                        lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // Tools
    { url: `${base}/tools/moe-builder`,             lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/tools/model-compatibility`,     lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/tools/can-i-run-it`,            lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/speed-estimator`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/inference-profiler`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/price-performance`,       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/tools/benchmark-compare`,       lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/tools/hardware-advisor`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/vram-calculator`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/context-calculator`,      lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/tools/token-budget`,            lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/tools/quant-picker`,            lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/tools/backend-picker`,          lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/tools/abliteration-scorer`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/model-diff`,              lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/tools/hf-tracker`,              lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/tools/modelfile-generator`,     lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/tools/system-prompt-library`,   lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/tools/model-reviews`,           lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/tools/submit-benchmark`,        lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
  ];

  const articlePages: MetadataRoute.Sitemap = getSlugs("content/articles").map((slug) => ({
    url: `${base}/articles/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tutorialPages: MetadataRoute.Sitemap = [
    ...getSlugs("content/tutorials/beginner"),
    ...getSlugs("content/tutorials/intermediate"),
    ...getSlugs("content/tutorials/expert"),
  ].map((slug) => ({
    url: `${base}/tutorials/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages, ...tutorialPages];
}
