"use client";
import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Syncs a key-value state object to URL search params.
 * Call syncToUrl(state) whenever state changes.
 * Call getFromUrl(defaults) to read initial state from URL.
 */
export function useShareableUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFromUrl = useCallback(
    (defaults: Record<string, string>): Record<string, string> => {
      const result: Record<string, string> = { ...defaults };
      for (const key of Object.keys(defaults)) {
        const val = searchParams.get(key);
        if (val !== null) result[key] = val;
      }
      return result;
    },
    [searchParams]
  );

  const syncToUrl = useCallback(
    (state: Record<string, string>) => {
      const url = new URL(window.location.href);
      for (const [key, val] of Object.entries(state)) {
        if (val) url.searchParams.set(key, val);
        else url.searchParams.delete(key);
      }
      router.replace(url.pathname + url.search, { scroll: false });
    },
    [router]
  );

  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  return { getFromUrl, syncToUrl, copyShareLink };
}

/**
 * Share button component — copy current URL to clipboard
 */
export function ShareButton({ label = "SHARE THIS CONFIG" }: { label?: string }) {
  return null; // implemented inline in each tool with local copied state
}
