import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Referral } from "@/models/Referral";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Getting query params for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Fetching referrals and populating the 'referredUserId' to get their name/image
    const referrals = await Referral.find({ referrerId: session.user.id })
      .populate("referredUserId", "name image createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReferrals = await Referral.countDocuments({
      referrerId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      data: referrals,
      pagination: {
        total: totalReferrals,
        totalPages: Math.ceil(totalReferrals / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching referral list" },
      { status: 500 },
    );
  }
}
