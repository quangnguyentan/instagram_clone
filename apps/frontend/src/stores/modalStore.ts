// stores/counterStore.ts

import { create } from "zustand";

interface ModalState {
  open: boolean;
  setOpen: (value: boolean) => void;
  cancel: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  open: false,
  setOpen: (value: boolean) => set({ open: value }),
  cancel: () => set({ open: false }),
}));

export default useModalStore;
