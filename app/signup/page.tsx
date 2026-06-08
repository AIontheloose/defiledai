"use client";
import { useState } from "react";
import Link from "next/link";

const INTERESTS = [
  { id: "models",     label: "New model drops",       desc: "Abliterated & uncensored GGUFs" },
  { id: "benchmarks", label: "Benchmark updates",     desc: "Community inference results" },
  { id: "tutorials",  label: "New tutorials",         desc: "Guides and how-tos" },
  { id: "tools",      label: "New tools",             desc: "Site feature launches" },
  { id: "weekly",     label: "Weekly digest",         desc: "Everything in one email" },
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<string[]>(["weekly"]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const toggleInterest = (id: string) =>
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (interests.length === 0) {
      setErrorMsg("Please select at least one interest.");
      return;
    }
    setErrorMsg("");
    setStatus("loading");

    // Replace this URL with your actual Mailchimp/Resend/ConvertKit endpoint
    // For Mailchimp: use their embedded form action URL
    // For Resend: POST to your /api/subscribe route
    // For now, simulate success after 1s
    await new Promise(r => setTimeout(r, 1000));

    // --- Mailchimp example (uncomment and fill in your endpoint) ---
    // try {
    //   const res = await fetch("https://YOUR_MAILCHIMP_FORM_ACTION_URL", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     body: new URLSearchParams({ EMAIL: email, tags: interests.join(",") }),
    //   });
    //   if (!res.ok) throw new Error();
    //   setStatus("success");
    // } catch {
    //   setStatus("error");
    //   setErrorMsg("Something went wrong. Try again or email us directly.");
    // }

    setStatus("success");
  };

  if (status === "success") {
    return (
      <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-3xl font-black font-mono mb-3 text-[var(--fg)]">YOU'RE IN</h2>
          <p className="text-[var(--muted)] mb-8 leading-relaxed">
            You'll get notified about {interests.includes("weekly") ? "the weekly digest and" : ""} new {interests.filter(i => i !== "weekly").join(", ").replace(/,([^,]*)$/, " and$1") || "updates"}.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/uncensored" className="px-6 py-2.5 bg-cyan-500 text-black font-black text-xs tracking-widest uppercase hover:bg-cyan-400 transition-colors font-mono">
              UNCENSORED MODELS
            </Link>
            <Link href="/tools" className="px-6 py-2.5 border border-[var(--border)] text-[var(--muted)] font-bold text-xs tracking-widest uppercase hover:text-[var(--fg)] hover:border-[var(--border2)] transition-colors font-mono">
              EXPLORE TOOLS
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="font-black font-mono text-2xl inline-block mb-6">
            <span className="text-[var(--fg)]">Forsaken</span>
            <span className="text-cyan-400">AI</span>
          </Link>
          <h1 className="text-3xl font-black font-mono mb-3">STAY IN THE LOOP</h1>
          <p className="text-[var(--muted)] leading-relaxed text-sm">
            Get notified about new uncensored model drops, benchmark updates, and tool launches. No spam — just the stuff that matters.
          </p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--card-bg)] p-7 space-y-6">

          {/* Email input */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2 font-mono">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com"
              className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] px-4 py-3 text-[var(--fg)] font-mono text-sm placeholder:text-[var(--muted)] focus:outline-none transition-colors"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-3 font-mono">Notify me about</label>
            <div className="space-y-2">
              {INTERESTS.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`w-full flex items-center gap-3 p-3 border text-left transition-all ${
                    interests.includes(interest.id)
                      ? "border-cyan-500/40 bg-cyan-500/[0.05]"
                      : "border-[var(--border)] hover:border-[var(--border2)]"
                  }`}>
                  <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                    interests.includes(interest.id)
                      ? "border-cyan-400 bg-cyan-400"
                      : "border-[var(--muted)]"
                  }`}>
                    {interests.includes(interest.id) && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round">
                        <polyline points="2 5 4 7 8 3"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-mono font-bold text-[var(--fg)]">{interest.label}</div>
                    <div className="text-xs text-[var(--muted)]">{interest.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="text-red-400 text-xs font-mono border border-red-500/30 bg-red-500/5 px-4 py-3">
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="w-full py-3.5 bg-cyan-500 text-black font-black tracking-widest uppercase text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono flex items-center justify-center gap-2">
            {status === "loading" ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                </svg>
                SUBSCRIBING...
              </>
            ) : "SUBSCRIBE"}
          </button>

          <p className="text-xs text-[var(--muted)] text-center font-mono">
            No spam. Unsubscribe any time.{" "}
            <Link href="/feed.xml" className="text-cyan-400 hover:text-cyan-300 transition-colors">RSS also available</Link>.
          </p>
        </div>

        {/* Already subscribed / Discord */}
        <div className="mt-6 border border-[#5865F2]/30 bg-[#5865F2]/[0.04] p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-mono font-bold text-[var(--fg)] mb-1">Want real-time updates?</div>
            <div className="text-xs text-[var(--muted)]">Join the Discord for live model drops and community discussion.</div>
          </div>
          <a href="/forum" className="px-5 py-2.5 bg-[#5865F2] text-white text-xs font-black tracking-widest uppercase hover:bg-[#4752C4] transition-colors font-mono shrink-0">
            DISCORD
          </a>
        </div>
      </div>
    </main>
  );
}
