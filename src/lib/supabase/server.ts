import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export function createClient(request?: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (!request) return [];
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          // só funciona em middleware / route handlers
        },
      },
    }
  );
}