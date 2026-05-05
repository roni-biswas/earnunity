import mongoose, { Schema } from "mongoose";

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String }, // Icon or image URL
    category: {
      type: String,
      enum: ["YouTube", "Facebook", "App", "Survey", "Other"],
      default: "Other",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reward: { type: Number, required: true },
    instructions: { type: String, required: true }, // Step by step instructions
    proofType: {
      type: String,
      enum: ["Screenshot", "Username", "TransactionID"],
      default: "Screenshot",
    },
    totalVacancies: { type: Number, required: true },
    completedCount: { type: Number, default: 0 },
    externalLink: { type: String }, // Link to the YT video or FB page
    status: {
      type: String,
      enum: ["Active", "Paused", "Full"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);
