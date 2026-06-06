// app/tools/hardware-simulator/TTFTCompare.tsx
import React, { useState } from "react";
import TTFTDemo from "./TTFTDemo";

export function TTFTCompare({
  left,
  right,
}: {
  left: { label: string; ttft: number | null; decode: number | null };
  right: { label: string; ttft: number | null; decode: number | null };
}) {
  const [startSignal, setStartSignal] = useState(0);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setStartSignal((s) => s + 1)}
        className="px-3 py-2 border border-[var(--border)] rounded text-sm hover:border-[var(--accent)] transition"
      >
        Start Comparison
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[var(--border)] rounded-md p-4">
          <div className="text-sm font-medium mb-2">{left.label}</div>
          <TTFTDemo
            ttft={left.ttft}
            decodeSpeed={left.decode}
            startSignal={startSignal}
          />
        </div>

        <div className="border border-[var(--border)] rounded-md p-4">
          <div className="text-sm font-medium mb-2">{right.label}</div>
          <TTFTDemo
            ttft={right.ttft}
            decodeSpeed={right.decode}
            startSignal={startSignal}
          />
        </div>
      </div>
    </div>
  );
}
