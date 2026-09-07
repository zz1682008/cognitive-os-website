"use client";

import { useCallback, useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

type Doc = { kind: string; name: string; note: string; chip: string; amount?: string; cells?: number; style: Record<string, string> };

const DOCS: Doc[] = [
  { kind: "pdf", name: "增值税发票", note: "办公用品 · 2026-08-30", amount: "¥1,200.00", chip: "发票 · 办公费", style: { left: "4%", top: "6%", transform: "rotate(-6deg)" } },
  { kind: "pdf", name: "增值税发票", note: "差旅 · 高铁", amount: "¥3,280.00", chip: "发票 · 差旅", style: { left: "16%", top: "34%", transform: "rotate(4deg)" } },
  { kind: "bank", name: "银行回单", note: "转出 · 供应商", amount: "¥86,000.00", chip: "银行回单", style: { left: "3%", top: "60%", transform: "rotate(-3deg)" } },
  { kind: "xls", name: "本月账簿.xlsx", note: "3 个工作表", cells: 9, chip: "本月账簿.xlsx", style: { right: "5%", top: "8%", transform: "rotate(5deg)" } },
  { kind: "pdf", name: "增值税发票", note: "采购入库 · 控制器", amount: "¥42,500.00", chip: "发票 · 采购入库", style: { right: "18%", top: "36%", transform: "rotate(-4deg)" } },
  { kind: "xls", name: "费用标准表.xlsx", note: "财务组", cells: 6, chip: "费用标准表.xlsx", style: { right: "4%", top: "62%", transform: "rotate(3deg)" } },
];

/**
 * 财务：桌上的发票、回单、Excel 一张张被吸进对话框，一发，
 * 凭证从对话框里长出来打勾，两张报表跟着落下。
 */
export function FinanceScene() {
  const stage = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const play = useCallback(() => {
    const host = stage.current;
    if (!host) return;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];

    const docs = Array.from(host.querySelectorAll<HTMLElement>("[data-doc]"));
    const attachments = host.querySelector<HTMLElement>("[data-att]");
    const text = host.querySelector<HTMLElement>("[data-txt]");
    const send = host.querySelector<HTMLElement>("[data-go]");
    const papers = ["[data-voucher]", "[data-balance]", "[data-profit]"]
      .map(selector => host.querySelector<HTMLElement>(selector));
    if (!attachments || !text || !send) return;

    host.classList.remove("done");
    docs.forEach(doc => {
      doc.getAnimations().forEach(animation => animation.cancel());
      doc.style.opacity = "";
    });
    attachments.innerHTML = "";
    text.classList.add("ph");
    papers.forEach(paper => { if (paper) paper.className = "paperc"; });

    if (prefersReducedMotion()) {
      host.classList.add("done");
      attachments.innerHTML = DOCS.map(doc => `<span class="on"><i></i>${doc.chip}</span>`).join("");
      text.classList.remove("ph");
      return;
    }

    const target = attachments.getBoundingClientRect();
    docs.forEach((doc, index) => {
      timers.current.push(window.setTimeout(() => {
        const box = doc.getBoundingClientRect();
        const dx = target.left + 40 + index * 6 - box.left;
        const dy = target.top - box.top;
        doc.animate([
          { transform: `${doc.style.transform} translate(0,0) scale(1)`, opacity: 1 },
          { transform: `translate(${dx}px,${dy}px) scale(.2) rotate(0deg)`, opacity: 0 },
        ], { duration: 650, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" });
        timers.current.push(window.setTimeout(() => {
          const chip = document.createElement("span");
          chip.className = "on";
          chip.innerHTML = `<i></i>${DOCS[index].chip}`;
          attachments.appendChild(chip);
        }, 520));
      }, 300 + index * 330));
    });

    const settled = 300 + docs.length * 330;
    timers.current.push(window.setTimeout(() => text.classList.remove("ph"), settled + 300));
    timers.current.push(window.setTimeout(() => {
      send.classList.add("hit");
      timers.current.push(window.setTimeout(() => send.classList.remove("hit"), 400));
    }, settled + 1100));
    const output = settled + 1400;
    timers.current.push(window.setTimeout(() => papers[0]?.classList.add("grow"), output));
    timers.current.push(window.setTimeout(() => papers[1]?.classList.add("side"), output + 1900));
    timers.current.push(window.setTimeout(() => papers[2]?.classList.add("side"), output + 2300));
  }, []);

  useEffect(() => {
    const host = stage.current;
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
    }, { threshold: 0.4 });
    observer.observe(host);
    const running = timers.current;
    return () => {
      observer.disconnect();
      running.forEach(window.clearTimeout);
    };
  }, [play]);

  return (
    <div className="fin-stage" ref={stage} data-rv onClick={play}>
      {DOCS.map((doc, index) => (
        <div className={`doc ${doc.kind}`} data-doc key={index} style={doc.style as React.CSSProperties}>
          <b>{doc.name}</b>{doc.note}
          {doc.cells
            ? <div className="grid">{Array.from({ length: doc.cells }, (_, i) => <i key={i} />)}</div>
            : <><i /><i style={{ width: "62%" }} /><div className="amt">{doc.amount}</div></>}
        </div>
      ))}

      <div className="fin-out">
        <div className="paperc" data-balance>
          <h5>资产负债表</h5>
          <div className="pd">2026 年 8 月 · 单位：元</div>
          <dl>
            <div><dt>货币资金</dt><dd>1,046,520</dd></div>
            <div><dt>固定资产净额</dt><dd>612,000</dd></div>
            <div><dt>资产合计</dt><dd>1,912,300</dd></div>
            <div><dt>负债与权益合计</dt><dd>1,912,300</dd></div>
          </dl>
        </div>
        <div className="paperc" data-voucher>
          <h5>记账凭证 · 记0087</h5>
          <div className="pd">2026-08-31 · 草稿，供你核对</div>
          <table><tbody>
            <tr style={{ "--d": ".5s" } as React.CSSProperties}><td>管理费用—办公费</td><td>借 1,200.00</td></tr>
            <tr style={{ "--d": ".7s" } as React.CSSProperties}><td>管理费用—差旅费</td><td>借 3,280.00</td></tr>
            <tr style={{ "--d": ".9s" } as React.CSSProperties}><td>库存商品</td><td>借 42,500.00</td></tr>
            <tr style={{ "--d": "1.1s" } as React.CSSProperties}><td>银行存款</td><td>贷 46,980.00</td></tr>
          </tbody></table>
          <div className="ok">✓ 借贷平衡 · 6 张凭证已生成</div>
        </div>
        <div className="paperc" data-profit>
          <h5>利润表</h5>
          <div className="pd">2026 年 8 月 · 单位：元</div>
          <dl>
            <div><dt>营业收入</dt><dd>1,860,000</dd></div>
            <div><dt>营业成本</dt><dd>1,204,000</dd></div>
            <div><dt>期间费用</dt><dd>238,480</dd></div>
          </dl>
          <div className="big"><span>利润总额</span><b>41.8 万</b></div>
        </div>
      </div>

      <div className="fin-composer">
        <div className="att" data-att />
        <div className="txt ph" data-txt>把这些记了，顺手出本月报表</div>
        <div className="row"><span>财务工作台</span><span className="go" data-go>↑</span></div>
      </div>
    </div>
  );
}
