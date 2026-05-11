import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Job } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const jobs = await Job.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
