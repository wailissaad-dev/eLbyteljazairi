import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase/server";
import { defaultSettings } from "@/data/site-default";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const g = adminGuard();
  if (g) return g;
  const sb = getServiceClient();
  if (!sb) return NextResponse.json({ error: "no_db" }, { status: 400 });
  const { data } = await sb.from("settings").select("value").eq("key", "business").maybeSingle();
  return NextResponse.json({ business: { ...defaultSettings, ...(data?.value ?? {}) } });
}

export async function PUT(req: Request): Promise<NextResponse> {
  const g = adminGuard();
  if (g) return g;
  const sb = getServiceClient();
  if (!sb) return NextResponse.json({ error: "no_db" }, { status: 400 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "bad_body" }, { status: 400 });
  const value = { ...defaultSettings, ...body };
  const { error } = await sb.from("settings").upsert({ key: "business", value }, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
