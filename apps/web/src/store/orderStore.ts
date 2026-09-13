import { create } from 'zustand';

interface OrderState {
  lastOrder: any | null;
  setLastOrder: (o: any) => void;
}

export const useOrder = create<OrderState>()((set) => ({
  lastOrder: null,
  setLastOrder: (lastOrder) => set({ lastOrder }),
}));
