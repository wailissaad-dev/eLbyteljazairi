import { NextResponse } from "next/server";
import { customRequestSchema } from "@/lib/schemas";
import { buildCustomMessage, whatsappUrl } from "@/lib/whatsapp";
import { getServiceClient } from "@/lib/supabase/server";
import { getWhatsappPhone } from "@/lib/site-data";
import type { ApiResult, CustomRequestPayload } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  const json = await req.json().catch(() => null);
  const parsed = customRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const payload: CustomRequestPayload = {
    fullName: data.fullName,
    phone: data.phone,
    requestType: data.requestType || undefined,
    preferredColor: data.preferredColor || undefined,
    details: data.details,
    locale: data.locale,
  };
  const message = buildCustomMessage(payload);
  const url = whatsappUrl(message, await getWhatsappPhone());

  let saved = false;
  let recordId: string | undefined;

  const sb = getServiceClient();
  if (sb) {
    try {
      const { data: row, error } = await sb
        .from("custom_requests")
        .insert({
          customer_name: data.fullName,
          phone: data.phone,
          request_type: data.requestType || null,
          preferred_color: data.preferredColor || null,
          details: data.details,
          status: "new",
          locale: data.locale,
          whatsapp_message: message,
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
