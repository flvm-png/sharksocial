"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import QRCode from "react-qr-code";

export default function CheckInQRCode({
  eventId,
}: {
  eventId: string;
}) {
  const supabase = createClient();

  const [dbToken, setDbToken] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setIsRegistered(false);
        return;
      }

      const { data: reg } = await supabase
        .from("event_registrations")
        .select("id, checkin_token")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (reg) {
        setIsRegistered(true);
        setDbToken(reg.checkin_token);
      } else {
        setIsRegistered(false);
      }
    }

    load();
  }, [eventId]);

  // 🔥 IMPORTANTE: ainda a carregar → não faz nada
  if (isRegistered === null) {
    return null;
  }

  // ❌ não inscrito → não mostra nada
  if (!isRegistered) {
    return null;
  }

  async function generateQR() {
    setLoading(true);

    if (!dbToken) {
      setLoading(false);
      return;
    }

    setShowQR(true);
    setLoading(false);
  }

  return (
    <div className="pt-2 border-t border-white/10">
      <p className="text-sm text-zinc-400 mb-2">
        Check-in do evento
      </p>

      {!showQR && (
        <button
          onClick={generateQR}
          disabled={loading}
          className="px-4 py-2 bg-white text-zinc-900 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {loading ? "A gerar..." : "Gerar QR Code de check-in"}
        </button>
      )}

      {showQR && dbToken && (
        <div className="bg-white p-3 rounded-lg w-fit mt-2">
          <QRCode
            value={`${window.location.origin}/checkin/${dbToken}`}
          />
        </div>
      )}
    </div>
  );
}