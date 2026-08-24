import assert from 'node:assert/strict';
import { test } from 'node:test';

const { createOidcRuntime, websiteOidcSettings } = await import('../app/lib/platform-oidc-client.ts');
const user = (token, sub = 'account-1') => ({ access_token: token, expired: false, expires_at: 1_900_000_000, profile: { sub } });

test('Website leaves UserStore at oidc-client-ts sessionStorage default', () => {
  const settings = websiteOidcSettings('https://account.example', 'https://www.example');
  assert.equal(settings.automaticSilentRenew, true);
  assert.equal(settings.userStore, undefined);
});

test('Website mature client single-flights silent renewal and invokes the silent callback primitive', async () => {
  let callbacks = 0;
  let renewals = 0;
  const manager = {
    getUser: async () => user('old'), signinSilent: async () => { renewals += 1; return user('renewed'); },
    signinSilentCallback: async () => { callbacks += 1; }, signinRedirectCallback: async () => user('interactive'),
    signinRedirect: async () => {}, removeUser: async () => {}, stopSilentRenew: () => {}, signoutRedirect: async () => {},
  };
  const runtime = createOidcRuntime(manager, { isSilentCallback: () => true });
  await Promise.all([runtime.recoverAuthorizationHeader(), runtime.recoverAuthorizationHeader()]);
  assert.deepEqual(await runtime.recoverAuthorizationHeader(), { Authorization: 'Bearer renewed' });
  await runtime.settleCallback();
  assert.equal(renewals, 2);
  assert.equal(callbacks, 1);
});

test('Website logout removes the local User before standard OIDC logout', async () => {
  const order = [];
  const manager = {
    getUser: async () => user('old'), signinSilent: async () => user('renewed'),
    signinSilentCallback: async () => {}, signinRedirectCallback: async () => user('interactive'), signinRedirect: async () => {},
    stopSilentRenew: () => { order.push('stop'); }, removeUser: async () => { order.push('remove'); },
    signoutRedirect: async () => { order.push('signout'); },
  };
  await createOidcRuntime(manager).logout('http://client.test/');
  assert.deepEqual(order, ['stop', 'remove', 'signout']);
});
