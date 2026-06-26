"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const inputClass =
    "w-full rounded-lg bg-orange-950/40 border border-orange-300/20 px-3 py-2 text-white placeholder:text-orange-200/50";

  async function handleRegister() {
  setLoading(true);

  // 1. criar conta
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
        bio,
      },
    },
  });

  if (!email.endsWith("@sharkcoders.pt")) {
    setLoading(false);
    alert("Usa o teu email da Sharkcoders para te registares!");
    return;
  }

  if (signUpError) {
    setLoading(false);
    alert(signUpError.message);
    return;
  }


  // 2. login automático (CRÍTICO)
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  setLoading(false);

  if (loginError) {
    alert(loginError.message);
    return;
  }

  // 3. ir para feed
  router.push("/feed");
}

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/feed`,
    },
  });

  if (error) {
    console.error(error);
    alert(error.message);
  }
}

  return (
    <div className="max-w-md mx-auto mt-10 text-white space-y-4">
      <h1 className="text-3xl font-semibold">Registo</h1>

      <input
        className={inputClass}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className={inputClass}
        placeholder="Nome completo"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <textarea
        className={inputClass}
        placeholder="Biografia"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <input
        className={inputClass}
        placeholder="Email Sharkcoders"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className={inputClass}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-orange-500 py-2 rounded-lg font-medium"
      >
        {loading ? "A criar..." : "Criar conta"}
      </button>

      {/* DIVIDER (igual ao login) */}
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

      <button
        onClick={signInWithGoogle}
        disabled={googleLoading}
        className="w-full bg-white text-black py-2 rounded-lg font-medium"
      >
        {googleLoading ? "A ligar..." : "Continuar com Google"}
      </button>
    </div>
  );
}