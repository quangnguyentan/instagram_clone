/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { isMobile } from "react-device-detect";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useContext } from "react";
import { NotificationContext } from "@/providers/NotificationProvider";
import { useNavigate } from "@/hooks/useNavigate";
import { useSocket } from "@/providers/SocketProvider";

export function useLogin() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const setSessionId = useAuthStore((s) => s.setSessionId);
  const notifyRef = useContext(NotificationContext);
  const socket = useSocket();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post("/auth/login", {
        ...data,
        deviceType: isMobile ? "mobile" : "desktop",
        userAgent: navigator.userAgent,
        socketId: socket?.id,
      });
      return res.data;
    },
    onSuccess: (data: any) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      setSessionId(data.sessionId);
      if (notifyRef && notifyRef.current) {
        notifyRef.current.success({
          message: "Đăng nhập thành công",
          description: "Bạn đã đăng nhập thành công",
        });
      }
    },
    onError: (error: any) => {
      if (notifyRef && notifyRef.current) {
        notifyRef.current.error({
          message: "Đăng nhập thất bại",
          description:
            error?.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập",
        });
      }
    },
  });
}

export function useRegister() {
  const notifyRef = useContext(NotificationContext);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      username: string;
      fullname: string;
    }) => {
      const res = await api.post("/auth/register", data);
      return res.data;
    },
    onSuccess: () => {
      if (notifyRef && notifyRef.current) {
        notifyRef.current.success({
          message: "Đăng ký thành công",
          description: "Bạn đã đăng ký thành công",
        });
      }
      navigate("/");
    },
    onError: (error: any) => {
      if (notifyRef && notifyRef.current) {
        notifyRef.current.error({
          message: "Đăng ký thất bại",
          description:
            error?.response?.data?.message || "Đã xảy ra lỗi khi đăng ký",
        });
      }
    },
  });
}

export function useLogout() {
  const notifyRef = useContext(NotificationContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/logout", {}, { withCredentials: true });
      return res.data;
    },
    onSuccess: () => {
      useAuthStore.getState().logout();
      if (notifyRef && notifyRef.current) {
        notifyRef.current.success({
          message: "Đăng xuất thành công",
          description: "Bạn đã đăng xuất khỏi hệ thống",
        });
      }
      queryClient.invalidateQueries(); // Làm mới dữ liệu
      navigate("/"); // Điều hướng mượt mà
    },
    onError: (error: any) => {
      if (notifyRef && notifyRef.current) {
        notifyRef.current.error({
          message: "Đăng xuất thất bại",
          description: error?.response?.data?.message || "Có lỗi khi đăng xuất",
        });
      }
    },
  });
}

// Optional: check login state
export function useRefresh() {
  return useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: async () => {
      const res = await api.get<{ accessToken: string }>("/auth/refresh");
      useAuthStore.getState().setAccessToken(res.data.accessToken);
      return res.data;
    },
    enabled: false, // gọi thủ công khi cần
  });
}
