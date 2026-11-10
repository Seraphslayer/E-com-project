// Vercel entry point: runs the Express API as a serverless function.
// The database connection is opened once per warm instance and reused.
import type { IncomingMessage, ServerResponse } from "http";
import { connectDb, ensureAdmin } from "../src/db";
import { createApp } from "../src/app";

const app = createApp();
let ready: Promise<void> | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    ready ??= connectDb().then(ensureAdmin);
    await ready;
  } catch (err) {
    ready = null; // try again on the next request
    console.error("Database connection failed:", err);
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Service unavailable. Please try again shortly." }));
    return;
  }
  return app(req, res);
}
