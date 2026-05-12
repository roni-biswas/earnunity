import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Submission } from "@/models/Submission";

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
    const statusFilter = searchParams.get("status");

    // Define a proper Mongoose FilterQuery type
    const query: Record<string, unknown> = {
      userId: session.user.id,
    };

    // Add status filter if provided in the URL
    if (
      statusFilter &&
      ["pending", "approved", "rejected"].includes(statusFilter)
    ) {
      query.status = statusFilter;
    }

    // Fetch history with Job title and reward
    const history = await Submission.find(query)
      .populate("jobId", "title reward")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalSubmissions = await Submission.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: history,
      pagination: {
        total: totalSubmissions,
        totalPages: Math.ceil(totalSubmissions / limit),
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
