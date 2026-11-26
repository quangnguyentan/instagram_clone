// hooks/usePosts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PaginatedResponse, Post } from "@/types/post.type";
import { ApiResponse } from "@/types/api.type";

export function usePosts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["posts", page, limit],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedResponse<Post>>>(
        `/posts?page=${page}&limit=${limit}`
      );
      return res.data.data;
    },
  });
}

export function useFeed(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["feed", page, limit],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedResponse<Post>>>(
        `/posts/feed?page=${page}&limit=${limit}`
      );
      return res.data.data;
    },
  });
}

export function useExplorePosts(page = 1, limit = 24) {
  return useQuery({
    queryKey: ["explore-posts", page, limit],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedResponse<Post>>>(
        "/posts/explore",
        { params: { page, limit } },
      );
      return res.data.data;
    },
  });
}

export function usePostsByUser(userId: string, page = 1, limit = 30) {
  return useQuery({
    queryKey: ["user-posts", userId, page, limit],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedResponse<Post>>>(
        `/posts/user/${userId}`,
        { params: { page, limit } },
      );
      return res.data.data;
    },
    enabled: !!userId,
  });
}

export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: ["post-search", query],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedResponse<Post>>>(
        "/posts/search",
        { params: { q: query } },
      );
      return res.data.data;
    },
    enabled: query.trim().length > 0,
  });
}

export function usePost(id: string) {
  return useQuery<Post>({
    queryKey: ["posts", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Post>>(`/posts/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post("/posts", formData);
      return res.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["feed"] }),
        queryClient.invalidateQueries({ queryKey: ["explore-posts"] }),
        queryClient.invalidateQueries({ queryKey: ["user-posts"] }),
      ]);
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const res = await api.put(`/posts/${id}`, formData);
      return res.data;
    },
    onSuccess: (_, { id }) =>
      queryClient.invalidateQueries({ queryKey: ["posts", id] }),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/posts/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useToggleLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      likes,
    }: {
      postId: string;
      likes: string[];
    }) => {
      const res = await api.patch(`/posts/${postId}`, { likes });
      return res.data as Post;
    },
    onSuccess: (updated: Post) => {
      // invalidate cache post list và post detail
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", updated?._id] });
    },
  });
}
