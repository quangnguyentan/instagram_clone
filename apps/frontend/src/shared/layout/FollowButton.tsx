"use client";

import { useFollow, useUnfollow } from "@/hooks/useUsers";
import { useState } from "react";

export default function FollowButton({
  targetId,
  isFollowing: initialFollowing,
}: Readonly<{
  targetId: string;
  isFollowing: boolean;
}>) {
  const follow = useFollow(targetId);
  const unfollow = useUnfollow(targetId);
  const [optimisticFollowing, setOptimisticFollowing] =
    useState(initialFollowing);
  const handleClick = () => {
    if (optimisticFollowing) {
      // Optimistic update: đổi UI ngay
      setOptimisticFollowing(false);
      unfollow.mutate(undefined, {
        onError: () => setOptimisticFollowing(true), // rollback nếu lỗi
      });
    } else {
      setOptimisticFollowing(true);
      follow.mutate(undefined, {
        onError: () => setOptimisticFollowing(false),
      });
    }
  };
  return (
    <button
      disabled={follow.isPending || unfollow.isPending}
      onClick={handleClick}
      className="rounded text-sm font-medium text-blue-500 disabled:opacity-50 cursor-pointer"
    >
      {optimisticFollowing ? "Đang theo dõi" : "Theo dõi"}
    </button>
  );
}
