import { useSyncExternalStore } from "react";
import { Product } from "../data/mockData";
import { useProducts } from "./productStore";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoredItem {
  id: string;
  quantity: number;
}

// FRONTEND DEMO: the cart is kept in localStorage so it survives a page refresh.
// Only product ids and quantities are stored; product data is re-read from the catalog
// (productStore) so prices, stock and uploaded photos stay current.
const KEY = "fgt.cart.v1";

function load(): StoredItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StoredItem[];
  } catch {
    /* storage unavailable or corrupt: start with an empty cart */
  }
  return [];
}

let globalCart: StoredItem[] = load();
const listeners = new Set<() => void>();

function commit(next: StoredItem[]) {
  globalCart = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(globalCart));
  } catch {
    /* ignore quota / private-mode errors */
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Never let the cart hold more units than are in stock.
const cap = (product: Product, qty: number) =>
  Math.max(1, Math.min(qty, product.stock > 0 ? product.stock : qty));

export function useCart() {
  const stored = useSyncExternalStore(subscribe, () => globalCart);
  const { products } = useProducts();

  // Resolve ids against the live catalog; items whose product was deleted are dropped.
  const cart: CartItem[] = stored.flatMap((i) => {
    const product = products.find((p) => p.id === i.id);
    return product ? [{ product, quantity: cap(product, i.quantity) }] : [];
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    const existing = globalCart.find((i) => i.id === product.id);
    commit(
      existing
        ? globalCart.map((i) =>
            i.id === product.id
              ? { ...i, quantity: cap(product, i.quantity + quantity) }
              : i,
          )
        : [...globalCart, { id: product.id, quantity: cap(product, quantity) }],
    );
  };

  const removeFromCart = (productId: string) => {
    commit(globalCart.filter((i) => i.id !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    commit(
      globalCart.map((i) =>
        i.id === productId
          ? { ...i, quantity: product ? cap(product, qty) : qty }
          : i,
      ),
    );
  };

  const clearCart = () => commit([]);

  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    count,
  };
}
