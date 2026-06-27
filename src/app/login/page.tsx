"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 text-white">
      <h1 className="text-3xl font-semibold mb-6">Login</h1>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg bg-orange-950/40 border border-orange-300/20 px-3 py-2 text-white placeholder:text-orange-200/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg bg-orange-950/40 border border-orange-300/20 px-3 py-2 text-white placeholder:text-orange-200/50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-medium py-2 transition"
        >
          {loading ? "A entrar..." : "Entrar"}
        </button>

        {/* DIVIDER */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-orange-300/20" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-transparent px-3 text-sm text-orange-100/70">
              ou
            </span>
          </div>
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-lg bg-white text-black font-medium py-2 hover:bg-zinc-100 transition"
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
}