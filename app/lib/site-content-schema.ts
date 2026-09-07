/**
 * 管理端下发的文案要先过这一关。缺字段、类型不对、空字符串一律退回默认稿的那一项，
 * 保证官网不会因为后台存了半截数据而出现空标题或空导航。
 */

import {
  defaultSiteContent,
  type Brand,
  type Contact,
  type CtaCopy,
  type FooterColumn,
  type HomeCopy,
  type NavCopy,
  type PageSection,
  type SiteContent,
  type SitePage,
} from "./site-content.ts";

type Raw = Record<string, unknown>;

function obj(value: unknown): Raw | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Raw) : undefined;
}

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function optionalStr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function strings(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const lines = value.filter((line): line is string => typeof line === "string" && line.trim().length > 0);
  return lines.length > 0 ? lines : fallback;
}

function pairs(value: unknown): [string, string][] | undefined {
  if (!Array.isArray(value)) return undefined;
  const rows = value
    .filter((row): row is unknown[] => Array.isArray(row) && row.length >= 2)
    .map(row => [String(row[0] ?? ""), String(row[1] ?? "")] as [string, string])
    .filter(([left]) => left.trim().length > 0);
  return rows.length > 0 ? rows : undefined;
}

function brand(raw: unknown, fallback: Brand): Brand {
  const source = obj(raw) ?? {};
  return {
    name: str(source.name, fallback.name),
    slogan: str(source.slogan, fallback.slogan),
    icp: str(source.icp, fallback.icp),
    police: str(source.police, fallback.police),
    copyright: str(source.copyright, fallback.copyright),
  };
}

function contact(raw: unknown, fallback: Contact): Contact {
  const source = obj(raw) ?? {};
  return {
    email: str(source.email, fallback.email),
    sales: str(source.sales, fallback.sales),
    support: str(source.support, fallback.support),
    wechat: str(source.wechat, fallback.wechat),
    address: str(source.address, fallback.address),
  };
}

function nav(raw: unknown, fallback: NavCopy): NavCopy {
  const source = obj(raw) ?? {};
  const products = Array.isArray(source.products)
    ? source.products
        .map(item => obj(item))
        .filter((item): item is Raw => Boolean(item))
        .map(item => ({
          href: str(item.href, "/"),
          title: str(item.title, ""),
          note: str(item.note, ""),
        }))
        .filter(item => item.title.length > 0)
    : [];
  const links = Array.isArray(source.links)
    ? source.links
        .map(item => obj(item))
        .filter((item): item is Raw => Boolean(item))
        .map(item => ({ href: str(item.href, "/"), text: str(item.text, "") }))
        .filter(item => item.text.length > 0)
    : [];
  return {
    productsLabel: str(source.productsLabel, fallback.productsLabel),
    products: products.length > 0 ? products : fallback.products,
    links: links.length > 0 ? links : fallback.links,
    download: str(source.download, fallback.download),
    trial: str(source.trial, fallback.trial),
  };
}

function home(raw: unknown, fallback: HomeCopy): HomeCopy {
  const source = obj(raw) ?? {};
  const heroSource = obj(source.hero) ?? {};
  const finaleSource = obj(source.finale) ?? {};
  const edited = new Map<string, Raw>();
  if (Array.isArray(source.blocks)) {
    for (const item of source.blocks) {
      const block = obj(item);
      const id = block && typeof block.id === "string" ? block.id : undefined;
      if (id) edited.set(id, block!);
    }
  }
  return {
    hero: {
      eyebrow: str(heroSource.eyebrow, fallback.hero.eyebrow),
      title: strings(heroSource.title, fallback.hero.title),
      sub: str(heroSource.sub, fallback.hero.sub),
      primary: str(heroSource.primary, fallback.hero.primary),
      secondary: str(heroSource.secondary, fallback.hero.secondary),
    },
    // 版块顺序与 id 由代码决定：每个 id 后面挂着一段特定动画，后台改不了顺序，只改文案。
    blocks: fallback.blocks.map(block => {
      const source = edited.get(block.id) ?? {};
      return {
        id: block.id,
        eyebrow: str(source.eyebrow, block.eyebrow),
        title: strings(source.title, block.title),
      };
    }),
    finale: {
      primary: str(finaleSource.primary, fallback.finale.primary),
      secondary: str(finaleSource.secondary, fallback.finale.secondary),
    },
  };
}

