import { create } from 'zustand';

export interface CartItem {
    menuItemId: string;
    restaurantId: string;
    name: string;
    price: number;
    quantity: number;
  }

  interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
  }

export const useCart = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,

  addItem: (item) => {
    const items = get().items;

    if (items.length > 0 && items[0].restaurantId !== item.restaurantId) {
      alert('Solo puedes pedir de un restaurante a la vez.');
      return;
    }

    let newItems: CartItem[];
    const existing = items.find((i) => i.menuItemId === item.menuItemId);
    if (existing) {
      newItems = items.map((i) =>
        i.menuItemId === item.menuItemId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      newItems = [...items, item];
    }

    set({
      items: newItems,
      total: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
      itemCount: newItems.reduce((acc, i) => acc + i.quantity, 0),
    });
  },

  removeItem: (id) => {
    const newItems = get().items.filter((i) => i.menuItemId !== id);
    set({
      items: newItems,
      total: newItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
      itemCount: newItems.reduce((acc, i) => acc + i.quantity, 0),
    });
  },

  clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
}));