import { NextRequest, NextResponse } from "next/server";
import { userInfoUrl } from "../../lib/platform-oidc";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("xeliti_website_access")?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });
  const userInfo = await fetch(userInfoUrl(), { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!userInfo.ok) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, ...(await userInfo.json() as object) });
}
