import { UserManager, type UserManagerSettings } from "oidc-client-ts";

export interface WebsiteIdentity { sub: string; email?: string }
export interface OidcUserLike {
  access_token: string;
  id_token?: string;
  expired?: boolean;
  expires_at?: number;
  state?: unknown;
  profile: Record<string, unknown> & { sub?: string };
}
export interface OidcManagerPort {
  getUser(): Promise<OidcUserLike | null>;
  signinRedirect(args?: Record<string, unknown>): Promise<void>;
  signinRedirectCallback(): Promise<OidcUserLike>;
  signinSilent(): Promise<OidcUserLike>;
  signinSilentCallback(): Promise<void>;
  stopSilentRenew(): void;
  removeUser(): Promise<void>;
  signoutRedirect(args?: Record<string, unknown>): Promise<void>;
}

export const PKCE_S256_POLICY = "code_challenge_method=S256";

function validSubject(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 160
    && !/[\u0000-\u001f\u007f]/u.test(value);
}
function identity(user: OidcUserLike): WebsiteIdentity {
  const sub = user.profile.sub;
  if (!validSubject(sub)) throw new Error("OIDC_SUBJECT_INVALID");
  return { sub, ...(typeof user.profile.email === "string" ? { email: user.profile.email } : {}) };
}
function active(user: OidcUserLike | null): user is OidcUserLike {
  return Boolean(user?.access_token) && user?.expired !== true;
}
function interactionRequired(error: unknown): boolean {
  const value = error as { error?: unknown; message?: unknown };
  const code = typeof value?.error === "string" ? value.error : "";
  const message = typeof value?.message === "string" ? value.message : "";
  return ["login_required", "interaction_required", "consent_required", "account_selection_required"]
    .some((candidate) => code === candidate || message.includes(candidate));
}

export function websiteOidcSettings(authority: string, origin: string): UserManagerSettings {
  const normalizedAuthority = authority.replace(/\/$/, "");
  const normalizedOrigin = new URL(origin).origin;
  return {
    authority: normalizedAuthority,
    client_id: "xeliti-website",
    redirect_uri: `${normalizedOrigin}/auth/callback`,
    silent_redirect_uri: `${normalizedOrigin}/auth/callback`,
    post_logout_redirect_uri: `${normalizedOrigin}/`,
    response_type: "code",
    scope: "openid profile email",
    automaticSilentRenew: true,
    accessTokenExpiringNotificationTimeInSeconds: 60,
    maxSilentRenewTimeoutRetries: 0,
    validateSubOnSilentRenew: true,
    monitorSession: false,
    loadUserInfo: true,
    fetchRequestCredentials: "include",
    revokeTokensOnSignout: false,
  };
}

export function createOidcRuntime(
  manager: OidcManagerPort,
  options: { isSilentCallback?: () => boolean } = {},
) {
  let generation = 0;
  let recoveryInFlight: Promise<OidcUserLike> | null = null;

  async function recoverUser(): Promise<OidcUserLike> {
    if (recoveryInFlight) return recoveryInFlight;
    const startedGeneration = generation;
    const request = (async () => {
      const previous = await manager.getUser();
      const expectedSubject = validSubject(previous?.profile.sub) ? previous.profile.sub : "";
      const recovered = await manager.signinSilent();
      if (generation !== startedGeneration) {
        await manager.removeUser();
        throw new Error("OIDC_LOGOUT_FENCE");
      }
      const recoveredIdentity = identity(recovered);
      if (expectedSubject && recoveredIdentity.sub !== expectedSubject) {
        await manager.removeUser();
        throw new Error("OIDC_SUBJECT_MISMATCH");
      }
      return recovered;
    })();
    recoveryInFlight = request;
    void request.finally(() => { if (recoveryInFlight === request) recoveryInFlight = null; }).catch(() => {});
    return request;
  }

  async function currentUser(allowRecovery = true): Promise<OidcUserLike | null> {
    const stored = await manager.getUser();
    if (active(stored)) return stored;
    if (!allowRecovery) return null;
    try {
      return await recoverUser();
    } catch (error) {
      if (interactionRequired(error)) {
        await manager.removeUser();
        return null;
      }
      throw error;
    }
  }

  return {
    async signin(returnTo: string): Promise<void> { await manager.signinRedirect({ state: returnTo }); },
    async settleCallback(): Promise<OidcUserLike | null> {
      if (options.isSilentCallback?.()) {
        await manager.signinSilentCallback();
        return null;
      }
      const user = await manager.signinRedirectCallback();
      identity(user);
      return user;
    },
    currentUser,
    async currentIdentity(): Promise<WebsiteIdentity | null> {
      const user = await currentUser(true);
      return user ? identity(user) : null;
    },
    async recoverAuthorizationHeader(): Promise<Record<string, string>> {
      const user = await recoverUser();
      return { Authorization: `Bearer ${user.access_token}` };
    },
    async logout(postLogoutRedirectUri: string): Promise<void> {
      generation += 1;
      recoveryInFlight = null;
      const current = await manager.getUser();
      manager.stopSilentRenew();
      await manager.removeUser();
      await manager.signoutRedirect({
        post_logout_redirect_uri: postLogoutRedirectUri,
        ...(current?.id_token ? { id_token_hint: current.id_token } : {}),
      });
    },
  };
}

let singletonKey = "";
let singleton: ReturnType<typeof createOidcRuntime> | null = null;

export function websiteOidcRuntime(authority: string, origin: string) {
  const key = `${authority.replace(/\/$/, "")}|${new URL(origin).origin}`;
  if (!singleton || singletonKey !== key) {
    singletonKey = key;
    singleton = createOidcRuntime(
      new UserManager(websiteOidcSettings(authority, origin)) as unknown as OidcManagerPort,
      { isSilentCallback: () => window.self !== window.top },
    );
  }
  return singleton;
}

export function safeWebsiteReturnTo(value: unknown, origin: string): string {
  const normalizedOrigin = new URL(origin).origin;
  if (typeof value !== "string") return `${normalizedOrigin}/`;
  const target = new URL(value, normalizedOrigin);
  return target.origin === normalizedOrigin ? target.href : `${normalizedOrigin}/`;
}
