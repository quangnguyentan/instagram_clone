"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { globalLogout } from "@/lib/logoutHandler";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const { sessionId } = useAuthStore((state) => state);

  if (!socketRef.current) {
    socketRef.current = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
      { transports: ["websocket"] }
    );
  }

  const socket = socketRef.current;

  useEffect(() => {
    if (sessionId && socket.connected) {
      socket.emit("register_session", sessionId);
    }

    const handleForceLogout = (data: { reason?: string }) => {
      globalLogout(
        data?.reason || "Bạn đã bị đăng xuất do đăng nhập ở thiết bị khác."
      );
      socket.disconnect();
      socketRef.current = null;
    };

    socket.on("force_logout", handleForceLogout);

    return () => {
      socket.off("force_logout", handleForceLogout);
      if (sessionId) {
        socket.emit("unregister_session", sessionId);
      }
    };
  }, [sessionId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
};
