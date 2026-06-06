// app/tools/hardware-simulator/ChatTTFTDemo.tsx
"use client";

import React, { useEffect, useState } from "react";

type Phase = "idle" | "waiting" | "streaming" | "done";

export type ChatTTFTDemoProps = {
  ttft?: number;
  decodeSpeed?: number;
  startSignal: number;
};

const DEMO_TEXT =
  "Sure! Here’s a quick explanation of how your hardware affects LLM performance, including TTFT, decode speed, and context length.";

export default function ChatTTFTDemo({
  ttft,
  decodeSpeed,
  startSignal,
}: ChatTTFTDemoProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleText, setVisibleText] = useState("");
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    if (!ttft || !decodeSpeed) {
      setPhase("idle");
      setVisibleText("");
      setTokens(0);
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    setPhase("waiting");
    setVisibleText("");
    setTokens(0);

    timeoutId = setTimeout(() => {
      setPhase("streaming");
      const chars = DEMO_TEXT.split("");
      let idx = 0;

      const charsPerToken = 4;
      const tokensPerSecond = decodeSpeed;
      const charsPerSecond = tokensPerSecond * charsPerToken;
      const intervalMs = 1000 / charsPerSecond;

      intervalId = setInterval(() => {
        idx++;
        if (idx >= chars.length) {
          setVisibleText(DEMO_TEXT);
          setTokens(Math.ceil(chars.length / charsPerToken));
          setPhase("done");
          if (intervalId) clearInterval(intervalId);
          return;
        }
        setVisibleText(chars.slice(0, idx).join(""));
        setTokens(Math.ceil(idx / charsPerToken));
      }, Math.max(intervalMs, 15));
    }, ttft * 1000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [ttft, decodeSpeed, startSignal]);

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-start gap-2">
        <div className="h-7 w-7 rounded-full bg-[var(--border)] flex items-center justify-center text-xs">
          😄
        </div>
        <div className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2">
          How fast will this model feel on my hardware?
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="h-7 w-7 rounded-full bg-[var(--accent-bg)] flex items-center justify-center text-xs">
          🤖
        </div>
        <div className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 min-h-[40px]">
          {phase === "idle" && (
            <span className="text-[var(--muted)]">
              Run a simulation to see a live response.
            </span>
          )}
          {phase === "waiting" && (
            <span className="text-[var(--muted)]">Thinking…</span>
          )}
          {phase === "streaming" && <span>{visibleText}</span>}
          {phase === "done" && <span>{visibleText}</span>}
        </div>
      </div>

      {phase === "streaming" && (
        <div className="text-xs text-[var(--muted)] text-right pr-2">
          {tokens} tokens • {decodeSpeed?.toFixed(1)} tok/s
        </div>
      )}
    </div>
  );
}
