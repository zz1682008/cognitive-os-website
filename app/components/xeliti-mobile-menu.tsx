"use client";

import { useRef, useState } from "react";

export function XelitiMobileMenu() {
  const [open, setOpen] = useState(false);
  const summary = useRef<HTMLElement>(null);

  return (
    <details className="mobile-menu" open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          summary.current?.focus();
        }
      }}>
      <summary ref={summary} aria-label={open ? "关闭导航菜单" : "打开导航菜单"}>菜单</summary>
      <div className="mobile-menu-panel" onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) setOpen(false);
      }}>
        <a href="#enterprise-product">Business</a>
        <a href="#decision">目标推演</a>
        <a href="#workbench">财务与法务工作台</a>
        <a href="#customer-service">智能客服</a>
        <a href="#secretary">秘书台</a>
        <a href="#download">桌面版</a>
        <a href="/personal/">Personal</a>
      </div>
    </details>
  );
}
