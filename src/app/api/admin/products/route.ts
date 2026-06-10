import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS = [
  "slug",
  "ref_code",
  "category",
  "name_ar",
  "name_fr",
  "name_en",
  "color_ar",
  "color_fr",
  "color_en",
  "description_ar",
  "description_fr",
  "description_en",
  "swatch_hex",
  "icon",
  "badge_ar",
  "badge_fr",
  "badge_en",
  "status",
  "active",
  "sort_order",
] as const;

type Row = Record<string, unknown>;

const toNum = (v: unknown): number | null => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function cleanRow(input: Row): Row {
  const out: Row = {};
  for (const k of FIELDS) {
    if (input[k] !== undefined) out[k] = input[k] === "" ? null : input[k];
  }
  out.price = toNum(input.price);
  out.sort_order = toNum(input.sort_order) ?? 0;
  out.active = input.active === undefined ? true : Boolean(input.active);
  if (out.category == null) out.category = "salons";
  return out;
}

export async function GET(): Promise<NextResponse> {
  const g = adminGuard();
  if (g) return g;
  const sb = getServiceClient();
  if (!sb) return NextResponse.json({ error: "no_db" }, { status: 400 });
  const [{ data: products }, { data: images }] = await Promise.all([
    sb.from("products").select("*").order("sort_order", { ascending: true }),
    sb.from("product_images").select("*").order("sort_order", { ascending: true }),
  ]);
  return NextResponse.json({ products: products ?? [], images: images ?? [] });
}

export async function POST(req: Request): Promise<NextResponse> {
  const g = adminGuard();
  if (g) return g;
  const sb = getServiceClient();
  if (!sb) return NextResponse.json({ error: "no_db" }, { status: 400 });
  const body = (await req.json().catch(() => ({}))) as Row & { images?: string[] };
  const { data, error } = await sb.from("products").insert(cleanRow(body)).select("id").single();
  if (error || !data) return NextResponse.json({ error: error?.message ?? "insert_failed" }, { status: 400 });
  const images = Array.isArray(body.images) ? body.images : [];
  if (images.length) {
    await sb.from("product_images").insert(images.map((src, i) => ({ product_id: data.id, image_path: src, sort_order: i })));
  }
  return NextResponse.json({ ok: true, id: data.id });
}

export async function PUT(req: Request): Promise<NextResponse> {
  const g = adminGuard();
  if (g) return g;
  const sb = getServiceClient();
  if (!sb) return NextResponse.json({ error: "no_db" }, { status: 400 });
  const body = (await req.json().catch(() => ({}))) as Row & { id?: string; images?: string[] };
  const id = body.id;
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  const { error } = await sb.from("products").update(cleanRow(body)).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (Array.isArray(body.images)) {
    await sb.from("product_images").delete().eq("product_id", id);
    if (body.images.length) {
      await sb.from("product_images").insert(body.images.map((src, i) => ({ product_id: id, image_path: src, sort_order: i })));
    }
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request): Promise<NextResponse> {
  const g = adminGuard();
  if (g) return g;
  const sb = getServiceClient();
  if (!sb) return NextResponse.json({ error: "no_db" }, { status: 400 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
