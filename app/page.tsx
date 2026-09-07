import Link from "next/link";

import { EnterpriseBrain } from "./components/enterprise-brain";
import { FinanceScene } from "./components/finance-scene";
import { Foresight } from "./components/foresight";
import { HeroDots } from "./components/hero-dots";
import { LegalScene } from "./components/legal-scene";
import { Reveal } from "./components/motion";
import { SecretaryWindow } from "./components/secretary-window";
import { ServiceScene } from "./components/service-scene";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";

export default function Home() {
  const authority = process.env.PLATFORM_ACCOUNT_CENTER_ISSUER ?? "http://127.0.0.1:5200";
  return (
    <>
      <Reveal />
      <a className="skip" href="#main">跳到主要内容</a>
      <SiteHeader authority={authority} home />

      <main id="main">
        {/* 首屏 */}
        <section className="hero" id="top">
          <HeroDots />
          <div className="shell">
            <div className="hero-copy">
              <p className="eyebrow" data-rv>XELITI BUSINESS</p>
              <h1 data-rv>让 AI，<br />真正懂你的企业。</h1>
              <p className="sub" data-rv>
                合同、账、制度、目标，全装在一个脑子里。所以风险它先看见，决定它先替你推一遍，客户的问题它替你答。
              </p>
              <div className="hero-act" data-rv>
                <Link className="btn btn-dark btn-lg" href="/trial">申请试用</Link>
                <a className="btn btn-line btn-lg" href="#brain">它怎么做到的 ↓</a>
              </div>
            </div>
          </div>
          <div className="scroll-hint" aria-hidden="true"><span>SCROLL</span><i /></div>
        </section>

        {/* 1 · 企业大脑 */}
        <section className="sec sec-soft" id="brain">
          <div className="shell">
            <div className="head">
              <p className="eyebrow" data-rv>为什么它给的是你公司的答案</p>
              <h2 data-rv>它把你公司的所有事，<br />装进企业大脑。</h2>
            </div>
            <EnterpriseBrain />
            <div className="head" id="secretary" style={{ margin: "64px auto 40px" }}>
              <p className="eyebrow" data-rv>秘书台</p>
              <h2 data-rv>你不用天天盯，<br />事情自己找上来。</h2>
            </div>
            <SecretaryWindow />
          </div>
        </section>

        {/* 2 · 推演 */}
        <section className="sec" id="reason">
          <div className="shell">
            <div className="head">
              <p className="eyebrow" data-rv>推演</p>
              <h2 data-rv>把未来的风险、别人的经验，<br />提前搬到你眼前。</h2>
            </div>
            <Foresight />
          </div>
        </section>

        {/* 3 · 财务 */}
        <section className="sec sec-soft" id="finance">
          <div className="shell">
            <div className="head">
              <p className="eyebrow" data-rv>财务</p>
              <h2 data-rv>发票丢进去，<br />剩下的它做。</h2>
            </div>
            <FinanceScene />
          </div>
        </section>

        {/* 4 · 法务 */}
        <section className="sec" id="legal">
          <div className="shell">
            <div className="head">
              <p className="eyebrow" data-rv>法务</p>
              <h2 data-rv>合同丢进去，<br />坑自己亮。</h2>
            </div>
            <LegalScene />
          </div>
        </section>

        {/* 5 · 智能客服 */}
        <section className="sec sec-soft" id="service">
          <div className="shell">
            <div className="head">
              <p className="eyebrow" data-rv>智能客服</p>
              <h2 data-rv>同一个问题，<br />客服升级前后。</h2>
            </div>
            <ServiceScene />
          </div>
        </section>

        {/* 品牌收尾 */}
        <section className="finale" id="finale" data-rv>
          <div className="shell">
            <div className="top" data-rv>
              <Link className="btn btn-dark btn-lg" href="/trial">申请试用</Link>
              <Link className="btn btn-line btn-lg" href="/download">下载桌面版</Link>
            </div>
            <div className="monument" role="img" aria-label="XELITI">
              <svg viewBox="0 0 44 44" aria-hidden="true">
                <path d="M5 30.5C9 30.5 10.5 12.5 16 12.5S19.5 31.5 24.5 31.5 28 12.5 33 12.5s5.5 14.5 6 18" />
                <circle cx="5" cy="30.5" r="2.2" />
                <circle cx="39" cy="30.5" r="2.2" />
              </svg>
              <div className="letters" aria-hidden="true">
                {"XELITI".split("").map((letter, index) => <span key={index}>{letter}</span>)}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
