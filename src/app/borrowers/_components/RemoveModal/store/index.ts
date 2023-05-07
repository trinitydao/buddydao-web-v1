import { create } from 'zustand';
import { TableLender } from '@/services/contracts/buddyDao/borrowers/getBorrower';

export interface RemoveModalState {
  isOpen: boolean;
  borrower?: TableLender;
  open: (args: { borrower: TableLender }) => void;
  close: () => void;
}

export const useRemoveModalStore = create<RemoveModalState>()((set) => ({
  isOpen: false,
  open: ({ borrower }) => set((state) => ({ ...state, isOpen: true, borrower })),
  close: () => set((state) => ({ ...state, isOpen: false })),
}));
