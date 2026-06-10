import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request): Promise<NextResponse> {
  const g = adminGuard();
  if (g) return g;
  const sb = getServiceClient();
  if (!sb) return NextResponse.json({ error: "no_db" }, { status: 400 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });

  const ext = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const isImage = (file.type || "").startsWith("image/");
  if (!ALLOWED_EXT.has(ext) || !isImage) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) return NextResponse.json({ error: "too_large" }, { status: 400 });

  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage
    .from("product-images")
    .upload(path, buf, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data } = sb.storage.from("product-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
