"use client";

import { useCallback, useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

type Clause = { h: string; text: string; bad?: string; advice?: string };

const CLAUSES: Clause[] = [
  { h: "第一条 · 标的", text: "卖方向买方出售工业控制器 24 台及配套配件一批，型号、数量以附件清单为准。" },
  { h: "第二条 · 价款", text: "合同总价 68 万元，含税。" },
  { h: "第三条 · 验收", text: "验收方式及期限，由买方另行确定。", bad: "验收标准和期限不明确", advice: "建议约定验收项目、期限及异议处理方式。" },
  { h: "第四条 · 交付", text: "交付时间由双方协商。" },
  { h: "第五条 · 违约责任", text: "卖方承担由此产生的一切损失。", bad: "责任范围没有边界", advice: "建议明确损失范围、责任上限与例外情形。" },
  { h: "第六条 · 争议解决", text: "双方协商不成的，提交卖方所在地法院。" },
];

const DRAFT: { h: string; lines: [number, number][] }[] = [
  { h: "交易与交付", lines: [[92, 5], [70, 5.15]] },
  { h: "分两期收款", lines: [[88, 5.5], [62, 5.65], [76, 5.8]] },
  { h: "交付后验收", lines: [[84, 6.2], [55, 6.35]] },
  { h: "违约责任（有上限）", lines: [[80, 6.7]] },
];

/** 法务：一道光扫过合同，有坑的条款原地泛红贴上建议；旁边草案按公司模板一段段生成。 */
export function LegalScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const play = useCallback(() => {
    const host = wrap.current;
    const stage = host?.querySelector<HTMLElement>(".law-stage");
    if (!host || !stage) return;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];

    host.classList.remove("done");
    stage.classList.remove("play", "done");
    stage.querySelectorAll(".clause").forEach(clause => clause.classList.remove("lit"));
    void stage.offsetWidth;

    if (prefersReducedMotion()) {
      stage.classList.add("done");
      stage.querySelectorAll(".clause.bad").forEach(clause => clause.classList.add("lit"));
      return;
    }
    stage.classList.add("play");
    const bad = Array.from(stage.querySelectorAll<HTMLElement>(".clause.bad"));
    bad.forEach((clause, index) => {
      timers.current.push(window.setTimeout(() => clause.classList.add("lit"), 1800 + index * 800));
    });
  }, []);

  useEffect(() => {
    const host = wrap.current;
    if (!host) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      play();
      return;
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
    const running = timers.current;
    return () => {
      observer.disconnect();
      running.forEach(window.clearTimeout);
    };
  }, [play]);

  return (
    <div className="law-wrap" ref={wrap} data-rv onClick={play}>
      <div className="law-say">
        <span>帮我审一下销售发来的设备销售合同，再按公司模板拟一份分两期收款的</span>
        <span className="go">↑</span>
      </div>
      <div className="law-stage">
        <div className="contract">
          <div className="scanbox"><div className="scan" /></div>
          <h5>设备销售合同</h5>
          <div className="sub2">销售提交 · 待法务确认</div>
          {CLAUSES.map(clause => (
            <div className={`clause${clause.bad ? " bad" : ""}`} key={clause.h}>
              <b>{clause.h}</b>{clause.text}
              {clause.bad && <div className="note"><b>{clause.bad}</b>{clause.advice}</div>}
            </div>
          ))}
        </div>
        <div className="draft">
          <h5>设备销售合同 · 草案 <span>按公司模板 · 交由法务确认</span></h5>
          {DRAFT.map(section => (
            <div className="sec2" key={section.h}>
              <b>{section.h}</b>
              {section.lines.map(([width, delay], index) => (
                <div className="ln" key={index} style={{ "--w": `${width}%`, animationDelay: `${delay}s` } as React.CSSProperties} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
