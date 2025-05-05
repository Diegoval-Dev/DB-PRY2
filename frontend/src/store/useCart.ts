import { create } from 'zustand';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    const existing = get().items.find((i) => i.menuItemId === item.menuItemId);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ items: [...get().items, item] });
    }
  },
  removeItem: (id) => set({ items: get().items.filter((i) => i.menuItemId !== id) }),
  clearCart: () => set({ items: [] }),
  get total() {
    return get().items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  },
  get itemCount() {
    return get().items.reduce((acc, i) => acc + i.quantity, 0);
  },
}));