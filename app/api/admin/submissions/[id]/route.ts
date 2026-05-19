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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const isApproved = status === "approved";

    if (isApproved) {
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

          /* 1. Send live notification to the Referrer (Converted to string & updated currency symbol) */
          try {
            await fetch(`${siteUrl}/api/notifications`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: referralTrack.referrerId.toString(),
                title: "Referral Milestone Bonus! 👥💸",
                message: `You earned ৳${TASK_COMPLETION_BONUS} milestone bonus because ${user.name} completed their first task.`,
                type: "referral",
                path: "/dashboard/referrals",
              }),
            });
          } catch (notifErr) {
            console.error("Failed to send referral notification:", notifErr);
          }
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

    // Update Submission Status in DB
    const formattedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    submission.status = formattedStatus;
    await submission.save();

    const dynamicPath = `/dashboard/tasks/${submission.jobId._id}`;

    /* 2. Send live notification to the Worker / Task Submitter (Fixed string parsing & currency) */
    try {
      await fetch(`${siteUrl}/api/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: submission.userId.toString(),
          title: isApproved ? "Task Approved! 🎉" : "Task Rejected ❌",
          message: isApproved
            ? `Your submission for '${submission.jobId.title}' has been approved. ৳${submission.jobId.reward} added to your wallet.`
            : `Your submission for '${submission.jobId.title}' was rejected by admin. Please check the task guidelines.`,
          type: isApproved ? "task_approved" : "task_rejected",
          path: dynamicPath,
        }),
      });
    } catch (notifErr) {
      console.error("Failed to send task worker notification:", notifErr);
    }

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
