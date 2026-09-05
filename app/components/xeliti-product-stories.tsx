import type { ReactNode } from "react";
import { financeVoucher, financeWorkbook, financeReportDownload, summarizeFinance, summarizeProcurement } from "../lib/website-demo.mjs";

const finance = summarizeFinance();
const balance = financeWorkbook();
const purchase = summarizeProcurement();
const money = (value: number) => value.toLocaleString("zh-CN");

function FileLabel({ name, type = "PDF" }: { name: string; type?: string }) {
  return <span className="file-label"><span className="file-kind">{type}</span>{name}</span>;
}

function WindowFrame({ title, children }: { title: string; children: ReactNode }) {
  return <div className="work-window" data-window><div className="window-title"><span><b>XELITI</b> Business</span><strong>{title}</strong></div>{children}</div>;
}

function Sidebar({ active, children }: { active: string; children?: ReactNode }) {
  return <aside className="demo-sidebar" aria-label="工作台资料"><div className="demo-navigation"><span className={active === "企业目标" ? "is-current" : ""}>企业目标</span><span className="folder-parent">企业文件夹</span><div className="folder-workbenches">{["财务工作台", "法务工作台"].map(label=><span className={label===active?"is-current":""} key={label}>{label}</span>)}</div><span className={active === "秘书台" ? "is-current" : ""}>秘书台</span></div>{children&&<div className="sidebar-files"><p>本次依据</p>{children}</div>}</aside>;
}

function WorkConversation({ message, reply, previous }: { message: string; reply: string; previous?: string }) {
  return <div className="work-conversation">
    <h3>对话</h3>
    {previous && <p className="conversation-history">{previous}</p>}
    <div className="conversation-message" data-work-message><span>你</span><p>{message}</p></div>
    <div className="conversation-reply" data-work-reply><b>XELITI</b><p>{reply}</p></div>
    <div className="work-composer"><textarea readOnly defaultValue="" data-work-input data-preset={message} rows={3} aria-label="本轮预设对话内容" placeholder="用一句话，交代你要做的事。" /><button type="button" data-work-send disabled aria-label={`发送预设请求：${message}`}>发送 <span aria-hidden="true">↑</span></button></div>
  </div>;
}

function ReportDownload({ kind }: { kind: "balance" | "profit" }) {
  const file = financeReportDownload(kind);
  return <a className="report-download" href={file.href} download={file.filename} data-work-download aria-label={`下载${kind === "balance" ? "资产负债表" : "利润表"}示例 CSV`}>下载 <span aria-hidden="true">↓</span></a>;
}

function Prompt({ children }: { children: ReactNode }) {
  return <div className="request-line" data-request><span className="request-person">你</span><p>{children}</p><span className="request-sent" aria-hidden="true">↗</span></div>;
}

export function DecisionStory() {
  return <div className="story-scene decision-scene" data-scene="decision" role="group" aria-label="采购目标推演交互演示">
    <h2 className="sr-only">采购目标的风险与解决方案</h2>
    <WindowFrame title="企业目标 · 采购计划">
      <div className="window-body decision-body">
        <Sidebar active="企业目标"><FileLabel name="采购合同.pdf" /><FileLabel name="现金计划.xlsx" type="XLS" /></Sidebar>
        <div className="decision-canvas">
          <Prompt>采购 60 万元设备，月底交付。先帮我推演一下。</Prompt>
          <div className="goal-node" data-goal><span>当前目标</span><strong>月底完成设备交付</strong><small>采购、付款、验收，放在一起看。</small></div>
          <div className="risk-branches" role="group" aria-label="目标上的两项风险">
            <article className="risk-node" data-risk><span className="risk-number">财务风险</span><h3>一次付清，现金会吃紧。</h3><p>付款后剩 <b>{purchase.afterFullPayment} 万</b>，低于 <b>30 万</b>运营预留。</p><div className="risk-value">缺口 <strong data-count={purchase.reserveGap}>{purchase.reserveGap}</strong><span>万元</span></div></article>
            <article className="risk-node" data-risk><span className="risk-number">法务风险</span><h3>交期没有写进合同。</h3><p>交付日期、验收条件、延期责任仍需明确。</p><div className="clause-fragment">“交付时间由双方协商”<span>待补充</span></div></article>
          </div>
        </div>
        <aside className="solution-pane" aria-label="风险对应的解决方案"><h3>解决方案</h3>
          <article data-solution><span className="solution-for">对应财务风险</span><h4>把付款分成两步。</h4><p>40% 预付，60% 验收后支付。</p><div className="cash-transition"><span>{purchase.afterFullPayment}<small>原方案余额</small></span><span aria-hidden="true">→</span><strong data-count={purchase.afterDeposit}>{purchase.afterDeposit}</strong><span className="cash-unit">万<small>预付后余额</small></span></div></article>
          <article data-solution><span className="solution-for">对应法务风险</span><h4>把交付约定写清。</h4><p>补齐交期、验收标准与延期责任。</p><span className="draft-state">建议草案，待你确认</span></article>
        </aside>
      </div>
    </WindowFrame>

  </div>;
}

