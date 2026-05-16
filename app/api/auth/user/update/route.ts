import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateSchema = z
  .object({
    name: z.string().min(2).optional(),
    image: z.string().url("Invalid image URL").or(z.literal("")).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.currentPassword || data.newPassword) {
        return (
          !!data.currentPassword &&
          !!data.newPassword &&
          data.currentPassword.length >= 6 &&
          data.newPassword.length >= 6
        );
      }
      return true;
    },
    {
      message:
        "Both current and new passwords are required and must be at least 6 characters",
      path: ["newPassword"],
    },
  );

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const validatedData = updateSchema.parse(body);

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (validatedData.name) {
      user.name = validatedData.name;
    }

    if (validatedData.image !== undefined) {
      user.image = validatedData.image;
    }

    if (validatedData.currentPassword && validatedData.newPassword) {
      const isMatch = await bcrypt.compare(
        validatedData.currentPassword,
        user.password,
      );
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Incorrect current password" },
          { status: 400 },
        );
      }

      user.password = await bcrypt.hash(validatedData.newPassword, 10);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: user.name,
        image: user.image,
      },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: "Update failed", error: err.message },
      { status: 500 },
    );
  }
}
