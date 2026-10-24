import { Schema, model } from "mongoose";
import { jsonOptions } from "./_shared";

export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
export const PAYMENT_METHODS = ["card", "gcash", "maya", "grabpay", "cod", "bank_transfer"] as const;
export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;
export const SHIPPING_METHODS = ["standard", "priority", "installation"] as const;

const itemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    // Price at the time of purchase, so later price edits never change old orders.
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

export interface IOrder {
  _id: string;
  customer: { name: string; organization?: string; email: string; phone: string };
  shippingAddress: { line1: string; city: string; province: string; postalCode?: string; country: string };
  items: { productId: string; name: string; sku: string; price: number; quantity: number }[];
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
  shippingMethod: (typeof SHIPPING_METHODS)[number];
  status: (typeof ORDER_STATUSES)[number];
  paymentMethod: (typeof PAYMENT_METHODS)[number];
  paymentStatus: (typeof PAYMENT_STATUSES)[number];
  paymentReference?: string;
  tracking?: string;
  notes?: string;
}

const orderSchema = new Schema<IOrder>(
  {
    _id: { type: String, required: true }, // human readable: ORD-20101
    customer: {
      name: { type: String, required: true },
      organization: String,
      email: { type: String, required: true, lowercase: true, index: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: String,
      country: { type: String, default: "Philippines" },
    },
    items: { type: [itemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    vat: { type: Number, required: true },
    total: { type: Number, required: true },
    shippingMethod: { type: String, enum: SHIPPING_METHODS, default: "standard" },
    status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "pending" },
    paymentReference: String, // e.g. PayMongo payment intent id, filled in by the payment integration
    tracking: String,
    notes: String,
  },
  jsonOptions,
);

export const Order = model<IOrder>("Order", orderSchema);

/** Atomic counter used to generate order numbers. */
const counterSchema = new Schema({ _id: String, seq: { type: Number, default: 20100 } });
const Counter = model("Counter", counterSchema);

export async function nextOrderId(): Promise<string> {
  const c = await Counter.findOneAndUpdate(
    { _id: "order" },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return `ORD-${c.seq}`;
}
