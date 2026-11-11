'use client';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { CartLineInput } from './commerce/adapter';
import { localCart } from './commerce/local-cart';
import type { Cart, CartLine } from './commerce/types';

/** localStorage encapsulé : repli en mémoire si le navigateur le refuse. */
const memory = new Map<string, string>();
const safeStorage: StateStorage = {
  getItem(name) {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return memory.get(name) ?? null;
    }
  },
  setItem(name, value) {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      memory.set(name, value);
    }
  },
  removeItem(name) {
    try {
      window.localStorage.removeItem(name);
    } catch {
      memory.delete(name);
    }
  },
};

interface CartState {
  cart: Cart;
  hydrated: boolean;
  drawerOpen: boolean;
  lastAdded: CartLine | null;
  add(line: CartLineInput, qty?: number): void;
  setQuantity(lineId: string, qty: number): void;
  remove(lineId: string): void;
  openDrawer(): void;
  closeDrawer(): void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: localCart.createCart(),
      hydrated: false,
      drawerOpen: false,
      lastAdded: null,
      add(line, qty = 1) {
        const cart = localCart.addLine(get().cart, line, qty);
        const added = cart.lines.find((l) => l.sku === line.sku && JSON.stringify(l.attributes) === JSON.stringify(line.attributes));
        set({ cart, drawerOpen: true, lastAdded: added ?? null });
      },
      setQuantity(lineId, qty) {
        set({ cart: localCart.updateLine(get().cart, lineId, qty) });
      },
      remove(lineId) {
        set({ cart: localCart.removeLine(get().cart, lineId) });
      },
      openDrawer: () => set({ drawerOpen: true, lastAdded: null }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: 'savignac-panier',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ cart: s.cart }),
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useCart.setState({ hydrated: true });
      },
    },
  ),
);
