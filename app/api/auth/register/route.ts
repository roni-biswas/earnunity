import connectDB from "@/lib/db";
import { RegisterSchema } from "@/lib/validations/auth";
import { User } from "@/models/User";
import { Referral } from "@/models/Referral";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.message },
        { status: 400 },
      );
    }

    const { name, email, password, deviceId, referralCode } = validation.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 },
      );
    }

    const existingDevice = await User.findOne({ deviceId });
    if (existingDevice) {
      return NextResponse.json(
        {
          success: false,
          message: "Multiple accounts are not allowed on the same device",
        },
        { status: 403 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const submittedCode = referralCode ? referralCode.trim() : null;

    // Generate unique user referral code
    const namePrefix = name
      .split(" ")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const generatedReferralCode = `${namePrefix}${randomSuffix}`;

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      deviceId,
      referredBy: submittedCode,
      referralCode: generatedReferralCode,
      balance: 0,
      role: "user",
    });

    if (submittedCode) {
      const referrerUser = await User.findOne({ referralCode: submittedCode });

      if (
        referrerUser &&
        referrerUser._id.toString() !== newUser._id.toString()
      ) {
        const INSTANT_BONUS = 5;

        await Referral.create({
          referrerId: referrerUser._id,
          referredUserId: newUser._id,
          rewardAmount: INSTANT_BONUS,
          instantBonusPaid: true,
          taskBonusPaid: false,
          status: "inactive",
        });

        await User.updateOne(
          { _id: referrerUser._id },
          { $inc: { balance: INSTANT_BONUS } },
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        userId: newUser._id,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: err.message },
      { status: 500 },
    );
  }
}
