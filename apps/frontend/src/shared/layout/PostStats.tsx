import React from "react";

interface PostStatsProps {
  likesCount: number;
  createdAt: string;
}

const PostStats: React.FC<PostStatsProps> = ({ likesCount, createdAt }) => {
  return (
    <div className="flex flex-col gap-1 text-sm text-gray-600 px-2">
      <span className="font-semibold">{likesCount} lượt thích</span>
      <span className="text-xs text-gray-400">{createdAt} trước</span>
    </div>
  );
};

export default PostStats;
