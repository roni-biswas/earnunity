import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { User } from "@/models/User"; // ইউজার মডেল ইম্পোর্ট করুন
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { status } = await req.json(); // status ('Approved' or 'Rejected')
    const submissionId = params.id;

    // submitted
    const submission =
      await Submission.findById(submissionId).populate("jobId");

    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 },
      );
    }

    if (submission.status !== "Pending") {
      return NextResponse.json(
        { message: "Already processed" },
        { status: 400 },
      );
    }

    // if admin approved
    if (status === "Approved") {
      const amountToAdd = submission.jobId.earnings; // job payment amount

      // update user amount
      await User.findByIdAndUpdate(submission.userId, {
        $inc: { balance: amountToAdd }, // balance
      });
    }

    // updated submission status
    submission.status = status;
    await submission.save();

    return NextResponse.json({
      success: true,
      message: `Submission ${status} successfully!`,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
