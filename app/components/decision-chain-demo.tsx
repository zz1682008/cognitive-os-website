"use client";

import { type KeyboardEvent, useId, useState } from "react";
import { demoScenarios, type DemoNodeTone } from "../lib/demo-scenarios";

const toneLabels: Record<DemoNodeTone, string> = {
  fact: "事实点",
  risk: "风险点",
  turning: "转折点",
  decision: "等待确认",
  outcome: "可能结果",
};

const scenarioStatus: Record<string, string> = {
  "product-mvp": "需要明确范围",
  "contract-signing": "待确认验收标准",
  cashflow: "持续关注回款",
};

function moveFocus(
  event: KeyboardEvent<HTMLButtonElement>,
  buttons: HTMLButtonElement[],
  currentIndex: number,
) {
  let nextIndex = currentIndex;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % buttons.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = buttons.length - 1;
  } else {
    return null;
  }

  event.preventDefault();
  buttons[nextIndex]?.focus();
  return nextIndex;
}

export function DecisionChainDemo() {
  const demoId = useId().replace(/:/g, "");
  const [scenarioIndex, setScenarioIndex] = useState(1);
  const [nodeIndex, setNodeIndex] = useState(3);
  const scenario = demoScenarios[scenarioIndex];
  const primaryNodes = scenario.nodes
    .filter((node) => node.lane === "main")
    .sort((left, right) => left.stage - right.stage)
    .slice(0, 4);
  const riskCount = primaryNodes.filter((node) => node.tone === "risk").length;
  const turningCount = primaryNodes.filter((node) => node.tone === "turning").length;

  const selectScenario = (index: number) => {
    setScenarioIndex(index);
    setNodeIndex(3);
  };

  const handleScenarioKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const buttons = Array.from(
      event.currentTarget
        .closest(".sandbox-sidebar")
        ?.querySelectorAll<HTMLButtonElement>("[role='tab']") ?? [],
    );
    const currentPosition = buttons.indexOf(event.currentTarget);
    const nextPosition = moveFocus(event, buttons, currentPosition);
    if (nextPosition !== null) {
      selectScenario(Number(buttons[nextPosition]?.dataset.scenarioIndex ?? 0));
    }
  };

  const handleNodeKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const buttons = Array.from(
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='option']") ?? [],
    );
    const nextIndex = moveFocus(event, buttons, index);
    if (nextIndex !== null) setNodeIndex(nextIndex);
  };

  const scenarioTab = (index: number, className = "") => {
    const item = demoScenarios[index];
    const selected = scenarioIndex === index;
    return (
      <button
        aria-controls={`${demoId}-panel`}
        aria-selected={selected}
        className={`sandbox-goal-row ${className}${selected ? " is-active" : ""}`}
        data-scenario-index={index}
        id={`${demoId}-tab-${item.id}`}
        key={item.id}
        onClick={() => selectScenario(index)}
        onKeyDown={handleScenarioKey}
        role="tab"
        tabIndex={selected ? 0 : -1}
        type="button"
      >
        <span className={`sandbox-goal-icon tone-${index === 0 ? "decision" : index === 1 ? "turning" : "risk"}`} />
        <span>{item.title}</span>
      </button>
    );
  };

  return (
    <div className="sandbox-app" aria-label="MASSOS 企业版目标沙盘演示">
      <header className="sandbox-topbar">
        <strong className="sandbox-wordmark">massos</strong>
        <div className="sandbox-top-context">
          <div className="sandbox-view-tabs" aria-label="目标内容视图">
            <span>对话</span>
            <strong>沙盘 <i>{scenario.facts.length}</i></strong>
          </div>
          <div className="sandbox-current-goal">
            <b>目标</b>
            <span>{scenario.title}</span>
          </div>
        </div>
        <div className="sandbox-top-actions" aria-hidden="true">
          <span className="sandbox-boundary"><i />本机边界生效</span>
          <span className="sandbox-icon-button">◐</span>
          <span className="sandbox-icon-button sandbox-panel-icon" />
        </div>
      </header>

      <div className="sandbox-layout">
        <aside className="sandbox-sidebar">
          <span className="sandbox-new-goal"><b>＋</b> 新建目标</span>

          <div className="sandbox-sidebar-scroll" role="tablist" aria-label="选择企业目标">
            <p className="sandbox-side-label">公司</p>
            <div className="sandbox-company-row"><i className="sandbox-company-icon">≋</i><strong>秘书台</strong><em><i />主动</em></div>
            <div className="sandbox-company-row"><i className="sandbox-company-icon">▤</i><strong>公司资料库</strong></div>

            <div className="sandbox-side-rule" />
            <p className="sandbox-side-heading">置顶 <span>⌄</span></p>
            {scenarioTab(1, "is-pinned")}
            {scenarioTab(0, "is-pinned")}

            <p className="sandbox-side-heading sandbox-goals-heading">目标 <span>⌄　⌕</span></p>
            {scenarioTab(2)}
            <span className="sandbox-static-goal"><i />完成新客户首期交付</span>
          </div>

          <div className="sandbox-profile"><i>陈</i><strong>陈先生</strong><span>⌃</span></div>
        </aside>

        <main
          aria-labelledby={`${demoId}-tab-${scenario.id}`}
          className="sandbox-main"
          id={`${demoId}-panel`}
          role="tabpanel"
        >
          <header className="sandbox-heading">
            <div><h3>目标沙盘</h3><p>查看已经形成的节点，以及当前等待确认的节点。</p></div>
            <dl className="sandbox-heading-counts" aria-label="推演节点统计">
              <div><dd>{scenario.facts.length}</dd><dt>已确认</dt></div>
              <div><dd>{riskCount}</dd><dt>风险点</dt></div>
              <div><dd>{turningCount}</dd><dt>转折点</dt></div>
            </dl>
          </header>

          <div className="sandbox-canvas" aria-label={`${scenario.title}完整推演链`}>
            <div className="sandbox-track" role="listbox" aria-label="选择推演节点">
              {primaryNodes.map((node, index) => (
                <span className="sandbox-track-item" key={node.id}>
                  {index > 0 ? <i className="sandbox-chain-arrow" aria-hidden="true">→</i> : null}
                  <button
                    aria-label={`P0${index + 1} ${toneLabels[node.tone]}：${node.title}`}
                    aria-selected={nodeIndex === index}
                    className={`sandbox-node tone-${node.tone}${index === primaryNodes.length - 1 ? " is-pending" : ""}${nodeIndex === index ? " is-current" : ""}`}
                    onClick={() => setNodeIndex(index)}
                    onKeyDown={(event) => handleNodeKey(event, index)}
                    role="option"
                    tabIndex={nodeIndex === index ? 0 : -1}
                    type="button"
                  >
                    <span className="sandbox-node-code"><i />P0{index + 1}</span>
                    <strong>{node.title}</strong>
                    <small>{toneLabels[node.tone]}</small>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </main>

        <aside className="sandbox-overview" aria-live="polite">
          <header><span>目标概览</span><h3>{scenario.title}</h3></header>
          <section className="sandbox-status">
            <span>当前状态</span>
            <strong>{scenarioStatus[scenario.id]}</strong>
            <p>{scenario.goal}</p>
          </section>
          <dl className="sandbox-overview-counts" aria-label="节点概况">
            <div className="is-confirmed"><dd>{scenario.facts.length}</dd><dt>已确认点</dt></div>
            <div className="is-risk"><dd>{riskCount}</dd><dt>风险点</dt></div>
            <div className="is-turning"><dd>{turningCount}</dd><dt>转折点</dt></div>
          </dl>
          <small>演示内容不代表真实企业数据</small>
        </aside>
      </div>
    </div>
  );
}
