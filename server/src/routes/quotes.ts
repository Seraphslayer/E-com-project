import { Router } from "express";
import { z } from "zod";
import { Quote, QUOTE_STATUSES } from "../models/Quote";
import { requireAdmin } from "../middleware/auth";
import { HttpError, parse } from "../middleware/error";
import { quoteLimiter } from "../middleware/limits";
import { toInt } from "../util";

export const quotesRouter = Router();

const createBody = z.object({
  name: z.string().trim().min(1).max(120),
  organization: z.string().trim().max(160).optional(),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(5).max(40),
  category: z.string().trim().max(100).optional(),
  items: z.string().trim().max(1000).default(""),
  message: z.string().trim().max(5000).default(""),
});

quotesRouter.post("/", quoteLimiter, async (req, res) => {
  const quote = await Quote.create(parse(createBody, req.body));
  res.status(201).json({ id: quote.id, message: "Quote request received" });
});

quotesRouter.get("/", requireAdmin, async (req, res) => {
  const status = String(req.query.status ?? "");
  const filter = (QUOTE_STATUSES as readonly string[]).includes(status) ? { status } : {};
  const limit = toInt(req.query.limit, 50, 1, 200);
  const skip = toInt(req.query.skip, 0, 0, 1_000_000);
  const [items, total] = await Promise.all([
    Quote.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Quote.countDocuments(filter),
  ]);
  res.json({ items, total });
});

const patchBody = z.object({
  status: z.enum(QUOTE_STATUSES).optional(),
  internalNotes: z.string().trim().max(5000).optional(),
});

quotesRouter.patch("/:id", requireAdmin, async (req, res) => {
  const quote = await Quote.findByIdAndUpdate(req.params.id, { $set: parse(patchBody, req.body) }, { new: true });
  if (!quote) throw new HttpError(404, "Quote not found");
  res.json(quote);
});

quotesRouter.delete("/:id", requireAdmin, async (req, res) => {
  if (!(await Quote.findByIdAndDelete(req.params.id))) throw new HttpError(404, "Quote not found");
  res.status(204).end();
});
