"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useRegistrationsRealtime(onChange: (payload: any) => void) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("registrations-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        (payload) => {
          onChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}