import connectDB from "@/lib/db";
import { RegisterSchema } from "@/lib/validations/auth";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate Input with Zod
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.message,
        },
        { status: 400 },
      );
    }

    const { name, email, password, deviceId, referralCode } = validation.data;

    // Check if Email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 400 },
      );
    }

    // Security: Check if Device ID already exists
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

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      deviceId,
      referredBy: referralCode || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        userId: newUser._id,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
