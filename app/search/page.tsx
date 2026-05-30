"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Static search index — all searchable content across the site
const INDEX = [
  // Articles
  { title: "Llama 3.1 70B Uncensored", excerpt: "48GB+ VRAM · Q4_K_M · ExLlamaV2. Full analysis of the uncensored Llama 3.1 70B variant including VRAM requirements and inference performance.", href: "/articles/llama-3-1-70b-uncensored", category: "Article", tags: ["llama", "70b", "q4_k_m", "exllamav2", "uncensored", "vram"] },
  { title: "Q4_K_M vs IQ3_M Quality Loss", excerpt: "Memory reduction analysis comparing Q4_K_M and IQ3_M quantization formats across 7B, 13B, and 70B models.", href: "/quantization", category: "Article", tags: ["q4_k_m", "iq3_m", "quantization", "quality", "perplexity"] },
  { title: "Dual 3090 NVLink Deployment", excerpt: "70B inference workstation guide using dual RTX 3090 cards with NVLink for full 48GB memory pool.", href: "/hardware", category: "Article", tags: ["3090", "nvlink", "70b", "workstation", "dual gpu"] },
  // Benchmarks
  { title: "Llama 3.1 70B — Q4_K_M Benchmark", excerpt: "21 tok/s on dual RTX 3090 NVLink. ExLlamaV2 backend, 4096 context, CUDA 12.4.", href: "/benchmarks", category: "Benchmark", tags: ["llama", "70b", "benchmark", "tok/s", "3090", "exllamav2"] },
  { title: "DeepSeek V3 MoE Benchmark", excerpt: "39 tok/s on 4× A100 with TensorRT-LLM. Multi-GPU MoE inference benchmark.", href: "/benchmarks", category: "Benchmark", tags: ["deepseek", "v3", "moe", "a100", "tensorrt", "benchmark"] },
  { title: "Mixtral 8x22B Q4 Benchmark", excerpt: "27 tok/s on dual RTX 3090. ExLlamaV2 backend.", href: "/benchmarks", category: "Benchmark", tags: ["mixtral", "8x22b", "benchmark", "moe"] },
  { title: "RTX 4090 vs 3090 Inference Comparison", excerpt: "Side-by-side GPU comparison for 7B, 13B, and 70B model inference throughput.", href: "/benchmarks", category: "Benchmark", tags: ["4090", "3090", "gpu", "comparison", "benchmark"] },
  // Models
  { title: "Llama 3.1 Family", excerpt: "Meta's open-weight Llama 3.1 in 8B, 70B, and 405B. 128K context, Apache 2.0.", href: "/models", category: "Model", tags: ["llama", "meta", "8b", "70b", "405b", "128k"] },
  { title: "Qwen 3 Family", excerpt: "Alibaba's Qwen 3 in 7B, 14B, and 72B. Strong multilingual and coding performance.", href: "/models", category: "Model", tags: ["qwen", "alibaba", "7b", "72b", "multilingual"] },
  { title: "DeepSeek R1 & V3", excerpt: "DeepSeek's reasoning and MoE models. R1 7B to 70B, V3 671B MoE.", href: "/models", category: "Model", tags: ["deepseek", "r1", "v3", "moe", "reasoning", "671b"] },
  { title: "Mistral & Mixtral Family", excerpt: "Mistral 7B and Mixtral MoE variants. Fast, efficient, Apache 2.0 licensed.", href: "/models", category: "Model", tags: ["mistral", "mixtral", "7b", "8x7b", "8x22b", "moe"] },
  { title: "Gemma 2 Family", excerpt: "Google's Gemma 2 in 2B, 9B, and 27B. Strong reasoning for size.", href: "/models", category: "Model", tags: ["gemma", "google", "2b", "9b", "27b"] },
  // Quantization
  { title: "Q8_0 Format", excerpt: "Near-lossless 8-bit quantization. Best quality at 0.5× VRAM vs F16.", href: "/quantization", category: "Quantization", tags: ["q8_0", "8bit", "lossless", "gguf"] },
  { title: "Q4_K_M Format", excerpt: "Most popular K-quant. Best balance of quality, speed, and VRAM for 70B class models.", href: "/quantization", category: "Quantization", tags: ["q4_k_m", "4bit", "kquant", "popular"] },
  { title: "IQ3_M Format", excerpt: "Importance-matrix 3.5-bit. Better quality than Q3_K_M at similar size.", href: "/quantization", category: "Quantization", tags: ["iq3_m", "importance matrix", "3bit", "iq"] },
  { title: "Q2_K Format", excerpt: "Extreme 2-bit compression. Last resort for fitting 70B+ on limited VRAM.", href: "/quantization", category: "Quantization", tags: ["q2_k", "2bit", "extreme", "compression"] },
  // Hardware
  { title: "RTX 4090 Inference Build", excerpt: "~$1,400 single-card build. Handles 30B Q4_K_M at 112 tok/s for 7B.", href: "/hardware", category: "Hardware", tags: ["4090", "rtx", "build", "24gb", "inference"] },
  { title: "Dual RTX 3090 NVLink Build", excerpt: "~$2,200 dual-GPU build for 70B inference. 48GB VRAM pool via NVLink.", href: "/hardware", category: "Hardware", tags: ["3090", "nvlink", "dual", "70b", "48gb"] },
  { title: "A100 Server Build", excerpt: "4× A100 80GB workstation for 405B and large MoE models.", href: "/hardware", category: "Hardware", tags: ["a100", "server", "405b", "moe", "80gb"] },
  // Resources
  { title: "Local Inference Setup Guide", excerpt: "Install Ollama or llama.cpp, download your first model, and run inference on any consumer GPU.", href: "/resources", category: "Resource", tags: ["setup", "ollama", "llama.cpp", "beginner", "install"] },
  { title: "CUDA Optimization Guide", excerpt: "Flash attention, KV cache tuning, batch size, and context length settings for maximum throughput.", href: "/resources", category: "Resource", tags: ["cuda", "optimization", "flash attention", "kv cache", "performance"] },
  { title: "Multi-GPU Scaling Guide", excerpt: "Tensor parallelism, NVLink vs PCIe P2P, pipeline vs model parallelism.", href: "/resources", category: "Resource", tags: ["multi-gpu", "tensor parallel", "nvlink", "pcie", "scaling"] },
];

