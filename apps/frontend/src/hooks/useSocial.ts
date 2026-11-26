"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  DirectChat,
  DirectMessage,
  Reel,
  ReelComment,
  Report,
  SocialNotification,
  Story,
} from "@/types/social.type";

function mergeMessages(...batches: DirectMessage[][]) {
  const uniqueMessages = new Map<string, DirectMessage>();
  batches.flat().forEach((message) => uniqueMessages.set(message._id, message));
  return Array.from(uniqueMessages.values()).sort(
    (left, right) =>
      Date.parse(left.createdAt) - Date.parse(right.createdAt),
  );
}

export function useStoriesFeed() {
  return useQuery<Story[]>({
    queryKey: ["stories", "feed"],
    queryFn: async () => (await api.get<Story[]>("/story/feed")).data,
  });
}

export function useCreateStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) =>
      (await api.post<Story>("/story", formData)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stories"] }),
  });
}

export function useMarkStoryViewed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (storyId: string) =>
      (await api.post<Story>(`/story/${storyId}/view`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stories"] }),
  });
}

export function useReelsFeed(page = 1, limit = 20) {
  return useQuery<{ docs: Reel[]; total: number; page: number }>({
    queryKey: ["reels", page, limit],
    queryFn: async () =>
      (
        await api.get<{ docs: Reel[]; total: number; page: number }>(
          "/reel/feed",
          { params: { page, limit } },
        )
      ).data,
  });
}

export function useReelsByUser(userId: string, enabled = true) {
  return useQuery<{ docs: Reel[]; total: number; page: number }>({
    queryKey: ["user-reels", userId],
    queryFn: async () =>
      (
        await api.get<{ docs: Reel[]; total: number; page: number }>(
          `/reel/user/${userId}`,
        )
      ).data,
    enabled: !!userId && enabled,
  });
}

export function useCreateReel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) =>
      (await api.post<Reel>("/reel", formData)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reels"] }),
  });
}

export function useReelComments(reelId: string, enabled = true) {
  return useQuery<ReelComment[]>({
    queryKey: ["reel-comments", reelId],
    queryFn: async () =>
      (
        await api.get<ReelComment[]>(`/comment/reel/${reelId}`)
      ).data,
    enabled: !!reelId && enabled,
  });
}

export function useCreateReelComment(reelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) =>
      (
        await api.post<ReelComment>(`/comment/reel/${reelId}`, { content })
      ).data,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["reel-comments", reelId],
      }),
  });
}

export function useNotifications() {
  return useQuery<SocialNotification[]>({
    queryKey: ["notifications"],
    queryFn: async () =>
      (await api.get<SocialNotification[]>("/notification")).data,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await api.put<SocialNotification>(`/notification/${id}/read`)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await api.put<{ modifiedCount: number }>("/notification/read-all")).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useChats(enabled = true) {
  return useQuery<DirectChat[]>({
    queryKey: ["chats"],
    queryFn: async () => (await api.get<DirectChat[]>("/chat")).data,
    enabled,
    refetchInterval: enabled ? 15000 : false,
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recipientId: string) =>
      (
        await api.post<DirectChat>("/chat", { recipientId })
      ).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chats"] }),
  });
}

export function useMessages(chatId: string) {
  const queryClient = useQueryClient();
  return useQuery<DirectMessage[]>({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const { data } = await api.get<
        DirectMessage[] | { data: DirectMessage[] }
      >(`/message/chat/${chatId}`);
      const fetchedMessages = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : null;
      if (!fetchedMessages) throw new Error("Invalid messages response");
      const cachedMessages =
        queryClient.getQueryData<DirectMessage[]>(["messages", chatId]) ?? [];
      return mergeMessages(cachedMessages, fetchedMessages);
    },
    enabled: !!chatId,
    refetchInterval: chatId ? 5000 : false,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      chatId: string;
      content: string;
      mediaUrl?: string;
    }) =>
      (await api.post<DirectMessage>("/message", data)).data,
    onSuccess: (message) => {
      queryClient.setQueryData<DirectMessage[]>(
        ["messages", message.chatId],
        (currentMessages = []) => mergeMessages(currentMessages, [message]),
      );
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

export function useSubmitReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (report: {
      targetType: Report["targetType"];
      targetId: string;
      reason: string;
    }) => (await api.post<Report>("/reports", report)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });
}
