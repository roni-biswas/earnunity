import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Notification } from "@/models/Notification";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
    console.error("CRITICAL ERROR IN NOTIFICATION GET API:", error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 },
    );
  }
}

/**
 * Create a new notification entry and emit payload via global socket architecture (Including Path)
 */
export async function POST(req: Request) {
  try {
    // destructured 'path' from request body
    const { userId, title, message, type, path } = await req.json();

    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    // Saved 'path' into MongoDB safely
    const newNotification = await Notification.create({
      userId,
      title,
      message,
      type,
      path: path || null, // default to null if no custom redirection path is given
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

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    // Request body from single notification id check
    const body = await req.json().catch(() => ({}));
    const { id } = body;

    if (id) {
      //  Specific data read
      await Notification.updateOne(
        { _id: id, userId: session.user.id },
        { $set: { isRead: true } },
      );
      return NextResponse.json({
        success: true,
        message: "Notification marked as read",
      });
    } else {
      // all notification read without any id
      await Notification.updateMany(
        { userId: session.user.id, isRead: false },
        { $set: { isRead: true } },
      );
      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 },
    );
  }
}

export async function PUT() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    // Updates all pending false flags to true instantly upon navbar alert focus
    await Notification.updateMany(
      { userId: session.user.id, isRead: false },
      { $set: { isRead: true } },
    );

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read successfully.",
    });
  } catch (error) {
    console.error("ERROR IN NOTIFICATION PUT API:", error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 },
    );
  }
}
