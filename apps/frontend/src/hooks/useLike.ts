import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSocket } from "@/app/features/socket/SocketProvider";
import { useEffect } from "react";
import { Like } from "@/types/like.type";

export function useToggleLike() {
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
  });
}

export function useRealtimeLikes(
  targetId: string,
  onLikeUpdate: (data: Like) => void
) {
  const socket = useSocket();

  useEffect(() => {
    if (!targetId) return;

    socket.emit("join_room", targetId);

    const handler = (data: Like) => {
      if (data.targetId === targetId) {
        onLikeUpdate(data);
      }
    };

    socket.on("like_updated", handler);

    return () => {
      socket.emit("leave_room", targetId);
      socket.off("like_updated", handler);
    };
  }, [socket, targetId, onLikeUpdate]);
}
