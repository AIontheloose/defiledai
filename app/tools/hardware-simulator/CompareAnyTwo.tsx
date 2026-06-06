"use client";

import React, { useState, useRef } from "react";
import ChatTTFTDemo from "./ChatTTFTDemo";
import {
  computePerf,
  defaultRuntimeProfile,
  type HardwareProfile,
} from "./hardwareEngine";
import { DEVICE_PRESETS, MODEL_PRESETS, BACKEND_PRESETS } from "./presets";

type PresetOption = { id: string; label: string; description?: string };

function ScrollList({
  items,
  selected,
  onSelect,
  scrollRef,
}: {
  items: PresetOption[];
  selected: string;
  onSelect: (id: string) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="border border-[var(--border)] rounded-md p-3 space-y-2">
      <div
        ref={scrollRef}
        className="max-h-48 overflow-y-auto space-y-2 pr-1"
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full text-left border rounded px-3 py-2 transition ${
              selected === item.id
                ? "border-[var(--accent)] bg-[var(--accent-bg)]"
                : "border-[var(--border)] hover:border-[var(--accent)]"
            }`}
          >
            <div className="font-medium">{item.label}</div>
            {item.description && (
              <div className="text-xs text-[var(--muted)]">
                {item.description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CompareAnyTwo() {
  const [runtime] = useState(defaultRuntimeProfile());

  const [leftDeviceId, setLeftDeviceId] = useState<string>("");
  const [rightDeviceId, setRightDeviceId] = useState<string>("");

  const [leftModelId, setLeftModelId] = useState<string>("");
  const [rightModelId, setRightModelId] = useState<string>("");

  const [leftBackendId, setLeftBackendId] = useState<string>("ollama");
  const [rightBackendId, setRightBackendId] = useState<string>("ollama");

  const [leftPerf, setLeftPerf] = useState<ReturnType<typeof computePerf> | null>(null);
  const [rightPerf, setRightPerf] = useState<ReturnType<typeof computePerf> | null>(null);

  const [startSignal, setStartSignal] = useState(0);

  const leftDeviceScrollRef = useRef<HTMLDivElement>(null);
  const rightDeviceScrollRef = useRef<HTMLDivElement>(null);
  const leftModelScrollRef = useRef<HTMLDivElement>(null);
  const rightModelScrollRef = useRef<HTMLDivElement>(null);
  const leftBackendScrollRef = useRef<HTMLDivElement>(null);
  const rightBackendScrollRef = useRef<HTMLDivElement>(null);

  function getDeviceProfile(id: string): HardwareProfile | null {
    const preset = DEVICE_PRESETS.find((p) => p.id === id);
    if (!preset) return null;
    return preset.apply();
  }

  function getModelParams(id: string) {
    const preset = MODEL_PRESETS.find((p) => p.id === id);
    if (!preset) return null;
    return { paramsB: preset.paramsB, quant: preset.quant };
  }

  function getBackendRuntime(id: string) {
    const preset = BACKEND_PRESETS.find((p) => p.id === id);
    if (!preset) return runtime;
    return { ...runtime, backend: preset.value };
  }

  function handleStartCompare() {
    const leftProfile = getDeviceProfile(leftDeviceId);
    const rightProfile = getDeviceProfile(rightDeviceId);
    const leftModel = getModelParams(leftModelId);
    const rightModel = getModelParams(rightModelId);
    const leftRuntime = getBackendRuntime(leftBackendId);
    const rightRuntime = getBackendRuntime(rightBackendId);

    if (!leftProfile || !rightProfile || !leftModel || !rightModel) return;

    const left = computePerf(
      leftProfile,
      leftRuntime,
      leftModel.paramsB,
      leftModel.quant
    );
    const right = computePerf(
      rightProfile,
      rightRuntime,
      rightModel.paramsB,
      rightModel.quant
    );

    setLeftPerf(left);
    setRightPerf(right);
    setStartSignal((s) => s + 1);
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Compare Any Two Presets</h2>
        <p className="text-sm text-[var(--muted)]">
          Pick two device + model + backend combinations and see how their responses feel side by side.
        </p>
      </div>

      {/* SELECTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-4 border border-[var(--border)] rounded-md p-4">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
            Left configuration
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <div className="mb-1 text-[var(--muted)]">Device preset</div>
              <ScrollList
                items={DEVICE_PRESETS}
                selected={leftDeviceId}
                onSelect={setLeftDeviceId}
                scrollRef={leftDeviceScrollRef}
              />
            </div>

            <div>
              <div className="mb-1 text-[var(--muted)]">Model preset</div>
              <ScrollList
                items={MODEL_PRESETS}
                selected={leftModelId}
                onSelect={setLeftModelId}
                scrollRef={leftModelScrollRef}
              />
            </div>

            <div>
              <div className="mb-1 text-[var(--muted)]">Backend</div>
              <ScrollList
                items={BACKEND_PRESETS}
                selected={leftBackendId}
                onSelect={setLeftBackendId}
                scrollRef={leftBackendScrollRef}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4 border border-[var(--border)] rounded-md p-4">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
            Right configuration
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <div className="mb-1 text-[var(--muted)]">Device preset</div>
              <ScrollList
                items={DEVICE_PRESETS}
                selected={rightDeviceId}
                onSelect={setRightDeviceId}
                scrollRef={rightDeviceScrollRef}
              />
            </div>

            <div>
              <div className="mb-1 text-[var(--muted)]">Model preset</div>
              <ScrollList
                items={MODEL_PRESETS}
                selected={rightModelId}
                onSelect={setRightModelId}
                scrollRef={rightModelScrollRef}
              />
            </div>

            <div>
              <div className="mb-1 text-[var(--muted)]">Backend</div>
              <ScrollList
                items={BACKEND_PRESETS}
                selected={rightBackendId}
                onSelect={setRightBackendId}
                scrollRef={rightBackendScrollRef}
              />
            </div>
          </div>
        </div>
      </div>

      {/* START BUTTON */}
      <div>
        <button
          onClick={handleStartCompare}
          className="px-4 py-2 border border-[var(--border)] rounded text-sm hover:border-[var(--accent)] transition"
        >
          Start Comparison
        </button>
      </div>

      {/* SIDE-BY-SIDE CHAT */}
      {leftPerf && rightPerf && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-[var(--border)] rounded-md p-4 space-y-2">
            <div className="text-sm font-medium mb-1">Left preset</div>
            <ChatTTFTDemo
              ttft={leftPerf.ttftSeconds}
              decodeSpeed={leftPerf.decodeTokPerSec}
              startSignal={startSignal}
            />
          </div>

          <div className="border border-[var(--border)] rounded-md p-4 space-y-2">
            <div className="text-sm font-medium mb-1">Right preset</div>
            <ChatTTFTDemo
              ttft={rightPerf.ttftSeconds}
              decodeSpeed={rightPerf.decodeTokPerSec}
              startSignal={startSignal}
            />
          </div>
        </div>
      )}
    </section>
  );
}
