import Image from "next/image";
import { DecisionChainDemo } from "./components/decision-chain-demo";
import { XelitiMotion } from "./components/xeliti-motion";
import { XelitiPlatformStory } from "./components/xeliti-platform-story";
import { AccountSession } from "./components/account-session";

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="XELITI 首页">
      <span className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 44 44">
          <path d="M5 30.5C9 30.5 10.5 12.5 16 12.5S19.5 31.5 24.5 31.5 28 12.5 33 12.5s5.5 14.5 6 18" />
          <circle cx="5" cy="30.5" r="2.2" />
          <circle cx="39" cy="30.5" r="2.2" />
        </svg>
      </span>
      <span>XELITI</span>
    </a>
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
  const accountCenterAuthority = process.env.PLATFORM_ACCOUNT_CENTER_ISSUER ?? "http://127.0.0.1:5200";
  return (
    <XelitiMotion>
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>

      <header className="site-header">
        <nav className="nav-shell" aria-label="主导航">
          <Brand />

          <div className="nav-center">
            <details className="product-menu">
              <summary>产品</summary>
              <div className="product-menu-panel">
                <a href="#enterprise-product">
                  <strong>Business</strong>
                  <small>首个复杂参考产品</small>
                </a>
                <a href="/personal/">
                  <strong>Personal</strong>
                  <small>面向个人重要选择</small>
                </a>
              </div>
            </details>
            <a href="#capabilities">核心优势</a>
            <a href="#product-lines">产品线</a>
          </div>

          <a className="nav-action" href="#download">
            桌面版 <DownloadIcon />
          </a>
          <AccountSession authority={accountCenterAuthority} />

          <details className="mobile-menu">
            <summary aria-label="打开导航">菜单</summary>
            <div className="mobile-menu-panel">
              <a href="#platform-story">理解平台</a>
              <a href="#enterprise-product">Business</a>
              <a href="/personal/">Personal</a>
              <a href="#capabilities">核心优势</a>
            </div>
          </details>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-eyebrow" data-hero-reveal>
                XELITI COGNITIVE PLATFORM
              </p>
              <h1 id="hero-title" data-hero-reveal>
                <span>让每个产品，</span>
                <span>都拥有认知能力。</span>
              </h1>
              <p className="hero-lede" data-hero-reveal>
                XELITI 是通用认知平台，让不同产品共享理解、判断与行动能力。
              </p>
              <div className="hero-actions" data-hero-reveal>
                <a className="button button-primary" href="#platform-story">
                  理解平台
                </a>
                <a className="button button-secondary" href="#enterprise-product">
                  查看 Business
                </a>
              </div>
            </div>

            <figure className="hero-visual hero-product-shot" data-hero-visual>
              <DecisionChainDemo />
              <figcaption>
                <strong>Business 产品界面</strong>
                <span>持续理解 · 主要问题识别 · 下一步行动</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="position-statement" aria-label="平台定位">
          <p>一套平台，多种产品。</p>
          <strong>Business 证明复杂问题可以被持续理解，未来产品沿用同一认知底座。</strong>
        </section>

        <XelitiPlatformStory />

        <section className="capabilities" id="capabilities" aria-labelledby="capabilities-title">
          <div className="section-heading">
            <h2 id="capabilities-title">内核很小，边界很硬。</h2>
            <p>它不替代产品，也不等同模型。它只负责在关键时刻做出可追溯的认知选择。</p>
          </div>

          <div className="capability-grid">
            <article className="capability-primary" data-section-reveal>
              <p>理解真正的问题</p>
              <h3>先识别真实意图与主要矛盾，再决定下一步该看什么。</h3>
              <span>不是把用户的话直接改写成提示词。</span>
            </article>
            <article data-section-reveal>
              <p>选择认知行动</p>
              <h3>判断该追问、检索、推演，还是暂停并等待更多事实。</h3>
            </article>
            <article data-section-reveal>
              <p>严格提交状态</p>
              <h3>只有通过边界校验的结论，才进入下一轮记忆与行动。</h3>
            </article>
          </div>
        </section>

        <section
          className="business-reference"
          id="enterprise-product"
          aria-labelledby="business-title"
        >
          <div className="business-copy" data-section-reveal>
            <p className="section-label">首个复杂参考产品</p>
            <h2 id="business-title">Business，把平台能力带进真实经营。</h2>
            <p>
              它持续理解企业目标、事实与约束，在关键决策前梳理风险、后果和下一步，而不是等待一个临时问题。
            </p>
            <a className="text-link" href="#product-lines">
              查看产品关系
            </a>
          </div>

          <div className="business-sequence" aria-label="Business 工作方式" data-section-reveal>
            <div>
              <strong>持续理解</strong>
              <span>目标、背景与正在变化的事实</span>
            </div>
            <div>
              <strong>提前推演</strong>
              <span>结果、风险与连锁影响</span>
            </div>
            <div>
              <strong>陪着行动</strong>
              <span>把判断推进为可验证的下一步</span>
            </div>
          </div>
        </section>

        <section className="product-family" id="product-lines" aria-labelledby="product-lines-title">
          <div className="section-heading">
            <h2 id="product-lines-title">平台先服务产品，产品再面对具体问题。</h2>
            <p>每条产品线保留自己的用户、任务和边界，同时复用同一套认知基础设施。</p>
          </div>

          <div className="product-grid">
            <article className="product-business" data-section-reveal>
              <span>Business</span>
              <h3>企业经营中的持续判断</h3>
              <p>围绕目标、事实、证据、风险与后续责任，帮助企业更早看见变化并减少误判。</p>
              <div className="download-block" id="download">
                <div className="button button-secondary download-preview" role="group" aria-label="XELITI 桌面版准备中">
                  <span>
                    <strong>桌面版</strong>
                    <small>安装包准备中</small>
                  </span>
                  <DownloadIcon />
                </div>
              </div>
            </article>
            <article className="product-personal" data-section-reveal>
              <span>Personal</span>
              <h3>个人重要选择中的清晰判断</h3>
              <p>展开不同可能，结合自己的经历与可信经验，把复杂选择看得更清楚。</p>
              <a className="text-link" href="/personal/">
                进入 Personal
              </a>
            </article>
          </div>

          <figure className="brand-panel" data-section-reveal>
            <Image
              src="/og.png"
              alt="XELITI 通用认知平台品牌视觉"
              width={1731}
              height={909}
              sizes="(max-width: 767px) 100vw, 90vw"
            />
          </figure>
        </section>
      </main>

      <footer className="site-footer" data-section-reveal>
        <div className="footer-top">
          <p>让产品理解正在发生什么，并知道下一步该做什么。</p>
          <div className="footer-links">
            <div>
              <strong>Products</strong>
              <a href="#enterprise-product">Business</a>
              <a href="/personal/">Personal</a>
            </div>
            <div>
              <strong>Explore</strong>
              <a href="#platform-story">平台结构</a>
              <a href="#capabilities">核心优势</a>
            </div>
          </div>
        </div>
        <div className="footer-meta">
          <span>© 2026 XELITI</span>
          <span>通用认知平台</span>
        </div>
        <div className="footer-wordmark" aria-label="XELITI">
          XELITI
        </div>
      </footer>
    </XelitiMotion>
  );
}
