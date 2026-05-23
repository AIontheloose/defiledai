export default function ModelsPage() {
  const models = [
    {
      name: "Llama 3.1",
      details: "Meta's large language model family focused on strong reasoning and general-purpose performance."
    },
    {
      name: "Mixtral",
      details: "Sparse mixture-of-experts architecture delivering high quality output with lower active parameter usage."
    },
    {
      name: "DeepSeek",
      details: "Open-weight reasoning-focused models optimized for coding, mathematics and analysis."
    }
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold">Models</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {models.map((model) => (
            <div
              key={model.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="text-2xl font-semibold">
                {model.name}
              </h2>

              <p className="text-white/60 mt-4 leading-relaxed">
                {model.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
