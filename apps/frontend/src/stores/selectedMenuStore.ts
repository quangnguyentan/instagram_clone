// stores/selectedMenuStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectedMenuState {
  selected: string;
  setSelected: (value: string) => void;
  resetSelected: () => void;
}

const useSeletedMenuStore = create<SelectedMenuState>()(
  persist(
    (set) => ({
      selected: "Trang chủ",
      setSelected: (value: string) => set({ selected: value }),
      resetSelected: () => set({ selected: "Trang chủ" }),
    }),
    {
      name: "selected-menu",
    }
  )
);

export default useSeletedMenuStore;
