import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Referral } from "@/models/Referral";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const totalReferrals = await Referral.countDocuments({
      referrerId: user._id,
    });

    const profileData = {
      name: user.name,
      email: user.email,
      balance: user.balance || 0,
      role: user.role,
      level: (user as any).level || "Beginner",
      totalReferrals,
      createdAt: user.createdAt,
    };

    return NextResponse.json({ success: true, data: profileData });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: "Server Error", error: err.message },
      { status: 500 },
    );
  }
}
