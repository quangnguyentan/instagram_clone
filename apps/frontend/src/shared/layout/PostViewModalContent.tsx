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
    <div className="flex w-full h-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
      <div className="media-container flex-1 bg-black flex items-center justify-center max-w-[1280px] aspect-[1/1]">
        <BaseCarousel media={media} arrows dots />
      </div>
      <div className="comments-container w-1/3 p-4 overflow-y-auto bg-white min-w-[300px] max-w-[33.333%]">
        {caption && <p className="mb-4 text-gray-800">{caption}</p>}
        <h2 className="text-lg font-bold mb-2 text-gray-900">Bình luận</h2>
        <div className="space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          {comments.map((comment, idx) => (
            <div key={idx} className="text-gray-700">
              <p className="font-semibold">{comment.user}</p>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Thêm bình luận..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PostViewModalContent;
