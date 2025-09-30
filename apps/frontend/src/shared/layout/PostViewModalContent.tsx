"use client";
import React, { useState } from "react";
import BaseCarousel from "../custom/BaseCarousel";
import { Media, Post } from "@/types/post.type";
import { User } from "@/types/user.type";
import Image from "next/image";
import defaultUser from "@/assets/images/default_user.svg";
import { Comment } from "@/types/comment.type";
import PostMeta from "./PostMeta";
import { useCreateComment } from "@/hooks/useComment";
import PostCaption from "./PostCaption";
import { useTimeAgo } from "@/hooks/useTimeAgo";

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
  const label = useTimeAgo(post?.createdAt || "");

  const [value, setValue] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [explain, setExplain] = useState<{ [key: string]: boolean }>({});
  const createCommentMutation = useCreateComment(); // Hook to create comments
  const handleReply = (comment: Comment) => {
    setReplyTo(comment);
    setValue?.(`@${comment?.user?.username} `);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === "" || !user?._id || !post?._id) return;
    createCommentMutation.mutate(
      {
        post: post._id,
        user: user._id,
        content: value,
        parent: replyTo?._id || null, // Set parent if replying
      },
      {
        onSuccess: () => {
          setValue(""); // Clear input
          setReplyTo(null); // Clear reply state
        },
      }
    );
  };
  const toggleExplain = (commentId: string) => {
    setExplain((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };
  return (
    <div className="flex w-full h-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
      <div className="media-container flex-1 bg-black flex items-center justify-center max-w-[1280px] aspect-[1/1]">
        <BaseCarousel media={media || []} arrows dots />
      </div>
      <div className="comments-container w-1/3 overflow-y-auto min-w-[300px] max-w-[33.333% p-4 relative">
        {user && (
          <div
            className="flex items-center gap-2 pb-4 relative
  after:content-[''] after:absolute after:-left-4 after:bottom-0
  after:w-[calc(100%+2rem)] after:h-[0.5px] after:bg-gray-400/80 after:opacity-20"
          >
            <Image
              src={user?.avatarUrl || defaultUser}
              alt={user?.username}
              width={28}
              height={28}
            />
            <p className="text-gray-800">{user?.fullname}</p>
          </div>
        )}
        <div className="space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto py-4">
          <div className="flex flex-col gap-2">
            <PostCaption
              user={post?.user as User}
              caption={post?.caption || ""}
            />
            <span className="text-gray-500 text-xs ">{label} trước</span>
          </div>
          {comments?.map((comment, idx) => {
            if (comment.parent) return null;
            return (
              <div key={idx} className="text-gray-700">
                <div className="flex items-center gap-2">
                  <Image
                    src={comment?.user?.avatarUrl || defaultUser}
                    alt={comment?.user?.username}
                    width={28}
                    height={28}
                  />
                  <p className="text-sm break-words line-clamp-2">
                    <span className="font-semibold mr-1">
                      {comment?.user?.username}
                    </span>
                    {comment.content}
                  </p>
                </div>
                <PostMeta
                  createdAt={post?.createdAt}
                  likesCount={likesCount}
                  commentsCount={comments.length}
                  repliesCount={
                    comments.filter((c) => c?.parent?._id === comment._id)
                      ?.length
                  }
                  handleReply={() => handleReply(comment)}
                  onToggleReplies={() => toggleExplain(comment._id)}
                  isExpanded={!!explain[comment._id]}
                />
                {explain[comment._id] &&
                  comments
                    .filter((c) => c?.parent?._id === comment?._id)
                    .map((reply: Comment, replyIdx) => (
                      <div key={replyIdx} className="ml-8 mt-2">
                        <div className="flex items-center gap-2">
                          <Image
                            src={reply?.user?.avatarUrl || defaultUser}
                            alt={reply?.user?.username}
                            width={24}
                            height={24}
                          />
                          <div className="flex flex-col">
                            <p className="font-semibold">
                              {reply?.user?.username}
                            </p>
                            <p>
                              <span className="text-blue-500 cursor-pointer">
                                {reply.content.split(" ", 2)[0]}
                              </span>{" "}
                              <span className="text-black">
                                {reply.content.split(" ", 2)[1]}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-4 fixed bottom-0 right-0 w-1/3 p-4 border-t">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="Bình luận..."
            className="w-full px-2 py-1 border-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={value.trim() === ""}
            className="disabled:opacity-50"
          >
            <span className="text-blue-500 font-semibold">Đăng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostViewModalContent;
