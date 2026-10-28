import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { Quote } from "../models/Quote";
import { Review } from "../models/Review";

export const statsRouter = Router();

// Numbers for the admin dashboard cards.
statsRouter.get("/", requireAdmin, async (_req, res) => {
  const [products, lowStock, orderCounts, revenue, newQuotes, pendingReviews] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ stock: { $lt: 30 } }),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Quote.countDocuments({ status: "new" }),
    Review.countDocuments({ status: "pending" }),
  ]);
  res.json({
    products,
    lowStock,
    orders: Object.fromEntries(orderCounts.map((o) => [o._id, o.count])),
    revenue: revenue[0]?.total ?? 0,
    newQuotes,
    pendingReviews,
  });
});
