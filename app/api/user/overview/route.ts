import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Job } from "@/models/Job";
import { Submission } from "@/models/Submission";
import { Referral } from "@/models/Referral";
import { Withdraw } from "@/models/Withdraw";
import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    // 1. Authenticate user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 },
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // 2. Fetch basic user data (Balance)
    const user = await User.findById(userId).select("balance name email");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // 3. Aggregate Submission stats (Count Pending/Approved/Rejected)
    const submissionStats = await Submission.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // 4. Calculate Total Earned from Approved Submissions
    // We populate jobId to get the reward amount of each approved task
    const approvedSubmissions = await Submission.find({
      userId: userId,
      status: "Approved",
    }).populate({
      path: "jobId",
      select: "reward",
      model: Job,
    });

    const totalEarnedFromTasks = approvedSubmissions.reduce(
      (acc, curr: any) => {
        return acc + (curr.jobId?.reward || 0);
      },
      0,
    );

    // 5. Fetch Referral statistics
    const totalReferrals = await Referral.countDocuments({
      referrerId: userId,
    });

    // Calculate total earnings from referrals specifically
    const referralEarnings = await Referral.aggregate([
      { $match: { referrerId: userId, status: "active" } },
      { $group: { _id: null, total: { $sum: "$rewardAmount" } } },
    ]);

    // 6. Fetch Withdrawal statistics (Completed vs Pending)
    const withdrawStats = await Withdraw.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$status", total: { $sum: "$amount" } } },
    ]);

    // 7. Map values for frontend consumption
    const statsMap = {
      pendingTasks:
        submissionStats.find((s) => s._id === "Pending")?.count || 0,
      completedTasks:
        submissionStats.find((s) => s._id === "Approved")?.count || 0,
      rejectedTasks:
        submissionStats.find((s) => s._id === "Rejected")?.count || 0,
      totalReferrals: totalReferrals,
      referralIncome: referralEarnings[0]?.total || 0,
      totalWithdrawn:
        withdrawStats.find((w) => w._id === "completed")?.total || 0,
      pendingWithdraw:
        withdrawStats.find((w) => w._id === "pending")?.total || 0,
    };

    // 8. Return combined dynamic data
    return NextResponse.json({
      success: true,
      data: {
        user: {
          name: user.name,
          balance: user.balance,
        },
        overview: {
          currentBalance: user.balance,
          totalEarned: totalEarnedFromTasks + (referralEarnings[0]?.total || 0),
          completedTasks: statsMap.completedTasks,
          pendingTasks: statsMap.pendingTasks,
          referralCount: statsMap.totalReferrals,
          withdrawnAmount: statsMap.totalWithdrawn,
        },
      },
    });
  } catch (error) {
    console.error("OVERVIEW_API_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error,
      },
      { status: 500 },
    );
  }
}
