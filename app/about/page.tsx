export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold">About DefiledAI</h1>

        <div className="space-y-8 mt-10 text-white/70 leading-relaxed">
          <p>
            DefiledAI is an independent platform focused on unrestricted local AI,
            self-hosted language models and practical educational content for beginners and advanced users alike.
          </p>

          <p>
            The goal of the platform is to make local artificial intelligence understandable,
            accessible and transparent. Many new users are interested in running models privately
            on their own hardware but struggle to understand hardware requirements,
            quantization formats, inference engines and deployment workflows.
          </p>

          <p>
            DefiledAI provides factual tutorials, benchmark data, hardware guides and
            community discussions covering real-world local AI usage. The platform focuses on:
          </p>

          <ul className="list-disc pl-6 space-y-3">
            <li>Local language model deployment</li>
            <li>GPU and hardware optimization</li>
            <li>Quantization and inference performance</li>
            <li>Privacy-focused AI workflows</li>
            <li>Community-driven experimentation and benchmarking</li>
          </ul>

          <p>
            The site is designed with a static-first architecture using Next.js,
            TypeScript, TailwindCSS and Cloudflare Pages to maintain low operational costs
            while delivering fast global performance.
          </p>
        </div>
      </div>
    </main>
  );
}