function cta(raw: unknown, fallback: CtaCopy): CtaCopy {
  const source = obj(raw) ?? {};
  return {
    title: str(source.title, fallback.title),
    note: str(source.note, fallback.note),
    button: str(source.button, fallback.button),
  };
}

function footerColumns(raw: unknown, fallback: FooterColumn[]): FooterColumn[] {
  if (!Array.isArray(raw)) return fallback;
  const columns = raw
    .map(item => obj(item))
    .filter((item): item is Raw => Boolean(item))
    .map(item => ({
      title: str(item.title, ""),
      links: Array.isArray(item.links)
        ? item.links
            .map(link => obj(link))
            .filter((link): link is Raw => Boolean(link))
            .map(link => ({ text: str(link.text, ""), href: str(link.href, "/") }))
            .filter(link => link.text.length > 0)
        : [],
    }))
    .filter(column => column.title.length > 0 && column.links.length > 0);
  return columns.length > 0 ? columns : fallback;
}

function section(raw: Raw): PageSection | undefined {
  const heading = optionalStr(raw.h);
  if (!heading) return undefined;
  const list = Array.isArray(raw.list)
    ? raw.list.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : undefined;
  const built: PageSection = { h: heading };
  const paragraph = optionalStr(raw.p);
  if (paragraph) built.p = paragraph;
  if (list && list.length > 0) built.list = list;
  const faq = pairs(raw.faq);
  if (faq) built.faq = faq;
  const code = optionalStr(raw.code);
  if (code) built.code = code;
  const status = pairs(raw.status);
  if (status) built.status = status;
  const hasBody = Boolean(built.p || built.list || built.faq || built.code || built.status);
  return hasBody ? built : undefined;
}

function page(raw: unknown, fallback: SitePage): SitePage {
  const source = obj(raw);
  if (!source) return fallback;
  const sections = Array.isArray(source.sections)
    ? source.sections
        .map(item => obj(item))
        .filter((item): item is Raw => Boolean(item))
        .map(section)
        .filter((item): item is PageSection => Boolean(item))
    : [];
  return {
    title: str(source.title, fallback.title),
    eyebrow: str(source.eyebrow, fallback.eyebrow),
    intro: str(source.intro, fallback.intro),
    legal: typeof source.legal === "boolean" ? source.legal : fallback.legal,
    sections: sections.length > 0 ? sections : fallback.sections,
  };
}

/**
 * 把管理端下发的任意 JSON 收敛成一份完整可渲染的文案。
 * 页面集合以代码里的默认稿为准：后台只能改已有页面，新增页面要重新发布官网。
 */
export function normalizeSiteContent(raw: unknown, fallback: SiteContent = defaultSiteContent): SiteContent {
  const source = obj(raw) ?? {};
  const incomingPages = obj(source.pages) ?? {};
  const pages: Record<string, SitePage> = {};
  for (const [slug, fallbackPage] of Object.entries(fallback.pages)) {
    pages[slug] = page(incomingPages[slug], fallbackPage);
  }
  return {
    brand: brand(source.brand, fallback.brand),
    contact: contact(source.contact, fallback.contact),
    nav: nav(source.nav, fallback.nav),
    home: home(source.home, fallback.home),
    cta: cta(source.cta, fallback.cta),
    footerColumns: footerColumns(source.footerColumns, fallback.footerColumns),
    pages,
  };
}
