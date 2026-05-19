import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Notification } from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Parse URL params for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Fetch total count and data in parallel
    const [notifications, total] = await Promise.all([
      Notification.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ userId: session.user.id }),
    ]);

    const hasMore = skip + notifications.length < total;

    return NextResponse.json({
      success: true,
      notifications,
      hasMore,
      total,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: "Server Error", error: err.message },
      { status: 500 },
    );
  }
}
