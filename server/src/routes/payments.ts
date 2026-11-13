import { Router } from "express";
import { z } from "zod";
import type { HydratedDocument } from "mongoose";
import { Order, PAYMENT_METHODS } from "../models/Order";
import type { IOrder } from "../models/Order";
import { config } from "../config";
import { HttpError, parse } from "../middleware/error";
import { orderLimiter, trackLimiter } from "../middleware/limits";

export const paymentsRouter = Router();

// Methods paid online through Maya Checkout (the customer picks card / Maya / GCash... on Maya's page).
type Method = (typeof PAYMENT_METHODS)[number];
const ONLINE: Method[] = ["card", "gcash", "maya", "grabpay"];

const peso = (n: number) => n.toFixed(2);
const basic = (key: string) => `Basic ${Buffer.from(`${key}:`).toString("base64")}`;

const checkoutBody = z.object({ orderId: z.string().trim().min(1), email: z.string().trim().email() });

// Creates a Maya hosted checkout for an existing order and returns the page to send the customer to.
// Amounts always come from the order stored on the server, never from the browser.
paymentsRouter.post("/checkout", orderLimiter, async (req, res) => {
  const { orderId, email } = parse(checkoutBody, req.body);
  if (!config.MAYA_PUBLIC_KEY) throw new HttpError(503, "Online payment isn't set up yet. Please choose another payment method.");

  const order = await Order.findOne({ _id: orderId.toUpperCase(), "customer.email": email.toLowerCase() });
  if (!order) throw new HttpError(404, "Order not found");
  if (order.status === "cancelled") throw new HttpError(400, "This order was cancelled");
  if (order.paymentStatus === "paid") throw new HttpError(409, "This order is already paid");
  if (!ONLINE.includes(order.paymentMethod)) throw new HttpError(400, "This order isn't set to be paid online");

  // Maya wants every line to add up to the total, so send lines for items, shipping and VAT.
  const items = order.items.map((i) => ({
    name: i.name.slice(0, 120),
    quantity: String(i.quantity),
    amount: { value: peso(i.price) },
    totalAmount: { value: peso(i.price * i.quantity) },
  }));
  if (order.shipping > 0) items.push({ name: "Shipping", quantity: "1", amount: { value: peso(order.shipping) }, totalAmount: { value: peso(order.shipping) } });
  if (order.vat > 0) items.push({ name: "VAT (12%)", quantity: "1", amount: { value: peso(order.vat) }, totalAmount: { value: peso(order.vat) } });
  const total = items.reduce((sum, i) => sum + Math.round(Number(i.totalAmount.value) * 100), 0) / 100;

  const [firstName, ...rest] = order.customer.name.trim().split(/\s+/);
  const site = config.siteUrl;
  const back = (flag: string) => `${site}/store/orders?id=${encodeURIComponent(order.id)}&${flag}=1`;

  let response: Response;
  try {
    response = await fetch(`${config.MAYA_API_URL}/checkout/v1/checkouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: basic(config.MAYA_PUBLIC_KEY) },
      body: JSON.stringify({
        totalAmount: { value: peso(total), currency: "PHP" },
        buyer: {
          firstName: firstName || "Customer",
          lastName: rest.join(" ") || "-",
          contact: { phone: order.customer.phone, email: order.customer.email },
        },
        items,
        redirectUrl: { success: back("paid"), failure: back("failed"), cancel: back("cancelled") },
        requestReferenceNumber: order.id,
        metadata: { orderId: order.id },
      }),
    });
  } catch {
    throw new HttpError(502, "Could not reach the payment provider. Please try again.");
  }
  const json = (await response.json().catch(() => null)) as { checkoutId?: string; redirectUrl?: string; message?: string } | null;
  if (!response.ok || !json?.redirectUrl) {
    console.error("Maya checkout failed:", response.status, JSON.stringify(json));
    throw new HttpError(502, json?.message ?? "The payment provider could not start the payment.");
  }

  order.paymentReference = json.checkoutId;
  await order.save();
  res.json({ checkoutUrl: json.redirectUrl });
});

/**
 * Asks Maya directly what happened to the order's checkout and updates the order.
 * We trust Maya's answer, never the browser or the webhook body.
 */
async function syncPayment(order: HydratedDocument<IOrder>) {
  if (order.paymentStatus === "paid" || !order.paymentReference || !config.MAYA_SECRET_KEY) return;
  type Checkout = { paymentStatus?: string; requestReferenceNumber?: string };
  const data = await (async (): Promise<Checkout | null> => {
    try {
        const r = await fetch(`${config.MAYA_API_URL}/checkout/v1/checkouts/${encodeURIComponent(order.paymentReference as string)}`, {
        headers: { Authorization: basic(config.MAYA_SECRET_KEY as string) },
      });
      return r.ok ? ((await r.json()) as Checkout) : null;
    } catch {
      return null;
    }
  })();
  if (!data || data.requestReferenceNumber !== order.id) return;
  if (data.paymentStatus === "PAYMENT_SUCCESS") {
    order.paymentStatus = "paid";
    await order.save();
  } else if (data.paymentStatus && ["PAYMENT_FAILED", "PAYMENT_EXPIRED", "AUTH_FAILED"].includes(data.paymentStatus) && order.paymentStatus !== "failed") {
    order.paymentStatus = "failed";
    await order.save();
  }
}

// The thank-you page calls this; it re-checks with Maya so it works even before the webhook arrives.
paymentsRouter.get("/status", trackLimiter, async (req, res) => {
  const id = String(req.query.id ?? "").trim().toUpperCase();
  const email = String(req.query.email ?? "").trim().toLowerCase();
  const order = id && email ? await Order.findOne({ _id: id, "customer.email": email }) : null;
  if (!order) throw new HttpError(404, "No order matches that order number and email");
  await syncPayment(order);
  res.json({ paymentStatus: order.paymentStatus });
});

// Maya calls this when a checkout succeeds or fails. Its body is not signed, so it is only a nudge:
// we look the order up and ask Maya for the real status before changing anything.
paymentsRouter.post("/webhook", async (req, res) => {
  const body = (req.body ?? {}) as { requestReferenceNumber?: string; metadata?: { orderId?: string } };
  const id = String(body.requestReferenceNumber ?? body.metadata?.orderId ?? "").toUpperCase();
  const order = id ? await Order.findById(id) : null;
  if (order) await syncPayment(order);
  res.json({ received: true });
});
