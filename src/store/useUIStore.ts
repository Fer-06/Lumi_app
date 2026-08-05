import { create } from "zustand";

interface UIState {
  isTaskModalOpen: boolean;
  openTaskModal: () => void;
  closeTaskModal: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isTaskModalOpen: false,
  openTaskModal: () => set({ isTaskModalOpen: true }),
  closeTaskModal: () => set({ isTaskModalOpen: false }),
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
