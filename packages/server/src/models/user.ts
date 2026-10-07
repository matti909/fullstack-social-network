import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

export type UserSchema = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
