"use client";

import React, {
  createContext,
  useContext,
  useState,
} from "react";

type StackForgeContextType = {
  selectedGpu: string;
  setSelectedGpu: (gpu: string) => void;
};

const StackForgeContext =
  createContext<StackForgeContextType | null>(
    null
  );

export function StackForgeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedGpu, setSelectedGpu] =
    useState("");

  return (
    <StackForgeContext.Provider
      value={{
        selectedGpu,
        setSelectedGpu,
      }}
    >
      {children}
    </StackForgeContext.Provider>
  );
}

export function useStackForge() {
  const context =
    useContext(StackForgeContext);

  if (!context) {
    throw new Error(
      "useStackForge must be used inside StackForgeProvider"
    );
  }

  return context;
}