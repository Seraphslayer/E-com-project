import { Router } from "express";
import { z } from "zod";
import { Product } from "../models/Product";
import { requireAdmin } from "../middleware/auth";
import { HttpError, parse } from "../middleware/error";
import { escapeRegex, toInt } from "../util";

export const productsRouter = Router();

// Media is either an uploaded file served by this API (/uploads/...) or an external https link.
const mediaUrl = z
  .string()
  .min(1)
  .refine((v) => v.startsWith("/uploads/") || /^https?:\/\//i.test(v), "Must be an upload path or http(s) link");

const productBody = z.object({
  name: z.string().trim().min(1).max(200),
  brand: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(100),
  sku: z.string().trim().min(1).max(100),
  price: z.number().nonnegative(),
  originalPrice: z.number().nonnegative().nullish(),
  stock: z.number().int().nonnegative(),
  image: mediaUrl,
  images: z.array(mediaUrl).max(20).default([]),
  video: mediaUrl.nullish(),
  description: z.string().max(5000).default(""),
  tags: z.array(z.string().trim().min(1).max(40)).max(30).default([]),
  quoteOnly: z.boolean().default(false),
});

productsRouter.get("/", async (req, res) => {
  const { category, brand, search, sort } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};
  if (category) filter.category = { $in: category.split(",") };
  if (brand) filter.brand = { $in: brand.split(",") };
  if (search?.trim()) {
    const rx = new RegExp(escapeRegex(search.trim().slice(0, 80)), "i");
    filter.$or = [{ name: rx }, { brand: rx }, { category: rx }, { tags: rx }, { sku: rx }];
  }
  const sorts: Record<string, Record<string, 1 | -1>> = {
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { rating: -1 },
    reviews: { reviews: -1 },
    newest: { createdAt: -1 },
  };
  const limit = toInt(req.query.limit, 500, 1, 1000);
  const skip = toInt(req.query.skip, 0, 0, 1_000_000);
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sorts[sort ?? ""] ?? { createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  res.set("X-Total-Count", String(total));
  res.json(items);
});

productsRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new HttpError(404, "Product not found");
  res.json(product);
});

productsRouter.post("/", requireAdmin, async (req, res) => {
  const body = parse(productBody, req.body);
  res.status(201).json(await Product.create(body));
});

productsRouter.put("/:id", requireAdmin, async (req, res) => {
  const body = parse(productBody.partial(), req.body);
  const updated = await Product.findByIdAndUpdate(req.params.id, { $set: body }, { new: true, runValidators: true });
  if (!updated) throw new HttpError(404, "Product not found");
  res.json(updated);
});

productsRouter.delete("/:id", requireAdmin, async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, "Product not found");
  res.status(204).end();
});
