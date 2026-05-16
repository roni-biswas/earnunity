import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { User } from "@/models/User";
import { Job } from "@/models/Job";
import { Transaction } from "@/models/Transaction";
import { Referral } from "@/models/Referral";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
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

      const user = await User.findById(submission.userId);
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      const newBalance = user.balance + rewardAmount;
      user.balance = newBalance;
      await user.save();

      await Transaction.create({
        userId: submission.userId,
        amount: rewardAmount,
        type: "income",
        category: "task",
        description: `Earned from task: ${submission.jobId.title}`,
        balanceAfter: newBalance,
      });

      const referralTrack = await Referral.findOne({
        referredUserId: submission.userId,
        taskBonusPaid: false,
      });

      if (referralTrack) {
        const TASK_COMPLETION_BONUS = 15;
        const referrerUser = await User.findById(referralTrack.referrerId);

        if (referrerUser) {
          const referrerNewBalance =
            referrerUser.balance + TASK_COMPLETION_BONUS;

          referrerUser.balance = referrerNewBalance;
          await referrerUser.save();

          await Referral.updateOne(
            { _id: referralTrack._id },
            {
              $inc: { rewardAmount: TASK_COMPLETION_BONUS },
              $set: { taskBonusPaid: true, status: "active" },
            },
          );

          await Transaction.create({
            userId: referralTrack.referrerId,
            amount: TASK_COMPLETION_BONUS,
            type: "income",
            category: "referral",
            description: `Referral milestone bonus from: ${user.name}`,
            balanceAfter: referrerNewBalance,
          });
        }
      }

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

    const formattedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    submission.status = formattedStatus;
    await submission.save();

    return NextResponse.json({
      success: true,
      message: `Submission ${status} successfully!`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Admin Update Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 },
    );
  }
}
