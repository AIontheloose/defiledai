// app/tools/hardware-simulator/SimulatorPanel.tsx
import TTFTDemo from "./TTFTDemo";
import { Speedometer } from "./Speedometer";

export function SimulatorPanel({ perf }: { perf: PerfResult }) {
  return (
    <div className="space-y-4">
      {/* existing stats UI here */}

      <TTFTDemo
        ttft={perf.ttftSeconds}
        decodeSpeed={perf.decodeTokPerSec}
      />

      <Speedometer decodeSpeed={perf.decodeTokPerSec} />
    </div>
  );
}
