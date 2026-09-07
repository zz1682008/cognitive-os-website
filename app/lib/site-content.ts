/**
 * 官网可配置内容。
 *
 * 这份数据是底部导航、二级页面正文与公司信息的单一来源；首页与 `/[slug]`
 * 都从这里读。将来由管理端维护，改一处全站生效。此处保留默认稿。
 */

export type PageSection = {
  h: string;
  p?: string;
  list?: string[];
  faq?: [question: string, answer: string][];
  code?: string;
  status?: [service: string, state: string][];
};

export type SitePage = {
  title: string;
  eyebrow: string;
  intro: string;
  legal?: boolean;
  sections: PageSection[];
};

export type FooterColumn = { title: string; links: { text: string; href: string }[] };

export type Brand = { name: string; slogan: string; icp: string; police: string; copyright: string };

export type Contact = { email: string; sales: string; support: string; wechat: string; address: string };

/** 首页一屏的标题按行编辑，渲染时逐行断开。 */
export type HomeBlock = { id: string; eyebrow: string; title: string[] };

export type HomeCopy = {
  hero: { eyebrow: string; title: string[]; sub: string; primary: string; secondary: string };
  blocks: HomeBlock[];
  finale: { primary: string; secondary: string };
};

export type NavCopy = {
  productsLabel: string;
  products: { href: string; title: string; note: string }[];
  links: { href: string; text: string }[];
  download: string;
  trial: string;
};

/** 二级页底部那块「先从一个目标开始」的招呼。 */
export type CtaCopy = { title: string; note: string; button: string };

export type SiteContent = {
  brand: Brand;
  contact: Contact;
  nav: NavCopy;
  home: HomeCopy;
  cta: CtaCopy;
  footerColumns: FooterColumn[];
  pages: Record<string, SitePage>;
};

export const brand: Brand = {
  name: "XELITI",
  slogan: "让 AI 真正懂你的企业。",
  icp: "京 ICP 备 XXXXXXXX 号",
  police: "京公网安备 XXXXXXXXXXXXX 号",
  copyright: "© 2026 XELITI",
};

export const contact: Contact = {
  email: "hello@xeliti.com",
  sales: "sales@xeliti.com",
  support: "support@xeliti.com",
  wechat: "XELITI 官方公众号",
  address: "北京市",
};

export const nav: NavCopy = {
  productsLabel: "产品",
  products: [
    { href: "#brain", title: "XELITI Business", note: "企业端 · 工作台与秘书台" },
    { href: "#service", title: "智能客服", note: "对外出口 · 懂你公司的客服" },
    { href: "/personal/", title: "XELITI Personal", note: "个人端 · 面向个人的重要选择" },
  ],
  links: [
    { href: "#brain", text: "企业大脑" },
    { href: "#reason", text: "推演" },
    { href: "#finance", text: "财务" },
    { href: "#legal", text: "法务" },
    { href: "/help", text: "帮助" },
  ],
  download: "下载桌面版",
  trial: "申请试用",
};

export const home: HomeCopy = {
  hero: {
    eyebrow: "XELITI BUSINESS",
    title: ["让 AI，", "真正懂你的企业。"],
    sub: "合同、账、制度、目标，全装在一个脑子里。所以风险它先看见，决定它先替你推一遍，客户的问题它替你答。",
    primary: "申请试用",
    secondary: "它怎么做到的 ↓",
  },
  blocks: [
    { id: "brain", eyebrow: "为什么它给的是你公司的答案", title: ["它把你公司的所有事，", "装进企业大脑。"] },
    { id: "secretary", eyebrow: "秘书台", title: ["你不用天天盯，", "事情自己找上来。"] },
    { id: "reason", eyebrow: "推演", title: ["把未来的风险、别人的经验，", "提前搬到你眼前。"] },
    { id: "finance", eyebrow: "财务", title: ["发票丢进去，", "剩下的它做。"] },
    { id: "legal", eyebrow: "法务", title: ["合同丢进去，", "坑自己亮。"] },
    { id: "service", eyebrow: "智能客服", title: ["同一个问题，", "客服升级前后。"] },
  ],
  finale: { primary: "申请试用", secondary: "下载桌面版" },
};

export const cta: CtaCopy = {
  title: "先从一个目标开始。",
  note: "30 天试用，不限功能。",
  button: "申请试用",
};

