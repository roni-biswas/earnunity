import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { User } from "@/models/User";
import { Job } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

//  approval/rejection logic
const ApprovalSchema = z.object({
  status: z.enum(["Approved", "Rejected"]),
  adminFeedback: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // Strict Admin Check
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const validation = ApprovalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    const submission = await Submission.findById(params.id).populate("jobId");
    if (!submission || submission.status !== "Pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Submission not found or already processed",
        },
        { status: 404 },
      );
    }

    if (body.status === "Approved") {
      // 1. Credit the reward to the user's balance
      await User.findByIdAndUpdate(submission.userId, {
        $inc: { balance: submission.jobId.reward },
      });

      // 2. Increment completed count in Job model
      await Job.findByIdAndUpdate(submission.jobId._id, {
        $inc: { completedCount: 1 },
      });
    }

    // Update submission status
    submission.status = body.status;
    submission.adminFeedback = body.adminFeedback || "";
    await submission.save();

    return NextResponse.json({
      success: true,
      message: `Submission ${body.status} successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 },
    );
  }
}
