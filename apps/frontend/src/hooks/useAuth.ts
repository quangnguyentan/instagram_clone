// hooks/useAuth.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export function useLogin() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("accessToken", res.data.accessToken);
      return res.data;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { email: string; password: string; username: string }) =>
      api.post("/auth/register", data).then((res) => res.data),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () =>
      api.post("/auth/logout").then((res) => {
        localStorage.removeItem("accessToken");
        return res.data;
      }),
  });
}

// Optional: check login state
export function useRefresh() {
  return useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: async () => {
      const res = await api.get("/auth/refresh");
      localStorage.setItem("accessToken", res.data.accessToken);
      return res.data;
    },
    enabled: false, // gọi thủ công khi cần
  });
}
