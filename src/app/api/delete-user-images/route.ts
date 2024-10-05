import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { db } from "@/db";
import { images } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 },
    );
  }
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Fetch all images related to the user
    const userImages = await db
      .select()
      .from(images)
      .where(eq(images.userId, userId));

    // Delete each image from Cloudinary
    for (const image of userImages) {
      const publicId = image.url.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
    // also delete the images from the database
    await db.delete(images).where(eq(images.userId, userId));

    return NextResponse.json({ message: "Images deleted successfully" });
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to delete images" },
      { status: 500 },
    );
  }
}
