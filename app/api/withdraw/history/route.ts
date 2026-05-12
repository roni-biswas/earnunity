import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Withdraw } from "@/models/Withdraw";
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

    // Fetch user's own withdrawal requests
    const history = await Withdraw.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Withdraw.countDocuments({ userId: session.user.id });

    return NextResponse.json({
      success: true,
      data: history,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
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
