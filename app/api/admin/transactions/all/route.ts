import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // Admin authorization check
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Fetch all transactions and populate user details to see who did what
    const transactions = await Transaction.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate Platform Totals (Audit)
    const auditSummary = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalDisbursed: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          }, // Money platform gave to users
          totalWithdrawn: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          }, // Money users actually took out
        },
      },
    ]);

    const totalCount = await Transaction.countDocuments();

    return NextResponse.json({
      success: true,
      data: transactions,
      audit: auditSummary[0] || { totalDisbursed: 0, totalWithdrawn: 0 },
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
