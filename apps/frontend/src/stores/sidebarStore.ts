// stores/sidebarStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
    isOpenLabel: boolean;
    setIsOpenLabel: (value: boolean) => void;
    resetSidebar: () => void;
}

const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            isOpenLabel: true,
            setIsOpenLabel: (value) => set({ isOpenLabel: value }),
            resetSidebar: () => set({ isOpenLabel: true }),
        }),
        {
            name: "sidebar-store",
        }
    )
);

export default useSidebarStore;
