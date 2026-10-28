import { Router } from "express";
import { z } from "zod";
import { Order, nextOrderId, ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES, SHIPPING_METHODS } from "../models/Order";
import { Product } from "../models/Product";
import { requireAdmin } from "../middleware/auth";
import { HttpError, parse } from "../middleware/error";
import { orderLimiter, trackLimiter } from "../middleware/limits";
import { escapeRegex, round2, toInt } from "../util";

export const ordersRouter = Router();

// Pricing rules mirror the storefront cart/checkout. The server always recomputes totals
// from current product prices, so a tampered browser request can't change what is charged.
const VAT_RATE = 0.12;
const FREE_SHIPPING_OVER = 20_000;
const STANDARD_SHIPPING = 850;
const SHIPPING_ADDON: Record<(typeof SHIPPING_METHODS)[number], number> = {
  standard: 0,
  priority: 650,
  installation: 1500,
};

const createBody = z.object({
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    organization: z.string().trim().max(160).optional(),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().min(5).max(40),
  }),
  shippingAddress: z.object({
    line1: z.string().trim().min(1).max(250),
    city: z.string().trim().min(1).max(100),
    province: z.string().trim().min(1).max(100),
    postalCode: z.string().trim().max(20).optional(),
    country: z.string().trim().max(60).default("Philippines"),
  }),
  items: z
    .array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(999) }))
    .min(1)
    .max(100),
  shippingMethod: z.enum(SHIPPING_METHODS).default("standard"),
  paymentMethod: z.enum(PAYMENT_METHODS),
  notes: z.string().trim().max(1000).optional(),
});

ordersRouter.post("/", orderLimiter, async (req, res) => {
  const body = parse(createBody, req.body);

  // Merge duplicate lines for the same product.
  const wanted = new Map<string, number>();
  for (const i of body.items) wanted.set(i.productId, (wanted.get(i.productId) ?? 0) + i.quantity);

  const products = await Product.find({ _id: { $in: [...wanted.keys()] } });
  const byId = new Map(products.map((p) => [p.id as string, p]));
  for (const [id, qty] of wanted) {
    const p = byId.get(id);
    if (!p) throw new HttpError(400, `Product ${id} no longer exists`);
    if (p.quoteOnly) throw new HttpError(400, `"${p.name}" is quote-only. Please send a quote request instead.`);
    if (p.stock < qty) throw new HttpError(409, `Only ${p.stock} of "${p.name}" left in stock`);
  }

  const items = [...wanted].map(([id, quantity]) => {
    const p = byId.get(id)!;
    return { productId: id, name: p.name, sku: p.sku, price: p.price, quantity };
  });
  const subtotal = round2(items.reduce((s, i) => s + i.price * i.quantity, 0));
  const baseShipping = subtotal > FREE_SHIPPING_OVER ? 0 : STANDARD_SHIPPING;
  const shipping = round2(baseShipping + SHIPPING_ADDON[body.shippingMethod]);
  const vat = round2(subtotal * VAT_RATE);
  const total = round2(subtotal + shipping + vat);

  // Reserve stock atomically per line; undo earlier lines if one fails (e.g. a concurrent order).
  const reserved: [string, number][] = [];
  const release = () =>
    Promise.all(reserved.map(([id, q]) => Product.updateOne({ _id: id }, { $inc: { stock: q } })));
  try {
    for (const [id, qty] of wanted) {
      const r = await Product.updateOne({ _id: id, stock: { $gte: qty } }, { $inc: { stock: -qty } });
      if (r.modifiedCount !== 1) throw new HttpError(409, `"${byId.get(id)!.name}" just sold out. Please review your cart.`);
      reserved.push([id, qty]);
    }
    const order = await Order.create({
      _id: await nextOrderId(),
      customer: body.customer,
      shippingAddress: body.shippingAddress,
      items,
      subtotal,
      shipping,
      vat,
      total,
      shippingMethod: body.shippingMethod,
      paymentMethod: body.paymentMethod,
      notes: body.notes,
    });
    res.status(201).json(order);
  } catch (err) {
    await release();
    throw err;
  }
});

// Customers look up their own order with the order number plus the email used at checkout.
ordersRouter.get("/track", trackLimiter, async (req, res) => {
  const id = String(req.query.id ?? "").trim().toUpperCase();
  const email = String(req.query.email ?? "").trim().toLowerCase();
  const order = id && email ? await Order.findOne({ _id: id, "customer.email": email }).select("-notes") : null;
  if (!order) throw new HttpError(404, "No order matches that order number and email");
  res.json(order);
});

// ---- Admin ----
ordersRouter.get("/", requireAdmin, async (req, res) => {
  const { status, search } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};
  if (status && (ORDER_STATUSES as readonly string[]).includes(status)) filter.status = status;
  if (search?.trim()) {
    const rx = new RegExp(escapeRegex(search.trim().slice(0, 80)), "i");
    filter.$or = [{ _id: rx }, { "customer.name": rx }, { "customer.email": rx }, { "customer.organization": rx }];
  }
  const limit = toInt(req.query.limit, 50, 1, 200);
  const skip = toInt(req.query.skip, 0, 0, 1_000_000);
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  res.json({ items, total });
});

ordersRouter.get("/:id", requireAdmin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new HttpError(404, "Order not found");
  res.json(order);
});

const patchBody = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  tracking: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(1000).optional(),
});

ordersRouter.patch("/:id", requireAdmin, async (req, res) => {
  const patch = parse(patchBody, req.body);
  const order = await Order.findById(req.params.id);
  if (!order) throw new HttpError(404, "Order not found");

  if (patch.status && patch.status !== order.status) {
    if (order.status === "cancelled") throw new HttpError(400, "A cancelled order can't be reopened. Create a new order instead.");
    if (patch.status === "cancelled") {
      // Put the reserved stock back.
      await Promise.all(order.items.map((i) => Product.updateOne({ _id: i.productId }, { $inc: { stock: i.quantity } })));
    }
  }
  Object.assign(order, patch);
  await order.save();
  res.json(order);
});
