"use client";
import React, { useState } from "react";
import { Post as PostType } from "@/types/post.type";
import PostMedia from "./PostMedia";
import PostActions from "./PostActions";
import PostHeader from "./PostHeader";
import PostCaption from "./PostCaption";
import PostLikes from "./PostLikes";
import PostCommentsPreview from "./PostCommentsPreview";
import PostAddComment from "./PostAddComment";

import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useRealtimeComments,
  useUpdateComment,
} from "@/hooks/useComment";
import { useToggleLike, useRealtimeLikes } from "@/hooks/useLike";
import useOpenModal from "@/hooks/useOpenModal";

const PostCard = ({ post }: { post: PostType }) => {
  const { data: comments = [] } = useComments(post._id);
  const { user } = useAuthStore();
  const toggleLike = useToggleLike();
  const createMutation = useCreateComment();
  const updateMutation = useUpdateComment();
  const deleteMutation = useDeleteComment();
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(
    user ? post.likes.includes(user._id) : false
  );
  const { openModal } = useOpenModal();

  // ... handlers

  const handleOpenCommentModal = () => {
    openModal("comment", {
      // Type động
      media: post.media,
      caption: post.caption || "",
      comments: [], // Nếu có comments từ API
    });
  };
  // comment realtime
  useRealtimeComments(post._id);

  // like realtime
  useRealtimeLikes(post._id, (data) => {
    if (data.targetType === "post" && data.targetId === post._id) {
      setLikesCount(data.likesCount);
      setIsLiked(user ? data.likes.includes(user._id) : false);
    }
  });

  const handleAddComment = (content: string) => {
    if (!user?._id) return;
    createMutation.mutate({
      post: post._id,
      user: user._id,
      content,
    });
  };

  const handleUpdateComment = (id: string, content: string) => {
    updateMutation.mutate({ id, data: { content } });
  };

  const handleDeleteComment = (id: string) => {
    deleteMutation.mutate({ id, postId: post._id });
  };

  const handleLikeComment = (id: string, likes: string[]) => {
    if (!user?._id) return;
    const isLiked = likes.includes(user._id);
    const newLikes = isLiked
      ? likes.filter((uid) => uid !== user._id)
      : [...likes, user._id];
    console.log(newLikes, "newLikes");
    updateMutation.mutate({ id, data: { likes: newLikes } });
  };

  const handleLikePost = () => {
    if (!user?._id) return;
    toggleLike.mutate({
      targetType: "post",
      targetId: post?._id,
      userId: user?._id,
    });
  };

  return (
    <div className="w-full">
      <PostHeader user={post.user} createdAt={post.createdAt} />
      <PostMedia media={post.media} />
      <PostActions
        liked={isLiked ? [user?._id || ""] : []}
        onLike={handleLikePost}
        onComment={handleOpenCommentModal}
        onShare={() => {}}
        onSave={() => {}}
      />
      <PostLikes count={likesCount} />
      <PostCaption user={post.user} caption={post.caption || ""} />
      <PostCommentsPreview
        comments={comments}
        onUpdate={handleUpdateComment}
        onDelete={handleDeleteComment}
        onLike={handleLikeComment}
      />
      <PostAddComment onSubmit={handleAddComment} />
    </div>
  );
};

export default PostCard;
