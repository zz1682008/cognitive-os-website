const issuer = (process.env.PLATFORM_ACCOUNT_CENTER_ISSUER ?? "http://127.0.0.1:5200").replace(/\/$/, "");
const clientId = "xeliti-website";
export const PKCE_S256_POLICY = "code_challenge_method=S256";

function base64url(value: Uint8Array): string {
  let binary = "";
  value.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomValue(size = 32): string {
  return base64url(crypto.getRandomValues(new Uint8Array(size)));
}

async function s256(value: string): Promise<string> {
  return base64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))));
}

export async function createAuthorizationRequest(origin: string, returnTo: string) {
  const verifier = randomValue(48);
  const state = randomValue();
  const nonce = randomValue();
  const redirectUri = `${origin}/auth/callback`;
  const query = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid profile email",
    state,
    nonce,
    code_challenge: await s256(verifier),
    code_challenge_method: "S256",
  });
  return {
    location: `${issuer}/oauth2/authorize?${query}`,
    transaction: base64url(new TextEncoder().encode(JSON.stringify({ verifier, state, returnTo: sameOriginReturnTo(origin, returnTo) }))),
  };
}

export async function exchangeAuthorizationCode(origin: string, code: string, transaction: string, state: string) {
  const decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(
    atob(transaction.replace(/-/g, "+").replace(/_/g, "/")), (char) => char.charCodeAt(0),
  ))) as { verifier: string; state: string; returnTo: string };
  if (!state || state !== decoded.state) throw new Error("OIDC_STATE_INVALID");
  const response = await fetch(`${issuer}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code", client_id: clientId,
      redirect_uri: `${origin}/auth/callback`, code, code_verifier: decoded.verifier,
    }),
  });
  if (!response.ok) throw new Error("OIDC_CODE_EXCHANGE_FAILED");
  const tokens = await response.json() as { access_token?: string; id_token?: string; expires_in?: number };
  if (!tokens.access_token) throw new Error("OIDC_TOKEN_RESPONSE_INVALID");
  return { tokens: { ...tokens, access_token: tokens.access_token }, returnTo: sameOriginReturnTo(origin, decoded.returnTo) };
}

export function platformLogoutUrl(origin: string, idToken = ""): string {
  const query = new URLSearchParams({ client_id: clientId, post_logout_redirect_uri: `${origin}/` });
  if (idToken) query.set("id_token_hint", idToken);
  return `${issuer}/connect/logout?${query}`;
}

export function userInfoUrl(): string { return `${issuer}/userinfo`; }

function sameOriginReturnTo(origin: string, value: string): string {
  const target = new URL(value, origin);
  return target.origin === new URL(origin).origin ? target.href : `${origin}/`;
}
