import { TableBorrower } from '@/services/contracts/buddyDao/lenders/getLenders';
import { create } from 'zustand';

export interface RepaymentModalState {
  isOpen: boolean;
  lender?: TableBorrower;
  payAmount: string;
  open: (args: { lender: TableBorrower }) => void;
  close: () => void;
  setPayAmount: (payAmount: string) => void;
}

export const useRepaymentModalStore = create<RepaymentModalState>()((set) => ({
  isOpen: false,
  payAmount: '0',
  open: ({ lender }) => set((state) => ({ ...state, isOpen: true, lender, payAmount: '0' })),
  close: () => set((state) => ({ ...state, isOpen: false })),
  setPayAmount: (payAmount: string) => set((state) => ({ ...state, payAmount })),
}));
