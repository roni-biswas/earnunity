import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const { balance } = await req.json();

    if (typeof balance !== "number") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid balance amount",
        },
        { status: 400 },
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { balance: balance } },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Balance updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update balance",
      },
      { status: 500 },
    );
  }
}
