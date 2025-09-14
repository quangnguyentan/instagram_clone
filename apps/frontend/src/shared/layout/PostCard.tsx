// src/components/Post/PostCard.tsx
import React from "react";
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

const PostCard = ({ post }: { post: PostType }) => {
  const { data: comments = [] } = useComments(post._id);
  const { user } = useAuthStore();
  console.log(comments);
  // mutations
  const createMutation = useCreateComment();
  const updateMutation = useUpdateComment();
  const deleteMutation = useDeleteComment();

  // realtime
  useRealtimeComments(post._id);

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

  return (
    <div className="w-full">
      <PostHeader user={post.user} createdAt={post.createdAt} />
      <PostMedia media={post.media} />
      <PostActions
        liked={post.likes}
        onLike={() => {}}
        onComment={() => {}}
        onShare={() => {}}
        onSave={() => {}}
      />
      <PostLikes count={post.likes?.length || 0} />
      <PostCaption user={post.user} caption={post.caption || ""} />
      <PostCommentsPreview
        comments={comments}
        onUpdate={handleUpdateComment}
        onDelete={handleDeleteComment}
      />
      <PostAddComment onSubmit={handleAddComment} />
    </div>
  );
};

export default PostCard;
