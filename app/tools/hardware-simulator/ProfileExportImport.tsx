"use client";

import React, { useRef, useState } from "react";
import type { HardwareProfile } from "./hardwareEngine";
import {
  serializeProfile,
  deserializeProfile,
} from "./profileSerializer";

export function ProfileExportImport({
  profile,
  onImport,
}: {
  profile: HardwareProfile;
  onImport: (p: HardwareProfile) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleExport() {
    const json = serializeProfile(profile);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "hardware-profile.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  function triggerImport() {
    setError(null);
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = deserializeProfile(text);

    if (!parsed) {
      setError("Invalid or incompatible profile JSON.");
      return;
    }

    onImport(parsed);
    setError(null);
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Export / Import Profile</h2>
        <p className="text-sm text-[var(--muted)]">
          Save your current hardware profile or load a custom one.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          className="px-4 py-2 border border-[var(--border)] rounded text-sm hover:border-[var(--accent)] transition"
        >
          Export current profile
        </button>

        <button
          onClick={triggerImport}
          className="px-4 py-2 border border-[var(--border)] rounded text-sm hover:border-[var(--accent)] transition"
        >
          Import profile from JSON
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && <div className="text-xs text-red-500">{error}</div>}

      <div className="text-xs text-[var(--muted)]">
        Current profile snapshot:
        <pre className="mt-2 p-2 border border-[var(--border)] rounded bg-[var(--bg)] overflow-x-auto">
          {serializeProfile(profile)}
        </pre>
      </div>
    </section>
  );
}
