import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Submission } from "@/models/Submission";
import { Job } from "@/models/Job";
import { Withdraw } from "@/models/Withdraw";
import { Transaction } from "@/models/Transaction";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parallel data fetching from multiple models
    const [approvedTasks, availableTasks, withdrawals, recentTransactions] =
      await Promise.all([
        Submission.countDocuments({ userId: user._id, status: "approved" }),
        Job.countDocuments({ status: "active" }),
        Withdraw.aggregate([
          { $match: { userId: user._id, status: "approved" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Transaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5),
      ]);

    const data = {
      stats: {
        balance: user.balance || 0,
        completedTasks: approvedTasks || 0,
        referrals: user.referrals?.length || 0,
        totalWithdraw: withdrawals[0]?.total || 0,
        todayAvailableTasks: availableTasks || 0,
        referralCode: user.referralCode || user._id.toString().slice(-6),
      },
      activities: recentTransactions.map((tx) => ({
        id: tx._id.toString(),
        title: tx.description || "Transaction",
        amount: tx.amount || 0,
        status: tx.status,
        date: new Date(tx.createdAt).toLocaleDateString("en-GB"),
      })),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
