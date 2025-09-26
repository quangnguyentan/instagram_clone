"use client";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import React from "react";

interface PostMetaProps {
  createdAt?: string;
  likesCount?: number;
  commentsCount?: number;
  repliesCount?: number;
}

const PostMeta: React.FC<PostMetaProps> = ({
  createdAt,
  likesCount = 0,
  commentsCount = 0,
  repliesCount = 0,
}) => {
  const label = useTimeAgo(createdAt || "");

  return (
    <div className="text-sm text-gray-500 mt-2 space-y-1">
      {/* Hàng 1: thời gian + likes + dịch */}
      <div className="flex items-center gap-3">
        {createdAt && <span className="text-xs">{label}</span>}
        {likesCount > 0 && (
          <span className="text-xs cursor-pointer">
            {likesCount.toLocaleString()} lượt thích
          </span>
        )}
        <button className="text-xs cursor-pointer">Trả lời</button>
        <button className="text-xs cursor-pointer">Xem bản dịch</button>
        <button className="text-xs cursor-pointer">•••</button>
      </div>

      {/* Hàng 3: replies */}
      {repliesCount > 0 && (
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-xs cursor-pointer">──</span>
          <button className="text-xs cursor-pointer">
            Xem câu trả lời ({repliesCount})
          </button>
        </div>
      )}
    </div>
  );
};

export default PostMeta;
