"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/types/user.type";

// Lấy tất cả users
export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const res = await api.get("/user");
      return res.data as User[];
    },
  });
}

// Lấy profile user hiện tại (dựa vào accessToken + refresh token interceptor)
export function useUserProfile() {
  return useQuery<User>({
    queryKey: ["user-profile"],
    queryFn: async (): Promise<User> => {
      const res = await api.get("/user/profile");
      return res.data as User;
    },
  });
}

// CRUD cho user
export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<User>): Promise<User> => {
      const res = await api.post("/user", data);
      return res.data as User;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: { id: number } & Partial<User>): Promise<User> => {
      const res = await api.patch(`/user/${id}`, data);
      return res.data as User;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<User> => {
      const res = await api.delete(`/user/${id}`);
      return res.data as User;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
