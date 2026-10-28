// Loads the demo catalog into an empty database.
//   npm run seed            -> only fills collections that are empty
//   npm run seed -- --reset -> wipes products, reviews and posts first (orders/quotes/users are never touched)
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { config } from "../config";
import { connectDb, ensureAdmin } from "../db";
import { Product } from "../models/Product";
import { Review } from "../models/Review";
import { Post } from "../models/Post";

const seedDir = path.resolve(__dirname, "../../seed");
const read = (name: string) => JSON.parse(fs.readFileSync(path.join(seedDir, name), "utf8")) as object[];

async function fill(label: string, model: mongoose.Model<any>, file: string, reset: boolean) {
  if (reset) await model.deleteMany({});
  if ((await model.countDocuments()) > 0) {
    console.log(`${label}: already has data, skipped (use --reset to replace)`);
    return;
  }
  const docs = read(file);
  await model.insertMany(docs);
  console.log(`${label}: inserted ${docs.length}`);
}

async function main() {
  const reset = process.argv.includes("--reset");
  if (reset && config.isProd && !process.argv.includes("--yes")) {
    console.error("Refusing to --reset in production without --yes.");
    process.exit(1);
  }
  await connectDb();
  await fill("products", Product, "products.json", reset);
  await fill("reviews", Review, "reviews.json", reset);
  await fill("posts", Post, "posts.json", reset);
  await ensureAdmin();
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
