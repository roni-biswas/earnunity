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

    // Limit 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File size too large (Max 5MB)" },
        { status: 400 },
      );
    }

    // File type validation
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed" },
        { status: 400 },
      );
    }

    // Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    //  Cloudinary Upload
    const uploadResponse: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "earnunity_proofs",
          resource_type: "image",
          quality: "auto:good",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      uploadStream.end(buffer);
    });

    // success response
    return NextResponse.json({
      success: true,
      imageUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error("Internal Upload Error:", error);
    return NextResponse.json(
      { success: false, message: error || "Upload failed" },
      { status: 500 },
    );
  }
}
