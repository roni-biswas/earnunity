import mongoose, { Schema } from "mongoose";

const SubmissionSchema = new Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    proofText: { type: String, required: true },
    proofImage: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminFeedback: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Submission =
  mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
