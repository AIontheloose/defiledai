// app/tools/hardware-simulator/Speedometer.tsx
import React from "react";

export function Speedometer({ decodeSpeed }: { decodeSpeed: number | null }) {
  if (!decodeSpeed) return null;

  const clamped = Math.min(decodeSpeed, 80);
  const pct = (clamped / 80) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-[var(--muted)]">
        <span>Speedometer</span>
        <span>{decodeSpeed.toFixed(1)} tok/s</span>
      </div>

      <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
