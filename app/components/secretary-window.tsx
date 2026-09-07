"use client";

import { useEffect, useRef } from "react";
import { WindowBar, prefersReducedMotion, useScenePlayback } from "./motion";

const ROWS = [
  { pill: "red", tag: "待裁", t: "两份制度对「大额采购审批」写法打架", s: "采购管理办法 v3 ↔ 财务审批流程 v2 · 你裁完才算数", tm: "今天" },
  { pill: "red", tag: "风险", t: "两家中型经销商回款拖了 47 天，正是最可能转投竞品的那两家", s: "华东区经销商渠道是否收缩 · 先保还是先切", tm: "15:40" },
  { pill: "amber", tag: "待审", t: "华远物资采购框架合同 3 处不符公司制度", s: "账期 90 天（制度 60 天）· 无质量异议期 · 违约金 30%", tm: "14:55" },
  { pill: "amber", tag: "待确认", t: "报销流程 v2 等你确认「这版作数」", s: "财务部 8 月 30 日提交 · 8 个流程卡", tm: "昨天" },
  { pill: "grey", tag: "已失效", t: "差旅标准 v1 的源文件已撤回", s: "3 个条目待重审", tm: "昨天" },
  { pill: "amber", tag: "待记", t: "6 张凭证等你确认", s: "差旅报销 ¥3,280 · 采购入库 ¥86,000 · 其他 4 笔", tm: "今天" },
  { pill: "green", tag: "进展", t: "明年是否自建仓配：收到三方仓报价，主线往前推一步", s: "等你确认候选", tm: "14:20" },
] as const;

const CHIPS: { text: string; count: number; muted?: boolean; on?: boolean }[] = [
  { text: "全部", count: 7, muted: true, on: true },
  { text: "文件冲突", count: 3 },
  { text: "财务风险", count: 1 },
  { text: "法务风险", count: 1 },
  { text: "目标更新", count: 2, muted: true },
];

const ClockMark = () => (
  <svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z" /><path d="M12 8v4l3 2" /></svg>
);

/** 秘书台：进来的事一条条主动冒上来。 */
export function SecretaryWindow() {
  const { host, play } = useScenePlayback<HTMLDivElement>();
  const total = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = total.current;
    if (!element) return;
    if (prefersReducedMotion()) {
      element.textContent = "7";
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 1400);
      element.textContent = String(Math.round(7 * (1 - (1 - progress) ** 3)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="win" ref={host} data-rv>
      <WindowBar label="秘书台" onReplay={play} />
      <div className="app">
        <aside className="app-nav">
          <div className="logo"><ClockMark />XELITI</div>
          <div className="new">＋ 新建目标</div>
          <div className="grp"><span>公司</span><span>华远贸易</span></div>
          <div className="it on">
            <svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z" /><path d="M4 10h16" /></svg>
            <span className="txt">秘书台</span>
            <span className="live"><span className="dot g pulse" />主动</span>
          </div>
          <div className="it">
            <svg viewBox="0 0 24 24"><path d="M4 5h6l2 2h8v12H4z" /></svg>
            <span className="txt">公司资料库</span>
          </div>
          <div className="grp"><span>置顶</span><span>仅本次会话</span></div>
          <div className="it"><span className="dot a" /><span className="txt">华东区经销商渠道是否收缩</span></div>
          <div className="grp"><span>目标</span><span>⌕</span></div>
          <div className="it"><span className="dot g" /><span className="txt">明年是否自建仓配</span></div>
          <div className="it"><span className="dot o" /><span className="txt">新品定价区间</span></div>
          <div className="user"><i>赵</i>赵总</div>
        </aside>

        <div className="app-main">
          <div className="app-head" style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div><h3>秘书台</h3><p>今年稳住华东渠道利润，明年直营化平稳过渡</p></div>
            <span className="toggle an pop" style={{ "--d": ".2s" } as React.CSSProperties}>
              <span className="on"><span className="dot g" />主动</span><span>暂停</span>
            </span>
          </div>
          <div className="app-body">
            <div className="chips">
              {CHIPS.map((chip, index) => (
                <span key={chip.text} className={`chip${chip.on ? " on" : ""} an pop`} style={{ "--d": `${0.4 + index * 0.1}s` } as React.CSSProperties}>
                  {chip.text} <i className={chip.muted ? "n" : undefined} ref={index === 0 ? total : undefined}>{index === 0 ? 0 : chip.count}</i>
                </span>
              ))}
            </div>
            <div className="sec-list">
              {ROWS.map((row, index) => (
                <div className="sec-row an slide" key={row.t} style={{ "--d": `${1.1 + index * 0.4}s` } as React.CSSProperties}>
                  <span className={`pill ${row.pill}`}>{row.tag}</span>
                  <div><div className="t">{row.t}</div><div className="s">{row.s}</div></div>
                  <span className="tm">{row.tm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="app-side">
          <h4>对话记录 <span className="delta">要点 4</span></h4>
          <div className="bub-you an" style={{ "--d": "4.2s" } as React.CSSProperties}>华东那两家拖款的，先别急着切，我下周去见一趟</div>
          <div className="bub-ai an" style={{ "--d": "4.9s" } as React.CSSProperties}>那两家暂不切，等你下周面谈。风险已改成「等面谈结果」。</div>
          <div className="side-foot">跟秘书说点什么</div>
        </aside>
      </div>
    </div>
  );
}
