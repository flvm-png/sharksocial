"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteEventButton({
  eventId,
}: {
  eventId: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Tens a certeza que queres eliminar este evento?"
    );

    if (!confirmed) return;

    setLoading(true);

    // 1. apagar inscrições
    const { error: regError } = await supabase
      .from("event_registrations")
      .delete()
      .eq("event_id", eventId);

    if (regError) {
      console.log("REG ERROR:", regError);
      alert(regError.message);
      setLoading(false);
      return;
    }

    // 2. apagar evento
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) {
      console.log("EVENT DELETE ERROR:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="
        px-4 py-2
        rounded-lg
        bg-red-600
        hover:bg-red-700
        text-white
        font-medium
        transition
        disabled:opacity-50
      "
    >
      {loading ? "A eliminar..." : "Eliminar Evento"}
    </button>
  );
}