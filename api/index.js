// Vercel serverless entry for the whole /api. The backend in server/ is compiled to
// server/dist during the build (see vercel.json), so the site and the API live in ONE
// Vercel project and the browser talks to the same address for both.
import dbModule from "../server/dist/db.js";
import appModule from "../server/dist/app.js";

const { connectDb, ensureAdmin } = dbModule;
const { createApp } = appModule;

const app = createApp();
let ready = null;

export default async function handler(req, res) {
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
