import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service role key.
 * Returns null when env vars are missing so API routes can gracefully
 * fall back to a WhatsApp-only flow (the site still works without a DB).
 */
let cached: SupabaseClient | null | undefined;

export function getServiceClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    cached = null;
    return cached;
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export const isSupabaseConfigured = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
