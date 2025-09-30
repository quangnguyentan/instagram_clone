"use client";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { Comment } from "@/types/comment.type";
import React from "react";

interface PostMetaProps {
  createdAt?: string;
  likesCount?: number;
  commentsCount?: number;
  repliesCount?: number;
  handleReply?: (comment: Comment) => void;
  onToggleReplies?: () => void; // 👈
  isExpanded?: boolean;
}

const PostMeta: React.FC<PostMetaProps> = ({
  createdAt,
  likesCount = 0,
  commentsCount = 0,
  repliesCount = 0,
  handleReply,
  onToggleReplies,
  isExpanded = false,
}) => {
  const label = useTimeAgo(createdAt || "");
  return (
    <div className="text-sm text-gray-500 mt-2 space-y-1">
      <div className="flex items-center gap-3">
        {createdAt && <span className="text-xs">{label}</span>}
        {likesCount > 0 && (
          <span className="text-xs cursor-pointer">
            {likesCount.toLocaleString()} lượt thích
          </span>
        )}
        <button
          className="text-xs cursor-pointer"
          onClick={() => handleReply && handleReply({} as Comment)}
        >
          Trả lời
        </button>
        <button className="text-xs cursor-pointer">Xem bản dịch</button>
        <button className="text-xs cursor-pointer">•••</button>
      </div>

      {repliesCount > 0 && (
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-xs cursor-pointer">──</span>
          <button className="text-xs cursor-pointer" onClick={onToggleReplies}>
            {isExpanded
              ? "Ẩn câu trả lời"
              : `Xem câu trả lời (${repliesCount})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostMeta;
