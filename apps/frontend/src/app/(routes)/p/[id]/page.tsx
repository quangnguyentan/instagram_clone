"use client";

import { useParams } from "next/navigation";
import Post from "@/shared/layout/Post";
import { usePost } from "@/hooks/usePosts";

export default function SharedPostPage() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, isError } = usePost(id);

  if (isLoading) {
    return <p className="p-8 text-sm text-gray-500">Đang tải bài viết...</p>;
  }
  if (isError || !post) {
    return <p className="p-8 text-sm text-red-600">Không tải được bài viết.</p>;
  }

  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-8">
      <Post posts={[post]} />
    </div>
  );
}
