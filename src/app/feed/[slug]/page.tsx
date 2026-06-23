import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EventClient from "../../profile/events/[id]/EventClient";

export default async function EventPage({ params }: any) {
  const { slug } = await params;

  const supabase = createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) return notFound();

  return <EventClient event={event} />;
}