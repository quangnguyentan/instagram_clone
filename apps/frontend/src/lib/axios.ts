/* eslint-disable @typescript-eslint/no-unused-vars */

import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080", // backend NestJS
  withCredentials: true, // để gửi cookie refresh token
});

// Interceptor request -> gắn accessToken
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response -> xử lý 401 refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshRes = await api.get<{ accessToken: string }>(
          "/auth/refresh"
        );
        const newToken = refreshRes.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        // retry lại request gốc
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
