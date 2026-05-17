import { NextResponse } from "next/server";
import { Notification } from "@/models/Notification";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Fetch top 20 latest notifications for the authenticated user context
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const notifications = await Notification.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 },
    );
  }
}

/**
 * Create a new notification entry and emit payload via global socket architecture
 */
export async function POST(req: Request) {
  try {
    const { userId, title, message, type } = await req.json();

    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    const newNotification = await Notification.create({
      userId,
      title,
      message,
      type,
    });

    // Extract global runtime socket instance bound in server.ts
    const globalIo = (global as any).io;
    if (globalIo) {
      // Broadcast payload exclusively to the isolated user room
      globalIo.to(userId).emit("new_notification", newNotification);
    }

    return NextResponse.json({ success: true, notification: newNotification });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 },
    );
  }
}
