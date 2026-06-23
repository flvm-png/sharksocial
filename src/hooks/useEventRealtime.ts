"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useEventRealtime(
  eventId: string,
  callback: (payload: any) => void
) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`event-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `id=eq.${eventId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, callback]);
}