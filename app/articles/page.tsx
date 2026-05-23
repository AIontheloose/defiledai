export default function ArticlesPage() {
  const articles = [
    {
      title: "Understanding Local LLMs",
      desc: "A beginner-friendly overview of how local language models work, including VRAM requirements, quantization and inference engines."
    },
    {
      title: "Llama 3.1 70B Setup Guide",
      desc: "Step-by-step installation guide for running large unrestricted models locally using Ollama and LM Studio."
    },
    {
      title: "Quantization Explained",
      desc: "Learn the difference between Q4, Q5 and Q8 quantization formats and how they impact speed, memory and output quality."
    }
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold">Articles</h1>

        <p className="mt-4 text-white/60 max-w-3xl">
          Detailed guides, benchmarks and educational content about unrestricted local AI models,
          hardware requirements, quantization and self-hosted inference.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {articles.map((article) => (
            <div
              key={article.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="aspect-video rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 mb-5" />

              <h2 className="text-xl font-semibold leading-snug">
                {article.title}
              </h2>

              <p className="text-white/60 mt-3 leading-relaxed text-sm">
                {article.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
