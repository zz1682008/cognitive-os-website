export type DemoNodeTone = "fact" | "risk" | "turning" | "decision" | "outcome";

export type DemoNodeLane = "main" | "alt";

export type DemoNode = {
  id: string;
  code: string;
  kind: string;
  tone: DemoNodeTone;
  title: string;
  /** 推演链列位置（0 起，时间从左向右推进） */
  stage: number;
  /** main = 主路径，alt = 分支路径 */
  lane: DemoNodeLane;
  /** 前进 / 分支连线的目标节点 id */
  to: string[];
  basis: string[];
  risk: string;
  impact: string;
};

export type DemoOverview = {
  keyRisks: string[];
  keyDecisions: string[];
  outcomes: string[];
  suggestedPath: string;
};

export type DemoScenario = {
  id: string;
  title: string;
  goal: string;
  context: string;
  facts: string[];
  chainSummary: string;
  nodes: DemoNode[];
  overview: DemoOverview;
};

export const demoScenarios: DemoScenario[] = [
  {
    id: "contract-signing",
    title: "完成首份 B2B 合同签署",
    goal: "在不牺牲交付边界的前提下完成签署，并锁定首期回款时间。",
    context: "系统已核对合同草案、交付计划和回款安排，当前最需要确认的是验收完成标准。",
    facts: [
      "签署以双方完成有效签字盖章为准",
      "合同生效并收到合规发票后再计算首付款期限",
      "新增报表不进入本次合同验收范围",
    ],
    chainSummary: "验收规则如果不完整，会继续影响尾款触发条件和后续投入安排。",
    nodes: [
      {
        id: "contract-fact",
        code: "P01",
        kind: "已确认事实",
        tone: "fact",
        title: "双方完成有效签署",
        stage: 0,
        lane: "main",
        to: ["contract-risk"],
        basis: ["首份 B2B 合同草案", "负责人已确认签署完成口径"],
        risk: "如果签署主体或授权不完整，合同生效时间仍可能出现争议。",
        impact: "首付款起算日和后续交付安排都依赖有效签署。",
      },
      {
        id: "contract-risk",
        code: "P02",
        kind: "风险点",
        tone: "risk",
        title: "验收起算日与逾期处理尚未确认",
        stage: 1,
        lane: "main",
        to: ["contract-turning", "contract-risk-branch"],
        basis: ["合同草案未写清完整材料提交后的验收期限", "交付计划依赖验收结果触发尾款"],
        risk: "客户反馈时间没有上限，尾款回收可能持续延后。",
        impact: "回款延后会继续影响供应商付款和下一阶段研发投入。",
      },
      {
        id: "contract-turning",
        code: "P03",
        kind: "转折点",
        tone: "turning",
        title: "新增需求转入变更流程",
        stage: 2,
        lane: "main",
        to: ["contract-decision"],
        basis: ["本次只验收已确认的核心模块", "新增报表尚未确认费用和排期"],
        risk: "如果新增需求直接进入验收，交付边界会再次变得不明确。",
        impact: "把新增内容移出本次验收，可以保持交付、验收与回款一致。",
      },
      {
        id: "contract-risk-branch",
        code: "P04",
        kind: "风险点",
        tone: "risk",
        title: "尾款回款持续延后",
        stage: 2,
        lane: "alt",
        to: ["contract-outcome-branch"],
        basis: ["客户侧验收反馈无时间上限", "供应商付款计划按月执行"],
        risk: "尾款账期拉长，供应商付款被迫向后顺延。",
        impact: "现金安排需要为未到账情形预留缓冲。",
      },
      {
        id: "contract-decision",
        code: "P05",
        kind: "决策点",
        tone: "decision",
        title: "确认验收期限起算口径",
        stage: 3,
        lane: "main",
        to: ["contract-outcome"],
        basis: ["建议从完整材料提交后起算验收期", "逾期未反馈按约定视为通过"],
        risk: "口径不写入合同，争议时缺少处理依据。",
        impact: "验收、尾款与新增需求获得清晰边界。",
      },
      {
        id: "contract-outcome",
        code: "P06",
        kind: "可能结果",
        tone: "outcome",
        title: "首期回款时间锁定",
        stage: 4,
        lane: "main",
        to: [],
        basis: ["验收期限与逾期处理写入合同", "尾款触发条件与交付计划一致"],
        risk: "仍需跟踪客户首次反馈是否一次性提出。",
        impact: "首付款与尾款安排可进入现金计划。",
      },
      {
        id: "contract-outcome-branch",
        code: "P07",
        kind: "可能结果",
        tone: "outcome",
        title: "供应商付款与研发投入顺延",
        stage: 3,
        lane: "alt",
        to: [],
        basis: ["回款延后情形下的支出优先级清单"],
        risk: "顺延时间过长会影响供应商关系与研发节奏。",
        impact: "需要提前准备支出调整方案作为兜底。",
      },
    ],
    overview: {
      keyRisks: ["验收起算日未确认，尾款可能持续延后", "回款延后挤压供应商付款与研发投入"],
      keyDecisions: ["验收期限从完整材料提交后起算", "新增需求全部转入变更流程"],
      outcomes: ["首期回款时间锁定，验收边界清晰", "回款延后时启动支出顺延方案"],
      suggestedPath: "P01 → P02 → P03 → P05 → P06，分支 P04 → P07 作为兜底预案。",
    },
  },
  {
    id: "product-mvp",
    title: "上线首个客户管理 MVP",
    goal: "让一人团队先验证客户录入、跟进和合同关联是否真正解决问题。",
    context: "首版涉及客户联系人和合同信息，预算与交付时间都要求先冻结范围。",
    facts: [
      "首版首先服务一人团队",
      "核心动作是客户录入、跟进和合同关联",
      "多人协作、批量导出和自动营销暂不进入首版",
    ],
    chainSummary: "范围继续扩大，会同时增加交付、预算和客户数据治理风险。",
    nodes: [
      {
        id: "mvp-fact",
        code: "P01",
        kind: "已确认事实",
        tone: "fact",
        title: "首版服务一人团队",
        stage: 0,
        lane: "main",
        to: ["mvp-risk"],
        basis: ["目标客户访谈摘要", "负责人确认的核心使用场景"],
        risk: "如果目标用户继续扩展，首版需求会失去判断标准。",
        impact: "明确首批用户，才能判断哪些功能真正属于首版。",
      },
      {
        id: "mvp-risk",
        code: "P02",
        kind: "风险点",
        tone: "risk",
        title: "范围扩大可能造成预算失控",
        stage: 1,
        lane: "main",
        to: ["mvp-turning", "mvp-risk-branch"],
        basis: ["客户管理 MVP 预算测算", "当前缺少新增功能的工时估算"],
        risk: "多人协作、批量导出和自动营销同时进入首版，会延后上线并增加现金消耗。",
        impact: "预算缓冲减少，交付节奏被打乱。",
      },
      {
        id: "mvp-turning",
        code: "P03",
        kind: "转折点",
        tone: "turning",
        title: "冻结三个核心模块",
        stage: 2,
        lane: "main",
        to: ["mvp-decision"],
        basis: ["首版验证目标已经明确", "非核心功能不影响首批用户完成关键动作"],
        risk: "如果冻结范围后仍接受临时新增，验收标准会再次漂移。",
        impact: "目标从继续增加功能，转为先形成可验收版本。",
      },
      {
        id: "mvp-risk-branch",
        code: "P04",
        kind: "风险点",
        tone: "risk",
        title: "客户数据授权与留存边界复杂",
        stage: 2,
        lane: "alt",
        to: ["mvp-outcome-branch"],
        basis: ["首版涉及客户联系人和合同信息", "数据治理规则尚未成文"],
        risk: "授权与留存规则不清，合规成本随功能增加而上升。",
        impact: "数据规则需要与首版范围一起冻结。",
      },
      {
        id: "mvp-decision",
        code: "P05",
        kind: "决策点",
        tone: "decision",
        title: "确认唯一首版范围",
        stage: 3,
        lane: "main",
        to: ["mvp-outcome"],
        basis: ["客户录入、跟进、合同关联作为唯一首版范围", "其余功能进入后续版本清单"],
        risk: "范围确认后仍需抵制交付过程中的临时扩张。",
        impact: "首版拥有明确目标、范围和验收边界。",
      },
      {
        id: "mvp-outcome",
        code: "P06",
        kind: "可能结果",
        tone: "outcome",
        title: "形成可验收的首版",
        stage: 4,
        lane: "main",
        to: [],
        basis: ["PRD 与验收标准围绕三个核心模块生成"],
        risk: "首版价值仍需真实用户验证，可能继续调整。",
        impact: "上线节奏与预算回到可控区间。",
      },
      {
        id: "mvp-outcome-branch",
        code: "P07",
        kind: "可能结果",
        tone: "outcome",
        title: "上线延后、现金消耗增加",
        stage: 3,
        lane: "alt",
        to: [],
        basis: ["范围失控情形下的预算消耗测算"],
        risk: "上线每延后一个周期，验证反馈也同步延后。",
        impact: "需要削减非核心投入或追加预算。",
      },
    ],
    overview: {
      keyRisks: ["范围扩大导致预算失控", "客户数据授权与留存边界复杂"],
      keyDecisions: ["冻结客户录入、跟进、合同关联三个核心模块", "其余功能全部进入后续版本"],
      outcomes: ["形成可验收首版，节奏与预算可控", "范围失控则上线延后、现金消耗增加"],
      suggestedPath: "P01 → P02 → P03 → P05 → P06，分支 P04 → P07 提示范围失控代价。",
    },
  },
  {
    id: "cashflow",
    title: "稳定本月现金流",
    goal: "确保工资、供应商付款和研发投入都有明确资金来源。",
    context: "固定支出已经锁定，但两笔应收款尚未确认具体到账日。",
    facts: [
      "工资、云服务和必要供应商付款需要按期支付",
      "本周到账情况决定月底现金安全",
      "催收动作已经准备，等待负责人确认",
    ],
    chainSummary: "应收款时间不确定，可能继续影响工资保障和研发投入安排。",
    nodes: [
      {
        id: "cash-fact",
        code: "P01",
        kind: "已确认事实",
        tone: "fact",
        title: "工资与固定支出已经锁定",
        stage: 0,
        lane: "main",
        to: ["cash-risk"],
        basis: ["本月现金流报表", "已确认的固定付款安排"],
        risk: "固定支出无法继续延后，可调整空间主要来自非必要投入。",
        impact: "现金安排必须优先保障工资、云服务和必要供应商付款。",
      },
      {
        id: "cash-risk",
        code: "P02",
        kind: "风险点",
        tone: "risk",
        title: "两笔应收款尚未确认到账日",
        stage: 1,
        lane: "main",
        to: ["cash-turning", "cash-risk-branch"],
        basis: ["客户回款沟通记录", "财务报表中的应收款状态"],
        risk: "如果本周没有新增到账，月底可用现金会接近内部警戒线。",
        impact: "研发投入可能需要缩减，非必要支出需要延后。",
      },
      {
        id: "cash-turning",
        code: "P03",
        kind: "转折点",
        tone: "turning",
        title: "优先处理阶段款催收",
        stage: 2,
        lane: "main",
        to: ["cash-decision"],
        basis: ["阶段款已具备催收条件", "削减投入会影响当前研发目标"],
        risk: "只等待回款会错过调整支出的时间窗口。",
        impact: "现金安排从等待回款，转为主动催收并准备支出备选方案。",
      },
      {
        id: "cash-risk-branch",
        code: "P04",
        kind: "风险点",
        tone: "risk",
        title: "月底现金接近内部警戒线",
        stage: 2,
        lane: "alt",
        to: ["cash-outcome-branch"],
        basis: ["无新增到账情形下的现金测算", "固定支出付款日程表"],
        risk: "警戒线下任何意外支出都会直接影响工资发放。",
        impact: "必须提前准备非必要支出延后清单。",
      },
      {
        id: "cash-decision",
        code: "P05",
        kind: "决策点",
        tone: "decision",
        title: "本周优先催收阶段款",
        stage: 3,
        lane: "main",
        to: ["cash-outcome"],
        basis: ["先催收阶段款，同时准备支出延后方案", "催收结果本周内复核"],
        risk: "催收不成时，延后方案需要立即启动。",
        impact: "优先争取到账，并为未到账情形保留调整空间。",
      },
      {
        id: "cash-outcome",
        code: "P06",
        kind: "可能结果",
        tone: "outcome",
        title: "到账优先保障工资与研发",
        stage: 4,
        lane: "main",
        to: [],
        basis: ["阶段款到账后的付款优先级安排"],
        risk: "单笔到账可能不足以覆盖全部固定支出。",
        impact: "工资、供应商与研发投入均有明确资金来源。",
      },
      {
        id: "cash-outcome-branch",
        code: "P07",
        kind: "可能结果",
        tone: "outcome",
        title: "启动非必要支出延后方案",
        stage: 3,
        lane: "alt",
        to: [],
        basis: ["未到账情形下的支出调整清单"],
        risk: "延后范围过大可能拖累研发里程碑。",
        impact: "先保工资与必要供应商付款，再恢复研发投入。",
      },
    ],
    overview: {
      keyRisks: ["两笔应收款到账日未定", "无新增到账时月底现金接近警戒线"],
      keyDecisions: ["本周优先催收首份 B2B 合同阶段款", "同步准备非必要支出延后方案"],
      outcomes: ["到账后优先保障工资与研发投入", "未到账则启动支出延后方案"],
      suggestedPath: "P01 → P02 → P03 → P05 → P06，分支 P04 → P07 为未到账兜底。",
    },
  },
];
