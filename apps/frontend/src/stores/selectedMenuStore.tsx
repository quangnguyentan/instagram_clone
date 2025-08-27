// stores/counterStore.ts

import { create } from "zustand";

interface SelectedMenuState {
  selected: string;
  setSelected: (value: string) => void;
  resetSelected: () => void;
}

const useSeletedMenuStore = create<SelectedMenuState>((set) => ({
  selected: "Trang chủ",
  setSelected: (value: string) => set({ selected: value }),
  resetSelected: () => set({ selected: "Trang chủ" }),
}));

export default useSeletedMenuStore;
