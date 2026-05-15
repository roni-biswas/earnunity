import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { User } from "@/models/User";
import { Job } from "@/models/Job";
import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { status } = await req.json();
    const { id } = await params;

    await connectDB();

    const submission = await Submission.findById(id).populate("jobId");
    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 },
      );
    }

    if (submission.status.toLowerCase() !== "pending") {
      return NextResponse.json(
        { message: "Already processed" },
        { status: 400 },
      );
    }

    if (status === "approved") {
      const rewardAmount = submission.jobId.reward;

      // 1. User-ke find korun tar current balance janar jonno
      const user = await User.findById(submission.userId);
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      // 2. New Balance calculate korun (balanceAfter field-er jonno)
      const newBalance = user.balance + rewardAmount;

      // 3. User Balance Update
      user.balance = newBalance;
      await user.save();

      // 4. Create Transaction
      await Transaction.create({
        userId: submission.userId,
        amount: rewardAmount,
        type: "income",
        category: "task",
        description: `Earned from task: ${submission.jobId.title}`,
        balanceAfter: newBalance,
      });

      // 5. Update Job Count
      const updatedJob = await Job.findByIdAndUpdate(
        submission.jobId._id,
        { $inc: { completedCount: 1 } },
        { new: true },
      );

      if (
        updatedJob &&
        updatedJob.completedCount >= updatedJob.totalVacancies
      ) {
        updatedJob.status = "Full";
        await updatedJob.save();
      }
    }

    // 6. Update Submission Status
    const formattedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    submission.status = formattedStatus;
    await submission.save();

    return NextResponse.json({
      success: true,
      message: `Submission ${status} successfully!`,
    });
  } catch (error) {
    console.error("Admin Update Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error },
      { status: 500 },
    );
  }
}
