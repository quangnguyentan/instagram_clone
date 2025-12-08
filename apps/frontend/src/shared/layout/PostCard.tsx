"use client";
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
import { useToggleLike, useRealtimeLikes } from "@/hooks/useLike";
import useOpenModal from "@/hooks/useOpenModal";
import {
  useCheckBookmark,
  useCreateBookmark,
  useDeleteBookmark,
} from "@/hooks/useBookmarks";

import { usePostState } from "@/hooks/usePostState";

const PostCard = ({ post }: { post: PostType }) => {
  const { user } = useAuthStore();
  const { data: comments = [] } = useComments(post._id);
  const { data: bookmark } = useCheckBookmark(post._id);

  const createMutation = useCreateComment();
  const updateMutation = useUpdateComment();
  const deleteMutation = useDeleteComment();
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();
  const { openModal } = useOpenModal();

  const {
    isLiked,
    likesCount,
    isBookmarked,
    comments: storeComments,
    setLike,
    setLikesCount,
    setBookmark,
    toggleComment,
    removeComment,
    replaceComment,
    handleLikePostToggle,
  } = usePostState(post, user, bookmark);
  useRealtimeComments(post._id);
  useRealtimeLikes(post._id, (data) => {
    if (data.targetType === "post" && data.targetId === post._id) {
      setLikesCount(post._id, data.likesCount);
      setLike(
        post._id,
        user ? data.likes?.some((likeUser) => likeUser === user._id) : false
      );
    }
  });

  const handleSavePostToggle = () => {
    if (isBookmarked) {
      setBookmark(post._id, false);
      deleteBookmark.mutate(post._id, {
        onError: () => setBookmark(post._id, true),
      });
    } else {
      setBookmark(post._id, true);
      createBookmark.mutate(post._id, {
        onError: () => setBookmark(post._id, false),
      });
    }
  };
  const handleOpenCommentModal = () => {
    openModal(
      "comment",
      {
        user: post.user,
        post,
        media: post.media,
        // comments: storeComments,
        // likesCount,
        // isLiked,
        // isBookmarked,
        // onLike: handleLikePost,
        // onSave: handleSavePostToggle,
      },
      "focus"
    );
  };

  const handleCommentSubmit = (content: string) => {
    if (!user?._id || !post._id) return;

    const tempCommentId = toggleComment(content);

    createMutation.mutate(
      {
        post: post._id,
        user: user._id,
        content,
      },
      {
        onSuccess: (newComment) => {
          // Replace temporary comment with real comment
          if (tempCommentId) {
            replaceComment(tempCommentId, newComment);
          }
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
    <div className="w-full">
      <PostHeader user={post.user} createdAt={post.createdAt} />
      <PostMedia media={post.media} />
      <PostActions
        liked={isLiked}
        onLike={() => handleLikePostToggle(post._id, user?._id as string)}
        onComment={handleOpenCommentModal}
        onShare={() => {}}
        onSave={handleSavePostToggle}
        isBookmarked={isBookmarked}
      />
      <PostLikes count={likesCount} />
      <PostCaption user={post.user} caption={post.caption || ""} />
      <PostCommentsPreview
        comments={comments}
        onUpdate={(id, content) =>
          updateMutation.mutate({ id, data: { content } })
        }
        onDelete={(id) => deleteMutation.mutate({ id, postId: post._id })}
        onLike={(id, likes) => {
          if (!user?._id) return;
          const isLiked = likes.includes(user._id);
          const newLikes = isLiked
            ? likes.filter((uid) => uid !== user._id)
            : [...likes, user._id];
          updateMutation.mutate({ id, data: { likes: newLikes } });
        }}
        handleOpenCommentModal={handleOpenCommentModal}
      />
      <PostAddComment onSubmit={handleCommentSubmit} />
    </div>
  );
};

export default PostCard;
