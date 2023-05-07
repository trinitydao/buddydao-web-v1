import { TableBorrower } from '@/services/contracts/buddyDao/lenders/getLenders';
import { create } from 'zustand';

export interface BorrowModalState {
  isOpen: boolean;
  lender?: TableBorrower;
  open: (args: { lender: TableBorrower }) => void;
  close: () => void;
}

export const useBorrowModalStore = create<BorrowModalState>()((set) => ({
  isOpen: false,
  open: ({ lender }) => set((state) => ({ ...state, isOpen: true, lender })),
  close: () => set((state) => ({ ...state, isOpen: false })),
}));
