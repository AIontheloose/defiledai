"use client";
import { useState } from "react";

const QUESTIONS = [
  {
    id: "budget",
    q: "What is your total hardware budget?",
    options: ["Under $300", "$300–$600", "$600–$1,200", "$1,200–$2,500", "$2,500–$5,000", "$5,000+"],
  },
  {
    id: "goal",
    q: "What is your primary goal?",
    options: [
      "Chat with 7–13B models (fast, responsive)",
      "Run 70B class models locally",
      "Maximum speed on smaller models",
      "Long context / RAG workloads",
      "Run abliterated / uncensored models",
      "Production API server (multiple users)",
    ],
  },
  {
    id: "existing",
    q: "What GPU do you currently have (if any)?",
    options: [
      "None — building from scratch",
      "RTX 3060/3070 (8–12GB)",
      "RTX 3080/3090 (10–24GB)",
      "RTX 4070/4080 (12–16GB)",
      "RTX 4090 (24GB)",
      "AMD RX 6000/7000 series",
      "Apple Silicon Mac",
    ],
  },
  {
    id: "os",
    q: "Operating system?",
    options: ["Windows 11", "Linux (Ubuntu/Debian)", "macOS", "Flexible"],
  },
];

interface Build {
  title: string;
  badge: string;
  badgeColor: string;
  gpu: string;
  vram: string;
  estPrice: string;
  models: string[];
  toks7b: string;
  toks70b: string;
  why: string;
  caveats: string[];
  buyLinks: { label: string; query: string }[];
}

