// hooks/useBookmarks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Post } from "@/types/post.type";
import { ApiResponse } from "@/types/api.type";
import { Reel } from "@/types/social.type";

export function useBookmarks(enabled = true) {
    return useQuery({
        queryKey: ["bookmarks"],
        queryFn: async () => {
            const res = await api.get<
                ApiResponse<Array<{ post: Post | null }>>
            >("/bookmarks");
            return res.data.data.flatMap((bookmark) =>
                bookmark.post ? [bookmark.post] : []
            );
        },
        enabled,
    });
}

export function useCreateBookmark() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (postId: string) => {
            const res = await api.post(`/bookmarks/${postId}`);
            console.log(res, "res create");

            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        },
    });
}

export function useDeleteBookmark() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (postId: string) => {
            const res = await api.delete(`/bookmarks/${postId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        },
    });
}

export function useCheckBookmark(postId: string) {
    return useQuery({
        queryKey: ["bookmarks", "check", postId],
        queryFn: async () => {
            const res = await api.get<ApiResponse<{ isBookmarked: boolean }>>(
                `/bookmarks/${postId}/check`
            );
            return res.data.data;
        },
        enabled: !!postId,
    });
}

export function useCreateReelBookmark() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (reelId: string) =>
            (await api.post(`/bookmarks/reel/${reelId}`)).data,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["bookmarks", "reels"] }),
    });
}

export function useDeleteReelBookmark() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (reelId: string) =>
            (await api.delete(`/bookmarks/reel/${reelId}`)).data,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["bookmarks", "reels"] }),
    });
}

export function useReelBookmarks() {
    return useQuery({
        queryKey: ["bookmarks", "reels"],
        queryFn: async () => {
            const res = await api.get<
                ApiResponse<Array<{ reel: Pick<Reel, "_id"> | null }>>
            >("/bookmarks");
            return res.data.data.flatMap((bookmark) =>
                bookmark.reel ? [bookmark.reel._id] : []
            );
        },
    });
}
