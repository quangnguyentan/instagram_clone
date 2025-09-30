/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { globalLogout } from "@/lib/logoutHandler";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: true,
});

// attach token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle 401
let refreshTokenPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = (api
          .get<{ accessToken: string }>("/auth/refresh")
          .then((res) => {
            const newToken = res.data.accessToken;
            useAuthStore.getState().setAccessToken(newToken);
            refreshTokenPromise = null;
            return newToken; // <-- trả về string
          })
          .catch((err) => {
            refreshTokenPromise = null;
            globalLogout("Phiên đăng nhập hết hạn");
            throw err;
          })) as Promise<string>; // ép kiểu cho chắc
      }

      try {
        const newToken = await refreshTokenPromise;
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;