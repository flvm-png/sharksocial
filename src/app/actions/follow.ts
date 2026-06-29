// app/actions/follow.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function toggleFollow(
  followerId: string,
  followingId: string,
  isFollowing: boolean
) {
  const supabase = await createClient();

  if (isFollowing) {
    await supabase
      .from("follows")
      .delete()
      .match({
        follower_id: followerId,
        following_id: followingId,
      });
  } else {
    await supabase.from("follows").insert({
      follower_id: followerId,
      following_id: followingId,
    });
  }
}