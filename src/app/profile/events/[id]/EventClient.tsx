"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import RegisterButton from "@/app/events/[slug]/register-button";

export default function EventClient({ event }: any) {
  const supabase = createClient();

  const [data, setData] = useState(event);
  const [formattedDate, setFormattedDate] = useState("");
  const [count, setCount] = useState(0);

  async function refreshEvent() {
    const { data: updatedEvent } = await supabase
      .from("events")
      .select("*")
      .eq("id", event.id)
      .single();

    const { count } = await supabase
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", event.id);

    if (updatedEvent) setData(updatedEvent);
    setCount(count ?? 0);
  }

  useEffect(() => {
    setData(event);
  }, [event]);

  useEffect(() => {
    if (data?.date) {
      setFormattedDate(
        new Date(data.date).toISOString().split("T")[0]
      );
    }
  }, [data?.date]);

  useEffect(() => {
    refreshEvent();

    const handler = () => refreshEvent();
    window.addEventListener("refresh-events", handler);

    return () => window.removeEventListener("refresh-events", handler);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{data.title}</h1>

      <p className="text-zinc-400">{data.description}</p>

      <div className="flex gap-3 text-sm text-zinc-300">
        <span>📍 {data.location}</span>
        <span>🧑‍🤝‍🧑 {count} / {data.capacity}</span>
        <span>📅 {formattedDate}</span>
      </div>

      <RegisterButton
        eventId={data.id}
        capacity={data.capacity}
        registeredCount={count}
        onChange={() => refreshEvent()}
      />
    </div>
  );
}