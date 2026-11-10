import { useSyncExternalStore } from "react";
import { products as seedProducts, Product } from "../data/mockData";
import { api, mediaUrl, toApiMedia } from "../lib/api";

// Single source of truth for the product catalog. The storefront reads it and the admin
// portal edits it; both talk to the backend (GET/POST/PUT/DELETE /api/products).
// The demo catalog in mockData is only shown while the backend is unreachable.

type ApiProduct = Omit<Product, "images" | "video" | "originalPrice"> & {
  images?: string[];
  video?: string | null;
  originalPrice?: number | null;
};

function fromApi(p: ApiProduct): Product {
  return {
    ...p,
    originalPrice: p.originalPrice ?? undefined,
    image: mediaUrl(p.image),
    images: p.images?.map(mediaUrl),
    video: p.video ? mediaUrl(p.video) : undefined,
  };
}

// The backend only accepts uploaded files (/uploads/...) or http(s) links, so the
// built-in "photo coming soon" placeholder (a data: URI) is left out of saves.
const sendable = (v?: string | null) => (v && !v.startsWith("data:") ? toApiMedia(v) : undefined);

function toApi(p: Product) {
  return {
    name: p.name,
    brand: p.brand,
    category: p.category,
    sku: p.sku,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    stock: p.stock,
    image: sendable(p.image),
    images: (p.images ?? []).map(sendable).filter(Boolean),
    video: sendable(p.video) ?? null,
    description: p.description,
    tags: p.tags,
    quoteOnly: !!p.quoteOnly,
  };
}

let state: Product[] = seedProducts;
let loaded = false;
const listeners = new Set<() => void>();

function set(next: Product[]) {
  state = next;
  listeners.forEach((l) => l());
}

export async function refreshProducts() {
  try {
    const list = await api<ApiProduct[]>("/products?limit=1000", { auth: false });
    loaded = true;
    set(list.map(fromApi));
  } catch {
    /* keep whatever is shown (demo catalog) when the backend is unreachable */
  }
}
if (typeof window !== "undefined") void refreshProducts();

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
const getSnapshot = () => state;

export function useProducts() {
  const products = useSyncExternalStore(subscribe, getSnapshot);
  return {
    products,
    loaded,
    /** Creates or updates a product. Throws with a readable message if the server refuses. */
    async saveProduct(product: Product) {
      const exists = state.some((p) => p.id === product.id);
      if (exists) {
        const saved = fromApi(await api<ApiProduct>(`/products/${product.id}`, { method: "PUT", body: toApi(product) }));
        set(state.map((p) => (p.id === product.id ? saved : p)));
      } else {
        const saved = fromApi(await api<ApiProduct>("/products", { method: "POST", body: toApi(product) }));
        set([saved, ...state]);
      }
    },
    async deleteProduct(id: string) {
      await api(`/products/${id}`, { method: "DELETE" });
      set(state.filter((p) => p.id !== id));
    },
  };
}
