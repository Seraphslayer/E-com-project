import { Schema, model } from "mongoose";
import { stringId, jsonOptions } from "./_shared";

export const QUOTE_STATUSES = ["new", "contacted", "quoted", "won", "closed"] as const;

const quoteSchema = new Schema(
  {
    _id: stringId,
    name: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    category: String,
    items: { type: String, default: "" },
    message: { type: String, default: "" },
    status: { type: String, enum: QUOTE_STATUSES, default: "new", index: true },
    internalNotes: String,
  },
  jsonOptions,
);

export const Quote = model("Quote", quoteSchema);
