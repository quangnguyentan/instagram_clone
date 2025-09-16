/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAuth.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "../store/useAuthStore";

export function useLogin() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data: any) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      username: string;
      fullname: string;
    }) => {
      const res = await api.post("/auth/register", data);
      console.log(res?.data);
      return res.data;
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
