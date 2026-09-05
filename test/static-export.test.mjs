import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { loadConfigFromFile } from 'vite';
import { GET as robots } from '../app/robots.txt/route.ts';
import { GET as sitemap } from '../app/sitemap.xml/route.ts';

const publicConfig = {
  NEXT_PUBLIC_SITE_URL: 'https://twww.linzhaozhao.com',
  PLATFORM_ACCOUNT_CENTER_ISSUER: 'https://tqy.linzhaozhao.com',
  WEBSITE_CANONICAL_ORIGIN: 'https://twww.linzhaozhao.com',
};

async function configWith(overrides, run) {
  const previous = Object.fromEntries(Object.keys(publicConfig).map(key => [key, process.env[key]]));
  try {
    for (const [key, value] of Object.entries({ ...publicConfig, ...overrides })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    const loaded = await loadConfigFromFile(
      { command: 'build', mode: 'production' },
      fileURLToPath(new URL('../vite.config.ts', import.meta.url)),
      undefined,
      'silent',
    );
    assert.ok(loaded);
    return await run(loaded.config);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('static page and RSC config pins the explicit public test destinations', async () => {
  await configWith({}, config => {
    for (const [key, value] of Object.entries(publicConfig)) {
      assert.equal(JSON.parse(config.define[`process.env.${key}`]), value);
    }
  });
  await configWith(Object.fromEntries(Object.entries(publicConfig).map(([key, value]) => [key, `${value}/`])), config => {
    assert.equal(JSON.parse(config.define['process.env.NEXT_PUBLIC_SITE_URL']), publicConfig.NEXT_PUBLIC_SITE_URL);
  });
});

for (const key of Object.keys(publicConfig)) {
  test(`static config rejects missing, invalid and unapproved ${key}`, async () => {
    const invalid = [
      undefined, '', 'not-a-url', 'http://localhost:3012',
      'https://www.linzhaozhao.com', 'https://unknown.example',
      `${publicConfig[key]}/path`, `${publicConfig[key]}?redirect=elsewhere`,
      `${publicConfig[key]}#fragment`, `${publicConfig[key]}:8443`,
      publicConfig[key].replace('https://', 'https://user:do-not-log@'),
    ];
    for (const value of invalid) {
      await assert.rejects(configWith({ [key]: value }, () => assert.fail('invalid config accepted')), error => {
        assert.equal(error.message, `Static Website requires explicit ${key}=${publicConfig[key]}`);
        assert.ok(!error.message.includes('do-not-log'));
        return true;
      });
    }
  });
}

test('the client build emits both existing GET responses with the validated site origin', async () => {
  await configWith({}, async config => {
    const plugin = config.plugins.flat(Infinity).find(item => item?.name === 'website-static-metadata');
    assert.ok(plugin);
    assert.equal(plugin.apply, 'build');
    assert.equal(plugin.applyToEnvironment({ name: 'client' }), true);
    assert.equal(plugin.applyToEnvironment({ name: 'ssr' }), false);
    assert.equal(plugin.applyToEnvironment({ name: 'rsc' }), false);
    const assets = [];
    await plugin.generateBundle.call({ emitFile: asset => assets.push(asset) });
    assert.deepEqual(assets.map(asset => [asset.type, asset.fileName]), [
      ['asset', 'robots.txt'], ['asset', 'sitemap.xml'],
    ]);
    for (const [asset, handler] of [[assets[0], robots], [assets[1], sitemap]]) {
      const response = handler(new Request(`${publicConfig.NEXT_PUBLIC_SITE_URL}/${asset.fileName}`));
      assert.equal(asset.source, await response.text());
    }
    assert.match(assets[0].source, /^Sitemap: https:\/\/twww\.linzhaozhao\.com\/sitemap\.xml$/m);
    assert.match(assets[1].source, /<loc>https:\/\/twww\.linzhaozhao\.com\/<\/loc>/);
  });
});
