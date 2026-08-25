import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Pre-processes and compresses high-resolution raster images in the browser
 * to prevent HTTP 413 (Payload Too Large) on Vercel / serverless functions.
 */
async function optimizeImageForUpload(file: File): Promise<File | Blob> {
  if (typeof window === "undefined") return file;

  const fileType = (file.type || "").toLowerCase();
  const fileName = (file.name || "").toLowerCase();

  // SVGs and GIFs are preserved directly
  if (
    fileType === "image/svg+xml" ||
    fileName.endsWith(".svg") ||
    fileType === "image/gif" ||
    fileName.endsWith(".gif")
  ) {
    return file;
  }
  
  // If file is already small (under 750KB), send directly
  if (file.size < 750 * 1024) return file;

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const maxDim = 1920;
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.85
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };

      img.src = url;
    } catch {
      resolve(file);
    }
  });
}

export async function uploadImageToSupabase(
  file: File,
  bucket: string = "cmhcb-media"
): Promise<string> {
  // Compress before sending over network to avoid 413 limits
  const preparedFile = await optimizeImageForUpload(file);

  const formData = new FormData();
  formData.append("file", preparedFile);
  formData.append("bucket", bucket);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try {
    data = await response.json();
  } catch {
    if (response.status === 413) {
      throw new Error("File size is too large for the server. Please choose a smaller image.");
    }
    throw new Error(`Server returned status ${response.status} (${response.statusText || "Upload failed"})`);
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.error || `Failed to upload image (status: ${response.status})`);
  }

  return data.url;
}
