import { NextResponse } from "next/server";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import sharp from "sharp";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Authenticate the admin session
    await getRequiredAdminSession();
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "cmhcb-media";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit." }, { status: 400 });
    }

    // Validate type and extension (must be image)
    const fileType = (file.type || "").toLowerCase();
    const fileNameLower = (file.name || "").toLowerCase();
    const isImageMime = fileType.startsWith("image/") || [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/jfif",
      "image/pjpeg",
      "image/x-png",
      "image/bmp",
    ].includes(fileType);
    const hasImageExt = /\.(jpg|jpeg|png|webp|gif|svg|jfif|bmp)$/i.test(fileNameLower);

    if (!isImageMime && !hasImageExt) {
      return NextResponse.json(
        { error: "Invalid file type. Only image files (JPG, PNG, WebP, GIF, SVG) are allowed." },
        { status: 400 }
      );
    }

    // 3. Read file into a buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    let outputBuffer: Buffer;
    let fileExt = "webp";
    let contentType = "image/webp";

    // SVGs are vector graphic files; upload directly without raster processing
    const isSvg = fileType === "image/svg+xml" || fileNameLower.endsWith(".svg");
    const isGif = fileType === "image/gif" || fileNameLower.endsWith(".gif");

    if (isSvg) {
      outputBuffer = inputBuffer;
      fileExt = "svg";
      contentType = "image/svg+xml";
    } else if (isGif) {
      outputBuffer = inputBuffer;
      fileExt = "gif";
      contentType = "image/gif";
    } else {
      // 4. Process raster images with sharp
      let sharpInstance = sharp(inputBuffer);
      
      // Auto-orient based on EXIF tag (critical for portrait smartphone photos)
      sharpInstance = sharpInstance.rotate();

      // Read metadata to check dimensions
      const metadata = await sharpInstance.metadata();
      const maxWidth = 1920;
      const maxHeight = 1920;

      if ((metadata.width && metadata.width > maxWidth) || (metadata.height && metadata.height > maxHeight)) {
        sharpInstance = sharpInstance.resize({
          width: maxWidth,
          height: maxHeight,
          fit: "inside",
          withoutEnlargement: true
        });
      }

      // Convert to WebP format and compress
      outputBuffer = await sharpInstance.webp({ quality: 85 }).toBuffer();
    }

    // 5. Initialize Supabase Admin client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server error: Supabase service key is missing." },
        { status: 500 }
      );
    }

    const supabaseAdmin = createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 6. Upload buffer to Supabase storage
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${randomString}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    let { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, outputBuffer, {
        contentType,
        cacheControl: "31536000", // 1 year cache control for static assets
        upsert: false,
      });

    if (uploadError && uploadError.message?.toLowerCase().includes("not found")) {
      // Auto-create bucket if missing
      await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
      });
      // Retry upload
      const retryResult = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, outputBuffer, {
          contentType,
          cacheControl: "31536000",
          upsert: false,
        });
      uploadError = retryResult.error;
    }

    if (uploadError) {
      return NextResponse.json({ error: `Upload error: ${uploadError.message}` }, { status: 500 });
    }

    // 7. Get public URL
    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return NextResponse.json({ error: "Failed to get public asset URL." }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: urlData.publicUrl });
  } catch (err: any) {
    console.error("Image upload pipeline error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during image processing." },
      { status: 500 }
    );
  }
}
