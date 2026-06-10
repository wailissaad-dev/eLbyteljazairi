"use client";

import type { ApiResult, CustomRequestPayload, OrderPayload, PriceRequestPayload } from "./types";
import { buildCustomMessage, buildOrderMessage, buildPriceMessage, whatsappUrl } from "./whatsapp";

async function post(path: string, body: unknown): Promise<ApiResult | null> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as ApiResult;
  } catch {
    return null;
  }
}

/** Each helper hits the API; if anything fails it still returns a usable
 *  WhatsApp URL built on the client, so the customer is never blocked. */

export async function submitOrder(payload: OrderPayload): Promise<ApiResult> {
  const res = await post("/api/orders", payload);
  if (res) return res;
  return { ok: true, whatsappUrl: whatsappUrl(buildOrderMessage(payload)), saved: false, message: "fallback" };
}

export async function submitCustomRequest(payload: CustomRequestPayload): Promise<ApiResult> {
  const res = await post("/api/custom-requests", payload);
  if (res) return res;
  return { ok: true, whatsappUrl: whatsappUrl(buildCustomMessage(payload)), saved: false, message: "fallback" };
}

export async function submitPriceRequest(payload: PriceRequestPayload): Promise<ApiResult> {
  const res = await post("/api/price-requests", payload);
  if (res) return res;
  return { ok: true, whatsappUrl: whatsappUrl(buildPriceMessage(payload)), saved: false, message: "fallback" };
}
