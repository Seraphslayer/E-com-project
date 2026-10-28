import mongoose from "mongoose";
import { config } from "./config";
import { connectDb, ensureAdmin } from "./db";
import { createApp } from "./app";

async function main() {
  await connectDb();
  await ensureAdmin();
  const app = createApp();
  const server = app.listen(config.PORT, () => console.log(`FGT API listening on :${config.PORT}`));

  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down`);
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  };
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

main().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
