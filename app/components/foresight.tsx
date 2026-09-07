"use client";

import { useCallback, useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

const PATH = "M90 240 C 240 240, 300 150, 430 165 S 620 300, 760 255 S 960 170, 1060 190";

type ForesightNode = { at: number; delay: number; kind: string; time: string; up?: boolean; label?: string; text?: string; before?: string; after?: string };

const NODES: ForesightNode[] = [
  { at: 0, delay: 0, kind: "now", time: "现在" },
  {
    at: 0.2, delay: 1.2, kind: "unk", up: true, time: "第 2 周", label: "未知",
    before: "12 家没上线，是我们没交付还是客户没推？",
    after: "查清了：只有 2 家没上线，15 家是缺报表功能",
  },
  {
    at: 0.36, delay: 2, kind: "risk", time: "第 7 周", label: "法务风险 · 提前看见",
    text: "2 家续约合同写着「未按期交付可单方解约」，延一周就能走人",
  },
  {
    at: 0.58, delay: 2.5, kind: "fin", up: true, time: "第 9 周", label: "财务风险 · 提前看见",
    text: "按 A 方案走，本季确认收入少 180 万",
  },
  {
    at: 0.72, delay: 3, kind: "exp", time: "经验 · 案例", label: "别人这么走过",
    text: "同类公司分两期收款、先做能做完的 5 家，续约率保住 80%",
  },
  {
    at: 0.9, delay: 3.7, kind: "dec", up: true, time: "第 12 周", label: "给你的判断",
    text: "推 A：三个月保 80%；坚持 85% 就得先解决招人这条线",
  },
];

/**
 * 推演：站在「现在」往前看。未来的未知被查清，法务和财务风险提前冒出来，
 * 别人的成功案例落到你这条路上，最后给一句判断。节点按曲线取点定位。
 */
export function Foresight() {
  const wrap = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    const host = wrap.current;
    const path = host?.querySelector<SVGPathElement>("path.path");
    if (!host || !path) return;
    const length = path.getTotalLength();
    host.querySelectorAll<HTMLElement>(".fnode").forEach(node => {
      const at = Number(node.dataset.at ?? 0);
      const point = path.getPointAtLength(length * at);
      node.style.left = `${(point.x / 1080) * 100}%`;
      node.style.top = `${(point.y / 460) * 100}%`;
    });
  }, []);

  const play = useCallback(() => {
    const host = wrap.current;
    if (!host) return;
    place();
    host.classList.remove("play", "done");
    void host.offsetWidth;
    host.classList.add(prefersReducedMotion() ? "done" : "play");
  }, [place]);

  useEffect(() => {
    place();
    window.addEventListener("resize", place);
    const host = wrap.current;
    if (!host) return () => window.removeEventListener("resize", place);
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      host.classList.add("done");
      return () => window.removeEventListener("resize", place);
    }
    let played = false;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || played) return;
        played = true;
        play();
      });
    }, { threshold: 0.35 });
    observer.observe(host);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [place, play]);

  return (
    <div className="fore" ref={wrap} data-rv onClick={play}>
      <svg viewBox="0 0 1080 460" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="fog" x1="0" x2="1">
            <stop offset="0" stopColor="#f4f6f7" stopOpacity="0" />
            <stop offset="1" stopColor="#d7dcdf" stopOpacity=".28" />
          </linearGradient>
          <linearGradient id="cone" x1="0" x2="1">
            <stop offset="0" stopColor="#d65732" stopOpacity=".06" />
            <stop offset="1" stopColor="#d65732" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect className="fog" x="640" y="0" width="440" height="460" />
        <polygon className="cone" points="90,230 1080,60 1080,400" />
        <path className="path" d={PATH} />
      </svg>
      {NODES.map(node => (
        <div
          key={node.time + node.at}
          className={`fnode ${node.kind}${node.up ? " up" : ""}`}
          data-at={node.at}
          style={{ "--d": `${node.delay}s` } as React.CSSProperties}
        >
          <div className="fb">
            <span className="pin" />
            {node.label && (
              <div className="fcard">
                <b>{node.label}</b>
                {node.before
                  ? <><span className="a">{node.before}</span><span className="b">{node.after}</span></>
                  : node.text}
              </div>
            )}
            <span className="tm">{node.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
