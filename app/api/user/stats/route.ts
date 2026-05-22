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
    // Check user authentication session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Connect to the database
    await connectDB();

    // 1. Fetch only required fields based on the User model schema
    const user = await User.findOne({ email: session.user.email })
      .select("balance referralCode")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found in database" },
        { status: 404 },
      );
    }

    // 2. Count completed tasks approved by admin from Submission collection
    const completedTasksCount = await Submission.countDocuments({
      userId: user._id,
      status: "approved",
    });

    // 3. Count total referrals by tracking how many users joined using this user's referral code
    const referralCount = await User.countDocuments({
      referredBy: user.referralCode,
    });

    // Return the sanitized and optimized stats to the dashboard
    return NextResponse.json({
      success: true,
      stats: {
        balance: user.balance || 0,
        completedTasks: completedTasksCount || 0,
        referrals: referralCount || 0,
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
