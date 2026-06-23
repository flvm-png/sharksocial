"use server";

import { createClient } from "@/lib/supabase/server";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log("REGISTER ERROR:", error.message);
    return { error: error.message };
  }

  console.log("REGISTER OK:", data);

  return { success: true };
}