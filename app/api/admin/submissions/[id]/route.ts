import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { User } from "@/models/User";
import { Job } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // Admin check
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { status } = await req.json(); // 'Approved' or 'Rejected'
    const submissionId = params.id;

    const submission =
      await Submission.findById(submissionId).populate("jobId");
    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 },
      );
    }

    if (status === "Approved") {
      // Increase Balance (reward)
      await User.findByIdAndUpdate(submission.userId, {
        $inc: { balance: submission.jobId.reward },
      });

      // Job completed increase count
      const updatedJob = await Job.findByIdAndUpdate(
        submission.jobId._id,
        { $inc: { completedCount: 1 } },
        { new: true },
      );

      // Vacancies is full then show status FULL
      if (updatedJob.completedCount >= updatedJob.totalVacancies) {
        updatedJob.status = "Full";
        await updatedJob.save();
      }
    }

    // Submission status update
    submission.status = status;
    await submission.save();

    return NextResponse.json({
      success: true,
      message: `Submission ${status} successfully!`,
    });
  } catch (error) {
    console.error("Admin Update Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
