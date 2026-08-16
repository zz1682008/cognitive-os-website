import { NextRequest, NextResponse } from "next/server";
import { userInfoUrl } from "../../lib/platform-oidc";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("xeliti_website_access")?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });
  try {
    const userInfo = await fetch(userInfoUrl(), { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!userInfo.ok) return NextResponse.json({ authenticated: false }, { status: 401 });
    const payload = await userInfo.json() as { sub?: unknown };
    if (!validSubject(payload.sub)) return NextResponse.json({ authenticated: false }, { status: 401 });
    return NextResponse.json({ authenticated: true, subject: payload.sub, account_id: payload.sub });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 503 });
  }
}

function validSubject(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 160 && !/[\u0000-\u001f\u007f]/u.test(value);
}
