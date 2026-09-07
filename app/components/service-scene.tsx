"use client";

import { Scene } from "./motion";

const SIGNAL = Array.from({ length: 30 }, (_, i) => ({
  height: 5 + Math.sin(i * 0.47) ** 2 * 19,
  index: i,
}));

const SOURCES: { tag: string; text: string; at: number }[] = [
  { tag: "产品表", text: "云朵款 4.2cm · 厚底款 3.5cm · 基础款 2cm", at: 3 },
  { tag: "库存", text: "云朵款 38 码 有货", at: 3.6 },
  { tag: "发货", text: "16 点前下单当天发", at: 4.2 },
];

/** 智能客服：同一个问题，升级前后两部手机。 */
export function ServiceScene() {
  return (
    <Scene className="vs">
      <div>
        <h3><small>以前</small>关键词机器人</h3>
        <div className="phone">
          <div className="cam" />
          <header>在线客服</header>
          <div className="q an" style={{ "--d": ".2s" } as React.CSSProperties}>最厚的鞋底是哪款</div>
          <div className="ans an" style={{ "--d": ".9s" } as React.CSSProperties}>
            hello~ 欢迎回家❤️<br />归家，是一场温暖的仪式。而一双好拖鞋，是这场仪式的开始。<br />需要任何推荐，我始终在线。
          </div>
          <div className="q an" style={{ "--d": "1.9s" } as React.CSSProperties}>人呢</div>
          <div className="ans an" style={{ "--d": "2.6s" } as React.CSSProperties}>亲亲，在的，请问有什么可以帮您～</div>
          <div className="q an" style={{ "--d": "3.5s" } as React.CSSProperties}>
            最厚的鞋底是哪款<small className="unread">未读</small>
          </div>
        </div>
      </div>

      <div className="vs-mid an" style={{ "--d": "3.9s" } as React.CSSProperties}>
        <span>升级</span>→
      </div>

      <div className="ai">
        <h3><small>现在</small>懂你公司的客服</h3>
        <div className="phone">
          <div className="cam" />
          <header><i />AI 客服</header>
          <div className="q an" style={{ "--d": ".2s" } as React.CSSProperties}>最厚的鞋底是哪款</div>
          <div className="think">
            <div className="sig an" style={{ "--d": ".9s" } as React.CSSProperties}>
              {SIGNAL.map(bar => (
                <i key={bar.index} style={{ height: `${bar.height}px`, "--i": bar.index } as React.CSSProperties} />
              ))}
            </div>
            <div className="an" style={{ "--d": "1.4s" } as React.CSSProperties}>
              <span className="lab2">找回记忆</span>
              <div className="mem"><span>上次买过 · 厚底款 38 码</span><span>说过 · 脚后跟疼</span></div>
            </div>
            <div className="an" style={{ "--d": "2.4s" } as React.CSSProperties}>
              <span className="lab2">从企业文件夹里拿</span>
              <div className="folder an" style={{ "--d": "2.5s" } as React.CSSProperties}><i />企业文件夹</div>
              <div className="papers">
                {SOURCES.map(source => (
                  <div className="paper grab" key={source.tag} style={{ "--d": `${source.at}s` } as React.CSSProperties}>
                    <span>{source.tag}</span><p>{source.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="an" style={{ "--d": "5.1s" } as React.CSSProperties}>
              <span className="lab2">结合起来分析</span>
              <div className="route">
                <i style={{ animationDelay: "5.3s" }} />
                <div className="an" style={{ "--d": "5.5s" } as React.CSSProperties}><span>最厚</span><strong>云朵款 4.2cm</strong></div>
                <div className="an" style={{ "--d": "6.1s" } as React.CSSProperties}><span>比上次</span><strong>厚 7mm · 后跟加厚</strong></div>
              </div>
            </div>
          </div>
          <div className="aians an" style={{ "--d": "7.2s" } as React.CSSProperties}>
            最厚的是云朵款，鞋底 4.2cm，比您上次买的厚底款厚 7mm。您提过脚后跟疼，这款后跟是加厚的，更合适。38 码有货，现在下单今天发。
          </div>
        </div>
      </div>
    </Scene>
  );
}
