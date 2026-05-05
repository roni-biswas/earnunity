import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 },
      );
    }

    // Validate file type (Professional check)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only images are allowed" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using stream
    const uploadResponse: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "earnunity_proofs", resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      imageUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 },
    );
  }
}
