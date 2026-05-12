import mongoose, { Schema } from "mongoose";

// Withdraw Schema
const WithdrawSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["bKash", "Nagad", "Rocket"],
      required: true,
    },
    accountNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Withdraw =
  mongoose.models.Withdraw || mongoose.model("Withdraw", WithdrawSchema);
