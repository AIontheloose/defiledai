import fs from "fs";
import path from "path";
import matter from "gray-matter";
import SearchClient from "./SearchClient";

function buildIndex() {
  const index: {
    title: string;
    excerpt: string;
    href: string;
    category: string;
    tags: string[];
  }[] = [];

  // Articles
  const articlesDir = path.join(process.cwd(), "content/articles");
  if (fs.existsSync(articlesDir)) {
    fs.readdirSync(articlesDir)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
      .forEach((file) => {
        const slug = file.replace(/\.mdx?$/, "");
        const raw = fs.readFileSync(path.join(articlesDir, file), "utf8");
        const { data, content } = matter(raw);
        index.push({
          title: data.title ?? slug,
          excerpt: data.excerpt ?? content.slice(0, 200).replace(/[#*`]/g, ""),
          href: `/articles/${slug}`,
          category: data.category ?? "Article",
          tags: data.tags ?? [],
        });
      });
  }

  // Tutorials
  const tutorialDirs = [
    "content/tutorials/beginner",
    "content/tutorials/intermediate",
    "content/tutorials/expert",
  ];
  for (const dir of tutorialDirs) {
    const full = path.join(process.cwd(), dir);
    if (!fs.existsSync(full)) continue;
    fs.readdirSync(full)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
      .forEach((file) => {
        const slug = file.replace(/\.mdx?$/, "");
        const raw = fs.readFileSync(path.join(full, file), "utf8");
        const { data, content } = matter(raw);
        index.push({
          title: data.title ?? slug,
          excerpt: data.excerpt ?? content.slice(0, 200).replace(/[#*`]/g, ""),
          href: `/tutorials/${slug}`,
          category: data.category ?? "Tutorial",
          tags: data.tags ?? [],
        });
      });
  }

  // Static pages
  const staticPages = [
    { title: "Uncensored Model Database", excerpt: "Curated database of abliterated and uncensored open-weight models with quality scores and HuggingFace links.", href: "/uncensored", category: "Page", tags: ["uncensored", "abliterated", "models"] },
    { title: "Community Leaderboard", excerpt: "Community-voted rankings for abliterated and uncensored models across coding, reasoning, creative, and instruction categories.", href: "/leaderboard", category: "Page", tags: ["leaderboard", "rankings", "community"] },
    { title: "Benchmark Matrix", excerpt: "Real-world inference benchmarks for local AI models across GPU tiers.", href: "/benchmarks", category: "Page", tags: ["benchmarks", "tok/s", "inference"] },
    { title: "Model Database", excerpt: "Open-weight model catalogue with quantization options, VRAM requirements, and abliterated variant availability.", href: "/models", category: "Page", tags: ["models", "database", "gguf"] },
    { title: "Quantization Guide", excerpt: "Every GGUF quantization format explained — quality, speed, VRAM tradeoffs.", href: "/quantization", category: "Page", tags: ["quantization", "gguf", "q4_k_m"] },
    { title: "Hardware Configs", excerpt: "GPU build recommendations for local AI at every budget tier.", href: "/hardware", category: "Page", tags: ["hardware", "gpu", "build"] },
    { title: "Weekly Digest", excerpt: "Weekly roundup of new uncensored model drops, community benchmarks, and local AI news.", href: "/weekly", category: "Page", tags: ["weekly", "news", "models"] },
    { title: "HuggingFace Tracker", excerpt: "Curated list of abliterated and uncensored model uploads. Updated weekly.", href: "/tools/hf-tracker", category: "Tool", tags: ["huggingface", "models", "tracker"] },
    { title: "MoE Pipeline Builder", excerpt: "Build a macro-scale Mixture-of-Experts pipeline from independent local models.", href: "/tools/moe-builder", category: "Tool", tags: ["moe", "pipeline", "router", "expert"] },
    { title: "Model Compatibility Checker", excerpt: "Select your GPU — see every uncensored model that fits with estimated tok/s.", href: "/tools/model-compatibility", category: "Tool", tags: ["compatibility", "gpu", "vram"] },
    { title: "Inference Speed Estimator", excerpt: "Predict tokens per second before downloading multi-gigabyte model files.", href: "/tools/speed-estimator", category: "Tool", tags: ["speed", "tok/s", "estimator"] },
    { title: "VRAM Calculator", excerpt: "Calculate exact VRAM requirements including KV cache for any model and quantization.", href: "/tools/vram-calculator", category: "Tool", tags: ["vram", "calculator", "kv-cache"] },
    { title: "Quant Picker", excerpt: "3-question wizard to find the right quantization format for your hardware.", href: "/tools/quant-picker", category: "Tool", tags: ["quantization", "wizard", "picker"] },
    { title: "Backend Picker", excerpt: "Find the right inference backend for your GPU, OS, and use case.", href: "/tools/backend-picker", category: "Tool", tags: ["backend", "ollama", "exllamav2", "llama.cpp"] },
    { title: "Abliteration Quality Scorer", excerpt: "Compare base vs abliterated benchmark scores. Grade quality retention S through D.", href: "/tools/abliteration-scorer", category: "Tool", tags: ["abliteration", "quality", "benchmark"] },
    { title: "GPU Price / Performance", excerpt: "Current GPU rankings by inference value — tok/s per dollar.", href: "/tools/price-performance", category: "Tool", tags: ["gpu", "price", "performance", "value"] },
    { title: "Modelfile Generator", excerpt: "Build a ready-to-use Ollama Modelfile with system prompt and parameters.", href: "/tools/modelfile-generator", category: "Tool", tags: ["ollama", "modelfile", "system-prompt"] },
    { title: "Token Budget Calculator", excerpt: "Plan context usage, generation time, and cost before building pipelines.", href: "/tools/token-budget", category: "Tool", tags: ["tokens", "context", "cost", "budget"] },
    { title: "Inference Profiler", excerpt: "Detailed inference profile: throughput, TTFT, bandwidth utilisation, CPU offload analysis.", href: "/tools/inference-profiler", category: "Tool", tags: ["inference", "profiler", "ttft", "bandwidth"] },
    { title: "System Prompt Library", excerpt: "Production-ready system prompts for local models — uncensored, coding, creative, reasoning.", href: "/tools/system-prompt-library", category: "Tool", tags: ["system-prompt", "ollama", "modelfile"] },
    { title: "Hardware Advisor", excerpt: "4-question wizard giving specific GPU and build recommendations for your budget.", href: "/tools/hardware-advisor", category: "Tool", tags: ["hardware", "gpu", "build", "budget"] },
    { title: "Context Length Calculator", excerpt: "Find your maximum context window given VRAM, model, and KV cache quantization.", href: "/tools/context-calculator", category: "Tool", tags: ["context", "kv-cache", "vram", "calculator"] },
    { title: "Model Diff", excerpt: "Side-by-side comparison of base vs abliterated model outputs.", href: "/tools/model-diff", category: "Tool", tags: ["model-diff", "abliterated", "comparison"] },
    { title: "Benchmark Compare", excerpt: "Side-by-side GPU inference comparison across 7B, 13B, and 70B model sizes.", href: "/tools/benchmark-compare", category: "Tool", tags: ["benchmark", "gpu", "comparison"] },
    { title: "Model Reviews", excerpt: "Community structured reviews with hardware, use case, verdict, pros and cons.", href: "/tools/model-reviews", category: "Tool", tags: ["reviews", "community", "models"] },
  ];

  index.push(...staticPages);
  return index;
}

export default function SearchPage() {
  const index = buildIndex();
  return <SearchClient index={index} />;
}
