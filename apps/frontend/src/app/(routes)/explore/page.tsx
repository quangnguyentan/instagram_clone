"use client";

import Link from "next/link";
import { useExplorePosts } from "@/hooks/usePosts";

export default function Explore() {
  const { data, isLoading, isError } = useExplorePosts();
  const posts = data?.docs ?? [];

  if (isLoading) {
    return <p className="p-8 text-sm text-gray-500">Đang tải bài viết...</p>;
  }
  if (isError) {
    return <p className="p-8 text-sm text-red-600">Không tải được Khám phá.</p>;
  }

  return (
    <section className="h-full w-full overflow-y-auto p-4 md:p-8">
      <h1 className="mb-5 text-xl font-semibold">Khám phá</h1>
      {posts.length ? (
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-1 sm:grid-cols-3">
          {posts.map((post) => {
            const media = post.media?.[0];
            if (!media) return null;
            return (
              <Link
                key={post._id}
                href={`/profile/${post.user.username}`}
                className="relative aspect-square overflow-hidden bg-gray-100"
                aria-label={`Bài viết của ${post.user.username}`}
              >
                {media.mediaType === "video" ? (
                  <video
                    src={media.url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={post.caption ?? ""}
                    className="h-full w-full object-cover"
                  />
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Chưa có nội dung để khám phá.</p>
      )}
    </section>
  );
}
