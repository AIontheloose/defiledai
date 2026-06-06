import React from "react";

export function Card({ className = "", children }: any) {
  return (
    <div className={`rounded-xl border bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}
