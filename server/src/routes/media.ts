import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { config } from "../config";
import { requireAdmin } from "../middleware/auth";
import { HttpError } from "../middleware/error";

// The file extension comes from the verified mime type, never from the uploaded file name.
const ALLOWED: Record<string, { ext: string; kind: "image" | "video" }> = {
  "image/jpeg": { ext: ".jpg", kind: "image" },
  "image/png": { ext: ".png", kind: "image" },
  "image/webp": { ext: ".webp", kind: "image" },
  "image/gif": { ext: ".gif", kind: "image" },
  "video/mp4": { ext: ".mp4", kind: "video" },
  "video/webm": { ext: ".webm", kind: "video" },
};

export const uploadDir = path.resolve(config.UPLOAD_DIR);
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) =>
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ALLOWED[file.mimetype].ext}`),
  }),
  limits: { fileSize: config.MAX_UPLOAD_MB * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) =>
    ALLOWED[file.mimetype]
      ? cb(null, true)
      : cb(new HttpError(415, "Only JPG, PNG, WebP, GIF images and MP4/WebM videos are allowed")),
});

export const mediaRouter = Router();

mediaRouter.post("/", requireAdmin, upload.array("files", 10), (req, res) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (files.length === 0) throw new HttpError(400, 'No files received (use the form field "files")');
  res.status(201).json(
    files.map((f) => ({
      url: `/uploads/${f.filename}`,
      type: ALLOWED[f.mimetype].kind,
      size: f.size,
      originalName: f.originalname,
    })),
  );
});

mediaRouter.delete("/:filename", requireAdmin, async (req, res) => {
  const name = String(req.params.filename);
  if (!/^[\w.-]+$/.test(name) || name.includes("..")) throw new HttpError(400, "Invalid file name");
  try {
    await fs.promises.unlink(path.join(uploadDir, name));
  } catch {
    throw new HttpError(404, "File not found");
  }
  res.status(204).end();
});
