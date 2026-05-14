import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Submission } from "@/models/Submission";

/**
 * GET: Fetch User Statistics for Dashboard
 * Visibility: Private (User only)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    // 1. Fetch user balance and referral count directly from User model
    const user = await User.findOne({ email: session.user.email }).select(
      "balance referrals",
    );

    // 2. Count completed tasks from Submission model
    const completedTasksCount = await Submission.countDocuments({
      userId: user._id,
      status: "approved", // Only count tasks that were approved by admin
    });

    return NextResponse.json({
      success: true,
      stats: {
        balance: user.balance || 0,
        completedTasks: completedTasksCount || 0,
        referrals: user.referrals?.length || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
