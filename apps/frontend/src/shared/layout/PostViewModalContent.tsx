"use client";
import React from "react";
import BaseCarousel from "../custom/BaseCarousel";
import { Media } from "@/types/post.type";

interface PostViewModalContentProps {
  media: Media[];
  comments?: { user: string; text: string }[];
  caption?: string;
}

const PostViewModalContent: React.FC<PostViewModalContentProps> = ({
  media,
  comments = [],
  caption,
}) => {
  return (
    <div className="flex h-[80vh] w-full">
      <div className="w-2/3 h-full">
        <BaseCarousel media={media} arrows={true} dots={true} />
      </div>
      <div className="w-1/3 p-4 overflow-y-auto bg-gray-100">
        {caption && <p className="mb-4">{caption}</p>}
        <h2 className="text-lg font-bold mb-2">Bình luận</h2>
        <div className="space-y-4">
          {comments.map((comment, idx) => (
            <div key={idx}>
              <p className="font-semibold">{comment.user}</p>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Thêm bình luận..."
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default PostViewModalContent;
