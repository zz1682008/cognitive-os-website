"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * 全站的滚动进场：给任意元素加 `data-rv`，进入视野后加上 `in`。
 * 观察器一次也没回调时（打印、截图、异常环境）兜底全部显示，不留白页。
 */
export function Reveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-rv]"));
    const revealAll = () => targets.forEach(el => {
      el.style.transitionDelay = "0ms";
      el.classList.add("in");
    });
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }
    let fired = false;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        fired = true;
        const el = entry.target as HTMLElement;
        const index = Array.prototype.indexOf.call(el.parentNode?.children ?? [], el);
        el.style.transitionDelay = `${Math.min(index, 5) * 90}ms`;
        el.classList.add("in");
        observer.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(el => observer.observe(el));
    const fallback = window.setTimeout(() => {
      if (!fired && document.visibilityState === "visible") revealAll();
    }, 2200);
    window.addEventListener("beforeprint", revealAll);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      window.removeEventListener("beforeprint", revealAll);
    };
  }, []);
  return null;
}

/**
 * 一段界面演示：进入视野播一次，可重播。播放状态只是 `play` / `done` 两个 class，
 * 动画排布交给 CSS 的 animation-delay，所以重播只需要抹掉 class 再强制回流。
 */
export function useScenePlayback<T extends HTMLElement>(onPlay?: () => void) {
  const host = useRef<T>(null);

  const play = useCallback(() => {
    const element = host.current;
    if (!element) return;
    element.classList.remove("play", "done");
    void element.offsetWidth;
    if (prefersReducedMotion()) {
      element.classList.add("done");
      return;
    }
    element.classList.add("play");
    onPlay?.();
  }, [onPlay]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      element.classList.add("done");
      return;
    }
    let played = false;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || played) return;
        played = true;
        play();
      });
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [play]);

  return { host, play };
}

/** 窗口标题栏，带重播按钮。 */
export function WindowBar({ label, onReplay }: { label: string; onReplay?: () => void }) {
  return (
    <div className="win-bar">
      <i /><i /><i /><span>{label}</span>
      {onReplay && (
        <button className="replay" type="button" onClick={onReplay} aria-label={`重播${label}演示`}>
          ↻ 重播
        </button>
      )}
    </div>
  );
}

/** 一个不需要额外状态的演示容器：进入视野播一次。 */
export function Scene({
  as: Tag = "div",
  className,
  label,
  children,
  ...rest
}: {
  as?: "div" | "section";
  className: string;
  label?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const { host, play } = useScenePlayback<HTMLDivElement>();
  return (
    <Tag ref={host} className={className} data-rv {...rest}>
      {label && <WindowBar label={label} onReplay={play} />}
      {children}
    </Tag>
  );
}
