import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "client";
  balance: number;
  deviceId: string;
  referredBy: string | null;
  isBlocked: boolean;
  referralCode: string; // এটি এখন স্ট্রিক্টলি রিকোয়ার্ড স্ট্রিং
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "client"], default: "user" },
    balance: { type: Number, default: 0 },
    deviceId: { type: String, required: true, unique: true },
    referredBy: { type: String, default: null },
    isBlocked: { type: Boolean, default: false },
    referralCode: {
      type: String,
      required: true,
      unique: true,
    },
    image: { type: String },
  },
  { timestamps: true },
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
