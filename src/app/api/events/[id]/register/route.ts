import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request, context: any) {
  const cookieStore = cookies();

  const supabase = createClient();

  const { params } = context;
  const { id: eventId } = await params;

  // 🔥 FORÇA AUTH COM COOKIE CONTEXT CORRETO
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // DEBUG (remove depois)
  console.log("AUTH:", user, authError);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", debug: authError },
      { status: 401 }
    );
  }

  // 1. evento
  const { data: event } = await supabase
    .from("events")
    .select("capacity")
    .eq("id", eventId)
    .single();

  if (!event) {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404 }
    );
  }

  // 2. já inscrito
  const { data: existing } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Already registered" },
      { status: 400 }
    );
  }

  // 3. count
  const { count } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  if ((count ?? 0) >= event.capacity) {
    return NextResponse.json(
      { error: "Capacity full" },
      { status: 400 }
    );
  }

  // 4. insert
  const { error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: eventId,
      user_id: user.id,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}