import { Schema, model } from "mongoose";
import { stringId, jsonOptions } from "./_shared";

export interface IReview {
  _id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
  status: "pending" | "published" | "hidden";
}

const reviewSchema = new Schema<IReview>(
  {
    _id: stringId,
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
    // New public reviews wait for admin approval before they show on the site.
    status: { type: String, enum: ["pending", "published", "hidden"], default: "pending", index: true },
  },
  jsonOptions,
);

export const Review = model<IReview>("Review", reviewSchema);
