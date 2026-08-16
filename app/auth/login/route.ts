import { NextRequest, NextResponse } from "next/server";
import { createAuthorizationRequest } from "../../lib/platform-oidc";

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get("return_to") ?? "/";
  const safeReturnTo = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
  const authorization = await createAuthorizationRequest(request.nextUrl.origin, safeReturnTo);
  const response = NextResponse.redirect(authorization.location);
  response.cookies.set("xeliti_website_oidc_tx", authorization.transaction, {
    httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "lax", path: "/auth/callback", maxAge: 300,
  });
  return response;
}
