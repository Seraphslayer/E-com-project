// Uploads product photos and videos to the backend (POST /api/media, admin only) and
// returns a URL the page can display and the product can save.
import { API_URL, ApiError, getToken, mediaUrl } from "../lib/api";

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
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b ?? file), "image/jpeg", 0.85));
}

/** Uploads one file and returns its public URL. */
export async function uploadMedia(file: File): Promise<string> {
  const blob = file.type.startsWith("image/") ? await shrinkImage(file) : file;
  const body = new FormData();
  body.append("files", blob, file.name.replace(/\.[^.]+$/, "") + (blob.type === "image/jpeg" ? ".jpg" : file.name.match(/\.[^.]+$/)?.[0] ?? ""));
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/media`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Please try again.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data?.error ?? "Upload failed");
  return mediaUrl(data[0].url);
}
