import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Fetch transactions and total count in parallel to speed up execution
    const [transactions, totalTransactions] = await Promise.all([
      Transaction.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // lean() improves performance by returning plain JS objects
      Transaction.countDocuments({ userId: session.user.id }),
    ]);

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        total: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
        currentPage: page,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: "Server Error", error: err.message },
      { status: 500 },
    );
  }
}
