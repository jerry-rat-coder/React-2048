import { create } from "zustand";

interface IModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useModal = create<IModalStore>((set) => ({
  isOpen: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
