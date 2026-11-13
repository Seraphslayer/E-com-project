import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import { config } from "./config";
import { errorHandler, notFound, HttpError } from "./middleware/error";
import { apiLimiter } from "./middleware/limits";
import { authRouter } from "./routes/auth";
import { productsRouter } from "./routes/products";
import { mediaRouter, uploadDir } from "./routes/media";
import { ordersRouter } from "./routes/orders";
import { quotesRouter } from "./routes/quotes";
import { reviewsRouter } from "./routes/reviews";
import { postsRouter } from "./routes/posts";
import { statsRouter } from "./routes/stats";
import { paymentsRouter } from "./routes/payments";

export function createApp() {
  const app = express();
  // The API normally sits behind nginx / a load balancer; trust one proxy hop for client IPs.
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  // Images and videos are loaded by the storefront from a different origin in some setups.
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  // Allowed: the origins listed in CORS_ORIGINS, plus any page served from the same host as the API
  // (the storefront and the admin portal each call /api on their own domain, and so do Vercel preview links).
  app.use(
    cors((req, cb) => {
      const origin = req.headers.origin;
      let sameHost = false;
      try {
        sameHost = !!origin && new URL(origin).host === req.headers.host;
      } catch {
        /* not a valid origin: fall through to the list */
      }
      const ok = !origin || sameHost || config.corsOrigins.includes(origin);
      ok ? cb(null, { origin: true, exposedHeaders: ["X-Total-Count"] }) : cb(new HttpError(403, "Origin not allowed"));
    }),
  );
  app.use(morgan(config.isProd ? "combined" : "dev"));
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => {
    const dbUp = mongoose.connection.readyState === 1;
    res.status(dbUp ? 200 : 503).json({ ok: dbUp, db: dbUp ? "connected" : "disconnected" });
  });

  app.use(
    "/uploads",
    express.static(uploadDir, {
      maxAge: "7d",
      index: false,
      setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
    }),
  );

  app.use("/api", apiLimiter);
  app.use("/api/auth", authRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/media", mediaRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/payments", paymentsRouter);
  app.use("/api/quotes", quotesRouter);
  app.use("/api/reviews", reviewsRouter);
  app.use("/api/posts", postsRouter);
  app.use("/api/admin/stats", statsRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
