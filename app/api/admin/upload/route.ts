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

    // Validate type (must be image)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    // 3. Read file into a buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    let outputBuffer: Buffer;
    let fileExt = "webp";
    let contentType = "image/webp";

    // SVGs are vector graphic files; upload directly without processing
    if (file.type === "image/svg+xml") {
      outputBuffer = inputBuffer;
      fileExt = "svg";
      contentType = "image/svg+xml";
    } else {
      // 4. Process raster images with sharp
      let sharpInstance = sharp(inputBuffer);
      
      // Auto-orient based on EXIF tag (critical for portrait smartphone photos)
      sharpInstance = sharpInstance.rotate();

      // Read metadata to check dimensions
      const metadata = await sharpInstance.metadata();
      const maxWidth = 1600;
      const maxHeight = 1600;

      if ((metadata.width && metadata.width > maxWidth) || (metadata.height && metadata.height > maxHeight)) {
        sharpInstance = sharpInstance.resize({
          width: maxWidth,
          height: maxHeight,
          fit: "inside",
          withoutEnlargement: true
        });
      }

      // Convert to WebP format and compress
      outputBuffer = await sharpInstance.webp({ quality: 80 }).toBuffer();
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

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, outputBuffer, {
        contentType,
        cacheControl: "31536000", // 1 year cache control for static assets
        upsert: false,
      });

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
