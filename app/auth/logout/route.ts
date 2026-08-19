import { NextRequest, NextResponse } from "next/server";
import { platformLogoutUrl, websiteOrigin } from "../../lib/platform-oidc";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(platformLogoutUrl(
    websiteOrigin(request.nextUrl.origin), request.cookies.get("xeliti_website_id")?.value,
  ));
  response.cookies.delete("xeliti_website_access");
  response.cookies.delete("xeliti_website_id");
  return response;
}
