import connectDB from "@/lib/db";
import { Job } from "@/models/Job";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    await Job.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Job deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
