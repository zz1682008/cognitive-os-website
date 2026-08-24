import { OidcCallback } from "./oidc-callback";

export default function CallbackPage() {
  const authority = process.env.PLATFORM_ACCOUNT_CENTER_ISSUER ?? "http://127.0.0.1:5200";
  return <OidcCallback authority={authority} />;
}
