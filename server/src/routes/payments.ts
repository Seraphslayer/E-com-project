import crypto from "node:crypto";
import { Router, Request } from "express";
import { z } from "zod";
import { Order, PAYMENT_METHODS } from "../models/Order";
import { config } from "../config";
import { HttpError, parse } from "../middleware/error";
import { orderLimiter, trackLimiter } from "../middleware/limits";

export const paymentsRouter = Router();

// Payment methods that are paid online through PayMongo (the rest are settled offline).
type Method = (typeof PAYMENT_METHODS)[number];
const ONLINE: Partial<Record<Method, string>> = {
  card: "card",
  gcash: "gcash",
  maya: "paymaya",
  grabpay: "grab_pay",
};

const centavos = (pesos: number) => Math.round(pesos * 100);

const checkoutBody = z.object({ orderId: z.string().trim().min(1), email: z.string().trim().email() });

// Creates a PayMongo hosted checkout for an existing order and returns the page to send the customer to.
// The amounts always come from the order stored on the server, never from the browser.
paymentsRouter.post("/checkout", orderLimiter, async (req, res) => {
  const { orderId, email } = parse(checkoutBody, req.body);
  if (!config.PAYMONGO_SECRET_KEY) throw new HttpError(503, "Online payment isn't set up yet. Please choose another payment method.");

  const order = await Order.findOne({ _id: orderId.toUpperCase(), "customer.email": email.toLowerCase() });
  if (!order) throw new HttpError(404, "Order not found");
  if (order.status === "cancelled") throw new HttpError(400, "This order was cancelled");
  if (order.paymentStatus === "paid") throw new HttpError(409, "This order is already paid");
  const methodType = ONLINE[order.paymentMethod];
  if (!methodType) throw new HttpError(400, "This order isn't set to be paid online");

  const lineItems = order.items.map((i) => ({
    currency: "PHP",
    amount: centavos(i.price),
    name: i.name.slice(0, 120),
    quantity: i.quantity,
  }));
  if (order.shipping > 0) lineItems.push({ currency: "PHP", amount: centavos(order.shipping), name: "Shipping", quantity: 1 });
  if (order.vat > 0) lineItems.push({ currency: "PHP", amount: centavos(order.vat), name: "VAT (12%)", quantity: 1 });

  const site = config.siteUrl;
  let response: Response;
  try {
    response = await fetch(`${config.PAYMONGO_API_URL}/checkout_sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${config.PAYMONGO_SECRET_KEY}:`).toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: lineItems,
            payment_method_types: [methodType],
            reference_number: order.id,
            description: `FGT Trading OPC order ${order.id}`,
            billing: { name: order.customer.name, email: order.customer.email, phone: order.customer.phone },
            metadata: { orderId: order.id },
            success_url: `${site}/store/orders?id=${encodeURIComponent(order.id)}&paid=1`,
            cancel_url: `${site}/store/orders?id=${encodeURIComponent(order.id)}&cancelled=1`,
          },
        },
      }),
    });
  } catch {
    throw new HttpError(502, "Could not reach the payment provider. Please try again.");
  }
  const json = (await response.json().catch(() => null)) as {
    data?: { id?: string; attributes?: { checkout_url?: string } };
    errors?: { detail?: string }[];
  } | null;
  const checkoutUrl = json?.data?.attributes?.checkout_url;
  if (!response.ok || !checkoutUrl) {
    console.error("PayMongo checkout failed:", response.status, JSON.stringify(json?.errors ?? json));
    throw new HttpError(502, json?.errors?.[0]?.detail ?? "The payment provider could not start the payment.");
  }

  order.paymentReference = json?.data?.id;
  await order.save();
  res.json({ checkoutUrl });
});

// Lets the thank-you page show whether the payment has been confirmed yet.
paymentsRouter.get("/status", trackLimiter, async (req, res) => {
  const id = String(req.query.id ?? "").trim().toUpperCase();
  const email = String(req.query.email ?? "").trim().toLowerCase();
  const order = id && email ? await Order.findOne({ _id: id, "customer.email": email }).select("paymentStatus") : null;
  if (!order) throw new HttpError(404, "No order matches that order number and email");
  res.json({ paymentStatus: order.paymentStatus });
});

/** Checks the Paymongo-Signature header: HMAC-SHA256 of "<timestamp>.<raw body>" with the webhook secret. */
export function verifyWebhookSignature(header: string | undefined, rawBody: Buffer | undefined, secret: string, livemode: boolean) {
  if (!header || !rawBody) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const i = kv.indexOf("=");
      return [kv.slice(0, i).trim(), kv.slice(i + 1).trim()];
    }),
  ) as Record<string, string>;
  if (!parts.t) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${parts.t}.${rawBody.toString("utf8")}`).digest("hex");
  const given = livemode ? parts.li : parts.te;
  if (!given || given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

interface PayMongoEvent {
  data?: { attributes?: { type?: string; livemode?: boolean; data?: { id?: string; attributes?: { reference_number?: string; metadata?: { orderId?: string } } } } };
}

// PayMongo calls this when a payment succeeds or fails. The signature proves the call is genuine.
paymentsRouter.post("/webhook", async (req: Request, res) => {
  if (!config.PAYMONGO_WEBHOOK_SECRET) throw new HttpError(503, "Webhook is not configured");
  const event = req.body as PayMongoEvent;
  const attrs = event?.data?.attributes;
  const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody;
  if (!verifyWebhookSignature(req.get("paymongo-signature"), rawBody, config.PAYMONGO_WEBHOOK_SECRET, !!attrs?.livemode)) {
    throw new HttpError(400, "Invalid signature");
  }

  const resource = attrs?.data;
  const orderId = resource?.attributes?.reference_number ?? resource?.attributes?.metadata?.orderId;
  if (orderId) {
    if (attrs?.type === "checkout_session.payment.paid") {
      await Order.updateOne({ _id: orderId }, { $set: { paymentStatus: "paid", paymentReference: resource?.id } });
    } else if (attrs?.type === "payment.failed") {
      // Never downgrade an order that has already been paid.
      await Order.updateOne({ _id: orderId, paymentStatus: { $ne: "paid" } }, { $set: { paymentStatus: "failed" } });
    }
  }
  res.json({ received: true });
});
