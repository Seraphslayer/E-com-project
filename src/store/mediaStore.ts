// Media storage for product photos and videos.
//
// FRONTEND DEMO IMPLEMENTATION: files are kept in the browser's IndexedDB, so they
// survive reloads on this device only. When the backend is ready, replace
// `uploadMedia` with a call that uploads to real storage (S3, Cloudinary, ...) and
// returns the public URL, and drop the IndexedDB code. Nothing else needs to change.

const DB_NAME = "fgt-media";
const STORE = "files";
const REF_PREFIX = "media:";

const refToUrl = new Map<string, string>();
const urlToRef = new Map<string, string>();

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function putBlob(id: string, blob: Blob): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getBlob(id: string): Promise<Blob | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
}

export function isMediaRef(value: string): boolean {
  return value.startsWith(REF_PREFIX);
}

/** Shrinks large photos so they stay light for the storefront. */
async function shrinkImage(file: File, maxSize = 1400): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b ?? file), "image/jpeg", 0.85),
  );
}

/** Saves an uploaded photo or video and returns a URL the page can display. */
export async function uploadMedia(file: File): Promise<string> {
  const blob = file.type.startsWith("image/") ? await shrinkImage(file) : file;
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  await putBlob(id, blob);
  const ref = REF_PREFIX + id;
  const url = URL.createObjectURL(blob);
  refToUrl.set(ref, url);
  urlToRef.set(url, ref);
  return url;
}

/** Turns a stored `media:` reference back into a displayable URL (other values pass through). */
export async function resolveMedia(value: string): Promise<string> {
  if (!isMediaRef(value)) return value;
  const cached = refToUrl.get(value);
  if (cached) return cached;
  const blob = await getBlob(value.slice(REF_PREFIX.length));
  if (!blob) return "";
  const url = URL.createObjectURL(blob);
  refToUrl.set(value, url);
  urlToRef.set(url, value);
  return url;
}

/** Turns a displayable URL back into the reference that gets saved. */
export function toStoredValue(url: string): string {
  return urlToRef.get(url) ?? url;
}
