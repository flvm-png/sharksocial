import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";

export default async function PublicProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 👇 Buscar perfil pelo username
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  // ⭐ IMPORTANTE: assumimos que profiles.id = auth.users.id
  const profileId = profile.id;

  // 👇 Buscar posts do utilizador
  const { data: posts } = await supabase
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
    .eq("user_id", profileId)
    .order("created_at", { ascending: false });

  // 👇 Verificar follow
  let isFollowing = false;

  if (user) {
    const { data: follow } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", user.id)
      .eq("following_id", profileId)
      .maybeSingle();

    isFollowing = !!follow;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-white">

      {/* PROFILE CARD */}
      <div className="rounded-xl border border-white/10 bg-zinc-900 p-6 mb-8">
        <div className="flex items-center gap-5">

          <img
            src={
              profile.avatar_url ||
              `https://ui-avatars.com/api/?name=${profile.username}`
            }
            className="w-24 h-24 rounded-full"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {profile.full_name || profile.username}
            </h1>

            <p className="text-orange-400">
              @{profile.username}
            </p>

            <p className="text-sm text-zinc-500 mt-3">
              Membro desde{" "}
              {new Date(profile.created_at).toLocaleDateString("pt-PT")}
            </p>
          </div>
        </div>
      </div>

      {/* POSTS */}
      <h2 className="text-xl font-semibold mb-4">Posts recentes</h2>

      {posts?.length ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-zinc-400">
          Este utilizador ainda não publicou nada.
        </div>
      )}
    </div>
  );
}