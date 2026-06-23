"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useCheckinsRealtime(onChange: (payload: any) => void) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("checkins-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "check_ins",
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