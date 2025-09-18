import { create } from "zustand";
/* eslint-disable @typescript-eslint/no-explicit-any */

interface ModalState {
  open: boolean;
  type: string; // Động: "post", "login", "comment", etc.
  data: any; // Props truyền vào modal (e.g., { media, caption })
  setModal: (type: string, data?: any) => void; // Mở modal với type/data
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  open: false,
  type: "",
  data: null,
  setModal: (type: string, data = null) => set({ open: true, type, data }),
  closeModal: () => set({ open: false, type: "", data: null }),
}));

export default useModalStore;
