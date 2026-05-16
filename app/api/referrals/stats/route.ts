import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Referral } from "@/models/Referral";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AggregationResult {
  totalJoined: number;
  activeReferrals: number;
  totalEarnings: number;
}

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const stats = await Referral.aggregate<AggregationResult>([
      {
        $match: { referrerId: userId },
      },
      {
        $group: {
          _id: null,
          totalJoined: { $sum: 1 },
          activeReferrals: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          totalEarnings: { $sum: "$rewardAmount" },
        },
      },
    ]);

    const summary =
      stats.length > 0
        ? stats[0]
        : { totalJoined: 0, activeReferrals: 0, totalEarnings: 0 };
    const pendingReferrals = summary.totalJoined - summary.activeReferrals;

    return NextResponse.json({
      success: true,
      data: {
        totalJoined: summary.totalJoined,
        activeReferrals: summary.activeReferrals,
        totalEarnings: summary.totalEarnings,
        pendingReferrals: pendingReferrals,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: "Error calculating network stats",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
