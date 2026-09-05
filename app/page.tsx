import { AccountSession } from "./components/account-session";
import { XelitiMotion } from "./components/xeliti-motion";
import { DecisionStory, MaterialsStory, FinanceStory, LegalStory, ServiceStory, SecretaryStory, EnterpriseBrain } from "./components/xeliti-product-stories";
import { XelitiMobileMenu } from "./components/xeliti-mobile-menu";
import { NeuralVisual } from "./components/xeliti-neural-visual";
import { PlatformDownload } from "./components/platform-download";

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="XELITI 首页">
      <span className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 44 44">
          <path d="M5 30.5C9 30.5 10.5 12.5 16 12.5S19.5 31.5 24.5 31.5 28 12.5 33 12.5s5.5 14.5 6 18" />
          <circle cx="5" cy="30.5" r="2.2" /><circle cx="39" cy="30.5" r="2.2" />
        </svg>
      </span>
      <span className="brand-wordmark">XELITI</span>
    </a>
  );
}

export default function Home() {
  const authority = process.env.PLATFORM_ACCOUNT_CENTER_ISSUER ?? "http://127.0.0.1:5200";
  return (
    <XelitiMotion>
      <a className="skip-link" href="#main">跳到主要内容</a>
      <header className="site-header">
        <nav className="nav-shell" aria-label="主导航">
          <Brand />
          <div className="nav-center">
            <details className="product-menu">
              <summary>产品 <span aria-hidden="true">⌄</span></summary>
              <div className="product-menu-panel">
                <a href="#enterprise-product"><strong>Business</strong><small>企业资料、工作与客户服务</small></a>
                <a href="/personal/"><strong>Personal</strong><small>面向个人重要选择</small></a>
              </div>
            </details>
            <a href="#capabilities">核心优势</a>
            <a href="#product-lines">产品线</a>
          </div>
          <div className="nav-actions">
            <a className="desktop-link" href="#download">桌面版 <span aria-hidden="true">↗</span></a>
            <AccountSession authority={authority} />
            <XelitiMobileMenu />
          </div>
        </nav>
      </header>
      <main id="main">
        <section className="platform-hero page-width" id="top" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="eyebrow" data-hero-reveal>XELITI BUSINESS</p>
              <h1 id="hero-title" data-hero-reveal>让 AI，<br />真正懂你的企业。</h1>
              <p className="hero-lede" data-hero-reveal>XELITI 将企业资料转为 AI 读得懂的知识，让财务、法务、客服与秘书台，在同一套企业理解上协同工作。</p>
              <div className="hero-actions" id="download" data-hero-reveal><PlatformDownload /><a className="text-link" href="#decision">看看它怎么做 <span aria-hidden="true">↗</span></a></div>
            </div>
            <NeuralVisual />
        </section>
        <section className="decision-hero story-section page-width" id="decision" aria-labelledby="decision-title">
          <div className="story-heading" data-section-reveal><h2 id="decision-title">决策前，先推演。</h2><p>目标、风险、解决方案，一起看清楚。</p></div>
          <DecisionStory />
        </section>
        <div id="enterprise-product"><MaterialsStory /><div id="capabilities" /><FinanceStory /><LegalStory /></div>
        <ServiceStory />
        <SecretaryStory />
        <EnterpriseBrain><NeuralVisual variant="network" /></EnterpriseBrain>
        <section className="brand-finale" id="product-lines" aria-label="XELITI" data-brand-finale>
          <div className="page-width">
            <div className="finale-top"><a className="text-link" href="/personal/">探索 Personal <span aria-hidden="true">↗</span></a></div>
            <div className="brand-monument" role="img" aria-label="XELITI">
              <svg className="monument-symbol" viewBox="0 0 44 44" aria-hidden="true"><path d="M5 30.5C9 30.5 10.5 12.5 16 12.5S19.5 31.5 24.5 31.5 28 12.5 33 12.5s5.5 14.5 6 18" /><circle cx="5" cy="30.5" r="2.2" /><circle cx="39" cy="30.5" r="2.2" /></svg>
              <div className="monument-letters" aria-hidden="true">{"XELITI".split("").map((letter,index)=><span key={index} data-logo-letter>{letter}</span>)}</div>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer page-width">
        <div className="footer-bottom"><span>© 2026 XELITI</span><a href="#top">回到顶部 ↑</a></div>
      </footer>
    </XelitiMotion>
  );
}
