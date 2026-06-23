import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: any) {
  const supabase = createClient();

  const { id } = await params;
  const { userId } = await req.json();

  const { error } = await supabase
    .from("event_registrations")
    .delete()
    .eq("event_id", id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}