/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/lib/axios"; // axios instance đã config baseURL + token
import { Comment } from "@/types/comment.type";
import { useSocket } from "@/app/features/socket/SocketProvider";

// API
const fetchComments = async (postId: string): Promise<Comment[]> => {
  const res = await api.get<Comment[]>(`/comment/post/${postId}`);
  return res.data;
};

const createComment = async (data: {
  post: string;
  user: string;
  content: string;
  parent?: string | null;
}): Promise<Comment> => {
  const res = await api.post<Comment>("/comment", data);
  return res.data;
};

const updateComment = async (
  id: string,
  data: { content?: string; likes?: string[] }
): Promise<Comment> => {
  const res = await api.patch<Comment>(`/comment/${id}`, data);
  return res.data;
};

const deleteComment = async (id: string): Promise<{ id: string }> => {
  const res = await api.delete<{ id: string }>(`/comment/${id}`);
  return res.data;
};

// Hooks
export function useComments(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", newComment.post],
      });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { content?: string; likes?: string[] };
    }) => updateComment(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["comments", updated.post] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; postId: string }) => deleteComment(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
  });
}
export function useRealtimeComments(postId: string) {
  const queryClient = useQueryClient();
  const socket = useSocket();
  useEffect(() => {
    if (!postId) return;

    socket.emit("join_room", postId);

    socket.on("comment.created", (comment: Comment) => {
      if (comment.post._id !== postId) return;
      queryClient.setQueryData<Comment[]>(["comments", postId], (old = []) => [
        ...old,
        comment,
      ]);
    });

    socket.on("comment.updated", (comment: Comment) => {
      if (comment.post?._id !== postId) return;
      queryClient.setQueryData<Comment[]>(["comments", postId], (old = []) =>
        old.map((c) => (c._id === comment._id ? comment : c))
      );
    });

    socket.on("comment.deleted", ({ id, postId: deletedPostId }) => {
      if (deletedPostId !== postId) return;
      queryClient.setQueryData<Comment[]>(["comments", postId], (old = []) =>
        old.filter((c) => c._id !== id)
      );
    });

    return () => {
      socket.emit("leave_room", postId);
      socket.off("comment.created");
      socket.off("comment.updated");
      socket.off("comment.deleted");
    };
  }, [postId, queryClient]);
}
