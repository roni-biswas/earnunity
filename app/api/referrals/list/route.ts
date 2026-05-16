import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Referral } from "@/models/Referral";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const totalLogs = await Referral.countDocuments({
      referrerId: session.user.id,
    });

    const logs = await Referral.find({ referrerId: session.user.id })
      .populate("referredUserId", "name image createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalLogs / limit),
        totalItems: totalLogs,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching referral list",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
