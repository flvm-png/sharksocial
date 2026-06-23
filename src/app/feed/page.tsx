"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PostCard from "@/components/PostCard";

export default function FeedPage() {
  const supabase = createClient();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          image_url,
          created_at,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      setPosts(data ?? []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-white">
        A carregar feed...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-white">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Feed 🦈
        </h1>

        <p className="text-zinc-400">
          Descobre o que a comunidade está a partilhar.
        </p>
      </div>

      {/* POSTS */}
      {posts.length === 0 ? (
        <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 text-zinc-400">
          Ainda não há posts.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

    </div>
  );
}