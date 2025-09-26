"use client";
import React from "react";
import BaseCarousel from "../custom/BaseCarousel";
import { Media, Post } from "@/types/post.type";
import { User } from "@/types/user.type";
import Image from "next/image";
import defaultUser from "@/assets/images/default_user.svg";
import { Comment } from "@/types/comment.type";
import PostMeta from "./PostMeta";

interface PostViewModalContentProps {
  post?: Post;
  comments?: Comment[];
  media?: Media[];
  likes?: User[];
  likesCount?: number;
  isLiked?: boolean;
  user?: User;
}

const PostViewModalContent: React.FC<PostViewModalContentProps> = ({
  post,
  comments = [],
  media = [],
  likes = [],
  likesCount = 0,
  isLiked = false,
  user,
}) => {
  console.log(user);
  console.log(comments);
  console.log(media);
  console.log(likes);
  console.log(likesCount);
  console.log(isLiked);
  return (
    <div className="flex w-full h-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
      <div className="media-container flex-1 bg-black flex items-center justify-center max-w-[1280px] aspect-[1/1]">
        <BaseCarousel media={media || []} arrows dots />
      </div>
      <div className="comments-container w-1/3 p-4 overflow-y-auto bg-white min-w-[300px] max-w-[33.333%]">
        {user && (
          <div className="flex items-center gap-2">
            <Image
              src={user?.avatarUrl || defaultUser}
              alt={user?.username}
              width={28}
              height={28}
            />
            <p className="text-gray-800">{user?.fullname}</p>
          </div>
        )}
        <div className="space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          {comments?.map((comment, idx) => (
            <div key={idx} className="text-gray-700">
              <div className="flex items-center gap-2">
                <Image
                  src={comment?.user?.avatarUrl || defaultUser}
                  alt={comment?.user?.username}
                  width={28}
                  height={28}
                />
                <div className="flex flex-col">
                  <p className="font-semibold">{comment?.user?.username}</p>
                  <p>{comment.content}</p>
                </div>
              </div>
              <PostMeta
                createdAt={post?.createdAt}
                likesCount={likesCount}
                commentsCount={comments.length}
              />
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