export function MaterialsStory() {
  return <section className="materials-story page-width" id="company-folders" aria-labelledby="materials-title" data-section-reveal>
    <div><h2 id="materials-title">不是存好资料。<br />是让工作有据可依。</h2><p>企业文件夹，连起合同、制度和业务数据。</p><div className="material-types"><FileLabel name="合同" /><FileLabel name="财务" type="XLS" /><FileLabel name="制度" /></div></div>
    <figure><picture><source media="(max-width: 767px)" srcSet="/xeliti-folder-v1-mobile.webp" /><img src="/xeliti-folder-v1.webp" alt="企业文件夹设计示意：资料按财务、法务、制度等归档，保留原文和版本依据。" width={1600} height={1001} loading="lazy" decoding="async" /></picture></figure>
  </section>;
}

export function FinanceStory() {
  return <section className="finance-story story-section" id="workbench" aria-labelledby="finance-title">
    <div className="page-width"><div className="story-heading" data-section-reveal><h2 id="finance-title">先把凭证记下来。<br />再把报表做出来。</h2><p>企业文件夹里的财务工作台，用对话接着办。</p></div>
      <div className="work-sequence">
        <div className="story-scene" data-scene="work-voucher" role="group" aria-label="一句话录入凭证">
          <WindowFrame title="企业文件夹 / 财务工作台"><div className="window-body conversation-body">
            <Sidebar active="财务工作台"><FileLabel name="办公费发票.pdf" /><FileLabel name="银行回单.pdf" /></Sidebar>
            <WorkConversation message={financeVoucher.request} reply="凭证已生成。借贷科目和金额都在这里，供你核对。" />
            <div className="work-output voucher-output"><article className="accounting-paper" data-work-result>
              <header><span>{financeVoucher.id}</span><span>凭证草稿</span></header><h3>记账凭证</h3><p className="paper-period">2026 年 8 月 31 日</p>
              <div className="voucher-summary">摘要 <strong>{financeVoucher.summary}</strong></div>
              <table><thead><tr><th>会计科目</th><th>借方</th><th>贷方</th></tr></thead><tbody>
                <tr data-work-row><th>{financeVoucher.debit.account}</th><td>{money(financeVoucher.debit.amount)}.00</td><td>−</td></tr>
                <tr data-work-row><th>{financeVoucher.credit.account}</th><td>−</td><td>{money(financeVoucher.credit.amount)}.00</td></tr>
              </tbody><tfoot><tr><th>合计</th><td>1,200.00</td><td>1,200.00</td></tr></tfoot></table>
              <div className="voucher-balanced" data-work-row><span aria-hidden="true">✓</span> 借贷平衡</div>
            </article></div>
          </div></WindowFrame>
        </div>
        <div className="story-scene" data-scene="work-reports" role="group" aria-label="继续对话生成资产负债表和利润表">
          <WindowFrame title="企业文件夹 / 财务工作台"><div className="window-body conversation-body">
            <Sidebar active="财务工作台"><FileLabel name="本月账簿.xlsx" type="XLS" /><FileLabel name="记0087.pdf" /></Sidebar>
            <WorkConversation previous="上一轮：办公费凭证已生成。" message="再帮我生成本月的资产负债表和利润表。" reply="两张表都做好了。本次办公费已纳入期间费用，可以分别下载。" />
            <div className="work-output reports-output">
              <article className="accounting-paper balance-paper" data-work-result><header><span>月度报表</span><ReportDownload kind="balance" /></header><h3>资产负债表</h3><p className="paper-period">2026 年 8 月 · 单位：元</p><dl>
                <div><dt>货币资金</dt><dd>{money(balance.bank)}</dd></div><div><dt>其他流动资产</dt><dd>{money(balance.otherCurrentAssets)}</dd></div><div><dt>固定资产净额</dt><dd>{money(balance.fixedAssets)}</dd></div><div className="report-subtotal"><dt>资产合计</dt><dd>{money(balance.assets)}</dd></div>
                <div><dt>负债合计</dt><dd>{money(balance.liabilities)}</dd></div><div><dt>所有者权益</dt><dd>{money(balance.equity)}</dd></div><div className="report-subtotal"><dt>负债与权益合计</dt><dd>{money(balance.liabilities + balance.equity)}</dd></div>
              </dl></article>
              <article className="accounting-paper profit-paper" data-work-result><header><span>月度报表</span><ReportDownload kind="profit" /></header><h3>利润表</h3><p className="paper-period">2026 年 8 月 · 单位：元</p><dl><div><dt>营业收入</dt><dd>{money(finance.revenue)}</dd></div><div><dt>营业成本</dt><dd>{money(finance.cost)}</dd></div><div><dt>期间费用</dt><dd>{money(finance.expenses)}</dd></div></dl><div className="report-profit"><span>利润总额</span><strong><span data-count={finance.profit / 10000}>{finance.profit / 10000}</span><small>万元</small></strong></div></article>
            </div>
          </div></WindowFrame>
        </div>
      </div>
    </div>
  </section>;
}

