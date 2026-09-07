import { EnterpriseBrain } from "./components/enterprise-brain";
import { FinanceScene } from "./components/finance-scene";
import { BlockHead, FinaleActions, HeroCopy } from "./components/home-copy";
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
            <HeroCopy />
          </div>
          <div className="scroll-hint" aria-hidden="true"><span>SCROLL</span><i /></div>
        </section>

        {/* 1 · 企业大脑 */}
        <section className="sec sec-soft" id="brain">
          <div className="shell">
            <BlockHead block="brain" />
            <EnterpriseBrain />
            <BlockHead block="secretary" id="secretary" style={{ margin: "64px auto 40px" }} />
            <SecretaryWindow />
          </div>
        </section>

        {/* 2 · 推演 */}
        <section className="sec" id="reason">
          <div className="shell">
            <BlockHead block="reason" />
            <Foresight />
          </div>
        </section>

        {/* 3 · 财务 */}
        <section className="sec sec-soft" id="finance">
          <div className="shell">
            <BlockHead block="finance" />
            <FinanceScene />
          </div>
        </section>

        {/* 4 · 法务 */}
        <section className="sec" id="legal">
          <div className="shell">
            <BlockHead block="legal" />
            <LegalScene />
          </div>
        </section>

        {/* 5 · 智能客服 */}
        <section className="sec sec-soft" id="service">
          <div className="shell">
            <BlockHead block="service" />
            <ServiceScene />
          </div>
        </section>

        {/* 品牌收尾 */}
        <section className="finale" id="finale" data-rv>
          <div className="shell">
            <FinaleActions />
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
