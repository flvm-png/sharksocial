"use server";

import { createClient } from "@/lib/supabase/server";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("events").insert({
    title,
    description,
    date,
    location,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}