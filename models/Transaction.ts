import mongoose, { Schema } from "mongoose";

// Transaction Schema
const TransactionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: {
      type: String,
      enum: ["task", "referral", "withdraw", "bonus"],
      required: true,
    },
    description: { type: String, required: true },
    balanceAfter: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
