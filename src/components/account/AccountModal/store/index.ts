import { create } from 'zustand';

export interface AccountModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  onConnected: () => void;
}

export const useAccountModalStore = create<AccountModalState>()((set, get) => ({
  isOpen: false,
  open: () => set((state) => ({ ...state, isOpen: true })),
  close: () => set((state) => ({ ...state, isOpen: false })),
  onConnected: () => get().close(),
}));
