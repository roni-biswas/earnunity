import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

//
export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // Check user is admin or not
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins only." },
        { status: 403 },
      );
    }

    // all pending submission data get
    const submissions = await Submission.find()
      .populate("userId", "name email")
      .populate("jobId", "title earnings")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.error("Admin Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}
