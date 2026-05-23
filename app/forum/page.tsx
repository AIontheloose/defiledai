export default function ForumPage() {
  const topics = [
    "Best GPU for local AI under $1000",
    "Mixtral unrestricted benchmark results",
    "Running Llama locally on Windows",
    "Best inference settings for storytelling"
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold">Forum</h1>

        <p className="mt-4 text-white/60 max-w-3xl">
          Community discussions covering unrestricted LLMs, local AI hardware,
          inference engines, prompt engineering and self-hosted workflows.
        </p>

        <div className="space-y-4 mt-12">
          {topics.map((topic, index) => (
            <div
              key={topic}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-400/20 border border-emerald-400/20 flex items-center justify-center text-emerald-300 font-bold">
                {index + 1}
              </div>

              <div>
                <h2 className="text-xl font-semibold">{topic}</h2>

                <p className="text-white/50 mt-2 text-sm">
                  Technical discussion, setup advice and benchmark analysis.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