export function LegalStory() {
  return <section className="legal-story story-section page-width" id="legal-workbench" aria-labelledby="legal-title">
    <div className="story-heading" data-section-reveal><h2 id="legal-title">审合同、拟合同。<br />把重复的工作，交给一句话。</h2></div>
    <div className="work-sequence">
      <div className="story-scene" data-scene="work-review" role="group" aria-label="自然语言审阅销售合同并定位风险"><WindowFrame title="企业文件夹 / 法务工作台"><div className="window-body conversation-body">
        <Sidebar active="法务工作台"><FileLabel name="销售发来的合同.pdf" /><FileLabel name="合同管理制度.pdf" /></Sidebar>
        <WorkConversation message="帮我审一下销售发来的设备销售合同，风险点标出来。" reply="有两处需要留意。我已定位原条款，并附上修改建议。" />
        <div className="work-output"><article className="review-paper" data-work-result><header><span>销售提交</span><span>待法务确认</span></header><h3>设备销售合同</h3>
          <div className="review-clause"><span>验收约定</span><p><mark><i data-highlight />验收方式及期限，由买方另行确定。</mark></p><aside data-work-row><b>验收标准和期限不明确</b><p>建议约定验收项目、期限及异议处理方式。</p></aside></div>
          <div className="review-clause"><span>违约责任</span><p><mark><i data-highlight />卖方承担由此产生的一切损失。</mark></p><aside data-work-row><b>责任范围缺少边界</b><p>建议明确损失范围、责任上限与例外情形。</p></aside></div>
        </article></div>
      </div></WindowFrame></div>
      <div className="story-scene" data-scene="work-draft" role="group" aria-label="继续对话拟定设备销售合同"><WindowFrame title="企业文件夹 / 法务工作台"><div className="window-body conversation-body">
        <Sidebar active="法务工作台"><FileLabel name="设备销售合同模板.docx" type="DOC" /><FileLabel name="合同管理制度.pdf" /></Sidebar>
        <WorkConversation previous="上一轮：原合同的风险已标出。" message="按公司模板，再拟一份设备销售合同，分两期收款，交付后验收。" reply="合同草案已拟好，收款和验收条款一起补上了。交易细节留给你确认。" />
        <div className="work-output"><article className="draft-paper" data-work-result><header><span>公司模板</span><span>合同草案</span></header><h3>设备销售合同</h3><p className="draft-parties">卖方、买方及设备清单：待补充</p>
          <div data-work-row><h4>交易与交付</h4><p>设备型号、数量、价款及交付日期由双方确认。</p></div>
          <div data-work-row><h4>分期收款</h4><p>首期款与尾款分开约定，金额、支付时间和对应条件待确认。</p></div>
          <div data-work-row><h4>交付后验收</h4><p>按约定项目验收，明确完成期限、异议提出及处理方式。</p></div>
          <footer data-work-row>已形成草案，交由法务确认。</footer>
        </article></div>
      </div></WindowFrame></div>
    </div>
  </section>;
}

