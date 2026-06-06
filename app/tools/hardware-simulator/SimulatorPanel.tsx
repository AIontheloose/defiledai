"use client";

import React from "react";
import type { PerfResult } from "./hardwareEngine";
import { Speedometer } from "./Speedometer";
import { SlowMotionToggle } from "./SlowMotionToggle";

export function SimulatorPanel({
  perf,
  slowMotion,
  setSlowMotion,
}: {
  perf: PerfResult;
  slowMotion: boolean;
  setSlowMotion: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4 border border-[var(--border)] rounded-md p-4">
      <div className="text-xs uppercase tracking-widest text-[var(--muted)]">
        Simulation Results
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Total VRAM</div>
        <div>{perf.totalVramGB.toFixed(1)} GB</div>

        <div>Model VRAM required</div>
        <div>{perf.modelVramGB.toFixed(1)} GB</div>

        <div>Fits in VRAM</div>
        <div>{perf.fitsInVram ? "Yes" : "No"}</div>

        <div>Fits in RAM</div>
        <div>{perf.fitsInRam ? "Yes" : "No"}</div>

        <div>Execution mode</div>
        <div>{perf.mode}</div>

        <div>Decode speed</div>
        <div>{perf.decodeTokPerSec.toFixed(1)} tok/s</div>

        <div>Prefill speed</div>
        <div>{perf.prefillTokPerSec.toFixed(1)} tok/s</div>

        <div>TTFT</div>
        <div>{perf.ttftSeconds.toFixed(2)} s</div>

        <div>Max context</div>
        <div>{perf.maxContextTokens}</div>

        <div>Perceived speed</div>
        <div>{perf.perceivedSpeed}</div>

        <div>Paragraph length</div>
        <div>{perf.paragraphTokens} tokens</div>
      </div>

      <Speedometer decodeSpeed={perf.decodeTokPerSec} />

      <SlowMotionToggle slowMotion={slowMotion} setSlowMotion={setSlowMotion} />
    </div>
  );
}
