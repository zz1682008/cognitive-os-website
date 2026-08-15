import { DecisionChainDemo } from "./components/decision-chain-demo";
import { SiteRuntime } from "./components/site-runtime";

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="MASSOS 首页">
      <span className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 44 44">
          <path
            className="brand-wave"
            d="M5 30.5C9 30.5 10.5 12.5 16 12.5S19.5 31.5 24.5 31.5 28 12.5 33 12.5s5.5 14.5 6 18"
          />
          <circle className="brand-node" cx="5" cy="30.5" r="2.2" />
          <circle className="brand-node" cx="39" cy="30.5" r="2.2" />
        </svg>
      </span>
      <span>MASSOS</span>
    </a>
  );
}

function BrowserBar() {
  return (
    <div className="browser-bar" aria-hidden="true">
      <span className="browser-dot" />
      <span className="browser-dot" />
      <span className="browser-dot" />
    </div>
  );
}

function CursorArrow() {
  return (
    <svg className="rd-cursor" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4 2 L20 12 L12.5 13.5 L16 21 L13.5 22 L10 14.5 L4 18 Z"
        fill="#212226"
        stroke="#fff"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function RouteMark({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 600 240">
      <path d="M18 158C70 158 88 52 144 52s67 128 122 128S332 72 392 72s76 96 116 96 48-48 74-48" />
      <circle cx="18" cy="158" r="5" />
      <circle cx="144" cy="52" r="5" />
      <circle cx="266" cy="180" r="5" />
      <circle cx="392" cy="72" r="5" />
      <circle cx="582" cy="120" r="5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 15.5h12" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>

      <header className="site-header" id="site-header">
        <nav className="nav-shell" aria-label="主导航">
          <Brand />

          <div className="nav-center">
            <details className="product-menu">
              <summary>产品</summary>
              <div className="product-menu-panel">
                <a href="#enterprise-product">
                  <span className="product-menu-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 20V6.5L12 3l7 3.5V20M3 20h18M9 8h1m4 0h1M9 12h1m4 0h1M9 16h6" />
                    </svg>
                  </span>
                  <span>
                    <strong>企业版</strong>
                    <small>主动发现经营变化，提前处理风险</small>
                  </span>
                </a>
                <a href="/personal">
                  <span className="product-menu-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="3.2" />
                      <path d="M5.5 20c.7-4.2 3-6.3 6.5-6.3s5.8 2.1 6.5 6.3" />
                    </svg>
                  </span>
                  <span>
                    <strong>个人版</strong>
                    <small>进入独立的 MASSOS 个人版</small>
                  </span>
                </a>
              </div>
            </details>
            <a href="#capabilities">核心优势</a>
            <a href="#product-lines">产品线</a>
          </div>

          <a className="nav-action" href="#download">
            桌面版 <DownloadIcon />
          </a>
          <button
            className="mobile-menu-button"
            type="button"
            aria-expanded="false"
            aria-controls="mobile-panel"
            aria-label="打开导航"
          >
            <span />
          </button>
        </nav>
      </header>

      <div className="mobile-panel" id="mobile-panel" aria-hidden="true">
        <a href="#enterprise-product">企业版</a>
        <a href="/personal">个人版</a>
        <a href="#capabilities">核心优势</a>
      </div>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <canvas id="signal-field" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />

          <div className="hero-content">
            <h1 id="hero-title">
              <span className="headline-row">
                <span>
                  持续理解 · 料事于先
                  <span className="headline-mobile-break">
                    <br />
                  </span>
                  <span className="headline-desktop-divider"> · </span>提前防错
                </span>
              </span>
            </h1>
            <p className="hero-lede">
              每个企业都应该拥有一位真正理解自己、并持续为自己思考的军师。
              <br />
              在每一次关键决策前，把结果、风险和连锁影响推演清楚，
              <br />
              <strong className="hero-lede-strong">提前发现错误，避免一次误判带来巨大损失。</strong>
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary download-button"
                href="#download"
                aria-label="查看 MASSOS 桌面版状态"
              >
                <span className="download-kind">MASSOS 桌面版</span>
                <span className="download-context" data-platform-copy>
                  macOS 下载准备中
                </span>
                <DownloadIcon />
              </a>
              <a className="button button-explore" href="#enterprise-product">
                查看产品实景
              </a>
            </div>
          </div>

          <div className="hero-product-peek">
            <div className="hero-workbench-embed hero-demo-embed">
              <DecisionChainDemo />
            </div>
          </div>
        </section>

        <section
          className="enterprise-showcase"
          id="enterprise-product"
          aria-labelledby="enterprise-overview-title"
        >
          <div className="post-shell">
            <header className="section-intro">
              <div className="section-intro-copy reveal">
                <h2 id="enterprise-overview-title">问不出的，才最容易被忽略。</h2>
                <span className="en-tag">DISCOVERY</span>
                <p>
                  替你盯着财务里的漏洞、法务里的风险、流程里的断点，让它们在被忽略之前先被看见。
                </p>
              </div>
            </header>

            <div className="workspace-stage reveal" aria-label="MASSOS 企业经营工作台界面示意">
              <div className="browser-frame" aria-hidden="true">
                <div className="browser-bar">
                  <span className="browser-dot" />
                  <span className="browser-dot" />
                  <span className="browser-dot" />
                </div>
                <div
                  className="wb-mock"
                  data-demo="帮我把报价再压 3 个点，先把这单签下来。"
                  data-demo-once=""
                >
                  <div className="wbm-top">
                    <span className="wbm-brand">
                      massos<em>Business</em>
                    </span>
                    <span className="wbm-chip">某某科技</span>
                  </div>
                  <div className="wbm-row">
                    <div className="wbm-rail">
                      <span className="wbm-new">＋ 新建事项</span>
                      <p className="wbm-label">目标</p>
                      <span className="wbm-item">
                        <i />季度现金流计划
                      </span>
                      <span className="wbm-item on">
                        <i />首份 B2B 合同复核
                      </span>
                      <span className="wbm-item">
                        <i />研发交付延期影响
                      </span>
                    </div>
                    <div className="wbm-main">
                      <p className="wbm-title">首份 B2B 合同签署前复核</p>
                      <p className="wbm-meta">MASSOS · 企业经营工作台 · 持续关注</p>
                      <div className="dm-user">
                        <span className="dm-user-text" />
                      </div>
                      <div className="wbm-thinking dm-thinking">
                        军师推演中……
                        <span className="wbm-dots">
                          <i />
                          <i />
                          <i />
                        </span>
                      </div>
                      <div className="wbm-card dm-card">
                        <div className="dm-line">
                          <b>军师</b>
                          <p>
                            当前<strong className="dm-hl">可能不是你的主要问题</strong>
                            。主要问题可能是：
                          </p>
                        </div>
                        <div className="dm-line">
                          <p>
                            1 · 70% 尾款挂在「验收合格后」，<strong>却没有约定验收期限</strong>
                          </p>
                        </div>
                        <div className="dm-line">
                          <p>
                            2 · 回款时间<strong>失去上限</strong>，影响研发投入和供应商付款
                          </p>
                        </div>
                        <div className="dm-line">
                          <p>
                            3 · <strong>验收标准与违约金条款缺失</strong>，签署前需要补充
                          </p>
                        </div>
                        <div className="dm-line">
                          <p>
                            4 · 交付计划变化，<strong>影响下一阶段安排</strong>
                          </p>
                        </div>
                      </div>
                      <div className="wbm-composer">
                        <span className="dm-typing" />
                        <i className="dm-send">↑</i>
                      </div>
                    </div>
                    <div className="wbm-detail">
                      <p className="wbm-dtitle">现在需要看</p>
                      <span className="wbm-att dm-att">合同验收期限缺失，尾款回收时间不明确</span>
                      <span className="wbm-att dm-att">交付计划变化，可能影响下一阶段研发安排</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="stage-caption">
                <span>演示内容不代表真实企业数据</span>
              </div>
            </div>
          </div>
        </section>

        <section className="advantages" id="capabilities" aria-label="核心优势">
          <div className="post-shell">
            <div className="advantage-board">
              <article className="advantage-panel advantage-panel-active reveal">
                <div className="capability-copy">
                  <h3>从被动应答，到主动发现。</h3>
                  <span className="en-tag">PROACTIVE</span>
                  <p>主动发现问题，主动预知风险。你要处理的事，永远先一步到面前。</p>
                </div>
                <div
                  className="proactive-product"
                  role="img"
                  aria-label="MASSOS 秘书台工作台：左侧秘书台选中，中间汇总今日需要决策的事项与目标完成进度"
                >
                  <BrowserBar />
                  <div className="wb-mock" aria-hidden="true">
                    <div className="wbm-top">
                      <span className="wbm-brand">
                        MASSOS<em>Business</em>
                      </span>
                      <span className="wbm-chip">某某科技</span>
                    </div>
                    <div className="wbm-row">
                      <div className="wbm-rail">
                        <span className="wbm-new wbm-new-on">秘书台</span>
                        <span className="wbm-side">目标库</span>
                        <span className="wbm-side">设置</span>
                      </div>
                      <div className="wbm-main">
                        <p className="wbm-title">秘书台 · 今天</p>
                        <p className="wbm-meta">8 月 10 日 · 已为你整理好今日事项</p>
                        <div className="wbm-sum">
                          <span className="wbm-sum-decide">2 件需要你决策</span>
                          <span className="wbm-sum-follow">4 件持续跟进</span>
                        </div>
                        <div className="wbm-card">
                          <b>需要你决策</b>
                          <p>1 · 合同验收期限缺失，尾款回收时间不明确</p>
                          <p>2 · 违约金条款是否接受客户版本</p>
                          <p>3 · 供应商账期从 30 天调整为 45 天</p>
                        </div>
                        <div className="wbm-card">
                          <b>目标进展</b>
                          <div className="wbm-prog">
                            <span>首份 B2B 合同复核</span>
                            <i className="bar">
                              <em style={{ width: "70%" }} />
                            </i>
                            <u>70%</u>
                          </div>
                          <div className="wbm-prog">
                            <span>季度现金流计划</span>
                            <i className="bar">
                              <em style={{ width: "45%" }} />
                            </i>
                            <u>45%</u>
                          </div>
                          <div className="wbm-prog">
                            <span>研发交付延期影响</span>
                            <i className="bar">
                              <em style={{ width: "60%" }} />
                            </i>
                            <u>60%</u>
                          </div>
                        </div>
                      </div>
                      <div className="wbm-detail">
                        <p className="wbm-dtitle">现在需要看</p>
                        <span className="wbm-att">合同验收期限缺失，影响尾款回收</span>
                        <span className="wbm-att">交付计划变化，可能影响下一阶段研发安排</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="advantage-panel advantage-panel-risk reveal reveal-delay">
                <div className="capability-copy">
                  <h3>预知风险，方案送达。</h3>
                  <span className="en-tag">RISK &amp; RESOLUTION</span>
                  <p>千万级财务与法务数据模型，提前提示风险，并给出合规依据与处理办法。</p>
                </div>
                <div
                  className="risk-product"
                  data-risk-demo=""
                  role="img"
                  aria-label="MASSOS 目标风险推演界面：选中目标后展示判断路径，选中风险节点后右侧依次展开风险详情与依据来源"
                >
                  <BrowserBar />
                  <div className="wb-mock" aria-hidden="true">
                    <div className="wbm-top">
                      <span className="wbm-brand">
                        MASSOS<em>Business</em>
                      </span>
                      <span className="wbm-chip">某某科技</span>
                    </div>
                    <div className="wbm-row">
                      <div className="wbm-rail">
                        <span className="wbm-new">＋ 新建目标</span>
                        <p className="wbm-label">目标</p>
                        <span className="wbm-item on rd-goal">
                          <i />上线首个客户管理 MVP<em>推演中</em>
                        </span>
                        <span className="wbm-item">
                          <i />完成首份 B2B 合同签署<em>进行中</em>
                        </span>
                        <span className="wbm-item">
                          <i />稳定本月现金流<em>关注中</em>
                        </span>
                        <span className="wbm-item">
                          <i />完成新客户首期交付<em>待确认</em>
                        </span>
                      </div>
                      <div className="wbm-main">
                        <p className="wbm-title">本轮判断路径</p>
                        <p className="wbm-meta">点击节点，右侧查看详情 · 3 个节点</p>
                        <CursorArrow />
                        <div className="wbm-path">
                          <div className="wbm-node ok rd-step">
                            <b>P01</b>
                            <p>一人团队、预算 8 万元，首版涉及客户与合同数据</p>
                            <small>已确认事实</small>
                          </div>
                          <span className="wbm-arrow">→</span>
                          <div className="wbm-node rd-step rd-risknode">
                            <b>
                              P02<span className="rd-risk-tag">风险点</span>
                            </b>
                            <p>范围继续扩大，会延后上线并增加现金消耗</p>
                            <small>承接前一节点</small>
                          </div>
                          <span className="wbm-arrow">→</span>
                          <div className="wbm-node rd-step">
                            <b>P03</b>
                            <p>首版是否只做客户录入、跟进和合同关联？</p>
                            <small>当前选择</small>
                          </div>
                        </div>
                        <p className="wbm-confirm rd-item">
                          现在只需要你确认：<strong>是否先按这个范围继续？</strong>
                        </p>
                        <div className="wbm-composer">
                          <span>输入新事实、纠正判断，或继续追问这个目标</span>
                          <i>↑</i>
                        </div>
                      </div>
                      <div className="wbm-detail risk-detail">
                        <p className="wbm-dtitle rd-item">当前节点 · P02</p>
                        <p className="wbm-node-detail rd-item">
                          <strong>范围继续扩大，会延后上线并增加现金消耗</strong>
                          <br />
                          当前缺少功能级工时估算；建议先冻结 P0 再核算。
                        </p>
                        <div className="wbm-risklabel rd-item">风险点</div>
                        <div className="wbm-risk rd-item">
                          <b>财务风险</b>
                          <p>范围扩张可能造成预算失控，建议先冻结 P0 再核算。</p>
                        </div>
                        <div className="wbm-risk rd-item">
                          <b>法务风险</b>
                          <p>客户联系人和合同数据边界不清，上线前需明确授权与留存期限。</p>
                        </div>
                        <div className="wbm-cite rd-item">
                          <span className="wbm-cite-tag">依据来源</span>
                          <p>
                            本公司账号 · 观远科技企业账号
                            <br />
                            上市企业经验 · 金山办公：轻量产品首版经验
                            <br />
                            上市企业经验 · 用友网络：客户数据治理经验
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="advantage-panel advantage-panel-number reveal reveal-delay-2">
                <div className="capability-copy">
                  <h3>万家企业的成功管理模型，让决策升维。</h3>
                  <span className="en-tag">GUIDANCE</span>
                  <p>
                    面对关键选择，从万家企业的真实决策中找到相似情形当时怎么做，再结合你的阶段与资源，给出可执行的办法。
                  </p>
                </div>
                <div
                  className="experience-product"
                  data-risk-demo=""
                  role="img"
                  aria-label="MASSOS 决策推演界面：展示决策路径并选中决策点，右侧列出三个引用自企业真实经验的决策选项，其中一个为当前选择"
                >
                  <BrowserBar />
                  <div className="wb-mock" aria-hidden="true">
                    <div className="wbm-top">
                      <span className="wbm-brand">
                        MASSOS<em>Business</em>
                      </span>
                      <span className="wbm-chip">某某科技</span>
                    </div>
                    <div className="wbm-row">
                      <div className="wbm-rail">
                        <span className="wbm-new">管理经验</span>
                        <p className="wbm-label">关键选择</p>
                        <span className="wbm-item on rd-goal">
                          <i />团队扩张<em>决策中</em>
                        </span>
                        <span className="wbm-item">
                          <i />组织协同
                        </span>
                        <span className="wbm-item">
                          <i />交付流程
                        </span>
                      </div>
                      <div className="wbm-main">
                        <p className="wbm-title">本轮决策路径</p>
                        <p className="wbm-meta">点击节点，右侧查看决策选项 · 3 个节点</p>
                        <CursorArrow />
                        <div className="wbm-path">
                          <div className="wbm-node ok rd-step">
                            <b>P01</b>
                            <p>客户需求增加，业务机会正在增长</p>
                            <small>已确认事实</small>
                          </div>
                          <span className="wbm-arrow">→</span>
                          <div className="wbm-node rd-step rd-risknode decide">
                            <b>
                              P02<span className="rd-risk-tag decide">决策点</span>
                            </b>
                            <p>是否扩大销售团队？</p>
                            <small>承接前一节点</small>
                          </div>
                          <span className="wbm-arrow">→</span>
                          <div className="wbm-node rd-step">
                            <b>P03</b>
                            <p>扩张节奏怎么定？</p>
                            <small>待定</small>
                          </div>
                        </div>
                      </div>
                      <div className="wbm-detail risk-detail">
                        <p className="wbm-dtitle rd-item">当前决策点</p>
                        <p className="wbm-node-detail rd-item">
                          <strong>是否扩大销售团队？</strong>
                          <br />
                          交付承载与回款节奏需要保持稳定。
                        </p>
                        <div className="wbm-risklabel rd-item decide">决策选项</div>
                        <div className="wbm-opt sel rd-item">
                          <b>
                            先验证，再扩张<span className="wbm-opt-tag">当前选择</span>
                          </b>
                          <p>区域试点跑通转化，再扩大编制。</p>
                          <small>引用 217 家企业经验</small>
                        </div>
                        <div className="wbm-opt rd-item">
                          <b>补关键岗位</b>
                          <p>先补齐关键行业负责人。</p>
                          <small>引用 96 家企业经验</small>
                        </div>
                        <div className="wbm-opt rd-item">
                          <b>固定售前与交付流程</b>
                          <p>转化和交付稳定后再扩编。</p>
                          <small>引用 84 家企业经验</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="company-flow" aria-label="企业数字孪生与业务成果生成">
          <div className="post-shell">
            <header className="section-intro">
              <div className="section-intro-copy reveal">
                <h2>企业数字孪生，AI 专属业务基石。</h2>
                <span className="en-tag">DIGITAL TWIN</span>
                <p>
                  将企业知识、业务流程与研发规范持续沉淀为可理解、可调用的数字孪生，并据此梳理业务与研发流程，生成 PRD、研发文档、测试用例与视频脚本，让每一次 AI 产出都真正基于这家企业。
                </p>
              </div>
            </header>

            <div
              className="gen-stage reveal"
              data-gen-demo=""
              aria-label="MASSOS 企业数字孪生界面：基于企业知识生成 PRD、交付清单、测试用例与视频脚本"
            >
              <div className="browser-frame" aria-hidden="true">
                <div className="browser-bar">
                  <span className="browser-dot" />
                  <span className="browser-dot" />
                  <span className="browser-dot" />
                </div>
                <div className="wb-mock">
                  <div className="wbm-top">
                    <span className="wbm-brand">
                      MASSOS<em>Business</em>
                    </span>
                    <span className="wbm-chip">某某科技</span>
                  </div>
                  <div className="twin-row">
                    <aside className="twin-rail">
                      <span className="twin-rail-label">公司</span>
                      <strong className="twin-rail-item is-current">企业数字孪生</strong>
                      <span className="twin-rail-item">公司资料库</span>
                      <span className="twin-rail-label">当前目标</span>
                      <span className="twin-rail-goal">上线首个客户管理 MVP</span>
                    </aside>

                    <div className="twin-main">
                      <div className="twin-main-heading">
                        <div>
                          <p>客户管理 MVP · 推演流</p>
                          <span>基于企业知识库与当前目标持续形成</span>
                        </div>
                        <em>数字孪生已同步</em>
                      </div>

                      <div className="twin-workspace">
                        <div className="twin-flow-pane">
                          <div className="twin-flow-track" aria-label="业务与研发推演流">
                            <div className="twin-node rd-twin-node">
                              <small>P01 · 企业知识</small>
                              <strong>客户、合同与经营事实</strong>
                              <span>知识基础</span>
                            </div>
                            <i className="twin-link rd-twin-link" aria-hidden="true">→</i>
                            <div className="twin-node rd-twin-node">
                              <small>P02 · 业务流程</small>
                              <strong>录入、跟进与签约闭环</strong>
                              <span>业务路径</span>
                            </div>
                            <i className="twin-link rd-twin-link" aria-hidden="true">→</i>
                            <div className="twin-node rd-twin-node">
                              <small>P03 · 研发流程</small>
                              <strong>范围、开发与验收标准</strong>
                              <span>研发路径</span>
                            </div>
                          </div>

                          <div className="twin-artifact-stage">
                            <span className="twin-artifact-label">根据推演结果生成</span>
                            <div className="twin-artifact-grid">
                              <div className="twin-artifact" data-twin-artifact="prd">
                                <b>PRD</b>
                                <div><strong>客户管理 MVP PRD</strong><small>业务范围、流程与验收标准</small></div>
                              </div>
                              <div className="twin-artifact" data-twin-artifact="video">
                                <b>VIDEO</b>
                                <div><strong>产品视频脚本</strong><small>场景、卖点与演示路径</small></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="twin-action-pane">
                          <span>生成企业成果</span>
                          <button className="twin-generate" data-twin-output="prd" type="button" tabIndex={-1}>
                            生成 PRD
                          </button>
                          <button className="twin-generate" data-twin-output="video" type="button" tabIndex={-1}>
                            生成视频脚本
                          </button>
                          <small>每一份内容均继承当前推演依据</small>
                        </div>
                      </div>
                      <CursorArrow />
                    </div>

                    <aside className="twin-folder-panel">
                      <span className="twin-folder-eyebrow">企业成果</span>
                      <div className="twin-folder">
                        <span>某某科技</span>
                        <strong>公司文件夹</strong>
                        <small>自动沉淀本次生成成果</small>
                      </div>
                      <div className="twin-folder-files">
                        <div className="twin-folder-file" data-twin-folder-file="prd">
                          <b>PRD</b><span>客户管理 MVP PRD</span>
                        </div>
                        <div className="twin-folder-file" data-twin-folder-file="video">
                          <b>VIDEO</b><span>产品视频脚本</span>
                        </div>
                      </div>
                      <p className="twin-folder-status">等待生成</p>
                    </aside>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="product-family" id="product-lines" aria-labelledby="business-route-title">
          <div className="post-shell">
            <article className="product-route business-route reveal" aria-labelledby="business-route-title">
              <div className="product-route-copy">
                <span className="route-label">MASSOS 企业版</span>
                <h2 id="business-route-title">
                  <span className="product-route-title-line">专注企业经营，</span>
                  <span className="product-route-title-line">一个产品做深。</span>
                </h2>
                <p>主动发现经营变化，预警财务法务风险，并陪着企业把处理流程跑完。</p>
                <div className="product-route-download" id="download">
                  <div
                    className="button download-button download-preview"
                    role="group"
                    aria-label="MASSOS 桌面版下载入口准备中"
                  >
                    <span className="download-kind">下载桌面版</span>
                    <span className="download-context" data-platform-state>
                      macOS 版本准备中
                    </span>
                    <DownloadIcon />
                  </div>
                  <p className="download-note">安装包接入后，将直接提供与你设备匹配的版本。</p>
                </div>
              </div>
              <div className="business-route-visual" aria-hidden="true">
                <RouteMark className="business-route-mark" />
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <p className="footer-statement">让每一次重要变化，都早点被看见。</p>
          <div className="footer-links">
            <div className="footer-link-group">
              <strong>Products</strong>
              <a href="#enterprise-product">企业版</a>
              <a href="/personal">个人版</a>
            </div>
            <div className="footer-link-group">
              <strong>Explore</strong>
              <a href="#capabilities">核心优势</a>
            </div>
          </div>
        </div>
        <div className="footer-meta">
          <span>© 2026 MASSOS</span>
          <span>企业经营系统 · 桌面版本准备中</span>
        </div>
        <div className="footer-wordmark" aria-label="MASSOS">
          <canvas id="footer-bits" aria-hidden="true" />
        </div>
      </footer>

      <SiteRuntime />
    </>
  );
}
