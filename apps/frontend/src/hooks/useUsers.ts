"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/types/user.type";

// Lấy tất cả users
export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/user");
      return res.data;
    },
  });
}

// Lấy profile user hiện tại (dựa vào accessToken + refresh token interceptor)
export function useUserProfile() {
  return useQuery<User>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data;
    },
  });
}

// CRUD cho user
export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<User>) =>
      api.post("/user", data).then((res) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<User>) =>
      api.patch(`/user/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/user/${id}`).then((res) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
