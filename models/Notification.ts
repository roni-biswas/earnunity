import mongoose, { Schema, model, models, Document } from "mongoose";

/**
 * Server-side interface representing the Notification Document in MongoDB
 */
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "task_approved" | "task_rejected" | "referral" | "payment" | "system";
  isRead: boolean;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Links to your existing User model
      required: [true, "User ID is required for notification mapping"],
      index: true, // Optimized for fast fetching per user
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Notification message body is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["task_approved", "task_rejected", "referral", "payment", "system"],
      default: "system",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    path: { type: String },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  },
);

// Compiles or retrieves the existing model instantiation safely for Next.js hot-reloading
export const Notification =
  models.Notification ||
  model<INotification>("Notification", NotificationSchema);
