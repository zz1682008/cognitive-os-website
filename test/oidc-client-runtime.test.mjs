import assert from 'node:assert/strict';
import { test } from 'node:test';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const oidc = await import('../app/lib/platform-oidc-client.ts');
class MemoryStorage {
  #values = new Map(); get length() { return this.#values.size; }
  key(i) { return [...this.#values.keys()][i] ?? null; }
  getItem(k) { return this.#values.get(k) ?? null; }
  setItem(k, v) { this.#values.set(k, String(v)); }
  removeItem(k) { this.#values.delete(k); }
}
function browser(persistent = new MemoryStorage()) {
  const session = new MemoryStorage(); const frame = {};
  globalThis.window = { location: { origin: 'https://www.example', href: 'https://www.example/' },
    self: frame, top: frame, sessionStorage: session, localStorage: persistent, crypto: globalThis.crypto };
  globalThis.sessionStorage = session; globalThis.localStorage = persistent;
  return { session, persistent };
}
const user = (token, sub = 'account-1') => ({ access_token: token, token_type: 'Bearer',
  expired: false, expires_at: 1_900_000_000, profile: { sub } });
async function waitForNavigation(readCount) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    if (readCount() > 0) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error('OIDC_TEST_NAVIGATION_TIMEOUT');
}

test('Website exact 3.5.0 User and PKCE stores are both page-session scoped', async () => {
  const { session, persistent } = browser();
  const settings = oidc.websiteOidcSettings('https://account.example', 'https://www.example');
  assert.ok(settings.userStore instanceof WebStorageStateStore);
  assert.ok(settings.stateStore instanceof WebStorageStateStore);
  await settings.userStore.set('user', 'present'); await settings.stateStore.set('pkce', 'present');
  assert.equal(session.length, 2); assert.equal(persistent.length, 0);
});

test('Website real automatic expiry and forced recovery share one UserManager navigation', async () => {
  const { session } = browser(); let navigations = 0; let rejectNavigation;
  const navigation = new Promise((_, reject) => { rejectNavigation = reject; });
  const iframe = { prepare: async () => ({ navigate: async () => { navigations += 1; return navigation; }, close() {} }) };
  const manager = oidc.bindWebsiteUserManager(new UserManager({
    ...oidc.websiteOidcSettings('https://account.example', 'https://www.example'),
    userStore: new WebStorageStateStore({ store: session }), stateStore: new WebStorageStateStore({ store: session }),
    metadata: { issuer: 'https://account.example', authorization_endpoint: 'https://account.example/oauth2/authorize',
      token_endpoint: 'https://account.example/oauth2/token' },
  }, undefined, undefined, iframe));
  const automatic = manager._silentRenewService._tokenExpiring(); const forced = manager.signinSilent();
  await waitForNavigation(() => navigations); assert.equal(navigations, 1);
  rejectNavigation(new Error('test-stop')); await Promise.allSettled([automatic, forced]); manager.stopSilentRenew();
});

test('Website persistent fence survives interrupted signout and clears only after interactive callback', async () => {
  const { persistent } = browser(); let release;
  const renewal = new Promise((resolve) => { release = resolve; });
  const manager = new UserManager({ ...oidc.websiteOidcSettings('https://account.example', 'https://www.example'), automaticSilentRenew: false });
  manager.getUser = async () => user('old'); manager.signinSilent = async () => renewal;
  manager.removeUser = async () => {}; manager.signoutRedirect = async () => { throw new Error('offline'); };
  oidc.bindWebsiteUserManager(manager);
  const active = manager.signinSilent(); await Promise.resolve();
  const logout = oidc.logoutWebsiteManager(manager, 'https://www.example/'); release(user('late'));
  await assert.rejects(active, /OIDC_LOGOUT_FENCE/); await assert.rejects(logout, /offline/);
  await assert.rejects(manager.signinSilent(), /OIDC_LOGOUT_FENCE/);
  assert.equal(persistent.getItem(oidc.WEBSITE_LOGOUT_FENCE_KEY), 'deny');

  const callback = new UserManager({ ...oidc.websiteOidcSettings('https://account.example', 'https://www.example'), automaticSilentRenew: false });
  callback.signinRedirectCallback = async () => { throw new Error('bad-callback'); };
  await assert.rejects(oidc.settleWebsiteManagerCallback(callback, false), /bad-callback/);
  assert.equal(persistent.getItem(oidc.WEBSITE_LOGOUT_FENCE_KEY), 'deny');
  callback.signinRedirectCallback = async () => user('interactive');
  const successful = await oidc.settleWebsiteManagerCallback(callback, false);
  assert.equal(successful.profile.sub, 'account-1');
  assert.equal(persistent.getItem(oidc.WEBSITE_LOGOUT_FENCE_KEY), null);
});

test('Website subject-bound managers reject adoption across tabs or clients', async () => {
  browser();
  const manager = new UserManager({ ...oidc.websiteOidcSettings('https://account.example', 'https://www.example'), automaticSilentRenew: false });
  manager.getUser = async () => user('old', 'account-a'); manager.signinSilent = async () => user('new', 'account-b');
  manager.removeUser = async () => {}; oidc.bindWebsiteUserManager(manager);
  await assert.rejects(manager.signinSilent(), /OIDC_SUBJECT_MISMATCH/);
});
