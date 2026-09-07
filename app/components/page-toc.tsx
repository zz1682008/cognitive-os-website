"use client";

import { useEffect, useState } from "react";

/** 二级页左侧目录：跟着滚动高亮当前小节。 */
export function PageToc({ anchors }: { anchors: { id: string; text: string }[] }) {
  const [active, setActive] = useState(anchors[0]?.id);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    anchors.forEach(anchor => {
      const element = document.getElementById(anchor.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [anchors]);

  return (
    <aside className="toc">
      <h4>本页</h4>
      {anchors.map(anchor => (
        <a key={anchor.id} href={`#${anchor.id}`} className={active === anchor.id ? "on" : undefined}>
          {anchor.text}
        </a>
      ))}
    </aside>
  );
}
