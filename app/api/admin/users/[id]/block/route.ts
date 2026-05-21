import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    // Establish database connection
    await connectDB();
    const { id } = await params;

    // Fetch user to determine current block status
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Toggle the isBlocked status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { isBlocked: !user.isBlocked } },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      message: updatedUser?.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      data: { isBlocked: updatedUser?.isBlocked },
    });
  } catch (error) {
    console.error("Block API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
