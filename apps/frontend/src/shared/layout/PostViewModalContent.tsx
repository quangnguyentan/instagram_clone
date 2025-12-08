"use client";
import React, { useEffect, useRef, useState } from "react";
import BaseCarousel from "../custom/BaseCarousel";
import { Media, Post } from "@/types/post.type";
import { User } from "@/types/user.type";
import Image from "next/image";
import defaultUser from "@/assets/images/default_user.svg";
import { Comment } from "@/types/comment.type";
import { useCreateComment } from "@/hooks/useComment";
import PostCaption from "./PostCaption";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import PostComment from "./PostComment";
import PostCommentInput from "./PostCommentInput";
import PostStats from "./PostStats";
import PostActions from "./PostActions";
import { usePostState } from "@/hooks/usePostState";
import useModalStore from "@/stores/modalStore";

interface PostViewModalContentProps {
  post?: Post;
  media?: Media[];
  user?: User;
}

const PostViewModalContent: React.FC<PostViewModalContentProps> = ({
  post,
  media = [],
  user,
}) => {
  const { action } = useModalStore();
  const createdPost = useTimeAgo(post?.createdAt || "0");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tagName, setTagName] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [explain, setExplain] = useState<{ [key: string]: boolean }>({});
  const createCommentMutation = useCreateComment();
  const {
    isLiked,
    likesCount,
    isBookmarked,
    comments: storeComments,
    setBookmark,
    toggleComment,
    removeComment,
    replaceComment,
    handleLikePostToggle,
  } = usePostState(post as Post, user);
  useEffect(() => {
    if (action === "focus") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [action]);
  const handleFocusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSavePostToggle = () => {
    if (!post) return;
    setBookmark(post._id, !isBookmarked);
  };

  const handleReply = (comment: Comment) => {
    const tag = `@${comment.user.username}`;
    setReplyTo(comment);
    setTagName(tag);
    setValue(`${tag} `); // thêm khoảng trắng sau tag
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === "" || !user?._id || !post?._id) return;

    // Optimistic update
    const tempCommentId = toggleComment(value, replyTo?._id);
    createCommentMutation.mutate(
      {
        post: post._id,
        user: user._id,
        content: value,
        parent: replyTo?._id || null,
      },
      {
        onSuccess: (newComment) => {
          // Replace temporary comment with real comment
          if (tempCommentId) {
            replaceComment(tempCommentId, newComment);
          }
          setValue("");
          setReplyTo(null);
        },
        onError: () => {
          // Rollback on error
          if (tempCommentId) {
            removeComment(post._id, tempCommentId);
          }
        },
      }
    );
  };

  return (
    <div className="flex w-full h-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
      <div className="media-container flex-1 bg-black flex items-center justify-center max-w-[1280px] aspect-[1/1]">
        <BaseCarousel media={media || []} arrows dots />
      </div>
      <div className="comments-container w-1/3 overflow-y-auto min-w-[300px] max-w-[33.333%] p-4 relative">
        {user && (
          <div className="flex items-center gap-2 pb-4 relative after:content-[''] after:absolute after:-left-4 after:bottom-0 after:w-[calc(100%+2rem)] after:h-[0.5px] after:bg-gray-400/80 after:opacity-20">
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
          <div className="flex flex-col gap-2 pt-4">
            <PostCaption
              user={post?.user as User}
              caption={post?.caption || ""}
            />
            <span className="text-gray-500 text-xs">{createdPost} trước</span>
          </div>
          {storeComments?.map((comment, idx) => {
            if (comment.parent) return null;
            return (
              <PostComment
                key={comment?._id || idx}
                onReply={() => handleReply(comment)}
                onToggleReplies={() =>
                  setExplain((prev) => ({
                    ...prev,
                    [comment._id]: !prev[comment._id],
                  }))
                }
                comment={comment}
                comments={storeComments}
                explain={explain}
                createdAt={comment?.createdAt}
                likesCount={likesCount}
              />
            );
          })}
        </div>
        <div className="mt-4 fixed bottom-0 right-0 w-1/3 px-3 py-2 border-t bg-white shadow">
          <PostActions
            liked={isLiked}
            onComment={handleFocusInput}
            onLike={() =>
              handleLikePostToggle(post?._id as string, user?._id as string)
            }
            onSave={handleSavePostToggle}
            onShare={() => {}}
            isBookmarked={isBookmarked}
          />
          <PostStats createdAt={createdPost} likesCount={likesCount} />
          <PostCommentInput
            ref={inputRef}
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            tagName={tagName || undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default PostViewModalContent;
