import { createClient } from "./supabase/client";

export async function getEvents() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}