export default function BenchmarksPage() {
  const rows = [
    ["Llama 3.1 8B", "RTX 4090", "52 tok/s", "16GB"],
    ["Llama 3.1 70B", "Dual 4090", "18 tok/s", "48GB"],
    ["Mixtral 8x22B", "RTX 6000 Ada", "24 tok/s", "48GB"],
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold">Benchmarks</h1>

        <p className="mt-4 text-white/60 max-w-3xl">
          Real-world local AI performance data including tokens per second,
          VRAM usage, inference speed and hardware scaling.
        </p>

        <div className="overflow-hidden rounded-2xl border border-white/10 mt-12">
          <table className="w-full text-left">
            <thead className="bg-white/[0.04]">
              <tr>
                <th className="p-5">Model</th>
                <th className="p-5">Hardware</th>
                <th className="p-5">Speed</th>
                <th className="p-5">VRAM</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="border-t border-white/10">
                  {row.map((cell) => (
                    <td key={cell} className="p-5 text-white/70">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