export function ServiceStory() {
  return <section className="service-story story-section" id="customer-service" aria-labelledby="service-title"><div className="page-width">
    <div className="story-heading" data-section-reveal><h2 id="service-title">同一个问题。<br />两种完全不同的回答。</h2></div>
    <div className="service-stage story-scene" data-scene="service-explore" role="group" aria-label="从模板匹配到理解后回答：AI 在对话中理解诉求、核对公司资料、形成安排">
      <div className="phone-column template-phone"><h3>停在关键词。</h3><div className="service-phone"><div className="phone-camera" aria-hidden="true" /><header>在线客服</header><div className="phone-conversation">
        <p className="phone-question" data-phone-question>明天就要装，能先发一部分吗？</p>
        <div className="template-matches" data-template-match><span>发货</span><span>物流</span><span>转人工</span></div>
        <div className="phone-answer robot-answer" data-robot-answer><span>自动回复</span><p>您好，发货时间请以订单页面为准。</p><div className="robot-options"><span>查询物流</span><span>转人工</span></div></div>
      </div><div className="phone-compose" aria-hidden="true"><span>输入消息</span><b>↑</b></div></div></div>
      <div className="service-upgrade" aria-hidden="true"><i /><span>→</span><i /></div>
      <div className="phone-column ai-phone"><h3>多一层理解。</h3><div className="service-phone"><div className="phone-camera" aria-hidden="true" /><header><picture><img src="/xeliti-service-person-r3-mobile.webp" width={28} height={28} loading="lazy" decoding="async" alt="" /></picture>XELITI AI 客服</header><div className="phone-conversation">
        <p className="phone-question" data-phone-question><span className="intent-mark">明天就要装<i data-intent-mark aria-hidden="true" /></span>，能<span className="intent-mark">先发一部分<i data-intent-mark aria-hidden="true" /></span>吗？</p>
        <div className="ai-understanding" role="group" aria-label="AI 的理解和核对过程">
          <div className="understanding-signal" aria-hidden="true">{Array.from({ length: 31 }, (_, i) => <i key={i} data-thought-signal style={{ height: `${5 + Math.sin(i * .47) ** 2 * 20}px` }} />)}</div>
          <div className="understanding-intent" data-service-intent><span className="processing-action">听懂诉求</span><p>赶上安装。<span>不必等全部到齐。</span></p></div>
          <div className="understanding-sources" data-service-sources><span className="processing-action">查阅公司资料</span><div className="understanding-papers">
            <div className="understanding-paper" data-service-source><span>订单</span><p>24 台控制器，1 批配件</p><i className="understanding-scan" data-source-scan aria-hidden="true" /></div>
            <div className="understanding-paper" data-service-source><span>流程</span><p>支持分批，发货前确认安装时间</p><i className="understanding-scan" data-source-scan aria-hidden="true" /></div>
            <div className="understanding-paper" data-service-source><span>库存</span><p>控制器今天可发，配件明天齐</p><i className="understanding-scan" data-source-scan aria-hidden="true" /></div>
          </div></div>
          <div className="understanding-plan" data-service-plan><span className="processing-action">结合业务，形成安排</span><div className="fulfillment-route"><i data-plan-route aria-hidden="true" /><div data-plan-part><span>今天</span><strong>控制器先发</strong></div><div data-plan-part><span>明天</span><strong>配件补齐</strong></div></div></div>
        </div>
        <div className="phone-answer ai-answer" data-ai-answer><p>可以分批安排。你明天几点安装？我帮你确认仓库和物流。</p></div>
      </div><div className="phone-compose"><span aria-hidden="true">接着聊</span><button type="button" data-service-replay disabled aria-label="重播客服理解过程">↻</button></div></div></div>
    </div>
  </div></section>;
}

