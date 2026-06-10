import { business } from "./config";
import { formatPriceAr } from "./format";
import type { CustomRequestPayload, OrderPayload, PriceRequestPayload } from "./types";

const SEP = "━━━━━━━━━━━━━━";

/** Messages are written in Arabic on purpose — they are read by the shop. */

export function buildOrderMessage(o: OrderPayload, orderCode?: string): string {
  const L: string[] = [];
  L.push("🛋️ *طلب جديد — البيت الجزائري* 🇩🇿");
  if (orderCode) L.push("🧾 رقم الطلب: " + orderCode);
  L.push(SEP);
  L.push("👤 الاسم: " + o.fullName);
  L.push("📍 الولاية: " + o.wilaya);
  L.push("🏘️ البلدية: " + o.commune);
  L.push("🏠 العنوان: " + o.address);
  L.push("📞 الهاتف: " + o.phone1);
  if (o.phone2) L.push("📞 هاتف إضافي: " + o.phone2);
  if (o.notes) L.push("📝 ملاحظات: " + o.notes);
  L.push(SEP);
  L.push("🛒 *المنتجات المطلوبة:*");
  o.items.forEach((it, i) => {
    const ref = it.ref ? ` [${it.ref}]` : "";
    const color = it.color ? " — اللون: " + it.color : "";
    const price = it.price ? " — السعر: " + formatPriceAr(it.price) : "";
    L.push(`${i + 1}. ${it.name}${ref}${color}${price} — الكمية: ${it.quantity}`);
  });
  const total = o.items.reduce((s, x) => s + x.quantity, 0);
  L.push("— إجمالي القطع: " + total);
  const amount = o.items.reduce((s, x) => s + (x.price ?? 0) * x.quantity, 0);
  if (amount > 0) L.push("— الإجمالي التقديري: " + formatPriceAr(amount));
  L.push(SEP);
  L.push("🙏 يُرجى التواصل لتأكيد الطلب وترتيب التوصيل.");
  return L.join("\n");
}

export function buildPriceMessage(p: PriceRequestPayload): string {
  const L: string[] = [];
  L.push("💰 *طلب سعر — البيت الجزائري* 🇩🇿");
  L.push(SEP);
  L.push("🛋️ المنتج: " + p.name);
  if (p.color) L.push("🎨 اللون: " + p.color);
  if (p.ref) L.push("🏷️ المرجع: " + p.ref);
  L.push(SEP);
  L.push("السلام عليكم، أرغب في معرفة سعر هذا المنتج وتفاصيل التوصيل. شكراً 🙏");
  return L.join("\n");
}

export function buildCustomMessage(c: CustomRequestPayload): string {
  const L: string[] = [];
  L.push("✨ *طلب خاص — البيت الجزائري* 🇩🇿");
  L.push(SEP);
  L.push("👤 الاسم: " + c.fullName);
  L.push("📞 الهاتف: " + c.phone);
  if (c.requestType) L.push("🧩 نوع القطعة: " + c.requestType);
  if (c.preferredColor) L.push("🎨 اللون/القماش: " + c.preferredColor);
  L.push("📝 التفاصيل: " + c.details);
  L.push(SEP);
  L.push("🙏 يُرجى التواصل لتجهيز عرض سعر مخصّص لهذا الطلب الخاص.");
  return L.join("\n");
}

export function whatsappUrl(message: string, phone?: string): string {
  const p = (phone || business.whatsappPhone).replace(/[^0-9]/g, "");
  return `https://wa.me/${p}?text=${encodeURIComponent(message)}`;
}
