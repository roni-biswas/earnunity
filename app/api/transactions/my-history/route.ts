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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Fetch transactions for the logged-in user
    const transactions = await Transaction.find({ userId: session.user.id })
      .sort({ createdAt: -1 }) // Show newest first
      .skip(skip)
      .limit(limit);

    const totalTransactions = await Transaction.countDocuments({
      userId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        total: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
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
