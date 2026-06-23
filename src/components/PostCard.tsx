"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PostCard({ post }: any) {
  const supabase = createClient();

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);

  const [newComment, setNewComment] = useState("");

  // 🔥 LOAD LIKES + COMMENTS COUNT + USER LIKE STATE
  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // LIKES COUNT
      const { count: likes } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      setLikesCount(likes ?? 0);

      // COMMENTS COUNT
      const { count: comments } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      setCommentsCount(comments ?? 0);

      // AUTO OPEN COMMENTS IF EXIST
      if ((comments ?? 0) > 0) {
        setShowComments(true);
        loadComments();
      }

      // CHECK IF USER LIKED
      if (user) {
        const { data } = await supabase
          .from("likes")
          .select("*")
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .maybeSingle();

        setLiked(!!data);
      }
    }

    load();
  }, [post.id]);

  // ❤️ TOGGLE LIKE
  async function toggleLike() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("Tens de estar logado");

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);

      setLiked(false);
      setLikesCount((c) => c - 1);
    } else {
      await supabase.from("likes").insert({
        post_id: post.id,
        user_id: user.id,
      });

      setLiked(true);
      setLikesCount((c) => c + 1);
    }
  }

  // 💬 LOAD COMMENTS LIST
  async function loadComments() {
    const { data } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        profiles (
          username
        )
      `)
      .eq("post_id", post.id)
      .order("created_at", { ascending: false });

    setComments(data ?? []);
  }

  // 💬 ADD COMMENT
  async function addComment() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("Tens de estar logado");
    if (!newComment.trim()) return;

    await supabase.from("comments").insert({
      post_id: post.id,
      user_id: user.id,
      content: newComment,
    });

    setNewComment("");
    setCommentsCount((c) => c + 1);

    loadComments();

    // auto open after comment
    setShowComments(true);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#111126] p-5">

      {/* USER */}
      <div className="text-xs text-[#A855F7] mb-2">
        @{post.profiles?.username ?? "user"}
      </div>

      {/* CONTENT */}
      <p className="text-white text-base leading-relaxed">
        {post.content}
      </p>

      {/* IMAGE */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt="post"
          className="mt-3 rounded-lg max-h-[400px] object-cover"
        />
      )}

      {/* DATE */}
      <div className="text-xs text-[#94A3B8] mt-3">
        {new Date(post.created_at).toLocaleString()}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-5 mt-4 text-sm">

        {/* LIKE */}
        <button
          onClick={toggleLike}
          className={liked ? "text-red-400" : "text-zinc-400"}
        >
          ❤️ {likesCount}
        </button>

        {/* COMMENTS TOGGLE */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-zinc-400 hover:text-[#A855F7]"
        >
          💬 {commentsCount}
        </button>

      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="mt-4 space-y-3">

          {/* LIST */}
          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="text-sm text-zinc-300">
                <span className="text-[#A855F7]">
                  @{c.profiles?.username}
                </span>{" "}
                {c.content}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMMENT INPUT (ALWAYS VISIBLE) */}
      <div className="flex gap-2 mt-4">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreve um comentário..."
          className="flex-1 bg-zinc-900 border border-white/10 rounded px-2 py-1 text-sm"
        />

        <button
          onClick={addComment}
          className="px-3 py-1 bg-white text-black text-sm rounded"
        >
          Enviar
        </button>
      </div>

    </div>
  );
}