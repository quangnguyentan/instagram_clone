// SocketProvider.tsx
"use client";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  // chỉ tạo socket 1 lần duy nhất
  const socket = useMemo(
    () =>
      io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080", {
        transports: ["websocket"],
      }),
    []
  );

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
};
