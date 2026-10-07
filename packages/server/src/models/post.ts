import { Schema, model, type InferSchemaType } from "mongoose";
const postSchema = new Schema(
  {
    title: { type: String, require: true },
    author: String,
    contents: String,
    tags: [String],
  },
  { timestamps: { createdAt: true } },
);

export type Blog = InferSchemaType<typeof postSchema>;
export const Post = model("post", postSchema);
