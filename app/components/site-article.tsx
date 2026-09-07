"use client";

import Link from "next/link";

import { PageToc } from "./page-toc";
import { useSiteContent } from "./site-content-provider";
import type { PageSection } from "../lib/site-content";

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

/** 二级页正文。页面存在与否由构建决定，正文与目录跟着管理端的当前版本走。 */
export function SiteArticle({ slug }: { slug: string }) {
  const content = useSiteContent();
  const page = content.pages[slug];
  if (!page) return null;
  const anchors = page.sections.map((section, index) => ({ id: `s${index}`, text: section.h }));

  return (
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
            <div><b>{content.cta.title}</b><span>{content.cta.note}</span></div>
            <Link className="btn btn-dark" href="/trial">{content.cta.button}</Link>
          </div>
        )}
        <p className="note">本页内容由管理端维护。</p>
      </article>
    </div>
  );
}
