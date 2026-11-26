"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/types/user.type";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";

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
export function useUserProfile(enabled = true) {
  return useQuery<User>({
    queryKey: ["user-profile"],
    queryFn: async (): Promise<User> => {
      const res = await api.get("/user/profile");
      return res.data as User;
    },
    enabled,
  });
}

export function useUserById(id: string) {
  return useQuery<User>({
    queryKey: ["user-profile", id],
    queryFn: async () => {
      const res = await api.get<User>(`/user/${id}`);
      return res.data as User;
    },
    enabled: !!id,
  });
}

export function useUserByUsername(username: string) {
  return useQuery<User>({
    queryKey: ["user-profile", "username", username],
    queryFn: async () => {
      const res = await api.get<User>(`/user/username/${encodeURIComponent(username)}`);
      return res.data as User;
    },
    enabled: !!username,
  });
}

export function useUpdateOwnProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Pick<User, "username" | "fullname" | "bio" | "avatarUrl">>) => {
      const res = await api.patch<User>("/user/profile", data);
      return res.data as User;
    },
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
      qc.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}

export function useSearchUsers(query: string, enabled = true) {
  return useQuery<User[]>({
    queryKey: ["user-search", query],
    queryFn: async () => {
      const res = await api.get<User[]>("/user/search", {
        params: { q: query },
      });
      return res.data as User[];
    },
    enabled: enabled && query.trim().length > 0,
  });
}

export function useSuggestions(enabled = true) {
  return useQuery<User[]>({
    queryKey: ["suggestions"],
    queryFn: async (): Promise<User[]> => {
      const res = await api.get("/user/suggestions");
      return res.data as User[];
    },
    enabled,
  });
}

export function useFollow(targetId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<User> => {
      const res = await api.post(`/user/follow/${targetId}`);
      return res.data as User;
    },
    onSuccess: () => {
      // invalidate cache để UI tự cập nhật
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      qc.invalidateQueries({ queryKey: ["followers"] });
      qc.invalidateQueries({ queryKey: ["following"] });
    },
  });
}

export function useUnfollow(targetId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<User> => {
      const res = await api.post(`/user/unfollow/${targetId}`);
      return res.data as User;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      qc.invalidateQueries({ queryKey: ["followers"] });
      qc.invalidateQueries({ queryKey: ["following"] });
    },
  });
}

export function useGetFollowers(id: string) {
  return useQuery<User[]>({
    queryKey: ["followers", id],
    queryFn: async (): Promise<User[]> => {
      const res = await api.get(`/user/${id}/followers`);
      return res.data as User[];
    },
  });
}

export function useGetFollowing(id: string) {
  return useQuery<User[]>({
    queryKey: ["following", id],
    queryFn: async (): Promise<User[]> => {
      const res = await api.get(`/user/${id}/following`);
      return res.data as User[];
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
    }: { id: string } & Partial<User>): Promise<User> => {
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
    mutationFn: async (id: string): Promise<User> => {
      const res = await api.delete(`/user/${id}`);
      return res.data as User;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
