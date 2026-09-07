import assert from 'node:assert/strict';
import test from 'node:test';

const content = await import('../app/lib/site-content.ts');

test('every footer link points at a page this site actually renders', () => {
  const known = new Set([
    '/',
    '/personal/',
    ...content.pageSlugs.map(slug => `/${slug}`),
  ]);
  const anchors = new Set(['/#brain', '/#reason', '/#secretary', '/#finance', '/#legal', '/#service']);
  for (const column of content.footerColumns) {
    assert.ok(column.links.length > 0, `${column.title} has no links`);
    for (const link of column.links) {
      assert.ok(link.text.trim().length > 0, 'footer link needs a label');
      assert.ok(
        known.has(link.href) || anchors.has(link.href),
        `footer link ${link.href} has no page or anchor behind it`,
      );
    }
  }
});

test('every page carries a title, an intro and at least one section', () => {
  for (const slug of content.pageSlugs) {
    const page = content.pages[slug];
    assert.ok(page.title.trim().length > 0, `${slug} has no title`);
    assert.ok(page.eyebrow.trim().length > 0, `${slug} has no eyebrow`);
    assert.ok(page.intro.trim().length > 0, `${slug} has no intro`);
    assert.ok(page.sections.length > 0, `${slug} has no sections`);
    for (const section of page.sections) {
      assert.ok(section.h.trim().length > 0, `${slug} has a section without a heading`);
      const hasBody = Boolean(section.p || section.list || section.faq || section.code || section.status);
      assert.ok(hasBody, `${slug} · ${section.h} has no body`);
    }
  }
});

test('legal pages are marked so they render in the quieter legal layout', () => {
  for (const slug of ['privacy', 'terms', 'cookies']) {
    assert.equal(content.pages[slug].legal, true, `${slug} must be marked legal`);
  }
  assert.notEqual(content.pages.help.legal, true);
});

test('contact addresses used in copy are the ones declared once in contact', () => {
  const declared = Object.values(content.contact);
  const emails = new Set();
  for (const slug of content.pageSlugs) {
    const serialized = JSON.stringify(content.pages[slug]);
    for (const match of serialized.matchAll(/[\w.-]+@[\w.-]+\.\w+/g)) emails.add(match[0]);
  }
  for (const email of emails) {
    assert.ok(declared.includes(email), `${email} is not declared in site-content contact`);
  }
});
