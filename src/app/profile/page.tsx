"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        window.location.href = "/login";
        return;
      }

      setUser(auth.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", auth.user.id)
        .single();

      if (profile) {
        setUsername(profile.username ?? "");
        setFullName(profile.full_name ?? "");
        setBio(profile.bio ?? "");
        setAvatarUrl(profile.avatar_url ?? "");
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function saveProfile() {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      if (
        error.message ===
        'duplicate key value violates unique constraint "profiles_username_key"'
      ) {
        alert("Username já existe! Escolhe outro. 🦈");
        return;
      }

      alert(error.message);
      return;
    }

    alert("Perfil atualizado com sucesso! 🦈");

    router.push("/feed");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-white">
        A carregar perfil...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 text-white space-y-5">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold">
        O teu perfil 🦈
      </h1>

      {/* AVATAR PREVIEW */}
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border border-white/10"
        />
      )}

      {/* USERNAME */}
      <div>
        <label className="text-sm text-zinc-400">
          Username
        </label>
        <input
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2"
          placeholder="ex: nuno123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* NOME COMPLETO */}
      <div>
        <label className="text-sm text-zinc-400">
          Nome completo
        </label>
        <input
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2"
          placeholder="O teu nome"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      {/* BIO */}
      <div>
        <label className="text-sm text-zinc-400">
          Bio
        </label>
        <textarea
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 min-h-[100px]"
          placeholder="Escreve algo sobre ti..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      {/* AVATAR URL */}
      <div>
        <label className="text-sm text-zinc-400">
          URL do avatar
        </label>
        <input
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2"
          placeholder="https://..."
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
      </div>

      {/* BOTÃO SAVE */}
      <button
        onClick={saveProfile}
        disabled={saving}
        className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-zinc-200 transition"
      >
        {saving ? "A guardar..." : "Guardar perfil"}
      </button>

    </div>
  );
}