import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Job } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

// create jobs for api //
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // Strict Admin Check
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required" },
        { status: 401 },
      );
    }

    const body = await req.json();

    // Model validation and creation
    const newJob = await Job.create({
      ...body,
      completedCount: 0,
      status: "Active",
    });

    return NextResponse.json(
      { success: true, message: "Job created!", data: newJob },
      { status: 201 },
    );
  } catch (error) {
    console.error("Job Post Error:", error);
    return NextResponse.json(
      { success: false, message: error || "Internal Server Error" },
      { status: 500 },
    );
  }
}
