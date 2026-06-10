import { z } from "zod";

const phone = z
  .string()
  .trim()
  .refine((v) => {
    const d = v.replace(/[^0-9]/g, "");
    return d.length >= 9 && d.length <= 13;
  }, "invalid_phone");

const localeSchema = z.enum(["ar", "fr", "en"]);

export const orderLineSchema = z.object({
  productSlug: z.string().optional(),
  ref: z.string().optional(),
  name: z.string().trim().min(1).max(300),
  color: z.string().trim().max(200).optional(),
  quantity: z.number().int().min(1).max(99),
});

export const orderSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  wilaya: z.string().trim().min(1).max(120),
  commune: z.string().trim().min(1).max(120),
  address: z.string().trim().min(3).max(400),
  phone1: phone,
  phone2: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  locale: localeSchema,
  items: z.array(orderLineSchema).min(1).max(50),
});

export const customRequestSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone,
  requestType: z.string().trim().max(120).optional().or(z.literal("")),
  preferredColor: z.string().trim().max(200).optional().or(z.literal("")),
  details: z.string().trim().min(3).max(1500),
  locale: localeSchema,
});

export const priceRequestSchema = z.object({
  productSlug: z.string().trim().max(160).optional(),
  ref: z.string().trim().max(40).optional(),
  name: z.string().trim().min(1).max(300),
  color: z.string().trim().max(200).optional().or(z.literal("")),
  locale: localeSchema,
});

export type OrderInput = z.infer<typeof orderSchema>;
export type CustomInput = z.infer<typeof customRequestSchema>;
export type PriceInput = z.infer<typeof priceRequestSchema>;
