import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { User } from "@/models/User"; // নিশ্চিত করুন এই মডেলগুলো ইম্পোর্ট আছে
import { Job } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ status: "Pending" })
      .populate("userId", "name email")
      .populate("jobId", "title reward")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments({ status: "Pending" });

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching data" },
      { status: 500 },
    );
  }
}
