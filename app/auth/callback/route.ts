import { NextRequest, NextResponse } from "next/server";
import { exchangeAuthorizationCode } from "../../lib/platform-oidc";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") ?? "";
  const state = request.nextUrl.searchParams.get("state") ?? "";
  const transaction = request.cookies.get("xeliti_website_oidc_tx")?.value ?? "";
  if (!code || !transaction) return NextResponse.json({ error: "OIDC_CALLBACK_INVALID" }, { status: 400 });
  try {
    const result = await exchangeAuthorizationCode(request.nextUrl.origin, code, transaction, state);
    const response = NextResponse.redirect(new URL(result.returnTo, request.nextUrl.origin));
    response.cookies.delete("xeliti_website_oidc_tx");
    response.cookies.set("xeliti_website_access", result.tokens.access_token, {
      httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "lax", path: "/", maxAge: 300,
    });
    if (result.tokens.id_token) response.cookies.set("xeliti_website_id", result.tokens.id_token, {
      httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "lax", path: "/", maxAge: 300,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "OIDC_CALLBACK_REJECTED" }, { status: 401 });
  }
}