function getRecommendation(answers: Record<string, string>): Build[] {
  const { budget, goal, existing, os } = answers;
  const builds: Build[] = [];

  const isApple = os === "macOS" || existing === "Apple Silicon Mac";
  const wantsSpeed = goal === "Maximum speed on smaller models";
  const wants70b = goal === "Run 70B class models locally" || goal === "Run abliterated / uncensored models";
  const wantsProduction = goal === "Production API server (multiple users)";
  const budgetNum = budget === "Under $300" ? 300 : budget === "$300–$600" ? 600 : budget === "$600–$1,200" ? 1200 : budget === "$1,200–$2,500" ? 2500 : budget === "$2,500–$5,000" ? 5000 : 10000;

  if (isApple) {
    builds.push({
      title: "M3 Max MacBook Pro / Mac Studio",
      badge: "BEST FOR MAC",
      badgeColor: "text-orange-400 border-orange-400/30",
      gpu: "M3 Max (40-core GPU)",
      vram: "36–96GB unified memory",
      estPrice: "$2,499–$3,999",
      models: ["Llama 3.1 70B Q4_K_M (36GB config)", "Any 7–13B at full F16", "DeepSeek R1 70B Q4"],
      toks7b: "~68 tok/s",
      toks70b: "~18 tok/s (48GB config)",
      why: "Apple Silicon's unified memory architecture means RAM and VRAM are shared — a 48GB M3 Max can run 70B Q4_K_M with no PCIe bottleneck. llama.cpp Metal backend is well-optimised. The best local AI hardware for macOS.",
      caveats: ["ExLlamaV2 is NVIDIA-only — use llama.cpp or Ollama", "Throughput lower than RTX 4090 on 7B models", "Expensive compared to used NVIDIA GPUs"],
      buyLinks: [{ label: "M3 Max Mac Studio", query: "apple mac studio m3 max" }],
    });
    return builds;
  }

  if (budgetNum <= 300) {
    builds.push({
      title: "RTX 3060 12GB",
      badge: "BUDGET PICK",
      badgeColor: "text-green-400 border-green-400/30",
      gpu: "RTX 3060 12GB",
      vram: "12GB GDDR6",
      estPrice: "~$180 used",
      models: ["Llama 3.1 8B Q8_0", "Mistral 7B Q8_0", "Gemma 2 9B Q4_K_M", "Any 13B Q4_K_M"],
      toks7b: "~42 tok/s",
      toks70b: "N/A",
      why: "The RTX 3060 12GB is the best sub-$200 card for local AI. The 12GB VRAM is the key differentiator — you can run 13B Q4_K_M or 7B Q8_0. Avoid the 8GB variants of any card at this tier.",
      caveats: ["Cannot run 70B models", "Slower bandwidth than 3080/3090 at same VRAM", "Buy specifically the 12GB version — 8GB 3060 exists"],
      buyLinks: [{ label: "RTX 3060 12GB", query: "rtx 3060 12gb" }],
    });
  }

  if (budgetNum >= 300 && budgetNum <= 700) {
    builds.push({
      title: "RTX 3080 Ti 12GB",
      badge: "BEST VALUE",
      badgeColor: "text-cyan-400 border-cyan-400/30",
      gpu: "RTX 3080 Ti",
      vram: "12GB GDDR6X",
      estPrice: "~$380–$450 used",
      models: ["Llama 3.1 8B Q8_0", "Mistral 7B Q8_0", "Gemma 2 9B Q5_K_M", "13B Q4_K_M"],
      toks7b: "~88 tok/s",
      toks70b: "N/A",
      why: "912 GB/s memory bandwidth — more than any 16GB card and close to the RTX 4090. At under $450 used it delivers exceptional tok/s per dollar for 7–13B models. Ideal for Dolphin 2.9 Mistral 7B or Llama 3.1 8B abliterated.",
      caveats: ["12GB limits you to 13B Q4 max", "High TDP (350W) — needs good case airflow", "No direct upgrade path to 70B without second card"],
      buyLinks: [{ label: "RTX 3080 Ti", query: "rtx 3080 ti 12gb" }],
    });
    if (budgetNum >= 600) {
      builds.push({
        title: "RTX 3090 24GB",
        badge: "24GB SWEET SPOT",
        badgeColor: "text-cyan-400 border-cyan-400/30",
        gpu: "RTX 3090",
        vram: "24GB GDDR6X",
        estPrice: "~$600–$720 used",
        models: ["Llama 3.1 8B Q8_0", "Gemma 2 27B Q5_K_M", "Mixtral 8x7B Q4_K_M", "Any model up to 30B"],
        toks7b: "~96 tok/s",
        toks70b: "N/A (single card)",
        why: "The best single-card buy for local AI in 2026. 24GB VRAM fits 27B Q5 or any 30B Q4. NVLink support means two 3090s give you a 48GB pool for 70B models later. 936 GB/s bandwidth is excellent.",
        caveats: ["Cannot fit 70B solo", "NVLink bridge required for dual-GPU 70B", "High power draw — 350W TDP"],
        buyLinks: [{ label: "RTX 3090", query: "rtx 3090 24gb" }, { label: "NVLink Bridge", query: "nvlink bridge rtx 3090" }],
      });
    }
  }

  if (budgetNum >= 700 && budgetNum <= 1300 && !wants70b) {
    builds.push({
      title: "RTX 4090 24GB",
      badge: "FASTEST SINGLE CARD",
      badgeColor: "text-cyan-400 border-cyan-400/30",
      gpu: "RTX 4090",
      vram: "24GB GDDR6X",
      estPrice: "~$1,500 new / ~$1,200 used",
      models: ["Any 7–27B model at maximum quant", "Gemma 2 27B Q8_0", "30B Q4_K_M", "Dolphin/abliterated variants of all above"],
      toks7b: "~128 tok/s",
      toks70b: "N/A (24GB)",
      why: "1,008 GB/s bandwidth — fastest consumer GPU for inference. 128 tok/s on 7B Q4 is genuinely instant. If you primarily run 7–27B models and want the best experience, this is the card.",
      caveats: ["24GB still cannot fit 70B", "No NVLink on Ada generation — dual GPU uses PCIe P2P", "Expensive if your use case doesn't need speed"],
      buyLinks: [{ label: "RTX 4090", query: "rtx 4090 24gb" }],
    });
  }

  if (wants70b || budgetNum >= 1200) {
    builds.push({
      title: "2× RTX 3090 NVLink",
      badge: "70B RECOMMENDED",
      badgeColor: "text-purple-400 border-purple-400/30",
      gpu: "2× RTX 3090 (NVLink)",
      vram: "48GB unified pool",
      estPrice: "~$1,300–$1,500 used (both cards + bridge)",
      models: ["Llama 3.1 70B Q4_K_M", "Qwen 2.5 72B Q4_K_M", "DeepSeek R1 70B Q4_K_M", "Dolphin 70B", "Any 70B abliterated variant"],
      toks7b: "~98 tok/s",
      toks70b: "~21 tok/s",
      why: "NVLink gives you a true 48GB VRAM pool — the OS sees one device. At ~$1,400 total this is the most cost-effective path to running 70B models locally. Q4_K_M Llama 3.1 70B at 21 tok/s is fast enough for interactive use.",
      caveats: ["Needs 1200W+ PSU", "NVLink bridge ~$60 extra", "Thermal management critical — cards are close together", "Not supported on all motherboards (check x16/x16 slots)"],
      buyLinks: [
        { label: "RTX 3090 (×2)", query: "rtx 3090 24gb" },
        { label: "NVLink 3-slot Bridge", query: "nvlink bridge 3090 3-slot" },
        { label: "1200W PSU", query: "1200w psu 80+ platinum" },
      ],
    });
  }

  if (wantsProduction || budgetNum >= 4000) {
    builds.push({
      title: "2× RTX 4090 (PCIe P2P)",
      badge: "PRODUCTION",
      badgeColor: "text-orange-400 border-orange-400/30",
      gpu: "2× RTX 4090",
      vram: "48GB (PCIe P2P — not unified)",
      estPrice: "~$3,000–$3,200",
      models: ["70B Q5_K_M at ~35 tok/s", "Any 7–27B at 130+ tok/s", "High-throughput batch serving"],
      toks7b: "~132 tok/s",
      toks70b: "~35 tok/s",
      why: "Ada doesn't support NVLink between consumer cards, but PCIe P2P still allows model sharding. Faster than dual 3090 NVLink on 70B due to higher bandwidth per card. Best for production serving with TensorRT-LLM or vLLM.",
      caveats: ["No NVLink — model split over PCIe, slight latency penalty vs NVLink", "Requires x16/x16 PCIe (check motherboard)", "1600W PSU recommended", "Expensive"],
      buyLinks: [{ label: "RTX 4090 (×2)", query: "rtx 4090 24gb" }],
    });
  }

  if (builds.length === 0) {
    builds.push({
      title: "RTX 3090 24GB",
      badge: "BEST DEFAULT",
      badgeColor: "text-cyan-400 border-cyan-400/30",
      gpu: "RTX 3090",
      vram: "24GB GDDR6X",
      estPrice: "~$650 used",
      models: ["27B Q5_K_M", "8B Q8_0", "13B Q8_0"],
      toks7b: "~96 tok/s",
      toks70b: "N/A solo",
      why: "The RTX 3090 is the best all-round card for local AI at its price point. 24GB VRAM, 936 GB/s bandwidth, NVLink support for future upgrades.",
      caveats: ["70B requires a second 3090 with NVLink bridge"],
      buyLinks: [{ label: "RTX 3090", query: "rtx 3090 24gb" }],
    });
  }

  return builds;
}

