import { Withdraw } from "@/models/Withdraw";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import connectDB from "./db";
import { Transaction } from "@/models/Transaction";
import { Job } from "@/models/Job";
import mongoose from "mongoose";
import { User } from "@/models/User";
import { Submission } from "@/models/Submission";

interface DashboardStats {
  balance: number;
  completedTasks: number;
  referrals: number;
  totalWithdraw: number;
  todayAvailableTasks: number;
  referralCode: string;
}

interface DashboardActivity {
  id: string;
  title: string;
  amount: number;
  status: "Earned" | "Paid";
  date: string;
}

interface DashboardData {
  stats: DashboardStats;
  activities: DashboardActivity[];
}

interface AggregateResult {
  _id: null;
  total: number;
}

interface DBTransaction {
  _id: mongoose.Types.ObjectId;
  description?: string;
  amount?: number;
  type?: "income" | "expense";
  createdAt?: Date;
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

    const user = await User.findById(userId).select(
      "balance name referralCode _id",
    );

    if (!user) return null;

    let finalReferralCode = user.referralCode || "";

    if (!user.referralCode) {
      const firstName = user.name
        ? user.name
            .split(" ")[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
        : "user";
      const userSuffix = user._id.toString().slice(-4);
      finalReferralCode = `${firstName}${userSuffix}`;

      await User.updateOne(
        { _id: userId },
        { $set: { referralCode: finalReferralCode } },
      );
    }

    const [
      completedTasks,
      withdrawData,
      referralData,
      availableTasks,
      recentTransactions,
    ] = await Promise.all([
      Submission.countDocuments({
        userId,
        status: "Approved",
      }),
      Withdraw.aggregate<AggregateResult>([
        { $match: { userId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate<AggregateResult>([
        { $match: { userId, category: "referral" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Job.countDocuments({
        status: "Active",
        $expr: { $lt: ["$completedCount", "$totalVacancies"] },
      }),
      Transaction.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean<DBTransaction[]>(),
    ]);

    const activities: DashboardActivity[] = recentTransactions.map((tx) => ({
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

    return {
      stats: {
        balance: user.balance || 0,
        completedTasks,
        referrals: referralData[0]?.total || 0,
        totalWithdraw: withdrawData[0]?.total || 0,
        todayAvailableTasks: availableTasks,
        referralCode: finalReferralCode,
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

export async function getWithdrawPageData() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) return null;

    const userId = session.user.id;

    // Fetch data in parallel using destructuring for clarity
    const [user, history, pendingAggregation] = await Promise.all([
      User.findById(userId).select("balance"),
      Withdraw.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Withdraw.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            status: "pending",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    // Extract pending total safely
    const pendingBalance =
      pendingAggregation.length > 0 ? pendingAggregation[0].total : 0;

    return {
      balance: user?.balance || 0,
      pendingBalance: pendingBalance,
      history: history.map((doc) => ({
        id: doc._id.toString(),
        amount: doc.amount,
        method: doc.method,
        accountNumber: doc.accountNumber,
        status: doc.status as "pending" | "completed" | "rejected",
        date: new Date(doc.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      })),
    };
  } catch (error: unknown) {
    console.error("WITHDRAW_PAGE_DATA_ERROR:", error);
    return null;
  }
}

/**
 * Fetch withdrawal history with pagination logic
 */
export async function getAllWithdrawHistory(
  page: number = 1,
  limit: number = 10,
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { history: [], totalPages: 0, totalCount: 0 };
    }

    const userId = session.user.id;
    const skip = (page - 1) * limit;

    // Fetch records and total count in parallel
    const [history, totalCount] = await Promise.all([
      Withdraw.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Withdraw.countDocuments({ userId }),
    ]);

    const formattedHistory = history.map((doc) => ({
      id: doc._id.toString(),
      amount: doc.amount,
      method: doc.method,
      accountNumber: doc.accountNumber,
      status: doc.status as "pending" | "completed" | "rejected",
      date: new Date(doc.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    return {
      history: formattedHistory,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    };
  } catch (error: unknown) {
    console.error("ALL_WITHDRAW_FETCH_ERROR:", error);
    return { history: [], totalPages: 0, totalCount: 0 };
  }
}
