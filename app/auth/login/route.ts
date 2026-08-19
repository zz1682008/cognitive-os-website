import { NextRequest, NextResponse } from "next/server";
import { createAuthorizationRequest, websiteOrigin } from "../../lib/platform-oidc";

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get("return_to") ?? "/";
  const safeReturnTo = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
  const origin = websiteOrigin(request.nextUrl.origin);
  const authorization = await createAuthorizationRequest(origin, safeReturnTo);
  const response = NextResponse.redirect(authorization.location);
  response.cookies.set("xeliti_website_oidc_tx", authorization.transaction, {
    httpOnly: true, secure: new URL(origin).protocol === "https:", sameSite: "lax", path: "/auth/callback", maxAge: 300,
  });
  return response;
}
