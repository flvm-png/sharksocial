"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const inputClass =
    "w-full rounded-lg bg-orange-950/40 border border-orange-300/20 px-3 py-2 text-white placeholder:text-orange-200/50";

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", auth.user.id)
        .single();

      if (data) {
        setUsername(data.username ?? "");
        setFullName(data.full_name ?? "");
        setBio(data.bio ?? "");
        setAvatarUrl(data.avatar_url ?? "");
      }

      setLoading(false);
    }

    load();
  }, []);

  async function save() {
    setSaving(true);

    const { data: auth } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
      })
      .eq("id", auth.user!.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Perfil atualizado 🦈");
    router.push("/feed");
  }

  if (loading) return <div className="text-white">A carregar...</div>;

  return (
    <div className="max-w-xl mx-auto text-white space-y-4">
      <h1 className="text-2xl">Perfil</h1>

      <input className={inputClass} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
      <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="nome" />
      <textarea className={inputClass} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="bio" />
      <input className={inputClass} value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="avatar url" />

      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-orange-500 py-2 rounded-lg"
      >
        {saving ? "A guardar..." : "Guardar"}
      </button>
    </div>
  );
}