import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { Job } from "@/models/Job"; // Imported to fetch job metadata for admin description
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiSubmissionSchema } from "@/lib/validations/submission";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    // zod validation
    const validation = ApiSubmissionSchema.safeParse(body);
    if (!validation.success) {
      console.log(
        "ZOD ERROR DETAILS:",
        JSON.stringify(validation.error.format(), null, 2),
      );
      return NextResponse.json(
        {
          success: false,
          message: "Invalid data submitted",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { jobId, proofText, proofImage } = validation.data;

    // duplicate data check
    const existingSubmission = await Submission.findOne({
      jobId,
      userId: session.user.id,
    });

    if (existingSubmission) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already submitted proof for this task.",
        },
        { status: 400 },
      );
    }

    // save in database
    const newSubmission = await Submission.create({
      jobId,
      userId: session.user.id,
      proofText,
      proofImage,
      status: "Pending",
    });

    /* --- Trigger Live Notification to Admin Panel --- */
    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      const adminUserId = process.env.ADMIN_ID;

      if (adminUserId) {
        // Fetching the job details to display the exact title to the admin
        const targetJob = await Job.findById(jobId).select("title");
        const jobTitle = targetJob ? targetJob.title : "Micro Task";

        await fetch(`${siteUrl}/api/notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: adminUserId,
            title: "New Task Submitted! 📥",
            message: `${session.user.name} submitted proof for task: '${jobTitle}'. Needs verification.`,
            type: "system",
            path: "/admin/submissions",
          }),
        });
      } else {
        console.warn(
          "Notification skipped: ADMIN_ID is not defined in environment variables.",
        );
      }
    } catch (notifErr) {
      console.error(
        "Failed to route task submission notification to admin:",
        notifErr,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Proof submitted successfully!",
        data: newSubmission,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Submission API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server Error. Please try again later.",
      },
      { status: 500 },
    );
  }
}
