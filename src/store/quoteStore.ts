import { useEffect, useSyncExternalStore } from "react";
import { api } from "../lib/api";

// Quote requests submitted from the storefront (POST /api/quotes, public) and read by the
// admin portal (GET/PATCH/DELETE /api/quotes, admin login required).

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

export type QuoteInput = Omit<QuoteRequest, "id" | "createdAt" | "status">;

/** Sends a quote request from the storefront. Throws with a readable message on failure. */
export async function submitQuote(data: QuoteInput): Promise<void> {
  await api("/quotes", { method: "POST", body: data, auth: false });
}

let state: QuoteRequest[] = [];
let error = "";
let loading = false;
const listeners = new Set<() => void>();
let snapshot = { quotes: state, error, loading };

function publish() {
  snapshot = { quotes: state, error, loading };
  listeners.forEach((l) => l());
}

export async function refreshQuotes() {
  loading = true;
  error = "";
  publish();
  try {
    const res = await api<{ items: QuoteRequest[] }>("/quotes?limit=200");
    state = res.items;
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load quote requests.";
  }
  loading = false;
  publish();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useQuotes() {
  const snap = useSyncExternalStore(subscribe, () => snapshot);
  useEffect(() => {
    void refreshQuotes();
  }, []);
  return {
    quotes: snap.quotes,
    error: snap.error,
    loading: snap.loading,
    async updateStatus(id: string, status: QuoteStatus) {
      const saved = await api<QuoteRequest>(`/quotes/${id}`, { method: "PATCH", body: { status } });
      state = state.map((q) => (q.id === id ? { ...q, ...saved } : q));
      publish();
    },
    async deleteQuote(id: string) {
      await api(`/quotes/${id}`, { method: "DELETE" });
      state = state.filter((q) => q.id !== id);
      publish();
    },
  };
}
