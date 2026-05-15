import { Withdraw } from "@/models/Withdraw";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import connectDB from "./db";
import { Transaction } from "@/models/Transaction";
import { Job } from "@/models/Job";
import mongoose from "mongoose";
import { User } from "@/models/User";
import { Submission } from "@/models/Submission";

// Define return types for better type safety
export interface DashboardData {
  stats: {
    balance: number;
    completedTasks: number;
    referrals: number;
    totalWithdraw: number;
    todayAvailableTasks: number;
    referralCode: string;
  };
  activities: {
    id: string;
    title: string;
    amount: number;
    status: string;
    date: string;
  }[];
}

export async function getOverviewData(): Promise<DashboardData | null> {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      console.log("No session found");
      return null;
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // 1. Fetch User details safely
    const user = await User.findById(userId).select("balance name _id").lean();

    // 2. Count Completed Tasks
    const completedTasks = await Submission.countDocuments({
      userId,
      status: "Approved",
    });

    // 3. Calculate Total Withdraw (Aggregate returns array)
    const withdrawData = await Withdraw.aggregate([
      { $match: { userId, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // 4. Calculate Referral Earnings
    const referralData = await Transaction.aggregate([
      { $match: { userId, category: "referral" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // 5. Available Tasks count
    const availableTasks = await Job.countDocuments({
      status: "Active",
      $expr: { $lt: ["$completedCount", "$totalVacancies"] },
    });

    // 6. Fetch Recent Activities with proper Type
    const recentTransactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const activities = recentTransactions.map((tx) => ({
      id: tx._id.toString(),
      title: tx.description || "Activity",
      amount: tx.amount || 0,
      status: tx.type === "income" ? "Earned" : "Paid",
      date: tx.createdAt
        ? new Date(tx.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "N/A",
    }));

    // 7. Safe Referral Code generation (Split error fixed)
    const firstName = user?.name
      ? user.name.split(" ")[0].toLowerCase()
      : "user";
    const userSuffix = user?._id ? user._id.toString().slice(-4) : "123";
    const GenReferralCode = `${firstName}${userSuffix}`;

    return {
      stats: {
        balance: user?.balance || 0,
        completedTasks,
        referrals: referralData[0]?.total || 0,
        totalWithdraw: withdrawData[0]?.total || 0,
        todayAvailableTasks: availableTasks,
        referralCode: GenReferralCode,
      },
      activities,
    };
  } catch (error) {
    console.error("Data Fetch Error:", error);
    return null;
  }
}

// Get available jobs with type safety
export async function getJobs(page: number = 1, limit: number = 6) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/jobs?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Fetch Jobs Error:", error);
    return null;
  }
}
