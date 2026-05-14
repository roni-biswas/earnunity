import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { User } from "@/models/User";
import { Job } from "@/models/Job";
import { Transaction } from "@/models/Transaction"; // Transaction model add
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  // Admin check
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { status } = await req.json(); // 'approved' or 'rejected'
  const { id } = await params;

  // DB Session start (Atomic Transaction)
  await connectDB();
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    const submission = await Submission.findById(id);
    console.log("Current Status:", submission.status);
    // const submission = await Submission.findById(id)
    //   .populate("jobId")
    //   .session(dbSession);

    // if (!submission) {
    //   return NextResponse.json(
    //     { message: "Submission not found" },
    //     { status: 404 },
    //   );
    // }

    // Pro-Tip: already approve/reject then next time are not update
    if (submission.status !== "pending") {
      return NextResponse.json(
        { message: "Already processed" },
        { status: 400 },
      );
    }

    if (status === "approved") {
      const rewardAmount = submission.jobId.reward;

      // 1. Increase Balance
      await User.findByIdAndUpdate(
        submission.userId,
        { $inc: { balance: rewardAmount } },
        { session: dbSession },
      );

      // 2. Create Transaction Record (User earning history)
      await Transaction.create(
        [
          {
            userId: submission.userId,
            amount: rewardAmount,
            type: "credit",
            category: "task_earning",
            description: `Earned from task: ${submission.jobId.title}`,
            status: "success",
          },
        ],
        { session: dbSession },
      );

      // 3. Update Job Count
      const updatedJob = await Job.findByIdAndUpdate(
        submission.jobId._id,
        { $inc: { completedCount: 1 } },
        { new: true, session: dbSession },
      );

      // 4. Check if Job is Full
      if (updatedJob.completedCount >= updatedJob.totalVacancies) {
        updatedJob.status = "Full";
        await updatedJob.save({ session: dbSession });
      }
    }

    // 5. Update Submission Status
    submission.status = status;
    await submission.save({ session: dbSession });

    await dbSession.commitTransaction();
    dbSession.endSession();

    return NextResponse.json({
      success: true,
      message: `Submission ${status} successfully!`,
    });
  } catch (error) {
    // Error
    await dbSession.abortTransaction();
    dbSession.endSession();
    console.error("Admin Update Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
