"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CheckInPage() {
  const supabase = createClient();
  const [token, setToken] = useState("");

  async function checkIn() {
    const { error } = await supabase.rpc("checkin_event", {
      token_input: token,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check-in feito com sucesso!");
    setToken("");
  }

  return (
    <div className="max-w-md mx-auto text-white mt-10">
      <h1 className="text-xl font-bold mb-4">Check-in Scanner</h1>

      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Token do QR"
        className="w-full p-2 rounded bg-zinc-900 border border-white/10"
      />

      <button
        onClick={checkIn}
        className="mt-4 w-full bg-white text-zinc-900 py-2 rounded"
      >
        Confirmar Check-in
      </button>
    </div>
  );
}