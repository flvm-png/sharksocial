"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import DeleteEventButton from "./DeleteEventButton";

export default function EventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const supabase = createClient();

  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      const { data: regs } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", id);

      setEvent(eventData);
      setRegistrations(regs ?? []);
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-white">
        A carregar evento...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-white">
        Evento não encontrado.
      </div>
    );
  }

  const checkedInCount = registrations.filter(
    (r) => r.checked_in
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-white">

      {/* AÇÕES */}

      <div className="flex items-center justify-between mb-8">

        <Link
          href="/dashboard"
          className="
            px-4 py-2
            rounded-lg
            border border-white/10
            bg-zinc-900
            hover:bg-zinc-800
            transition
          "
        >
          ← Voltar
        </Link>

        <DeleteEventButton eventId={event.id} />

      </div>

      {/* EVENTO */}

      <h1 className="text-3xl font-bold mb-2">
        {event.title}
      </h1>

      <p className="text-zinc-400 mb-6">
        {event.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-8 text-sm">

        <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1">
          📍 {event.location || "Sem local"}
        </span>

        <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1">
          📅{" "}
          {new Date(event.date).toLocaleDateString()}
        </span>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
          <p className="text-zinc-400 text-sm">
            Inscritos
          </p>

          <p className="text-3xl font-bold mt-1">
            {registrations.length}
          </p>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
          <p className="text-zinc-400 text-sm">
            Check-ins
          </p>

          <p className="text-3xl font-bold text-green-400 mt-1">
            {checkedInCount}
          </p>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">
          <p className="text-zinc-400 text-sm">
            Capacidade
          </p>

          <p className="text-3xl font-bold mt-1">
            {event.capacity}
          </p>
        </div>

      </div>

      {/* INSCRITOS */}

      <h2 className="text-xl font-semibold mb-4">
        Lista de Inscritos
      </h2>

      {registrations.length === 0 ? (
        <div className="
          bg-zinc-900
          border border-white/10
          rounded-lg
          p-4
          text-zinc-400
        ">
          Ainda não existem inscrições.
        </div>
      ) : (
        <div className="space-y-2">

          {registrations.map((registration) => (

            <div
              key={registration.id}
              className="
                bg-zinc-900
                border border-white/10
                rounded-lg
                p-4
                flex
                items-center
                justify-between
              "
            >

              <div>
                <p className="font-medium">
                  {registration.user_id}
                </p>
              </div>

              <div>

                {registration.checked_in ? (
                  <span className="
                    text-green-400
                    text-sm
                    font-medium
                  ">
                    ✅ Checked-in
                  </span>
                ) : (
                  <span className="
                    text-zinc-500
                    text-sm
                  ">
                    ⏳ Pendente
                  </span>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}