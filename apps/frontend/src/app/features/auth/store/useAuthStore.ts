// stores/auth.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import CryptoJS from "crypto-js";
import { User } from "@/types/user.type";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

const SECRET = process.env.NEXT_PUBLIC_AUTH_SECRET || "my-secret-key";

const encryptedStorage = {
  getItem: (name: string): string | null => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(str, SECRET);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (err) {
      console.error("Decrypt error:", err);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      const encrypted = CryptoJS.AES.encrypt(value, SECRET).toString();
      localStorage.setItem(name, encrypted);
    } catch (err) {
      console.error("Encrypt error:", err);
    }
  },
  removeItem: (name: string): void => localStorage.removeItem(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => {
        set({ user: null, accessToken: null }); // Reset trạng thái
        encryptedStorage.removeItem("auth-storage"); // Xóa key auth-storage khỏi localStorage
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => encryptedStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);
