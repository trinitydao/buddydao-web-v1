'use client';
import { create } from 'zustand';

export interface ApproveModalState {
  isOpen: boolean;
  tokenAddress?: `0x${string}`;
  open: (arsg: { tokenAddress: `0x${string}` }) => void;
  close: () => void;
}

export const useApproveModalStore = create<ApproveModalState>()((set) => ({
  isOpen: false,
  open: ({ tokenAddress }) => set((state) => ({ ...state, isOpen: true, tokenAddress })),
  close: () => set((state) => ({ ...state, isOpen: false })),
}));
