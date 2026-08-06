import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, isGoogleConfigured } from "@/lib/googleWorkspace";

// Standard Google OAuth2 authorization-code exchange. Only runs when the
// GOOGLE_CLIENT_ID / SECRET env vars are set (see .env.local.example).
export async function GET(req: NextRequest) {
  if (!isGoogleConfigured) {
    return NextResponse.redirect(new URL("/login?google=not-configured", req.url));
  }
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/login?google=missing-code", req.url));
  }
  const tokens = await exchangeCodeForTokens(code);
  const res = NextResponse.redirect(new URL("/dashboard", req.url));
  if (tokens?.access_token) {
    res.cookies.set("google_access_token", tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: tokens.expires_in ?? 3600,
    });
  }
  return res;
}