export default function HardwareAdvisorPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const done = step >= QUESTIONS.length;
  const recs = done ? getRecommendation(answers) : [];

  const answer = (val: string) => {
    setAnswers(a => ({ ...a, [QUESTIONS[step].id]: val }));
    setStep(step + 1);
  };
  const reset = () => { setAnswers({}); setStep(0); };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3">DefiledAI Tools</div>
          <h1 className="text-4xl font-black font-mono mb-4">HARDWARE ADVISOR</h1>
          <p className="text-[var(--muted)]">Get specific GPU and build recommendations for your budget and use case.</p>
        </div>

        <div className="flex gap-2 mb-10">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 transition-colors ${i < step ? "bg-cyan-400" : i === step ? "bg-cyan-400/40" : "bg-[var(--border)]"}`} />
          ))}
        </div>

        {!done ? (
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">Question {step + 1} of {QUESTIONS.length}</div>
            <h2 className="text-2xl font-black font-mono mb-8">{QUESTIONS[step].q}</h2>
            <div className="space-y-3">
              {QUESTIONS[step].options.map(opt => (
                <button key={opt} onClick={() => answer(opt)}
                  className="w-full text-left border border-[var(--border)] px-6 py-4 text-[var(--fg2)] font-mono text-sm hover:border-cyan-500/60 hover:bg-cyan-500/[0.03] hover:text-[var(--fg)] transition-all">
                  <span className="text-cyan-400 mr-3">›</span>{opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2 font-mono">Hardware Recommendations</div>
            {recs.map((r, i) => (
              <div key={r.title} className={`border p-6 ${i === 0 ? "border-cyan-500/40 bg-cyan-500/[0.02]" : "border-[var(--border)]"}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-black font-mono text-xl text-[var(--fg)]">{r.title}</span>
                      <span className={`text-xs border px-2 py-0.5 font-mono ${r.badgeColor}`}>{r.badge}</span>
                    </div>
                    <div className="text-sm text-[var(--muted)] font-mono">{r.gpu} · {r.vram} · {r.estPrice}</div>
                  </div>
                </div>
                <p className="text-[var(--fg2)] text-sm leading-relaxed mb-4">{r.why}</p>
                <div className="grid md:grid-cols-2 gap-4 mb-4 text-xs font-mono">
                  <div>
                    <div className="text-[var(--muted)] uppercase mb-2">Runs these models</div>
                    {r.models.map(m => <div key={m} className="text-[var(--fg2)] mb-0.5">✓ {m}</div>)}
                  </div>
                  <div>
                    <div className="text-[var(--muted)] uppercase mb-2">Speed</div>
                    <div className="text-green-400 mb-1">7B Q4: {r.toks7b}</div>
                    <div className={r.toks70b === "N/A" || r.toks70b.includes("N/A") ? "text-[var(--muted)]" : "text-green-400"}>70B Q4: {r.toks70b}</div>
                  </div>
                </div>
                {r.caveats.length > 0 && (
                  <div className="text-xs font-mono text-[var(--muted)] mb-4">
                    {r.caveats.map(c => <div key={c} className="mb-0.5">⚠ {c}</div>)}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {r.buyLinks.map(l => (
                    <a key={l.label} href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(l.query)}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-mono text-cyan-400 border border-cyan-500/20 px-3 py-1.5 hover:border-cyan-400 transition-all">
                      Search {l.label} on eBay ↗
                    </a>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={reset} className="w-full border border-[var(--border)] py-3 text-xs uppercase tracking-widest font-mono text-[var(--muted)] hover:text-[var(--fg)] hover:border-zinc-500 transition-all">
              Start Over
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
