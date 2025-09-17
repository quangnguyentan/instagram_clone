/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useContext } from "react";
import { NotificationContext } from "@/providers/NotificationProvider";

export function useLogin() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const notifyRef = useContext(NotificationContext);
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data: any) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
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
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      useAuthStore.getState().logout();
      return res.data;
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
