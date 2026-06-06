// app/tools/hardware-simulator/TTFTDemo.tsx
import React, { useState, useEffect } from "react";

export default function TTFTDemo({
  ttft,
  decodeSpeed,
  startSignal,
}: {
  ttft: number | null;
  decodeSpeed: number | null;
  startSignal: number; // triggers restart
}) {
  const [phase, setPhase] = useState<"idle" | "waiting" | "streaming">("idle");
  const [output, setOutput] = useState("");
  const [tokens, setTokens] = useState(0);

  const text =
    "This is a simulated model response generated at the speed your hardware would realistically achieve.";

  // Reset when startSignal changes
  useEffect(() => {
    setPhase("waiting");
    setOutput("");
    setTokens(0);
  }, [startSignal]);

  // TTFT delay
  useEffect(() => {
    if (phase === "waiting" && ttft) {
      const timer = setTimeout(() => setPhase("streaming"), ttft * 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, ttft]);

  // Streaming
  useEffect(() => {
    if (phase === "streaming" && decodeSpeed) {
      let i = 0;
      const charsPerToken = 4;

      const interval = setInterval(() => {
        const next = text.slice(i, i + charsPerToken);
        setOutput((prev) => prev + next);
        i += charsPerToken;
        setTokens((t) => t + 1);

        if (i >= text.length) clearInterval(interval);
      }, 1000 / decodeSpeed);

      return () => clearInterval(interval);
    }
  }, [phase, decodeSpeed]);

  return (
    <div className="space-y-2">
      {phase === "waiting" && (
        <div className="text-sm text-[var(--muted)]">Thinking…</div>
      )}

      <div className="font-mono text-sm whitespace-pre-wrap">{output}</div>

      {phase === "streaming" && (
        <div className="flex justify-between text-xs text-[var(--muted)]">
          <span>Tokens: {tokens}</span>
          <span>{decodeSpeed?.toFixed(1)} tok/s</span>
        </div>
      )}
    </div>
  );
}
