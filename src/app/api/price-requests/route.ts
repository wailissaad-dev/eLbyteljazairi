import { NextResponse } from "next/server";
import { priceRequestSchema } from "@/lib/schemas";
import { buildPriceMessage, whatsappUrl } from "@/lib/whatsapp";
import { getServiceClient } from "@/lib/supabase/server";
import { getWhatsappPhone } from "@/lib/site-data";
import type { ApiResult, PriceRequestPayload } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  const json = await req.json().catch(() => null);
  const parsed = priceRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const payload: PriceRequestPayload = {
    productSlug: data.productSlug,
    ref: data.ref,
    name: data.name,
    color: data.color || undefined,
    locale: data.locale,
  };
  const message = buildPriceMessage(payload);
  const url = whatsappUrl(message, await getWhatsappPhone());

  let saved = false;
  let recordId: string | undefined;

  const sb = getServiceClient();
  if (sb) {
    try {
      const { data: row, error } = await sb
        .from("price_requests")
        .insert({
          product_slug: data.productSlug || null,
          ref: data.ref || null,
          product_name: data.name,
          color: data.color || null,
          locale: data.locale,
          metadata: { source: "web" },
        })
        .select("id")
        .single();
      if (!error && row) {
        recordId = row.id as string;
        saved = true;
      }
    } catch {
      saved = false;
    }
  }

  const result: ApiResult = { ok: true, recordId, whatsappUrl: url, saved };
  return NextResponse.json(result);
}
