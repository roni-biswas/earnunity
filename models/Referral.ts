import mongoose, { Schema } from "mongoose";

// Mongoose Schema
const ReferralSchema = new Schema(
  {
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    rewardAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true },
);

export const Referral =
  mongoose.models.Referral || mongoose.model("Referral", ReferralSchema);
