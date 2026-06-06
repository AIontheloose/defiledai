import {
  HardwareSelector,
  CapabilityScore,
  RecommendationCards,
  PerformancePrediction,
  QuantExplorer,
  BackendRecommendation,
  UpgradeAdvisor,
  CloudComparison,
  CommunityStats,
  ShareCard,
} from "../../../components/stackforge";

export const metadata = {
  title: "StackForge - Local AI Architect | DefiledAI",
  description:
    "Discover which AI models, quants, and backends fit your hardware. Compare performance, capability, upgrades, and community benchmarks.",
};

export default function StackForgePage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:px-8">
        {/* Hero */}
        <section className="mb-10">
          <div className="rounded-2xl border bg-card p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  StackForge
                </h1>

                <p className="mt-3 max-w-3xl text-muted-foreground">
                  The Local AI Architect. Discover what models you can run,
                  which quantizations fit, expected performance, backend
                  recommendations, upgrade paths, and community benchmark data.
                </p>
              </div>

              <div className="flex gap-2">
                <button className="rounded-lg border px-4 py-2 text-sm">
                  Compare Hardware
                </button>

                <button className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">
                  Community Benchmarks
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Top Dashboard */}
        <section className="mb-10">
          <div className="grid gap-6 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <HardwareSelector />
            </div>

            <div className="xl:col-span-8">
              <CapabilityScore />
            </div>
          </div>
        </section>

        {/* Recommended Models */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Recommended Models
              </h2>

              <p className="text-sm text-muted-foreground">
                Ranked recommendations based on your hardware profile.
              </p>
            </div>
          </div>

          <RecommendationCards />
        </section>

        {/* Performance */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">
              Performance Predictions
            </h2>

            <p className="text-sm text-muted-foreground">
              Estimated generation speed, prompt processing, TTFT, and context
              handling based on benchmark data.
            </p>
          </div>

          <PerformancePrediction />
        </section>

        {/* Quant + Backend */}
        <section className="mb-10">
          <div className="grid gap-6 xl:grid-cols-2">
            <QuantExplorer />
            <BackendRecommendation />
          </div>
        </section>

        {/* Upgrade + Cloud */}
        <section className="mb-10">
          <div className="grid gap-6 xl:grid-cols-2">
            <UpgradeAdvisor />
            <CloudComparison />
          </div>
        </section>

        {/* Community */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">
              Community Results
            </h2>

            <p className="text-sm text-muted-foreground">
              Real-world benchmark submissions from the DefiledAI community.
            </p>
          </div>

          <CommunityStats />
        </section>

        {/* Share Card */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">
              Share Your Build
            </h2>

            <p className="text-sm text-muted-foreground">
              Generate a shareable card for Reddit, X, Discord, and forums.
            </p>
          </div>

          <ShareCard />
        </section>
      </div>
    </main>
  );
}