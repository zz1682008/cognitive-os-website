import { UserManager, WebStorageStateStore, type User, type UserManagerSettings } from "oidc-client-ts";

export interface WebsiteIdentity { sub: string; email?: string }
export const PKCE_S256_POLICY = "code_challenge_method=S256";
export const WEBSITE_LOGOUT_FENCE_KEY = "xeliti-website.oidc.logout-fence.v1";
const boundManager = Symbol("website-bound-user-manager");

function validSubject(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 160
    && !/[\u0000-\u001f\u007f]/u.test(value);
}
function identity(user: User): WebsiteIdentity {
  const sub = user.profile.sub;
  if (!validSubject(sub)) throw new Error("OIDC_SUBJECT_INVALID");
  return { sub, ...(typeof user.profile.email === "string" ? { email: user.profile.email } : {}) };
}
function active(user: User | null): user is User {
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
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
  };
}

export function websiteLogoutFenced(): boolean {
  return window.localStorage.getItem(WEBSITE_LOGOUT_FENCE_KEY) === "deny";
}
export function establishWebsiteLogoutFence(): void {
  window.localStorage.setItem(WEBSITE_LOGOUT_FENCE_KEY, "deny");
}
function clearWebsiteLogoutFence(): void {
  window.localStorage.removeItem(WEBSITE_LOGOUT_FENCE_KEY);
}

export function bindWebsiteUserManager(manager: UserManager): UserManager {
  const target = manager as UserManager & { [boundManager]?: boolean };
  if (target[boundManager]) return manager;
  target[boundManager] = true;
  const standardSigninSilent = manager.signinSilent.bind(manager);
  let silentRenewal: Promise<User> | null = null;
  manager.signinSilent = (args = {}) => {
    if (websiteLogoutFenced()) return Promise.reject(new Error("OIDC_LOGOUT_FENCE"));
    if (silentRenewal) return silentRenewal;
    const request = (async () => {
      const previous = await manager.getUser();
      if (websiteLogoutFenced()) throw new Error("OIDC_LOGOUT_FENCE");
      const recovered = await standardSigninSilent(args);
      if (websiteLogoutFenced()) {
        await manager.removeUser();
        throw new Error("OIDC_LOGOUT_FENCE");
      }
      if (!recovered) throw new Error("OIDC_SILENT_USER_MISSING");
      const recoveredIdentity = identity(recovered);
      if (validSubject(previous?.profile.sub) && recoveredIdentity.sub !== previous.profile.sub) {
        await manager.removeUser();
        throw new Error("OIDC_SUBJECT_MISMATCH");
      }
      return recovered;
    })();
    silentRenewal = request;
    const clear = () => { if (silentRenewal === request) silentRenewal = null; };
    void request.then(clear, clear);
    return request;
  };
  return manager;
}

let singletonKey = "";
let singleton: UserManager | null = null;
export function websiteUserManager(authority: string, origin: string): UserManager {
  const key = `${authority.replace(/\/$/, "")}|${new URL(origin).origin}`;
  if (!singleton || singletonKey !== key) {
    singleton?.stopSilentRenew();
    singletonKey = key;
    singleton = bindWebsiteUserManager(new UserManager(websiteOidcSettings(authority, origin)));
  }
  return singleton;
}

export async function currentWebsiteUser(manager: UserManager, allowRecovery: boolean): Promise<User | null> {
  if (websiteLogoutFenced()) { await manager.removeUser(); return null; }
  const stored = await manager.getUser();
  if (websiteLogoutFenced()) { await manager.removeUser(); return null; }
  if (active(stored)) return stored;
  if (!allowRecovery) return null;
  try {
    return await manager.signinSilent();
  } catch (error) {
    if (interactionRequired(error) || (error as Error)?.message === "OIDC_LOGOUT_FENCE") {
      await manager.removeUser();
      return null;
    }
    throw error;
  }
}

export async function currentWebsiteIdentity(authority: string, origin: string): Promise<WebsiteIdentity | null> {
  const user = await currentWebsiteUser(websiteUserManager(authority, origin), true);
  return user ? identity(user) : null;
}

export async function beginWebsiteLogin(authority: string, origin: string, returnTo: string): Promise<void> {
  await websiteUserManager(authority, origin).signinRedirect({ state: returnTo });
}

export async function settleWebsiteManagerCallback(
  manager: UserManager,
  silent: boolean,
): Promise<User | null> {
  if (silent) {
    await manager.signinSilentCallback();
    return null;
  }
  const user = await manager.signinRedirectCallback();
  identity(user);
  clearWebsiteLogoutFence();
  return user;
}

export function settleWebsiteCallback(authority: string, origin: string): Promise<User | null> {
  return settleWebsiteManagerCallback(
    websiteUserManager(authority, origin),
    window.self !== window.top,
  );
}

export async function recoverWebsiteAuthorizationHeader(
  authority: string,
  origin: string,
): Promise<Record<string, string>> {
  const user = await websiteUserManager(authority, origin).signinSilent();
  if (!user) throw new Error("OIDC_SILENT_USER_MISSING");
  return { Authorization: `Bearer ${user.access_token}` };
}

export async function logoutWebsiteManager(
  manager: UserManager,
  postLogoutRedirectUri: string,
): Promise<void> {
  establishWebsiteLogoutFence();
  manager.stopSilentRenew();
  const current = await manager.getUser();
  await manager.removeUser();
  await manager.signoutRedirect({
    post_logout_redirect_uri: postLogoutRedirectUri,
    ...(current?.id_token ? { id_token_hint: current.id_token } : {}),
  });
}

export function logoutWebsite(authority: string, origin: string): Promise<void> {
  const normalizedOrigin = new URL(origin).origin;
  return logoutWebsiteManager(websiteUserManager(authority, normalizedOrigin), `${normalizedOrigin}/`);
}

export function safeWebsiteReturnTo(value: unknown, origin: string): string {
  const normalizedOrigin = new URL(origin).origin;
  if (typeof value !== "string") return `${normalizedOrigin}/`;
  const target = new URL(value, normalizedOrigin);
  return target.origin === normalizedOrigin ? target.href : `${normalizedOrigin}/`;
}
