import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/schemas";
import { buildOrderMessage, whatsappUrl } from "@/lib/whatsapp";
import { getServiceClient } from "@/lib/supabase/server";
import { getWhatsappPhone } from "@/lib/site-data";
import { genOrderCode } from "@/lib/orderCode";
import type { ApiResult, OrderPayload } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  const json = await req.json().catch(() => null);
  const parsed = orderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const orderCode = genOrderCode();
  const message = buildOrderMessage(data as unknown as OrderPayload, orderCode);
  const url = whatsappUrl(message, await getWhatsappPhone());

  let saved = false;
  let recordId: string | undefined;

  const sb = getServiceClient();
  if (sb) {
    try {
      const { data: order, error } = await sb
        .from("orders")
        .insert({
          order_code: orderCode,
          customer_name: data.fullName,
          phone1: data.phone1,
          phone2: data.phone2 || null,
          wilaya: data.wilaya,
          commune: data.commune,
          address: data.address,
          notes: data.notes || null,
          status: "new",
          locale: data.locale,
          whatsapp_message: message,
          metadata: { source: "web", item_count: data.items.length },
        })
        .select("id")
        .single();

      if (!error && order) {
        recordId = order.id as string;
        const rows = data.items.map((it) => ({
          order_id: recordId,
          product_slug: it.productSlug || null,
          ref: it.ref || null,
          label: it.name,
          color: it.color || null,
          quantity: it.quantity,
        }));
        const { error: itemsError } = await sb.from("order_items").insert(rows);
        saved = !itemsError;
      }
    } catch {
      saved = false;
    }
  }

  const result: ApiResult = { ok: true, recordId, orderCode, whatsappUrl: url, saved };
  return NextResponse.json(result);
}
