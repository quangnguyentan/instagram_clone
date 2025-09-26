import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSocket } from "@/app/features/socket/SocketProvider";
import { useEffect } from "react";
import { Like } from "@/types/like.type";

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      targetType,
      targetId,
      userId,
    }: {
      targetType: "post" | "comment" | "reel" | "story";
      targetId: string;
      userId: string;
    }) => {
      const res = await api.post<Like>("/likes/toggle", {
        targetType,
        targetId,
        userId,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["likes", data.targetId], data);
    },
  });
}

export function useRealtimeLikes(
  targetId: string,
  onLikeUpdate: (data: Like) => void
) {
  const socket = useSocket();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!targetId) return;

    socket.emit("join_room", targetId);

    const handler = (data: Like) => {
      if (data.targetId === targetId) {
        onLikeUpdate(data);
        queryClient.setQueryData(["likes", data.targetId], data);
      }
    };

    socket.on("like_updated", handler);

    return () => {
      socket.emit("leave_room", targetId);
      socket.off("like_updated", handler);
    };
  }, [socket, targetId, onLikeUpdate, queryClient]);
}
