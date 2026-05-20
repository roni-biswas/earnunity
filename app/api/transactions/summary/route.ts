import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
        },
      },
      {
        $group: {
          _id: null,
          totalEarned: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalWithdrawn: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
          taskEarnings: {
            $sum: { $cond: [{ $eq: ["$category", "task"] }, "$amount", 0] },
          },
          referralEarnings: {
            $sum: { $cond: [{ $eq: ["$category", "referral"] }, "$amount", 0] },
          },
        },
      },
    ]);

    const stats =
      summary.length > 0
        ? summary[0]
        : {
            totalEarned: 0,
            totalWithdrawn: 0,
            taskEarnings: 0,
            referralEarnings: 0,
          };

    return NextResponse.json({
      success: true,
      data: {
        totalEarned: stats.totalEarned,
        totalWithdrawn: stats.totalWithdrawn,
        taskEarnings: stats.taskEarnings,
        referralEarnings: stats.referralEarnings,
        netBalance: stats.totalEarned - stats.totalWithdrawn,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: "Error fetching summary", error: err.message },
      { status: 500 },
    );
  }
}
