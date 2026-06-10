import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminConfigured, passwordMatches, sessionToken } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// best-effort in-memory throttle (per server instance)
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return (xff ? xff.split(",")[0] : "").trim() || req.headers.get("x-real-ip") || "unknown";
}

function isLocked(ip: string): boolean {
  const rec = attempts.get(ip);
  if (!rec) return false;
  if (Date.now() - rec.first > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return rec.count >= MAX_FAILS;
}

function recordFail(ip: string) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) attempts.set(ip, { count: 1, first: now });
  else rec.count += 1;
}

export async function POST(req: Request): Promise<NextResponse> {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 400 });
  }
  const ip = clientIp(req);
  if (isLocked(ip)) {
    return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  if (!body || !passwordMatches(String(body.password || ""))) {
    recordFail(ip);
    await sleep(350); // slow brute-force attempts
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }
  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE(): Promise<NextResponse> {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
