import { NextResponse } from "next/server";
import { db } from "@/db";
import { projectImages } from "@/db/schema";
import cloudinary from "@/lib/cloudinary";
import { NextRequest } from "next/server";
import streamifier from "streamifier";
import { getCurrentUser } from "@/lib/session";

// for now we are not using this api

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
    const projectId = formData.get("projectId") as string;
    const userId = formData.get("userId") as string;
    const routeId = formData.get("routeId") as string;

    console.log("projectId", projectId);
    console.log("userId", userId);
    console.log("routeId", routeId);

    if (!file || !projectId || !userId || !routeId) {
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
          { folder: "project-images" },
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
        { message: "Error uploading project image to Cloudinary" },
        { status: 500 },
      );
    }

    // Save project image URL to database
    let projectImage;
    try {
      if (
        typeof uploadedImage === "object" &&
        uploadedImage !== null &&
        "secure_url" in uploadedImage
      ) {
        projectImage = await db.insert(projectImages).values({
          projectId: parseInt(projectId),
          userId: parseInt(userId),
          routeId: parseInt(routeId),
          url: (uploadedImage as { secure_url: string }).secure_url,
        });
      } else {
        throw new Error("Invalid uploaded image");
      }
    } catch (error) {
      console.error("Database Insertion Error:", error);
      return NextResponse.json(
        {
          message: `Error saving project image to database: ${error}`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { url: (uploadedImage as { secure_url: string }).secure_url },
      { status: 201 },
    );
  } catch (error) {
    console.error("General Error:", error);
    return NextResponse.json(
      { message: `Error uploading project image: ${error}` },
      { status: 500 },
    );
  }
}
