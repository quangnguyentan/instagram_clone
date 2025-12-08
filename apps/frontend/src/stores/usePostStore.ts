import { create } from "zustand";
import { Comment } from "@/types/comment.type";

interface PostState {
    likesCount: Record<string, number>; // postId -> count
    isLiked: Record<string, boolean>; // postId -> boolean
    isBookmarked: Record<string, boolean>; // postId -> boolean
    comments: Record<string, Comment[]>; // postId -> array of comments

    setLike: (postId: string, liked: boolean) => void;
    setLikesCount: (postId: string, count: number) => void;
    toggleLike: (postId: string) => void;
    setBookmark: (postId: string, bookmarked: boolean) => void;
    addComment: (postId: string, comment: Comment) => void;
    removeComment: (postId: string, commentId: string) => void;
    setComments: (postId: string, comments: Comment[]) => void; // New function to sync comments
}

export const usePostStore = create<PostState>((set) => ({
    likesCount: {},
    isLiked: {},
    isBookmarked: {},
    comments: {},

    setLike: (postId, liked) =>
        set((state) => ({
            isLiked: { ...state.isLiked, [postId]: liked },
        })),

    setLikesCount: (postId, count) =>
        set((state) => ({
            likesCount: { ...state.likesCount, [postId]: count },
        })),

    toggleLike: (postId) =>
        set((state) => {
            const prevLiked = state.isLiked[postId] ?? false;
            const prevCount = state.likesCount[postId] ?? 0;
            return {
                isLiked: { ...state.isLiked, [postId]: !prevLiked },
                likesCount: {
                    ...state.likesCount,
                    [postId]: prevLiked ? prevCount - 1 : prevCount + 1,
                },
            };
        }),

    setBookmark: (postId, bookmarked) =>
        set((state) => ({
            isBookmarked: { ...state.isBookmarked, [postId]: bookmarked },
        })),

    addComment: (postId, comment) =>
        set((state) => ({
            comments: {
                ...state.comments,
                [postId]: [...(state.comments[postId] || []), comment],
            },
        })),

    removeComment: (postId, commentId) =>
        set((state) => ({
            comments: {
                ...state.comments,
                [postId]: (state.comments[postId] || []).filter(
                    (comment) => comment._id !== commentId
                ),
            },
        })),

    setComments: (postId, comments) =>
        set((state) => ({
            comments: {
                ...state.comments,
                [postId]: comments,
            },
        })),
}));