export const footerColumns: FooterColumn[] = [
  {
    title: "产品",
    links: [
      { text: "XELITI Business · 企业端", href: "/#brain" },
      { text: "智能客服", href: "/#service" },
      { text: "XELITI Personal · 个人端", href: "/personal/" },
      { text: "桌面版下载", href: "/download" },
    ],
  },
  {
    title: "能力",
    links: [
      { text: "企业大脑", href: "/#brain" },
      { text: "推演", href: "/#reason" },
      { text: "秘书台", href: "/#secretary" },
      { text: "财务", href: "/#finance" },
      { text: "法务", href: "/#legal" },
    ],
  },
  {
    title: "资源",
    links: [
      { text: "帮助中心", href: "/help" },
      { text: "使用文档", href: "/docs" },
      { text: "接入文档（API）", href: "/api" },
      { text: "更新日志", href: "/changelog" },
      { text: "服务状态", href: "/status" },
    ],
  },
  {
    title: "公司",
    links: [
      { text: "关于 XELITI", href: "/about" },
      { text: "新闻与动态", href: "/news" },
      { text: "加入我们", href: "/careers" },
      { text: "联系我们", href: "/contact" },
      { text: "申请试用", href: "/trial" },
    ],
  },
  {
    title: "安全与法律",
    links: [
      { text: "安全与数据边界", href: "/security" },
      { text: "隐私政策", href: "/privacy" },
      { text: "服务条款", href: "/terms" },
      { text: "Cookie 说明", href: "/cookies" },
    ],
  },
];

