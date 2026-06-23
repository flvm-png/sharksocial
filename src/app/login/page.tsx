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

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-semibold text-white mb-6">
        Login
      </h1>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-lg bg-white text-zinc-900 font-medium py-2"
        >
          {loading ? "A entrar..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}