import { create } from "zustand";
/* eslint-disable @typescript-eslint/no-explicit-any */

interface ModalState {
  open: boolean;
  type: string; // Động: "post", "login", "comment", etc.
  data: any; // Props truyền vào modal (e.g., { media, caption })
  action?: string; // 👈 thêm field mới (tùy chọn)
  setModal: (type: string, data?: any, action?: string) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  open: false,
  type: "",
  data: null,
  action: undefined,
  setModal: (type: string, data = null, action) => set({ open: true, type, data, action }),
  closeModal: () => set({ open: false, type: "", data: null, action: undefined }),
}));

export default useModalStore;