const CATEGORY_COLORS: Record<string, string> = {
  Article: "text-cyan-400 border-cyan-400/20",
  Benchmark: "text-green-400 border-green-400/20",
  Model: "text-purple-400 border-purple-400/20",
  Quantization: "text-yellow-400 border-yellow-400/20",
  Hardware: "text-orange-400 border-orange-400/20",
  Resource: "text-blue-400 border-blue-400/20",
};

function score(item: typeof INDEX[0], query: string): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  let s = 0;
  for (const w of words) {
    if (item.title.toLowerCase().includes(w)) s += 10;
    if (item.excerpt.toLowerCase().includes(w)) s += 5;
    if (item.tags.some((t) => t.includes(w))) s += 8;
    if (item.category.toLowerCase().includes(w)) s += 3;
  }
  return s;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof INDEX>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const scored = INDEX
      .map((item) => ({ item, s: score(item, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.item);
    setResults(scored);
  }, [query]);

  const categories = Array.from(new Set(results.map((r) => r.category)));

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI</div>
          <h1 className="text-4xl font-black font-mono mb-8">SEARCH</h1>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search models, benchmarks, hardware, guides..."
              className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] px-5 py-4 text-[var(--fg)] font-mono text-sm placeholder:text-[var(--muted)] focus:outline-none transition-colors pr-12"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="6.5" cy="6.5" r="4.5" /><path d="M10.5 10.5L14 14" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {query && results.length === 0 && (
          <div className="text-center py-16 text-[var(--muted)]">
            <div className="font-mono text-lg mb-2">NO RESULTS</div>
            <div className="text-sm">Try different keywords — models, formats, GPU names, tok/s...</div>
          </div>
        )}

        {!query && (
          <div className="text-[var(--muted)] text-sm space-y-2">
            <div className="text-xs uppercase tracking-widest mb-4">Try searching for</div>
            {["Q4_K_M", "RTX 3090", "70B", "Llama", "ExLlamaV2", "NVLink", "MoE", "CUDA"].map((s) => (
              <button key={s} onClick={() => setQuery(s)}
                className="block text-[var(--accent)] hover:underline font-mono text-sm">
                {s}
              </button>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div>
            <div className="text-xs text-[var(--muted)] mb-6 font-mono">
              {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </div>
            <div className="space-y-3">
              {results.map((r, i) => (
                <Link key={i} href={r.href}
                  className="block border border-[var(--border)] hover:border-[var(--accent)]/40 p-5 transition-all hover:bg-[var(--accent)]/[0.02] animate-fade-in">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs border px-1.5 py-0.5 ${CATEGORY_COLORS[r.category] ?? "text-[var(--muted)] border-[var(--border)]"}`}>
                      {r.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-[var(--fg)] mb-1">{r.title}</div>
                  <div className="text-[var(--muted)] text-sm leading-relaxed">{r.excerpt}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
