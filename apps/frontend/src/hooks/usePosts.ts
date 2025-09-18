// hooks/usePosts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PaginatedResponse, Post } from "@/types/post.type";

export function usePosts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["posts", page, limit],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Post>>(
        `/posts?page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => api.get(`/posts/${id}`).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
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
      const res = await api.put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
