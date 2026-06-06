// app/tools/hardware-simulator/Speedometer.tsx
"use client";

import React from "react";

export function Speedometer({ decodeSpeed }: { decodeSpeed: number }) {
  const clamped = Math.max(0, Math.min(decodeSpeed, 80));
  const pct = (clamped / 80) * 100;

  return (
    <div className="space-y-1">
      <div className="text-xs text-[var(--muted)]">Perceived speed</div>
      <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-[var(--muted)]">
        {decodeSpeed.toFixed(1)} tok/s (0–80 scale)
      </div>
    </div>
  );
}
