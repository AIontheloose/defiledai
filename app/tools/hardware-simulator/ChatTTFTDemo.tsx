// app/tools/hardware-simulator/ChatTTFTDemo.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ChatTTFTDemo({
  ttft,
  decodeSpeed,
  startSignal,
}: {
  ttft: number | null;
  decodeSpeed: number | null;
  startSignal: number;
}) {
  const [phase, setPhase] = useState<"idle" | "waiting" | "streaming">("idle");
  const [output, setOutput] = useState("");
  const [tokens, setTokens] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const userMessage =
    "Explain how GPUs accelerate LLMs in simple terms.";

  const aiText =
    "GPUs accelerate LLMs by running thousands of tiny math operations in parallel. This lets them process tokens much faster than CPUs, which work more sequentially. The result is dramatically faster inference and training.";

  // Reset on startSignal change
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
        const next = aiText.slice(i, i + charsPerToken);
        setOutput((prev) => prev + next);
        i += charsPerToken;
        setTokens((t) => t + 1);

        if (i >= aiText.length) clearInterval(interval);
      }, 1000 / decodeSpeed);

      return () => clearInterval(interval);
    }
  }, [phase, decodeSpeed]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output, phase]);

  return (
    <div
      ref={containerRef}
      className="space-y-4 max-h-64 overflow-y-auto p-2 border border-[var(--border)] rounded-md bg-[var(--bg)]"
    >
      {/* USER MESSAGE */}
      <div className="flex justify-end">
        <div className="flex items-start gap-2 max-w-[80%]">
          <div className="text-xl">😄</div>
          <div className="bg-[var(--accent-bg)] text-[var(--fg)] px-3 py-2 rounded-lg shadow">
            {userMessage}
          </div>
        </div>
      </div>

      {/* AI MESSAGE */}
      <div className="flex justify-start">
        <div className="flex items-start gap-2 max-w-[80%]">
          <div className="text-xl">🤖</div>

          <div className="bg-[var(--border)] text-[var(--fg)] px-3 py-2 rounded-lg shadow whitespace-pre-wrap">
            {phase === "waiting" && (
              <span className="text-[var(--muted)]">Thinking…</span>
            )}
            {output}
          </div>
        </div>
      </div>

      {/* TOKEN COUNTER */}
      {phase === "streaming" && (
        <div className="text-xs text-[var(--muted)] text-right pr-2">
          {tokens} tokens • {decodeSpeed?.toFixed(1)} tok/s
        </div>
      )}
    </div>
  );
}
