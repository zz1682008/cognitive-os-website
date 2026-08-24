const layers = [
  {
    key: "product",
    name: "Product",
    title: "产品定义具体问题",
    body: "Personal、Business 与未来产品，分别拥有自己的用户与任务边界。",
  },
  {
    key: "harness",
    name: "Agent Harness",
    title: "运行完整工作过程",
    body: "统一承接会话、工具、上下文与恢复，让产品能力持续运转。",
  },
  {
    key: "kernel",
    name: "Cognitive Kernel",
    title: "决定下一步认知行动",
    body: "理解真实意图与主要矛盾，选择追问、检索、推演或提交。",
  },
  {
    key: "state",
    name: "State / Memory",
    title: "保留必要状态与依据",
    body: "激活当前需要的记忆、知识与证据，不把全部历史塞进一次判断。",
  },
  {
    key: "gateway",
    name: "AI-Gateway",
    title: "执行受治理的模型调用",
    body: "模型负责生成与推理，网关负责执行，它们都不拥有产品判断权。",
  },
] as const;

export function XelitiPlatformStory() {
  return (
    <section className="platform-story" id="platform-story" aria-labelledby="platform-story-title" data-platform-story>
      <div className="story-intro">
        <h2 id="platform-story-title">平台负责把认知能力，交给每一个产品。</h2>
        <p>向上支持不同产品，向下约束模型调用。每一层只做自己该做的事。</p>
      </div>

      <div className="story-layout">
        <ol className="story-copy" aria-label="XELITI 平台层级">
          {layers.map((layer) => (
            <li key={layer.key} data-story-step={layer.key}>
              <span>{layer.name}</span>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </li>
          ))}
        </ol>

        <div className="story-visual" aria-label="平台从产品层到模型执行层的结构">
          <div className="story-stack">
            {layers.map((layer) => (
              <div className={`story-layer story-layer-${layer.key}`} key={layer.key} data-story-layer={layer.key}>
                <span>{layer.name}</span>
                <strong>{layer.title}</strong>
              </div>
            ))}
          </div>
          <p>判断权始终在产品与内核边界内。</p>
        </div>
      </div>
    </section>
  );
}
