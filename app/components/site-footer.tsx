"use client";

import Link from "next/link";

import { useSiteContent } from "./site-content-provider";

export function SiteFooter() {
  const { brand, contact, footerColumns } = useSiteContent();
  return (
    <footer className="ftr">
      <div className="shell">
        <div className="ftr-cols">
          <div className="ftr-brand">
            <Link className="bw" href="/" aria-label={`${brand.name} 首页`}>
              <svg viewBox="0 0 44 44" aria-hidden="true">
                <path d="M5 30.5C9 30.5 10.5 12.5 16 12.5S19.5 31.5 24.5 31.5 28 12.5 33 12.5s5.5 14.5 6 18" />
                <circle cx="5" cy="30.5" r="2.4" />
                <circle cx="39" cy="30.5" r="2.4" />
              </svg>
              <b>{brand.name}</b>
            </Link>
            <p>{brand.slogan}</p>
            <p className="ftr-contact">{contact.email}<br />{contact.wechat}</p>
            <div className="sm">
              <a href={`mailto:${contact.email}`} aria-label="发邮件给 XELITI">
                <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>
              </a>
              <Link href="/contact" aria-label="联系我们">
                <svg viewBox="0 0 24 24"><path d="M4 18v-2.6A6.4 6.4 0 0 1 10.5 5h3A6.5 6.5 0 0 1 20 11.5 6.5 6.5 0 0 1 13.5 18H8z" /></svg>
              </Link>
            </div>
          </div>
          {footerColumns.map(column => (
            <div className="ftr-col" key={column.title}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map(link => (
                  <li key={link.text}>{link.href.startsWith("/#") || link.href.endsWith("/")
                    ? <a href={link.href}>{link.text}</a>
                    : <Link href={link.href}>{link.text}</Link>}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="ftr-bottom">
          <span>{brand.copyright}</span>
          <a href="https://beian.miit.gov.cn/" rel="noreferrer">{brand.icp}</a>
          <span>{brand.police}</span>
          <span className="right">
            <Link href="/privacy">隐私政策</Link>
            <Link href="/terms">服务条款</Link>
            <Link href="/status">服务状态</Link>
            <a href="#top">回到顶部 ↑</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
