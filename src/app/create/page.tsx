"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreatePostPage() {
  const supabase = createClient();
  const router = useRouter();

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreatePost() {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Tens de estar autenticado para criar um post");
      setLoading(false);
      return;
    }

    // validation
    if (!content.trim()) {
      alert("O post não pode estar vazio");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      content,
      image_url: imageUrl || null,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <div className="max-w-xl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-semibold mb-6">
        Criar Post 🦈
      </h1>

      <div className="space-y-4">

        {/* CONTENT */}
        <textarea
          placeholder="O que estás a pensar?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 min-h-[120px]"
        />

        {/* IMAGE URL (OPTIONAL) */}
        <input
          type="text"
          placeholder="URL da imagem (opcional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2"
        />

        {/* BUTTON */}
        <button
          onClick={handleCreatePost}
          disabled={loading}
          className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-zinc-200 transition"
        >
          {loading ? "A publicar..." : "Publicar"}
        </button>

      </div>
    </div>
  );
}