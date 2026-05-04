import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Job } from "@/models/Job";

export async function GET() {
  try {
    await connectDB();

    // Fetch active jobs that still have vacancies
    const jobs = await Job.find({
      status: "Active",
      $expr: { $lt: ["$completedCount", "$totalVacancies"] },
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}
