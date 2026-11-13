import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("8h"),
  // Comma-separated list of browser origins allowed to call the API.
  CORS_ORIGINS: z.string().default("http://localhost:8443,http://localhost:5173"),
  // On Vercel the project folder is read-only, so only /tmp is writable.
  UPLOAD_DIR: z.string().default(process.env.VERCEL ? "/tmp/uploads" : "./uploads"),
  MAX_UPLOAD_MB: z.coerce.number().default(50),
  // Maya Checkout online payments (card, Maya, GCash, GrabPay... the customer picks on Maya's page).
  // Public key creates the checkout, secret key confirms the payment. Sandbox keys charge nothing.
  MAYA_PUBLIC_KEY: z.string().optional(),
  MAYA_SECRET_KEY: z.string().optional(),
  // Sandbox by default. Production is https://pg.maya.ph
  MAYA_API_URL: z.string().default("https://pg-sandbox.paymaya.com"),
  // Public address of the website, used for the return links after payment. Defaults to the first CORS origin.
  SITE_URL: z.string().optional(),
  // Optional: create the first admin account on startup if no users exist.
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean),
  siteUrl: (parsed.data.SITE_URL ?? parsed.data.CORS_ORIGINS.split(",")[0] ?? "").trim().replace(/\/$/, ""),
  isProd: parsed.data.NODE_ENV === "production",
};
