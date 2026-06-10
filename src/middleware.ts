import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Per-request nonce + Content-Security-Policy. The nonce is read back in the
 * root layout (via the `x-nonce` header) and applied to inline scripts; Next.js
 * applies it to its own bundled scripts automatically.
 */
export function middleware(request: NextRequest) {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const nonce = btoa(String.fromCharCode(...bytes));
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // inline style attributes are used throughout; styles are low-risk for XSS
    `style-src 'self' 'unsafe-inline'`,
    // self assets + data: (noise texture) + https: (Supabase Storage uploads)
    `img-src 'self' data: https:`,
    `font-src 'self'`,
    `connect-src 'self'${isDev ? " ws:" : ""}`,
    `frame-ancestors 'none'`,
    `frame-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      // run on pages/routes, skip Next static assets and public files
      source:
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|woff2?)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
