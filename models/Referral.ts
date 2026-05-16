import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReferral extends Document {
  referrerId: mongoose.Types.ObjectId;
  referredUserId: mongoose.Types.ObjectId;
  rewardAmount: number;
  instantBonusPaid: boolean;
  taskBonusPaid: boolean;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
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
    instantBonusPaid: { type: Boolean, default: false },
    taskBonusPaid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true },
);

export const Referral: Model<IReferral> =
  mongoose.models.Referral ||
  mongoose.model<IReferral>("Referral", ReferralSchema);
