import { Router } from "express";
import { z } from "zod";
import { Review } from "../models/Review";
import { Product } from "../models/Product";
import { requireAdmin } from "../middleware/auth";
import { HttpError, parse } from "../middleware/error";
import { reviewLimiter } from "../middleware/limits";

export const reviewsRouter = Router();

/** Keeps a product's star rating and review count in step with its published reviews. */
async function refreshProductRating(productId: string) {
  const [agg] = await Review.aggregate([
    { $match: { productId, status: "published" } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await Product.updateOne(
    { _id: productId },
    { $set: { rating: agg ? Math.round(agg.avg * 10) / 10 : 0, reviews: agg?.count ?? 0 } },
  );
}

// Public: published reviews, optionally for one product.
reviewsRouter.get("/", async (req, res) => {
  const filter: Record<string, unknown> = { status: "published" };
  if (req.query.productId) filter.productId = String(req.query.productId);
  res.json(await Review.find(filter).sort({ createdAt: -1 }).limit(200));
});

const createBody = z.object({
  productId: z.string().min(1),
  author: z.string().trim().min(1).max(80),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(3000),
});

reviewsRouter.post("/", reviewLimiter, async (req, res) => {
  const body = parse(createBody, req.body);
  const product = await Product.findById(body.productId);
  if (!product) throw new HttpError(404, "Product not found");
  await Review.create({ ...body, productName: product.name, status: "pending", verified: false });
  res.status(201).json({ message: "Thanks! Your review will appear once it has been approved." });
});

// ---- Admin moderation ----
reviewsRouter.get("/admin/all", requireAdmin, async (req, res) => {
  const status = String(req.query.status ?? "");
  const filter = ["pending", "published", "hidden"].includes(status) ? { status } : {};
  res.json(await Review.find(filter).sort({ createdAt: -1 }).limit(500));
});

reviewsRouter.patch("/:id", requireAdmin, async (req, res) => {
  const { status } = parse(z.object({ status: z.enum(["pending", "published", "hidden"]) }), req.body);
  const review = await Review.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
  if (!review) throw new HttpError(404, "Review not found");
  await refreshProductRating(review.productId);
  res.json(review);
});

reviewsRouter.delete("/:id", requireAdmin, async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new HttpError(404, "Review not found");
  await refreshProductRating(review.productId);
  res.status(204).end();
});
