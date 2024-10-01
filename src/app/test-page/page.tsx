"use client";
import ImageUpload from "@/components/image-upload";
import { CldImage } from "next-cloudinary";

import { CldUploadWidget } from "next-cloudinary";

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function Page() {
  return (
    <div>
      {/* image upload */}
      <ImageUpload />

      {/* image display */}
      {/* <CldImage
        src="cld-sample-5" // Use this sample image or upload your own via the Media Explorer
        width="500" // Transform the image: auto-crop to square aspect_ratio
        height="500"
        crop={{
          type: "auto",
          source: true,
        }}
        alt="image"
      /> */}
    </div>
  );
}
