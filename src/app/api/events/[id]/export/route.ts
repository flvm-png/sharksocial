import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request, { params }: any) {
  const supabase = createClient();
  const { id } = await params;

  const { data, error } = await supabase.rpc("get_event_export", {
    event_uuid: id,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const csv =
    "email,created_at\n" +
    (data ?? [])
      .map((r: any) => `${r.email},${r.created_at}`)
      .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="event-${id}.csv"`,
    },
  });
}