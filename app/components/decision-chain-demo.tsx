export function DecisionChainDemo() {
  return (
    <div className="business-shot" aria-label="XELITI Business 产品界面截图，内容为演示数据">
      <div className="business-shot__chrome" aria-hidden="true">
        <span className="business-shot__dots"><i /><i /><i /></span>
        <span className="business-shot__address">business.xeliti</span>
        <span className="business-shot__preview">PRODUCT VIEW</span>
      </div>

      <div className="business-shot__app">
        <aside className="business-shot__rail">
          <div className="business-shot__brand">
            <span>XELITI</span>
            <small>Business</small>
          </div>
          <div className="business-shot__new">＋ 新建目标</div>
          <p>置顶目标</p>
          <ul>
            <li><span />季度现金流计划</li>
            <li className="is-active"><span />首份 B2B 合同复核</li>
            <li><span />研发交付延期影响</li>
          </ul>
          <div className="business-shot__watch"><i />持续关注中</div>
        </aside>

        <section className="business-shot__workspace">
          <header>
            <div>
              <span>当前目标</span>
              <h3>首份 B2B 合同签署前复核</h3>
            </div>
            <strong><i />持续理解</strong>
          </header>

          <div className="business-shot__conversation">
            <div className="business-shot__user">
              <span>你</span>
              <p>帮我把报价再压 3 个点，先把这单签下来。</p>
            </div>

            <article className="business-shot__insight">
              <div className="business-shot__insight-head">
                <span>X</span>
                <div><strong>主要问题识别</strong><small>刚刚完成 · 已核对合同事实</small></div>
              </div>
              <h4>现在最需要处理的，不是报价。</h4>
              <p>70% 尾款依赖“验收合格”，但合同没有约定验收期限，回款时间因此失去上限。</p>
              <div className="business-shot__risk-grid">
                <span><small>识别风险</small><strong>回款期限不确定</strong></span>
                <span><small>连锁影响</small><strong>研发投入被挤压</strong></span>
              </div>
              <div className="business-shot__next">
                <span>建议下一步</span>
                <strong>先补充验收期限与付款节点，再讨论报价。</strong>
              </div>
            </article>
          </div>
        </section>

        <aside className="business-shot__evidence">
          <header><span>判断依据</span><strong>3 项</strong></header>
          <div><i>01</i><p><strong>付款条款</strong><small>70% 尾款在验收后支付</small></p></div>
          <div><i>02</i><p><strong>验收约束</strong><small>未发现明确完成期限</small></p></div>
          <div><i>03</i><p><strong>经营影响</strong><small>影响下一阶段研发现金</small></p></div>
          <footer><span>能力路径</span><strong>理解 → 推演 → 行动</strong></footer>
        </aside>
      </div>
    </div>
  );
}
