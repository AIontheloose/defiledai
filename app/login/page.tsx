export const metadata = { title: "Login — ForsakenAI" };

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-black font-mono text-2xl mb-1">
            <span className="text-white">Forsaken</span><span className="text-cyan-400">AI</span>
          </div>
          <div className="text-zinc-500 text-sm">Research Network Login</div>
        </div>
        <div className="border border-zinc-800 p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-2">Email</label>
              <input type="email" placeholder="you@example.com"
                className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-2">Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <button className="w-full bg-cyan-500 text-black font-bold tracking-widest uppercase text-sm py-3 hover:bg-cyan-400 transition-colors mt-2">
              LOGIN
            </button>
          </div>
          <div className="mt-6 text-center text-xs text-zinc-600">
            No account?{" "}
            <a href="/signup" className="text-cyan-400 hover:text-cyan-300">Sign up free</a>
          </div>
        </div>
      </div>
    </main>
  );
}
