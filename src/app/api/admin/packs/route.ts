import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS = [
  "name_ar",
  "name_fr",
  "name_en",
  "subtitle",
  "highlight_ar",
  "highlight_fr",
  "highlight_en",
  "badge_ar",
  "badge_fr",
  "badge_en",
  "featured",
  "active",
  "sort_order",
] as const;

type Row = Record<string, unknown>;
type Item = { label_ar?: string; label_fr?: string; label_en?: string };

export async function GET(): Promise<NextResponse> {
  const g = adminGuard();
  if (g) return g;
  const sb = getServiceClient();
  if (!sb) return NextResponse.json({ error: "no_db" }, { status: 400 });
  const [{ data: packs }, { data: items }] = await Promise.all([
    sb.from("packs").select("*").order("sort_order", { ascending: true }),
    sb.from("pack_items").select("*").order("sort_order", { ascending: true }),
  ]);
  return NextResponse.json({ packs: packs ?? [], items: items ?? [] });
}

export async function PUT(req: Request): Promise<NextResponse> {
  const g = adminGuard();
  if (g) return g;
  const sb = getServiceClient();
  if (!sb) return NextResponse.json({ error: "no_db" }, { status: 400 });
  const body = (await req.json().catch(() => ({}))) as Row & { id?: string; items?: Item[] };
  const id = body.id;
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const row: Row = {};
  for (const k of FIELDS) if (body[k] !== undefined) row[k] = body[k] === "" ? null : body[k];
  const { error } = await sb.from("packs").update(row).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (Array.isArray(body.items)) {
    await sb.from("pack_items").delete().eq("pack_id", id);
    const rows = body.items
      .filter((it) => (it.label_ar || "").trim())
      .map((it, i) => ({
        pack_id: id,
        label_ar: it.label_ar ?? "",
        label_fr: it.label_fr ?? null,
        label_en: it.label_en ?? null,
        sort_order: i,
      }));
    if (rows.length) await sb.from("pack_items").insert(rows);
  }
  return NextResponse.json({ ok: true });
}
