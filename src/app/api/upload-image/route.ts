import { NextResponse } from "next/server";
import { db } from "@/db";
import { images } from "@/db/schema";
import cloudinary from "@/lib/cloudinary";
import { NextRequest } from "next/server";
import streamifier from "streamifier";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as Blob;
    const userId = formData.get("userId") as string;
    const routeId = formData.get("routeId") as string;

    if (!file) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload image to Cloudinary
    let uploadedImage;
    try {
      uploadedImage = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      return NextResponse.json(
        { message: "Error uploading image to Cloudinary" },
        { status: 500 },
      );
    }

    // Save image URL to database
    let image;
    let imageUrl;
    try {
      if (
        typeof uploadedImage === "object" &&
        uploadedImage !== null &&
        "secure_url" in uploadedImage
      ) {
        imageUrl = (uploadedImage as { secure_url: string }).secure_url;
        image = await db.insert(images).values({
          url: imageUrl,
          userId: parseInt(userId),
          routeId: parseInt(routeId),
        });
      } else {
        throw new Error("Invalid uploaded image");
      }
    } catch (dbError) {
      console.error("Database Insertion Error:", dbError);
      return NextResponse.json(
        { message: "Error saving image to database" },
        { status: 500 },
      );
    }
    console.log(image);

    // Return both the image data and the image URL
    return NextResponse.json({ image, imageUrl }, { status: 201 });
  } catch (error) {
    console.error("General Error:", error);
    return NextResponse.json(
      { message: `Error uploading image: ${error}` },
      { status: 500 },
    );
  }
}
