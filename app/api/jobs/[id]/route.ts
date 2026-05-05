import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Job } from "@/models/Job";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const job = await Job.findById(params.id);

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid Job ID" },
      { status: 400 },
    );
  }
}
