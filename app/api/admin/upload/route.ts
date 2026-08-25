import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // 1. Authenticate the admin session
  try {
    await requireAdminSession();
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
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

    // 3. Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // 4. Validate type and extension (must be image)
    const fileType = (file.type || "").toLowerCase();
    const fileNameLower = (file.name || "").toLowerCase();
    const allowedTypes = [
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
    ];

    const isImageMime = fileType.startsWith("image/") || allowedTypes.includes(fileType);
    const hasImageExt = /\.(jpg|jpeg|png|webp|gif|svg|jfif|bmp)$/i.test(fileNameLower);

    if (!isImageMime && !hasImageExt) {
      return NextResponse.json(
        { error: "Invalid file type. Only image files (JPG, PNG, WebP, GIF, SVG) are allowed." },
        { status: 400 }
      );
    }

    // 5. Read file into buffer — client-side optimizeImageForUpload in lib/supabase.ts
    // handles canvas resizing and compression.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Infer extension and content type from the uploaded file
    const extMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/svg+xml": "svg",
      "image/jfif": "jpg",
      "image/pjpeg": "jpg",
      "image/x-png": "png",
      "image/bmp": "bmp",
    };
    const fileExt = extMap[fileType] ?? (fileNameLower.split(".").pop() || "jpg");
    const contentType = file.type || "image/jpeg";

    // 6. Initialize Supabase Admin client with service role key
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

    // 7. Upload buffer to Supabase Storage
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${randomString}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    let { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType,
        cacheControl: "31536000", // 1 year cache
        upsert: false,
      });

    // Auto-create bucket if it doesn't exist yet
    if (uploadError && uploadError.message?.toLowerCase().includes("not found")) {
      await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: allowedTypes,
      });

      const retryResult = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType,
          cacheControl: "31536000",
          upsert: false,
        });
      uploadError = retryResult.error;
    }

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload error: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 8. Return public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: "Failed to get public asset URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, url: urlData.publicUrl });
  } catch (err: unknown) {
    console.error("Image upload pipeline error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during upload.",
      },
      { status: 500 }
    );
  }
}
