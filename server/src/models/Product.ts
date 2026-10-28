import { Schema, model } from "mongoose";
import { stringId, jsonOptions } from "./_shared";

export interface IProduct {
  _id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  video?: string;
  description: string;
  tags: string[];
  quoteOnly: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    _id: stringId,
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, index: true },
    sku: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    video: { type: String },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },
    // Bulk / project equipment: shows "Request a Quote" instead of Add to Cart.
    quoteOnly: { type: Boolean, default: false },
  },
  jsonOptions,
);
productSchema.index({ name: "text", brand: "text", tags: "text", category: "text" });

export const Product = model<IProduct>("Product", productSchema);
