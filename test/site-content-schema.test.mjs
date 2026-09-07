import assert from 'node:assert/strict';
import test from 'node:test';

const { defaultSiteContent } = await import('../app/lib/site-content.ts');
const { normalizeSiteContent } = await import('../app/lib/site-content-schema.ts');

test('an empty or broken payload falls back to the built-in copy', () => {
  for (const payload of [null, undefined, 42, 'text', [], {}, { pages: null, brand: 'x' }]) {
    assert.deepEqual(normalizeSiteContent(payload), defaultSiteContent);
  }
});

test('a partial payload only replaces the fields it actually carries', () => {
  const result = normalizeSiteContent({ brand: { icp: '京 ICP 备 12345678 号', slogan: '   ' } });
  assert.equal(result.brand.icp, '京 ICP 备 12345678 号');
  assert.equal(result.brand.slogan, defaultSiteContent.brand.slogan);
  assert.deepEqual(result.footerColumns, defaultSiteContent.footerColumns);
});

test('home blocks keep code order and ids no matter what the payload says', () => {
  const result = normalizeSiteContent({
    home: { blocks: [{ id: 'service', eyebrow: '客服' }, { id: 'made-up', eyebrow: '不存在' }] },
  });
  assert.deepEqual(result.home.blocks.map(block => block.id), defaultSiteContent.home.blocks.map(block => block.id));
  assert.equal(result.home.blocks.find(block => block.id === 'service').eyebrow, '客服');
  assert.deepEqual(
    result.home.blocks.find(block => block.id === 'service').title,
    defaultSiteContent.home.blocks.find(block => block.id === 'service').title,
  );
});

test('unknown page slugs are dropped and known pages keep every rendered field', () => {
  const result = normalizeSiteContent({
    pages: {
      help: { title: '帮助', sections: [{ h: '一节', list: ['甲', '', '乙'], faq: [['问', '答'], ['坏']] }] },
      ghost: { title: '幽灵页', sections: [{ h: 'x', p: 'y' }] },
    },
  });
  assert.deepEqual(Object.keys(result.pages), Object.keys(defaultSiteContent.pages));
  assert.equal(result.pages.help.title, '帮助');
  assert.equal(result.pages.help.eyebrow, defaultSiteContent.pages.help.eyebrow);
  assert.deepEqual(result.pages.help.sections[0].list, ['甲', '乙']);
  assert.deepEqual(result.pages.help.sections[0].faq, [['问', '答']]);
});

test('a section with a heading but no body is dropped rather than rendered empty', () => {
  const result = normalizeSiteContent({ pages: { about: { sections: [{ h: '只有标题' }] } } });
  assert.deepEqual(result.pages.about.sections, defaultSiteContent.pages.about.sections);
});

test('legal pages keep their flag unless the payload states otherwise', () => {
  assert.equal(normalizeSiteContent({}).pages.privacy.legal, true);
  assert.equal(normalizeSiteContent({ pages: { privacy: { legal: false } } }).pages.privacy.legal, false);
});
