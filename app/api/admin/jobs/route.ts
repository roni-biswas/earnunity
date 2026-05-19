import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Job } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    // get page and limit
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Fetch data
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total count of jobs
    const totalJobs = await Job.countDocuments();

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        totalItems: totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = await Job.create({
      ...body,
      userId: session.user.id,
    });

    // ===================================================================
    // GLOBAL BROADCAST: Notify all live connected users about the new task
    // ===================================================================
    try {
      const globalIo = (global as any).io;
      if (globalIo) {
        /**
         * Emitting a global event to all sockets currently alive on EarnUnity.
         * We pass structured metadata including title, message, and target routing path.
         */
        globalIo.emit("new_task_published", {
          title: "New Task Available! 🚀",
          message: `A new task "${validatedData.title || "Mission"}" has been posted. Earn rewards now!`,
          path: "/dashboard/tasks", // Redirection hook for client context
        });
      }
    } catch (socketErr) {
      console.error("Global task broadcast notification failed:", socketErr);
    }

    return NextResponse.json({
      success: true,
      message: "Job posted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create job" },
      { status: 500 },
    );
  }
}
