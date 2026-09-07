import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageToc } from "../components/page-toc";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { pageSlugs, pages, type PageSection } from "../lib/site-content";

export function generateStaticParams() {
  return pageSlugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return {};
  return { title: `${page.title}｜XELITI`, description: page.intro };
}

function Section({ section, id }: { section: PageSection; id: string }) {
  return (
    <section className="sec" id={id}>
      <h2>{section.h}</h2>
      {section.p && <p>{section.p}</p>}
      {section.list && <ul>{section.list.map(item => <li key={item}>{item}</li>)}</ul>}
      {section.faq && (
        <div className="faq">
          {section.faq.map(([question, answer], index) => (
            <details key={question} open={index === 0 && id === "s0"}>
              <summary>{question}</summary>
              <div className="a">{answer}</div>
            </details>
          ))}
        </div>
      )}
      {section.code && <pre>{section.code}</pre>}
      {section.status && (
        <div className="status">
          {section.status.map(([service, state]) => (
            <div key={service}><b>{service}</b><span>{state}</span></div>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();
  const authority = process.env.PLATFORM_ACCOUNT_CENTER_ISSUER ?? "http://127.0.0.1:5200";
  const anchors = page.sections.map((section, index) => ({ id: `s${index}`, text: section.h }));

  return (
    <>
      <a className="skip" href="#main">跳到主要内容</a>
      <SiteHeader authority={authority} />
      <main className="pg" id="main">
        <div className="shell pg-grid">
          <PageToc anchors={anchors} />
          <article className={page.legal ? "legal" : undefined}>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p className="intro">{page.intro}</p>
            {page.sections.map((section, index) => (
              <Section key={section.h} section={section} id={`s${index}`} />
            ))}
            {!page.legal && slug !== "trial" && (
              <div className="cta">
                <div><b>先从一个目标开始。</b><span>30 天试用，不限功能。</span></div>
                <Link className="btn btn-dark" href="/trial">申请试用</Link>
              </div>
            )}
            <p className="note">本页内容由管理端维护。</p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
