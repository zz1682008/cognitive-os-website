"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AccountSession } from "./account-session";

const BrandMark = () => (
  <svg viewBox="0 0 44 44" aria-hidden="true">
    <path d="M5 30.5C9 30.5 10.5 12.5 16 12.5S19.5 31.5 24.5 31.5 28 12.5 33 12.5s5.5 14.5 6 18" />
    <circle cx="5" cy="30.5" r="2.4" />
    <circle cx="39" cy="30.5" r="2.4" />
  </svg>
);

/** 首页锚点在别的页面上要带上站点根路径。 */
function anchor(home: boolean, hash: string) {
  return home ? hash : `/${hash}`;
}

export function SiteHeader({ authority, home = false }: { authority: string; home?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [stuck, setStuck] = useState(!home);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!home) return;
    const sync = () => setStuck(window.scrollY > 8);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, [home]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setSheetOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const products = [
    {
      href: anchor(home, "#brain"),
      title: "XELITI Business",
      note: "企业端 · 工作台与秘书台",
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M9 4v16" />
        </svg>
      ),
    },
    {
      href: anchor(home, "#service"),
      title: "智能客服",
      note: "对外出口 · 懂你公司的客服",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 12a8 8 0 1 1 16 0v5a3 3 0 0 1-3 3h-2" />
          <path d="M4 13h3v5H4z" />
          <path d="M17 13h3v5h-3z" />
        </svg>
      ),
    },
    {
      href: "/personal/",
      title: "XELITI Personal",
      note: "个人端 · 面向个人的重要选择",
      full: true,
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      ),
    },
  ];

  const sections = [
    { href: anchor(home, "#brain"), text: "企业大脑" },
    { href: anchor(home, "#reason"), text: "推演" },
    { href: anchor(home, "#finance"), text: "财务" },
    { href: anchor(home, "#legal"), text: "法务" },
    { href: "/help", text: "帮助" },
  ];

  return (
    <header className={`hdr${home ? "" : " solid"}${stuck ? " stuck" : ""}${sheetOpen ? " mopen" : ""}`}>
      <div className="shell nav">
        <a className="brand" href={home ? "#top" : "/"} aria-label="XELITI 首页">
          <BrandMark />
          <b>XELITI</b>
        </a>
        <nav className="nav-links" aria-label="主导航">
          <div className="has-menu" ref={menu} {...(menuOpen ? { "data-open": "" } : {})}
            onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
            <button className="nav-link" type="button" aria-expanded={menuOpen} aria-haspopup="true"
              onClick={event => { event.stopPropagation(); setMenuOpen(open => !open); }}>
              产品
              <svg className="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div className="menu" role="menu">
              {products.map(item => (
                <a key={item.title} className={item.full ? "full" : undefined} href={item.href} role="menuitem">
                  <span className="mi">{item.icon}</span>
                  <span><strong>{item.title}</strong><small>{item.note}</small></span>
                </a>
              ))}
            </div>
          </div>
          {sections.map(item => (
            <a key={item.text} className="nav-link" href={item.href}>{item.text}</a>
          ))}
        </nav>
        <div className="nav-act">
          <Link className="btn btn-ghost" href="/download">下载桌面版</Link>
          <AccountSession authority={authority} />
          <Link className="btn btn-dark" href="/trial">申请试用</Link>
          <button className="burger" type="button" aria-expanded={sheetOpen} aria-label="打开菜单"
            onClick={event => { event.stopPropagation(); setSheetOpen(open => !open); }}>
            <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>
      <div className="msheet" onClick={event => { if ((event.target as HTMLElement).closest("a")) setSheetOpen(false); }}>
        <div className="shell">
          {products.map(item => (
            <a key={item.title} href={item.href}>{item.title} <small>{item.note}</small></a>
          ))}
          {sections.map(item => <a key={item.text} href={item.href}>{item.text}</a>)}
          <div className="macts">
            <Link className="btn btn-line" href="/download">下载桌面版</Link>
            <Link className="btn btn-dark" href="/trial">申请试用</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
