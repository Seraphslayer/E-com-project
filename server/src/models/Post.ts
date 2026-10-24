import { Schema, model } from "mongoose";
import { stringId, jsonOptions } from "./_shared";

const postSchema = new Schema(
  {
    _id: stringId,
    author: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    category: { type: String, default: "Update" },
    image: String,
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  jsonOptions,
);

export const Post = model("Post", postSchema);
