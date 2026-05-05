import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SubmissionFormSchema } from "@/lib/validations/submission";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    // Validate request body using Zod
    const validation = SubmissionFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Check if the user has already submitted proof for this specific job
    const existingSubmission = await Submission.findOne({
      jobId: body.jobId,
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

    // Create new submission record
    const newSubmission = await Submission.create({
      ...body,
      userId: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Proof submitted successfully!",
        data: newSubmission,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Submission Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
