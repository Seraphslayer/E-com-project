// One-off helper: regenerates server/seed/*.json from the frontend's demo data
// (../src/data/mockData.ts). Run with `npm run export-seed`; the JSON files are committed.
import fs from "node:fs";
import path from "node:path";
import { products, reviews, blogPosts } from "../../../src/data/mockData";

const out = path.resolve(__dirname, "../../seed");
fs.mkdirSync(out, { recursive: true });
const write = (name: string, data: unknown) =>
  fs.writeFileSync(path.join(out, name), JSON.stringify(data, null, 2) + "\n");

write(
  "products.json",
  products.map(({ id, ...p }) => ({ _id: id, ...p, images: p.images?.length ? p.images : [p.image] })),
);
write(
  "reviews.json",
  reviews.map(({ id, avatar: _a, date: _d, ...r }) => ({ _id: id, ...r, status: "published" })),
);
write(
  "posts.json",
  blogPosts.map(({ id, avatar: _a, date: _d, ...p }) => ({ _id: id, ...p, published: true })),
);
console.log(`Wrote ${products.length} products, ${reviews.length} reviews, ${blogPosts.length} posts to ${out}`);
