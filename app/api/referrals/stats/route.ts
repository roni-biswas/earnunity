import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Referral } from "@/models/Referral";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    // Using MongoDB Aggregation for efficient stats calculation
    const stats = await Referral.aggregate([
      { $match: { referrerId: session.user.id } },
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
        : {
            totalJoined: 0,
            activeReferrals: 0,
            totalEarnings: 0,
          };

    return NextResponse.json({
      success: true,
      data: {
        totalJoined: summary.totalJoined,
        activeReferrals: summary.activeReferrals,
        totalEarnings: summary.totalEarnings,
        pendingReferrals: summary.totalJoined - summary.activeReferrals,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error calculating stats" },
      { status: 500 },
    );
  }
}
