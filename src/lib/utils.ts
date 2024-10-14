import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function optimizeImage(
  file: File,
  MAX_FILE_SIZE: number,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        let quality = 0.7;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > 1920 || height > 1080) {
          const ratio = Math.min(1920 / width, 1080 / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressAndCheck = () => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                if (blob.size <= MAX_FILE_SIZE) {
                  resolve(new File([blob], file.name, { type: "image/jpeg" }));
                } else if (quality > 0.1) {
                  quality -= 0.1;
                  compressAndCheck();
                } else {
                  reject(new Error("Unable to optimize image to under 2MB"));
                }
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            "image/jpeg",
            quality,
          );
        };

        compressAndCheck();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
