import rateLimit from "express-rate-limit";

const make = (windowMinutes: number, limit: number, message: string) =>
  rateLimit({
    windowMs: windowMinutes * 60_000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: message },
  });

export const loginLimiter = make(15, 10, "Too many sign-in attempts. Try again in a few minutes.");
export const orderLimiter = make(60, 20, "Too many orders from this connection. Try again later.");
export const quoteLimiter = make(60, 10, "Too many quote requests from this connection. Try again later.");
export const reviewLimiter = make(60, 5, "Too many reviews from this connection. Try again later.");
export const trackLimiter = make(15, 30, "Too many lookups. Try again in a few minutes.");
export const apiLimiter = make(1, 300, "Too many requests. Slow down a little.");
