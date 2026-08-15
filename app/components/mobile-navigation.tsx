"use client";

import { useEffect, useId, useState } from "react";

type NavigationItem = {
  href: string;
  label: string;
};

export function MobileNavigation({ items }: { items: NavigationItem[] }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    const desktopQuery = window.matchMedia("(min-width: 769px)");

    window.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeAtDesktop);
    };
  }, [open]);

  return (
    <div className="mobile-navigation">
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-label={open ? "关闭导航" : "打开导航"}
        className="menu-button"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <nav aria-label="移动导航" className={open ? "mobile-menu is-open" : "mobile-menu"} id={menuId}>
        {items.map((item) => (
          <a href={item.href} key={item.href} onClick={() => setOpen(false)}>{item.label}</a>
        ))}
        <a href="#decision-demo" onClick={() => setOpen(false)}>查看推演示例</a>
      </nav>
    </div>
  );
}
