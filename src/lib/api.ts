// Talks to the backend (server/). In development Vite forwards /api and /uploads to
// http://localhost:4000. In production set VITE_API_URL to the backend's address
// (no trailing slash), for example https://api.fgttrading.ph
export const API_URL: string = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const TOKEN_KEY = "fgt.admin.token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token && options.auth !== false) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Please check your connection and try again.");
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && token) setToken(null);
    throw new ApiError(res.status, data?.error ?? data?.message ?? `Request failed (${res.status})`);
  }
  return data as T;
}

/** Uploaded files are served by the backend, so make their path a full URL. */
export function mediaUrl(value: string): string {
  return value.startsWith("/uploads/") ? `${API_URL}${value}` : value;
}

/** The opposite: store only the /uploads/... path so the backend accepts it. */
export function toApiMedia(value: string): string {
  if (API_URL && value.startsWith(`${API_URL}/uploads/`)) return value.slice(API_URL.length);
  return value;
}
