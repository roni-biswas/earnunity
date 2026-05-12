import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Updated Validation Schema
const updateSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.string().url("Invalid image URL").optional(),
  currentPassword: z.string().min(6).optional(),
  newPassword: z.string().min(6).optional(),
});

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
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

    // Update Name if provided
    if (validatedData.name) {
      user.name = validatedData.name;
    }

    // Update Profile Image URL from Cloudinary
    if (validatedData.image) {
      user.image = validatedData.image;
    }

    // Handle Password Update logic
    if (validatedData.currentPassword && validatedData.newPassword) {
      // Verify the old password first
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

      // Hash and set new password
      user.password = await bcrypt.hash(validatedData.newPassword, 10);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      // Returning updated info for client-side state sync
      data: {
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 },
    );
  }
}
