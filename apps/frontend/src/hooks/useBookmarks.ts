// hooks/useBookmarks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Post } from "@/types/post.type";

export function useBookmarks() {
    return useQuery({
        queryKey: ["bookmarks"],
        queryFn: async () => {
            const res = await api.get<Post[]>("/bookmarks");
            return res.data;
        },
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
            const res = await api.get<{ isBookmarked: boolean }>(
                `/bookmarks/${postId}/check`
            );
            return res.data;
        },
        enabled: !!postId,
    });
}
