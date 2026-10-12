
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAdminSession } from "@/lib/admin-session";

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary environment variables are missing. Check your Codespaces .env file."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: "Please sign in to upload images." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Please select an image to upload." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Use a JPG, PNG, WEBP, or GIF image." },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Images must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    configureCloudinary();

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadedImage = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: "simply-smart-money/articles",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Image upload failed."));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      upload.end(buffer);
    });

    return NextResponse.json({
      success: true,
      imageUrl: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    });
  } catch (error: unknown) {
    if (error && typeof error === "object") {
      const cloudinaryError = error as {
        message?: string;
        http_code?: number;
        name?: string;
        error?: { message?: string };
        http_headers?: Record<string, string>;
      };

      console.error("Admin image upload failed:", {
        message: cloudinaryError.message,
        http_code: cloudinaryError.http_code,
        name: cloudinaryError.name,
        details: cloudinaryError.error?.message,
        cloudinaryErrorHeader:
          cloudinaryError.http_headers?.["x-cld-error"] ??
          cloudinaryError.http_headers?.["X-Cld-Error"],
      });
    } else {
      console.error("Admin image upload failed:", error);
    }

    return NextResponse.json(
      {
        error:
          "Image upload failed. Check the Codespaces terminal for the detailed error.",
      },
      { status: 500 }
    );
  }
}
