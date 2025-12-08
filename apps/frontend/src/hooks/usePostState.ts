/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import { Post } from "@/types/post.type";
import { User } from "@/types/user.type";
import { Comment } from "@/types/comment.type";
import { usePostStore } from "@/stores/usePostStore";
import { useQueryClient } from "@tanstack/react-query";
import { useToggleLike } from "./useLike";

export function usePostState(post: Post, user?: User | null, bookmark?: any) {
    const queryClient = useQueryClient();
    const toggleLike = useToggleLike();

    const isLikedMap = usePostStore((state) => state.isLiked);
    const likesCountMap = usePostStore((state) => state.likesCount);
    const isBookmarkedMap = usePostStore((state) => state.isBookmarked);
    const commentsMap = usePostStore((state) => state.comments);

    const toggleLikeStore = usePostStore((state) => state.toggleLike);
    const setLike = usePostStore((state) => state.setLike);
    const setLikesCount = usePostStore((state) => state.setLikesCount);
    const setBookmark = usePostStore((state) => state.setBookmark);
    const addComment = usePostStore((state) => state.addComment);
    const removeComment = usePostStore((state) => state.removeComment);
    const setComments = usePostStore((state) => state.setComments);

    useEffect(() => {
        if (!user) return;

        const liked = post.likes?.some((l) => l?._id === user._id) ?? false;
        const likeCount = post.likes?.length || 0;

        const hasInitLike = isLikedMap[post._id] !== undefined;
        const hasInitCount = likesCountMap[post._id] !== undefined;

        if (!hasInitLike) {
            setLike(post._id, liked);
        }

        if (!hasInitCount) {
            setLikesCount(post._id, likeCount);
        }

        const apiComments = queryClient.getQueryData<Comment[]>(["comments", post._id]);
        if (apiComments && (!commentsMap[post._id] || commentsMap[post._id].length === 0)) {
            const sortedComments = [...apiComments].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setComments(post._id, sortedComments);
        }
    }, [post._id, user?._id, post.likes]);

    useEffect(() => {
        const handleCommentUpdate = (comment: Comment) => {
            if (comment.post?._id === post._id) {
                const currentComments = queryClient.getQueryData<Comment[]>(["comments", post._id]) || [];
                const sortedComments = [...currentComments].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setComments(post._id, sortedComments);
            }
        };

        const socket = (window as any).__socket;
        if (socket) {
            socket.on("comment.created", handleCommentUpdate);
            socket.on("comment.updated", handleCommentUpdate);
            socket.on("comment.deleted", () => {
                const currentComments = queryClient.getQueryData<Comment[]>(["comments", post._id]) || [];
                const sortedComments = [...currentComments].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setComments(post._id, sortedComments);
            });
        }

        return () => {
            if (socket) {
                socket.off("comment.created", handleCommentUpdate);
                socket.off("comment.updated", handleCommentUpdate);
                socket.off("comment.deleted");
            }
        };
    }, [post._id, queryClient, setComments]);

    const isLiked = useMemo(() => {
        return isLikedMap[post._id] ?? false;
    }, [isLikedMap, post._id]);
    const likesCount = useMemo(() => {
        return likesCountMap[post._id] ?? 0;
    }, [likesCountMap, post._id]);

    const isBookmarked = useMemo(() => {
        return isBookmarkedMap[post._id] ?? (bookmark?.data?.isBookmarked ?? false);
    }, [isBookmarkedMap, post._id, bookmark]);

    const comments = useMemo(() => {
        return [...(commentsMap[post._id] ?? [])].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [commentsMap, post._id]);

    useEffect(() => {
        if (bookmark?.data?.isBookmarked !== undefined) {
            setBookmark(post._id, bookmark.data.isBookmarked);
        }
    }, [bookmark, post._id, setBookmark]);

    const toggleComment = (content: string, parentId?: string) => {
        if (!user?._id || !post?._id) return null;

        const tempComment: Comment = {
            _id: `temp-${Date.now()}`,
            post,
            user,
            content,
            parent: parentId ? { _id: parentId } as Comment : undefined,
            likes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        addComment(post._id, tempComment);

        return tempComment._id;
    };

    const handleLikePostToggle = (postId: string, userId: string) => {
        if (!userId) return;
        toggleLikeStore(postId);
        toggleLike.mutate({
            targetType: "post",
            targetId: post._id,
            userId: userId,
        });
    }

    const replaceComment = (tempCommentId: string, realComment: Comment) => {
        const currentComments = commentsMap[post._id] || [];
        const updatedComments = [
            ...currentComments.filter((c) => c._id !== tempCommentId),
            realComment,
        ].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setComments(post._id, updatedComments);
    };

    return {
        isLiked,
        likesCount,
        isBookmarked,
        comments,
        setLike,
        setLikesCount,
        setBookmark,
        toggleComment,
        removeComment,
        replaceComment,
        handleLikePostToggle
    };
}