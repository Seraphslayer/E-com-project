import { useSyncExternalStore } from "react";

// Quote requests submitted from the storefront, read by the admin portal.
//
// FRONTEND DEMO: persisted in localStorage (this browser only). When the backend exists,
// replace submitQuote/updateStatus with API calls (POST /api/quotes, PATCH /api/quotes/:id).

export type QuoteStatus = "new" | "contacted" | "quoted" | "closed";

export interface QuoteRequest {
  id: string;
  createdAt: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  category: string;
  items: string;
  message: string;
  status: QuoteStatus;
}

const KEY = "fgt.quotes.v1";

function load(): QuoteRequest[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as QuoteRequest[];
  } catch {
    /* storage unavailable or corrupt */
  }
  return [];
}

let state: QuoteRequest[] = load();
const listeners = new Set<() => void>();

function set(next: QuoteRequest[]) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private-mode errors */
  }
  listeners.forEach((l) => l());
}

export function submitQuote(
  data: Omit<QuoteRequest, "id" | "createdAt" | "status">,
): QuoteRequest {
  const next: QuoteRequest = {
    ...data,
    id: `QR-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  set([next, ...state]);
  return next;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useQuotes() {
  const quotes = useSyncExternalStore(subscribe, () => state);
  return {
    quotes,
    updateStatus(id: string, status: QuoteStatus) {
      set(state.map((q) => (q.id === id ? { ...q, status } : q)));
    },
    deleteQuote(id: string) {
      set(state.filter((q) => q.id !== id));
    },
  };
}
