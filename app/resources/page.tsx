export default function ResourcesPage() {
  const resources = [
    "Ollama local inference guide",
    "LM Studio beginner setup",
    "Understanding quantization",
    "GPU buying guide for local AI",
    "Prompt engineering fundamentals"
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold">Resources</h1>

        <div className="space-y-4 mt-12">
          {resources.map((resource) => (
            <div
              key={resource}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="text-xl font-semibold">
                {resource}
              </h2>

              <p className="text-white/50 mt-2">
                Educational material designed to help beginners understand and deploy local AI systems.
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
