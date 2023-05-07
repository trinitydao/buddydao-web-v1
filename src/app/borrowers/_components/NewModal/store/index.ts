'use client';
import { create } from 'zustand';

export interface NewBorrowerFormData {
  alias: string;
  token: `0x${string}`;
  address: `0x${string}`;
  fixedRate: string;
  amount: string;
}

export interface NewModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useNewModalStore = create<NewModalState>()((set) => ({
  isOpen: false,
  open: () => set((state) => ({ ...state, isOpen: true })),
  close: () => set((state) => ({ ...state, isOpen: false })),
}));
