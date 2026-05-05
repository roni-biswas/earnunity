import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
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

    console.log("User Job ID:", jobId);

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
