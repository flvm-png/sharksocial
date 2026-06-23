import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function CheckInPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const supabase = createClient();
  const { token } = await params;

  // 1. find registration
  const { data: reg, error: findError } = await supabase
    .from("event_registrations")
    .select("id, checked_in")
    .eq("checkin_token", token)
    .single();

  if (findError || !reg) {
    return notFound();
  }

  // 2. already checked-in
  if (reg.checked_in) {
    return (
      <div className="text-white p-10">
        Já foi feito check-in.
      </div>
    );
  }

  // 3. update check-in (IMPORTANT FIX)
  const { error: updateError } = await supabase
    .from("event_registrations")
    .update({ checked_in: true })
    .eq("id", reg.id);

  if (updateError) {
    return (
      <div className="text-red-500 p-10">
        ❌ Erro no check-in: {updateError.message}
      </div>
    );
  }

  return (
    <div className="text-white p-10">
      ✅ Check-in efetuado com sucesso!
    </div>
  );
}