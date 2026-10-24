import { Router } from "express";
import { z } from "zod";
import { Post } from "../models/Post";
import { requireAdmin } from "../middleware/auth";
import { HttpError, parse } from "../middleware/error";

export const postsRouter = Router();

const postBody = z.object({
  author: z.string().trim().min(1).max(120).default("FGT Trading OPC"),
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20_000),
  category: z.string().trim().max(60).default("Update"),
  image: z
    .string()
    .refine((v) => v.startsWith("/uploads/") || /^https?:\/\//i.test(v), "Must be an upload path or http(s) link")
    .nullish(),
  published: z.boolean().default(true),
});

postsRouter.get("/", async (_req, res) => {
  res.json(await Post.find({ published: true }).sort({ createdAt: -1 }).limit(100));
});

postsRouter.get("/admin/all", requireAdmin, async (_req, res) => {
  res.json(await Post.find().sort({ createdAt: -1 }).limit(500));
});

postsRouter.post("/", requireAdmin, async (req, res) => {
  res.status(201).json(await Post.create(parse(postBody, req.body)));
});

postsRouter.put("/:id", requireAdmin, async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { $set: parse(postBody.partial(), req.body) }, { new: true });
  if (!post) throw new HttpError(404, "Post not found");
  res.json(post);
});

postsRouter.delete("/:id", requireAdmin, async (req, res) => {
  if (!(await Post.findByIdAndDelete(req.params.id))) throw new HttpError(404, "Post not found");
  res.status(204).end();
});
