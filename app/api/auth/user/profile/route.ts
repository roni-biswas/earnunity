import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Referral } from "@/models/Referral";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import z from "zod";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Fetch user data and exclude sensitive info like password
    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Fetch total referral count for stats
    const totalReferrals = await Referral.countDocuments({
      referrerId: user._id,
    });

    // You can add more complex logic here for levels or extra stats
    const profileData = {
      name: user.name,
      email: user.email,
      balance: user.balance || 0,
      role: user.role,
      level: user.level || "Beginner", // Fallback if level is not defined
      totalReferrals,
      createdAt: user.createdAt,
    };

    return NextResponse.json({ success: true, data: profileData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
