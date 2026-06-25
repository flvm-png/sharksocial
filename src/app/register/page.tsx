"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Conta criada!");
    router.push("/login");
  }

  async function signInWithGoogle() {
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/feed`,
      },
    });

    setGoogleLoading(false);

    if (error) {
      alert(error.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 text-white space-y-4">

      <h1 className="text-3xl font-semibold mb-6">
        Registo
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-zinc-900 border border-white/10 px-3 py-2 rounded-lg"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-zinc-900 border border-white/10 px-3 py-2 rounded-lg"
      />

      {/* EMAIL REGISTER */}
      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-orange-500 text-white font-medium py-2 rounded-lg hover:bg-orange-600 transition"
      >
        {loading ? "A criar..." : "Criar conta"}
      </button>

      {/* DIVIDER */}
      <div className="text-center text-zinc-400 text-sm">
        ou
      </div>

      {/* GOOGLE */}
      <button
        onClick={signInWithGoogle}
        disabled={googleLoading}
        className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-zinc-200 transition"
      >
        {googleLoading ? "A ligar..." : "Continuar com Google"}
      </button>

    </div>
  );
}