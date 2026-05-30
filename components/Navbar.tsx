"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  function toggleTheme() {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#050816]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            Defiled<span className="text-cyan-400">AI</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm text-zinc-400">
            <Link
              href="/articles"
              className="hover:text-cyan-400 transition-colors"
            >
              Articles
            </Link>

            <Link
              href="/benchmarks"
              className="hover:text-cyan-400 transition-colors"
            >
              Benchmarks
            </Link>

            <Link
              href="/models"
              className="hover:text-cyan-400 transition-colors"
            >
              Models
            </Link>

            <Link
              href="/quantization"
              className="hover:text-cyan-400 transition-colors"
            >
              Quantization
            </Link>

            <Link
              href="/hardware"
              className="hover:text-cyan-400 transition-colors"
            >
              Hardware
            </Link>

            <Link
              href="/forum"
              className="hover:text-cyan-400 transition-colors"
            >
              Forum
            </Link>

            <Link
              href="/resources"
              className="hover:text-cyan-400 transition-colors"
            >
              Resources
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-white/[0.03] border border-cyan-500/10 rounded-xl px-3 h-10">
            <input
              type="text"
              placeholder="Search models, benchmarks..."
              className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-56"
            />
          </div>

          <button
            onClick={toggleTheme}
            className="h-10 px-4 rounded-xl border border-cyan-500/10 bg-white/[0.03] text-sm text-zinc-300 hover:border-cyan-400/30 transition-all"
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          <Link
            href="/login"
            className="h-10 px-4 rounded-xl border border-cyan-500/10 bg-white/[0.03] text-sm text-zinc-300 hover:border-cyan-400/30 transition-all flex items-center"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="h-10 px-4 rounded-xl bg-cyan-500 text-black font-medium text-sm hover:bg-cyan-400 transition-all flex items-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}