export const pages: Record<string, SitePage> = {
  help: {
    title: "帮助中心",
    eyebrow: "帮助中心",
    intro: `最常被问到的问题。找不到答案，写信到 ${contact.support}，工作日 24 小时内回复。`,
    sections: [
      {
        h: "开始使用",
        faq: [
          [
            "XELITI Business 是什么？",
            "一个装着你公司所有资料的企业大脑。合同、账、制度、目标进去之后，它替你推演决定、提前报风险、办财务法务的事、替你答客户。员工用工作台，老板用秘书台，客户走客服接口，背后是同一套对你公司的理解。",
          ],
          [
            "怎么开始？",
            "申请试用 → 我们开通账号 → 下载桌面版 → 选一个文件夹当「企业文件夹」，把合同、制度、报表放进去 → 写下你这三个月真正要推动的那件事。第一轮它就会告诉你，哪些它已经知道，哪些还得问你。",
          ],
          [
            "需要先整理资料吗？",
            "不需要。把现有的 PDF、Word、Excel 原样放进去就行。它自己解析、分版本、记出处。解析不出来的会诚实说解析不出来，不会编。",
          ],
          [
            "第一期支持哪些业务？",
            "财务和法务先上：凭证、报表、预算与合同核对、付款条款与制度核对；合同审阅、按公司模板拟合同、制度冲突对照。其他业务陆续开放。",
          ],
        ],
      },
      {
        h: "资料与安全",
        faq: [
          [
            "我的资料放在哪？",
            "在你自己的电脑上。桌面版只读你授权的那个文件夹，原文不上传。要送模型处理、要外发，是另外两次单独授权，随时可以撤。",
          ],
          [
            "AI 会不会改我的文件？",
            "不会。它对你的文件只读；撤销或换文件夹只是解除映射，不删、不挪、不改任何文件。",
          ],
          [
            "它说的话可靠吗？",
            "每一句关于你公司的陈述都能点回原文：哪份资料、第几版、现在还作不作数。没有依据它就说没有依据。历史案例只是参照，不当答案。",
          ],
          [
            "多个人能一起用吗？",
            "可以。同一个公司下，员工用工作台、老板用秘书台，谁能看到哪份资料由你在资料库里设。",
          ],
        ],
      },
      {
        h: "账号与费用",
        faq: [
          ["用什么登录？", "统一账号。一个账号登录 Business、Personal 和桌面版。"],
          ["试用期多久？", "30 天，不限功能。试用期内不产生费用。"],
          [
            "之后怎么收费？",
            `按公司席位按年订阅，模型用量包含在内。正式报价请联系 ${contact.sales}。`,
          ],
          ["能用自己的模型额度吗？", "测试期先用平台自带额度；自带 Key（BYOK）在后续版本开放。"],
        ],
      },
    ],
  },

  docs: {
    title: "使用文档",
    eyebrow: "使用文档",
    intro: "把它用起来的每一步。",
    sections: [
      {
        h: "1. 安装与登录",
        list: [
          "下载 macOS 或 Windows 桌面版，双击安装。",
          "用统一账号登录；没有账号先在网页申请试用。",
          "首次登录会让你选一个文件夹作为企业文件夹，选完可以随时换。",
        ],
      },
      {
        h: "2. 企业文件夹",
        list: [
          "支持 PDF、Word、Excel、图片；直接把文件放进文件夹即可，不用改名、不用分类。",
          "同一份文件改了会自动记成新版本，旧版本仍可回看。",
          "「谁能看到」在资料库里按文件夹或按文件设。",
        ],
      },
      {
        h: "3. 立一个目标",
        list: [
          "在工作台点「新建目标」，用一句话写下你要推动的事，例如「三个月内把老客户续约率从 70% 提到 85%」。",
          "接下来只说这轮的情况：发生了什么、你知道什么。它会分清哪些是事实、哪些是推断、哪些还不知道。",
          "你说错的数可以随时更正，它会撤掉靠这个数得出的判断。",
        ],
      },
      {
        h: "4. 秘书台",
        list: [
          "秘书台默认「主动」：资料一进来就核，制度打架、回款拖了、合同不合规会主动列出来。",
          "每条提醒都写清依据和来源，你裁决后留痕，工作台照裁决版执行。",
          "不想被打扰时可以切到「暂停」。",
        ],
      },
      {
        h: "5. 财务与法务",
        list: [
          "财务工作台：把发票、回单丢进对话框，一句话生成凭证；再一句话出资产负债表和利润表。",
          "法务工作台：把合同丢进去，风险条款原地标出并附建议；按公司模板拟合同草案。",
          "所有产物都是草稿，由你或你的财务／法务确认后才算数。",
        ],
      },
      {
        h: "6. 智能客服",
        list: [
          "把已生效的公司知识接进你现有的电话或网页客服，不换系统。",
          "客户问的每一句，它先翻订单、流程、库存和这位客户的历史，再回答。",
          "答不了、客户急了、连续没进展，它会连同上下文转给人工，不让客户从头再说。",
        ],
      },
    ],
  },

  api: {
    title: "接入文档（API）",
    eyebrow: "接入文档",
    intro: "把 XELITI 的企业理解接进你自己的系统。目前开放客服接口，其余接口按需申请。",
    sections: [
      {
        h: "认证",
        p: "使用企业管理员在管理端签发的机器凭证（OIDC client credentials）。所有请求走 HTTPS，凭证不要放在前端。",
      },
      {
        h: "客服接口",
        code: `POST /api/v1/service/turns
Authorization: Bearer <token>

{
  "session_id": "cs_8f2a…",
  "channel": "web",
  "customer_ref": "crm:10293",
  "text": "最厚的鞋底是哪款"
}

→ 200
{
  "reply": "最厚的是云朵款，鞋底 4.2cm……38 码有货，现在下单今天发。",
  "state": "AI_CONTINUE",
  "evidence": [{ "source": "产品表.xlsx", "version": "v3" }],
  "handoff": null
}`,
      },
      {
        h: "转人工",
        p: "当 state 为 HANDOFF_REQUIRED 时，响应里会带 handoff 包：客户原话、已确认的事实、依据、已做的动作。把它交给你的坐席系统即可。人工未确认接单前，会话不会被标成已解决。",
      },
      {
        h: "限制",
        list: [
          "每个企业默认 60 次／分钟，可申请提高。",
          "接口只读企业已生效的知识，不会返回原始文件。",
          "每次调用都有审计记录，可在管理端导出。",
        ],
      },
    ],
  },

  changelog: {
    title: "更新日志",
    eyebrow: "更新日志",
    intro: "每次发布都在这里记一笔。",
    sections: [
      {
        h: "2026-09 · V1.0 预览",
        list: [
          "推演：同一目标多轮推进，风险在排期中提前冒出，别人的案例可借鉴。",
          "秘书台：主动感知资料变化，制度冲突、财务／法务风险主动上报。",
          "财务工作台：一句话录凭证，一句话出报表。",
          "法务工作台：审合同标风险，按公司模板拟草案。",
          "智能客服：接入既有渠道，结合客户历史与企业资料作答。",
          "桌面版（macOS / Windows）：企业文件夹留在本机。",
        ],
      },
      {
        h: "2026-08 · 内测",
        list: [
          "企业文件夹：版本、出处、可见范围。",
          "统一账号：一个账号登录 Business 与 Personal。",
        ],
      },
    ],
  },

  status: {
    title: "服务状态",
    eyebrow: "服务状态",
    intro: "各服务当前状态。出现异常会在这里第一时间更新。",
    sections: [
      {
        h: "当前状态",
        status: [
          ["网页与登录", "正常"],
          ["Business 工作台", "正常"],
          ["秘书台主动巡查", "正常"],
          ["模型服务", "正常"],
          ["客服接口（API）", "正常"],
          ["桌面版更新", "正常"],
        ],
      },
      { h: "近期事件", list: ["暂无。"] },
    ],
  },

  about: {
    title: "关于 XELITI",
    eyebrow: "关于我们",
    intro: "我们只做一件事：让 AI 真正懂一家企业。",
    sections: [
      {
        h: "我们相信",
        p: "企业里最贵的错误不是答不出来，是答得很顺但没有依据。所以我们不做通用问答，只做一件事：把一家公司的合同、账、制度、目标装进企业大脑，让它给出的每一句话都能指回原文，让风险在发生之前被看见。",
      },
      {
        h: "我们不做什么",
        list: [
          "不替你拍板。它给路、给把握、给代价，选哪条是你的事。",
          "不碰你的原文。资料留在你自己的电脑上。",
          "不装懂。没有依据就说没有依据，没建的能力就说没建。",
        ],
      },
      { h: "团队", p: "一支做过企业软件、做过 AI 系统的小团队，在北京。" },
    ],
  },

  news: {
    title: "新闻与动态",
    eyebrow: "新闻与动态",
    intro: "产品进展和我们在想的事。",
    sections: [
      {
        h: "2026-09 · XELITI Business V1.0 开放试用",
        p: "首批面向财务与法务场景开放。申请试用请见「申请试用」页。",
      },
      {
        h: "2026-08 · 为什么我们不做「企业知识库」",
        p: "把资料塞进一个搜索框，AI 就会拿一份三个月前的制度回答今天的问题。我们选择先分清「资料写了什么」和「公司现在什么状态」，再谈回答。",
      },
    ],
  },

  careers: {
    title: "加入我们",
    eyebrow: "加入我们",
    intro: "如果你也觉得 AI 应该先懂企业，再开口。",
    sections: [
      {
        h: "在招职位",
        list: [
          "产品设计师（B 端）· 北京",
          "前端工程师（Vue / TypeScript）· 北京",
          "后端工程师（Java / Kotlin）· 北京",
          "AI 应用工程师 · 北京",
          "企业客户成功经理 · 北京",
        ],
      },
      {
        h: "怎么投",
        p: `把简历和一段你最得意的作品发到 ${contact.email}，标题写职位名。我们一周内回复。`,
      },
    ],
  },

  contact: {
    title: "联系我们",
    eyebrow: "联系我们",
    intro: "有问题、想合作、想试用，都从这里来。",
    sections: [
      {
        h: "联系方式",
        list: [
          `商务合作：${contact.sales}`,
          `产品支持：${contact.support}`,
          `其他：${contact.email}`,
          `微信公众号：${contact.wechat}`,
        ],
      },
      { h: "地址", p: `${contact.address}（详细地址待填）` },
    ],
  },

  trial: {
    title: "申请试用",
    eyebrow: "申请试用",
    intro: "30 天，不限功能。留下信息，我们一个工作日内联系你开通。",
    sections: [
      {
        h: "适合谁",
        list: [
          "50–500 人、有专职财务或法务的公司。",
          "老板或经营负责人愿意亲自用秘书台。",
          "愿意把真实的制度、合同、报表放进企业文件夹试。",
        ],
      },
      {
        h: "试用流程",
        list: [
          "填写公司名、联系人、行业、大概人数。",
          "我们开通账号并发送桌面版。",
          "30 分钟远程上手，帮你选好企业文件夹、立第一个目标。",
          "30 天后一起看：它替你省了什么、提前看见了什么。",
        ],
      },
      {
        h: "现在申请",
        p: `发邮件到 ${contact.sales}，或在公众号留言「试用」。（网页表单待接入）`,
      },
    ],
  },

  download: {
    title: "桌面版下载",
    eyebrow: "桌面版",
    intro: "企业文件夹留在你自己的电脑上，所以需要桌面版。",
    sections: [
      {
        h: "系统要求",
        list: [
          "macOS 13 或 Windows 10 及以上。",
          "4 GB 可用磁盘空间。",
          "需要网络连接以登录与调用模型；资料本身不离开本机。",
        ],
      },
      {
        h: "安装后",
        list: ["用统一账号登录。", "选一个文件夹作为企业文件夹。", "打开工作台，立第一个目标。"],
      },
    ],
  },

  security: {
    title: "安全与数据边界",
    eyebrow: "安全",
    intro: "你的资料怎么被使用，写清楚。",
    sections: [
      {
        h: "三条硬规矩",
        list: [
          "原文留在本机。桌面版只读你授权的文件夹，不上传原文。",
          "三份授权分开：本地读取、送模型处理、片段外发，是三件事，各自授权，各自可撤。",
          "模型零写权。AI 只能提候选；落库、生效、裁决都在受控的写入口和人手里。",
        ],
      },
      {
        h: "送模型的是什么",
        p: "只送回答当前问题所需的最小片段，并记录送了哪一段、发给谁、什么时候。不会用你的资料训练模型。",
      },
      { h: "审计", p: "每一次读取、处理、外发、人工裁决都有记录，管理端可查可导出。" },
      {
        h: "账号与权限",
        p: "统一账号中心负责身份；谁能看到哪份资料由企业在资料库里设；客服接口只读已生效的知识，永远拿不到原始文件。",
      },
    ],
  },

  privacy: {
    title: "隐私政策",
    eyebrow: "隐私政策",
    intro: "生效日期：2026-09-01。",
    legal: true,
    sections: [
      {
        h: "1. 我们收集什么",
        list: [
          "账号信息：邮箱、手机号、公司名。",
          "使用信息：登录时间、功能使用记录、错误日志。",
          "企业资料：只在你的设备上读取；送模型处理的片段按你授权的范围处理，处理完不保留。",
        ],
      },
      {
        h: "2. 我们怎么用",
        list: ["提供和改进服务。", "安全与审计。", "不会把你的企业资料用于训练模型，不会卖给第三方。"],
      },
      {
        h: "3. 保存多久",
        p: "账号信息在账号存续期间保存；注销后 30 天内删除。企业原文从不上传，因此无需删除。",
      },
      {
        h: "4. 你的权利",
        p: `你可以随时查看、更正、导出或删除你的账号信息，撤回任何一次授权。写信到 ${contact.support}。`,
      },
      { h: "5. 联系", p: `隐私相关问题：${contact.support}。` },
    ],
  },

  terms: {
    title: "服务条款",
    eyebrow: "服务条款",
    intro: "生效日期：2026-09-01。",
    legal: true,
    sections: [
      {
        h: "1. 服务内容",
        p: "XELITI 向企业提供基于其自有资料的 AI 推演、提醒、财务法务辅助与客服能力。所有输出为辅助性建议，最终决定与法律责任由企业自行承担。",
      },
      {
        h: "2. 账号",
        p: "一个账号对应一个自然人；企业管理员负责本企业成员的开通与权限。请妥善保管凭证。",
      },
      {
        h: "3. 你的资料",
        p: "你对放入企业文件夹的资料拥有全部权利，并确认有权使用它们。我们不取得任何所有权。",
      },
      {
        h: "4. 禁止行为",
        list: ["用于违法用途。", "试图绕过授权边界获取他人资料。", "对服务进行逆向、爬取或压力攻击。"],
      },
      { h: "5. 费用", p: "试用期免费；正式订阅按合同约定。" },
      {
        h: "6. 免责与限制",
        p: "服务按「现状」提供。对于因使用输出做出的商业决定造成的损失，我们的责任以你过去 12 个月支付的费用为限。",
      },
      { h: "7. 变更与终止", p: "条款变更提前 30 天通知。你可随时停用；我们在你严重违约时可终止服务。" },
    ],
  },

  cookies: {
    title: "Cookie 说明",
    eyebrow: "Cookie",
    intro: "我们只用必要的 Cookie。",
    legal: true,
    sections: [
      { h: "用到的", list: ["登录会话：保持你的登录状态。", "偏好：记住你的语言与界面设置。"] },
      { h: "没用到的", p: "不用广告 Cookie，不做跨站跟踪。" },
    ],
  },
};

export const pageSlugs = Object.keys(pages);

/**
 * 全站文案的出厂默认稿。管理端保存后由运行时覆盖，取不到时就用这一份，
 * 所以官网永远能完整渲染，不依赖管理端在不在。
 */
export const defaultSiteContent: SiteContent = { brand, contact, nav, home, cta, footerColumns, pages };
