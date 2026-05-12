import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const userId = id;

    // Fetch all records for this specific user
    const userTransactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });

    // Summary for this specific user to spot patterns
    const userStats = await Transaction.aggregate([
      { $match: { userId: new Object(userId) } }, // Use mongoose.Types.ObjectId(userId) if needed
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: userTransactions,
      analysis: userStats, // Shows how much earned from tasks vs referrals
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
