import { useSyncExternalStore } from "react";
import { products as seedProducts, Product } from "../data/mockData";
import { resolveMedia, toStoredValue, isMediaRef } from "./mediaStore";

// Single source of truth for the product catalog. The admin portal edits it and the
// storefront reads it, so changes show up on the site immediately.
//
// FRONTEND DEMO: persisted in localStorage (this browser only). When the backend
// exists, replace load/persist with API calls; the hook's shape can stay the same.

const KEY = "fgt.products.v1";
const PLACEHOLDER =
  "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=600&fit=crop&auto=format";

function loadStored(): Product[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Product[];
  } catch {
    /* storage unavailable or corrupt: fall back to the demo catalog */
  }
  return seedProducts;
}

function persist(list: Product[]) {
  try {
    const stored = list.map((p) => ({
      ...p,
      image: toStoredValue(p.image),
      images: p.images?.map(toStoredValue),
      video: p.video ? toStoredValue(p.video) : undefined,
    }));
    localStorage.setItem(KEY, JSON.stringify(stored));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

let state: Product[] = loadStored().map((p) => ({
  ...p,
  // uploaded files are swapped in by hydrate() once they are read back from IndexedDB
  image: isMediaRef(p.image) ? "" : p.image,
  images: p.images?.filter((u) => !isMediaRef(u)),
  video: p.video && isMediaRef(p.video) ? undefined : p.video,
}));
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function set(next: Product[], save = true) {
  state = next;
  if (save) persist(state);
  emit();
}

async function hydrate() {
  const stored = loadStored();
  const hydrated = await Promise.all(
    stored.map(async (p) => ({
      ...p,
      image: (await resolveMedia(p.image)) || PLACEHOLDER,
      images: p.images ? await Promise.all(p.images.map(resolveMedia)) : undefined,
      video: p.video ? (await resolveMedia(p.video)) || undefined : undefined,
    })),
  );
  set(hydrated, false);
}
if (typeof window !== "undefined" && stored()) void hydrate();
function stored() {
  try {
    return !!localStorage.getItem(KEY);
  } catch {
    return false;
  }
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
const getSnapshot = () => state;

export function useProducts() {
  const products = useSyncExternalStore(subscribe, getSnapshot);
  return {
    products,
    saveProduct(product: Product) {
      const exists = state.some((p) => p.id === product.id);
      set(
        exists
          ? state.map((p) => (p.id === product.id ? product : p))
          : [product, ...state],
      );
    },
    deleteProduct(id: string) {
      set(state.filter((p) => p.id !== id));
    },
    resetProducts() {
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* ignore */
      }
      set(seedProducts, false);
    },
  };
}
