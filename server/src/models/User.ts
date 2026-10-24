import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { stringId, jsonOptions } from "./_shared";

interface IUser {
  _id: string;
  email: string;
  name: string;
  role: "admin";
  passwordHash: string;
}

const userSchema = new Schema<IUser>(
  {
    _id: stringId,
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "Administrator" },
    role: { type: String, enum: ["admin"], default: "admin" },
    passwordHash: { type: String, required: true, select: false },
  },
  jsonOptions,
);

export const User = model<IUser>("User", userSchema);

export async function createUser(email: string, password: string, name = "Administrator") {
  const passwordHash = await bcrypt.hash(password, 12);
  return User.create({ email, name, passwordHash });
}

export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);
