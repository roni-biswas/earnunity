import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 },
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Avatar size too large (Max 2MB)" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "earnunity_avatars",
          resource_type: "image",
          transformation: [
            {
              width: 200,
              height: 200,
              crop: "fill",
              gravity: "face",
              quality: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Avatar Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      uploadStream.end(buffer);
    });

    const secureUrl = uploadResponse.secure_url;

    /* CRITICAL FIX: Directly update and persist the image URL in the MongoDB User document */
    await User.findByIdAndUpdate(session.user.id, {
      image: secureUrl,
    });

    return NextResponse.json({
      success: true,
      imageUrl: secureUrl,
    });
  } catch (error: unknown) {
    console.error("Internal Avatar Upload Error:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || "Upload failed" },
      { status: 500 },
    );
  }
}
