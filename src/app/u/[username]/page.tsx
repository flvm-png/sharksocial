import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import { toggleFollow } from "@/app/actions/follow";

export default async function PublicProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const supabase = await createClient();

  // 👤 user logado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔎 perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  // 📌 posts
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
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  // ❤️ ver se já segue
  let isFollowing = false;

  if (user) {
    const { data: follow } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", user.id)
      .eq("following_id", profile.id)
      .maybeSingle();

    isFollowing = !!follow;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-white">

      {/* HEADER */}
      <div className="rounded-xl border border-white/10 bg-zinc-900 p-6 mb-8">

        <div className="flex items-center gap-5">

          <img
            src={
              profile.avatar_url ||
              `https://ui-avatars.com/api/?name=${profile.username}`
            }
            className="w-24 h-24 rounded-full object-cover"
          />

          <div className="flex-1">

            <h1 className="text-3xl font-bold">
              {profile.full_name || profile.username}
            </h1>

            <p className="text-orange-400">
              @{profile.username}
            </p>

            {profile.bio && (
              <p className="mt-3 text-zinc-300">
                {profile.bio}
              </p>
            )}

            <p className="mt-3 text-sm text-zinc-500">
              Membro desde{" "}
              {new Date(profile.created_at).toLocaleDateString("pt-PT")}
            </p>

            {/* ❤️ FOLLOW BUTTON */}
            {user && user.id !== profile.id && (
              <form
                action={toggleFollow.bind(
                  null,
                  user.id,
                  profile.id,
                  isFollowing
                )}
              >
                <button
                  className={`
                    mt-4 px-4 py-2 rounded-lg text-sm font-semibold transition
                    ${
                      isFollowing
                        ? "bg-zinc-700 text-white"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }
                  `}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>

      {/* POSTS */}
      <h2 className="text-xl font-semibold mb-4">
        Posts recentes
      </h2>

      {posts?.length ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="border border-white/10 rounded-lg bg-zinc-900 p-5 text-zinc-400">
          Este utilizador ainda não publicou nada.
        </div>
      )}

    </div>
  );
}