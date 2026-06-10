import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "eb_admin";

const password = () => process.env.ADMIN_PASSWORD || "";
const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

export const adminConfigured = (): boolean => Boolean(password());

/** Signed session token (no secrets stored in the cookie itself). */
export function sessionToken(): string {
  return createHmac("sha256", secret()).update("el-bayt-admin-v1").digest("hex");
}

export function passwordMatches(input: string): boolean {
  const a = Buffer.from(input || "");
  const b = Buffer.from(password());
  if (a.length !== b.length || b.length === 0) return false;
  return timingSafeEqual(a, b);
}

/** Returns a 401 response when not authenticated, else null. */
export function adminGuard(): NextResponse | null {
  return isAuthed() ? null : NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

/** True when the request carries a valid admin session cookie. */
export function isAuthed(): boolean {
  if (!adminConfigured()) return false;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const expected = sessionToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
