// app/tools/hardware-simulator/SlowMotionToggle.tsx
"use client";

import React from "react";

export function SlowMotionToggle({
  slowMotion,
  setSlowMotion,
}: {
  slowMotion: boolean;
  setSlowMotion: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-[var(--muted)] cursor-pointer">
      <input
        type="checkbox"
        checked={slowMotion}
        onChange={(e) => setSlowMotion(e.target.checked)}
        className="h-3 w-3"
      />
      Slow‑motion stream (for demo)
    </label>
  );
}
