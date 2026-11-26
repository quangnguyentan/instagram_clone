"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { globalLogout } from "@/lib/logoutHandler";
import api from "@/lib/axios";

const SocketContext = createContext<Socket | null>(null);
let refreshPromise: Promise<string> | null = null;

function refreshSocketToken() {
  if (!refreshPromise) {
    refreshPromise = api
      .get<{ accessToken: string }>("/auth/refresh")
      .then((response) => response.data.accessToken)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const socket = useMemo(
    () =>
      io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", {
        autoConnect: false,
        auth: { token: accessToken },
      }),
    [accessToken],
  );

  useEffect(() => {
    if (!accessToken) return;

    const handleAuthError = (error: { message?: string }) => {
      const currentSession = useAuthStore.getState();
      if (
        currentSession.accessToken !== accessToken ||
        currentSession.isManualLogout ||
        currentSession.isAuthenticating
      ) {
        return;
      }
      void refreshSocketToken()
        .then((refreshedToken) => {
          const latestSession = useAuthStore.getState();
          if (
            latestSession.accessToken === accessToken &&
            !latestSession.isManualLogout &&
            !latestSession.isAuthenticating
          ) {
            latestSession.setAccessToken(refreshedToken);
          }
        })
        .catch(() => {
          const latestSession = useAuthStore.getState();
          if (
            latestSession.accessToken === accessToken &&
            !latestSession.isManualLogout &&
            !latestSession.isAuthenticating
          ) {
            globalLogout(error.message || "Phiên đăng nhập socket không hợp lệ");
          }
        });
    };
    const handleForceLogout = (
      payload?: string | { reason?: string; sessionId?: string },
    ) => {
      const currentSession = useAuthStore.getState();
      if (
        currentSession.accessToken !== accessToken ||
        currentSession.isManualLogout ||
        currentSession.isAuthenticating
      ) {
        return;
      }
      if (
        typeof payload === "object" &&
        payload?.sessionId &&
        currentSession.sessionId !== payload.sessionId
      ) {
        return;
      }
      globalLogout(
        typeof payload === "string"
          ? payload
          : payload?.reason || "Phiên đăng nhập đã bị thu hồi",
      );
    };

    socket.auth = { token: accessToken };
    socket.on("auth_error", handleAuthError);
    socket.on("force_logout", handleForceLogout);
    socket.connect();

    return () => {
      socket.off("auth_error", handleAuthError);
      socket.off("force_logout", handleForceLogout);
      socket.disconnect();
    };
  }, [accessToken, socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
}
