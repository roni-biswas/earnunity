import { NextResponse } from "next/server";
import { Notification } from "@/models/Notification";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Batch update all unread notifications for the authenticated session user
 */
export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    // Perform mass database update condition matching the target user context
    await Notification.updateMany(
      { userId: session.user.id, isRead: false },
      { $set: { isRead: true } },
    );

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 },
    );
  }
}
