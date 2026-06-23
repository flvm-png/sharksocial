import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request, { params }: any) {
  const supabase = createClient();

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ registered: false });
  }

  const { data } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", id)
    .eq("user_id", userId)
    .maybeSingle();

  return NextResponse.json({
    registered: !!data,
  });
}