export function SecretaryStory() {
  return <section className="secretary-story story-section page-width" id="secretary" aria-labelledby="secretary-title">
    <div className="story-heading" data-section-reveal><h2 id="secretary-title">文件刚进来，<br />问题先报上来。</h2></div>
    <div className="story-scene secretary-scene" data-scene="secretary" role="group" aria-label="秘书台工作台中的资料冲突及采购风险主动提示演示">
      <WindowFrame title="秘书台"><div className="window-body secretary-body">
      <Sidebar active="秘书台"><FileLabel name="采购申请.xlsx" type="XLS" /><FileLabel name="采购合同.pdf" /><FileLabel name="采购制度.pdf" /></Sidebar>
      <div className="secretary-canvas">
        <div className="secretary-arrival"><span>新资料已进入企业文件夹</span><div><span data-upload>采购申请 <b>60 万</b></span><span data-upload>采购合同 <b>68 万</b></span><span data-upload>采购制度 <b>预付 ≤ 40%</b></span></div></div>
      <div className="secretary-report"><header><h3>有 <b data-count={3}>3</b> 件事，需要你留意。</h3></header>
        <article className="secretary-alert" data-alert><span className="alert-type">数据冲突</span><div><h4>预算和合同，对不上。</h4><p>申请 60 万，合同 68 万。</p></div><strong>+{purchase.budgetConflict}<small>万元</small></strong></article>
        <article className="secretary-alert" data-alert><span className="alert-type">条款冲突</span><div><h4>付款条款与采购制度冲突。</h4><p>制度预付上限 40%，合同要求一次付清。</p></div><strong>40%<small>≠ 100%</small></strong></article>
        <article className="secretary-alert" data-alert><span className="alert-type">推进风险</span><div><h4>照当前合同付款，预留资金不足。</h4><p>按 68 万全款测算，运营预留缺口 {purchase.contractReserveGap} 万。</p></div><strong>{purchase.contractReserveGap}<small>万元缺口</small></strong></article>
      </div></div>
      <aside className="secretary-context" data-alert><h3>当前目标</h3><strong>月底完成设备交付</strong><div><span>建议先处理</span><p>核对合同总价。<br />让付款与验收节点挂钩。</p></div><div><span>问题依据</span><FileLabel name="采购申请.xlsx" type="XLS" /><FileLabel name="采购合同.pdf" /><FileLabel name="采购制度.pdf" /></div></aside>
    </div></WindowFrame></div>
  </section>;
}

export function EnterpriseBrain({ children }: { children: ReactNode }) {
  return <section className="brain-section story-section" id="platform-story" aria-labelledby="brain-title"><div className="page-width">
    <div className="story-heading" data-section-reveal><h2 id="brain-title">围绕一个目标，<br />连起整个企业。</h2></div>
    {children}
  </div></section>;
}
