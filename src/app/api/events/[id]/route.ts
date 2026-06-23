import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  const { data: regs } = await supabase
    .from("event_registrations")
    .select("event_id");

  const map: Record<string, number> = {};

  regs?.forEach((r) => {
    map[r.event_id] = (map[r.event_id] || 0) + 1;
  });

  const enriched = events.map((e) => ({
    ...e,
    registration_count: map[e.id] ?? 0,
  }));

  return NextResponse.json(enriched);
}