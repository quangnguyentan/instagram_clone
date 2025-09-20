"use client";

import { useFollow, useUnfollow } from "@/hooks/useUsers";

export default function FollowButton({
  targetId,
  isFollowing,
}: Readonly<{
  targetId: string;
  isFollowing: boolean;
}>) {
  const follow = useFollow(targetId);
  const unfollow = useUnfollow(targetId);

  return (
    <button
      disabled={follow.isPending || unfollow.isPending}
      onClick={() => {
        if (isFollowing) {
          unfollow.mutate();
        } else {
          follow.mutate();
        }
      }}
      className="rounded text-sm font-medium text-blue-500 disabled:opacity-50 cursor-pointer"
    >
      {isFollowing ? "Đang theo dõi" : "Theo dõi"}
    </button>
  );
}
