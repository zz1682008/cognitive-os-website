import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteArticle } from "../components/site-article";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { pageSlugs, pages } from "../lib/site-content";

export function generateStaticParams() {
  return pageSlugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return {};
  return { title: `${page.title}｜XELITI`, description: page.intro };
}

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!pages[slug]) notFound();
  const authority = process.env.PLATFORM_ACCOUNT_CENTER_ISSUER ?? "http://127.0.0.1:5200";

  return (
    <>
      <a className="skip" href="#main">跳到主要内容</a>
      <SiteHeader authority={authority} />
      <main className="pg" id="main">
        <SiteArticle slug={slug} />
      </main>
      <SiteFooter />
    </>
  );
}
