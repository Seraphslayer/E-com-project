import mongoose from "mongoose";
import { config } from "./config";
import { User, createUser } from "./models/User";

export async function connectDb() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("MongoDB connected");
}

/** Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD when the users collection is empty. */
export async function ensureAdmin() {
  if (!config.ADMIN_EMAIL || !config.ADMIN_PASSWORD) return;
  if ((await User.countDocuments()) > 0) return;
  await createUser(config.ADMIN_EMAIL, config.ADMIN_PASSWORD, "Administrator");
  console.log(`Created initial admin account: ${config.ADMIN_EMAIL}`);
}
