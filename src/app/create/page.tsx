"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreatePostPage() {
  const supabase = createClient();
  const router = useRouter();

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(file: File, userId: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("post-images")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

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

    if (!content.trim()) {
      alert("O post não pode estar vazio");
      setLoading(false);
      return;
    }

    let imageUrl = null;

    try {
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, user.id);
      }

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content,
        image_url: imageUrl,
      });

      if (error) throw error;

      router.push("/feed");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-semibold mb-6">Criar Post 🦈</h1>

      <div className="space-y-4">

        {/* CONTENT */}
        <textarea
          placeholder="O que estás a pensar?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 min-h-[120px]"
        />

        {/* IMAGE UPLOAD */}
        <div className="flex items-center gap-3">
          {/* BOTÃO CUSTOM */}
            <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition">
              Procurar
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

          {/* TEXTO DO ESTADO */}
          <span className="text-sm text-zinc-400">
            {imageFile ? imageFile.name : "Nenhum ficheiro selecionado"}
          </span>
        </div>

        {/* PREVIEW */}
        {imagePreview && (
          <img
            src={imagePreview}
            className="rounded-lg max-h-[300px] object-cover"
          />
        )}

        {/* BUTTON */}
        <button
          onClick={handleCreatePost}
          disabled={loading}
          className="
            w-full
            bg-orange-500
            text-white
            font-medium
            py-2
            rounded-lg
            hover:bg-orange-600
            transition
            shadow-md
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? "A publicar..." : "Publicar"}
        </button>
      </div>
    </div>
  );
}