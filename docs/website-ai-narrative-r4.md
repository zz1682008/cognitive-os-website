# 官网第四版：让 AI 真正懂企业

## 本轮边界与设计

老板本轮明确实施指令，补回整体产品介绍、科技动画、下载桌面版；纠正客服机制对比、秘书台工作台归属、企业大脑表达；删除点名的页尾冗余文案。此为一个公开官网呈现结果，不实施任何 GOAL 后台能力。

- Design Read：企业负责人看的 AI 科技产品发布页，清楚说明产品整体，再用知识流入大脑的科技动画和真实 B 端结构演示具体工作。保留灰白/深灰和品牌橙；不是另建品牌。`DESIGN_VARIANCE=8 / MOTION_INTENSITY=8 / VISUAL_DENSITY=3`。
- 前端设计技能用于公开营销页面；页面内工作台沿用上一轮核对过的 B 端左导航/中工作区/右上下文结构和确定性示例模型，不创造新业务引擎。
- 审视 R3：保留财务与法务不同的结果动效、目标风险与右侧方案、企业文件夹、品牌标识、无障碍与移动阅读。退役大人物占主位的客服聊天拼贴、工作台外的秘书台、静态方框企业大脑图和老板点名的微文案。
- 文案关系：整体产品介绍为首页起点；“决策前，先推演”仍为首个具体产品工作台。客服明确对照“关键词 → 预设答案”与“企业知识结构化 + 用户意图 → 理解后回应”。企业知识的汇入只作产品概念动画，不表示文件自动上传、不表示所有资料自动成为有效事实或训练数据。
- 下载：复用 `app/lib/product-config.ts` 的唯一现有版本配置；当前两个 URL 均为空。补回首页下载按钮及版本对话框；无 URL 时如实提示，不造包、不发布、不接支付/预约/外部表单。已向老板非阻塞询问正式链接。
- 取消用户点名的长篇演示说明，保留工作台内简短“交互演示/设计示意”和 AI 形象标记，不宣称是生产实况。
- L0 §3/4/6/13：Website 只有公开呈现和现有账号入口。无新知识/事实/AI/材料写者，无后台 API、目录访问、模型调用或真实数据。
- 新任务 inspect：PREPARE_NEW_TASK_ADMISSION，无 blockers；现有任务仅作冲突输入，不接管。主线 clean，HEAD `3ce74ef830545d6a7ce329831659158715f8f8fa`；继续当前官网独立候选 `codex/website-v1-redesign-20260905`，不修改主线或其他工作树。
- 现有轻量入口结果：`TASK-E180FB50530B / SINGLE_TASK / ordinary_change / LIGHTWEIGHT / autonomous`，`contract_ready=true`、`dispatch_allowed=true`、`branch_required=true`，无风险项。
- 实施为低风险可逆公开 UI；自己实现、测试和自查，不称独立复核。普通测试/构建、真实浏览器、Lighthouse 是证据，无新增专用验收或截图脚本。
- 范围：`app/page.tsx`、`app/globals.css`、`app/layout.tsx`、`app/components/xeliti-motion.tsx`、`app/components/xeliti-product-stories.tsx`、`app/components/xeliti-mobile-menu.tsx`、`app/components/platform-download.tsx`、`app/components/xeliti-neural-visual.tsx`、`public/xeliti-brain-r4.webp`、`public/xeliti-brain-r4-mobile.webp`、`public/og-business-r4.webp`、`README.md`、本记录。下载链接如老板提供再核实是否纳入原配置；不暗改来源。
- 当前一轮内交付本地候选；停止于老板视觉验收前。无提交、合并、推送、上线或台账状态变化。历史素材与 R3 记录保留。
- 实页检查追加同范围可访问性修正：`app/components/account-session.tsx` 只调整账号按钮的 `aria-label`，让其包含当前可见文字（Lighthouse 检出旧标签与可见文字不匹配）；不调整身份协议、状态或调用。未扩展到后台或认证实现。

## 验收

首页首屏能读懂产品并看到下载入口；客服机制对比清楚且不靠长文；秘书台内容全在工作台；知识汇入可辨认的大脑并连接财务、法务、客服、秘书台；动作随浏览出现、可暂停/重播，移动与 reduced-motion 完整可读；点名删除文案不存在；下载未配置时无死链与假成功；电脑/手机/窄屏及明暗模式无溢出；7 项现有测试、lint、构建、TypeScript 及真实页面自查。

## 核心视觉与素材

- 使用 imagegen 工具：`stylized-concept` 新图生成，再用首轮本地图片作参考编辑；不是手绘 SVG 替代核心视觉。围绕大脑的关系线、知识包、工作台结果是页面原生结构与 GSAP 动画。
- 首轮原图：`/Users/zhaozhao/.codex/generated_images/01a07041-9eb9-7fc1-a36e-80697adcc4d3/exec-d84647a5-96a4-443f-bfe9-dcc22792ff1e.png`。检查发现棋盘格是 RGB 背景而非 alpha，未采用该图。
- 选用编辑后原图：`/Users/zhaozhao/.codex/generated_images/01a07041-9eb9-7fc1-a36e-80697adcc4d3/exec-0497e1e4-b1a6-48bc-81ba-202744c9c72a.png`。实际输出为 RGB 白底，并非透明 PNG；不再宣称具有 alpha。通过页面级混合模式融入相应明暗背景，原文件保留。
- 成品：`public/xeliti-brain-r4.webp`（960 × 960，225,758 bytes）；`public/xeliti-brain-r4-mobile.webp`（480 × 480，43,028 bytes）；手机编码由首轮 69,386 bytes 缩到 43,028 bytes，使用实际小屏确认。
- `public/og-business-r4.webp`（1320 × 704，69,122 bytes）直接来自本轮首屏真实浏览器截图，保留页面左右边距，不是另造宣传页面。
- 复用 R3 虚构 AI 形象仅作小头像并保留 AI 标记，不声称是真人员工；素材不含真实企业或客户数据。

首轮生成提示词：

```text
Use case: stylized-concept. Asset type: transparent hero visual for XELITI, a premium enterprise AI technology website. Create a single unmistakably human-brain-shaped computational neural sculpture, viewed in elegant three-quarter view slightly from above, frontal lobes oriented toward the left. Clearly recognizable left and right cerebral hemispheres and intricate folded cortex, but entirely non-biological: thousands of very fine graphite-silver conductive filaments and tiny precision nodes forming the gyri and sulci, sparse warm burnt-orange impulses traversing a few neural routes. The result should feel like a major AI research company product launch rendered by a high-end 3D studio: physically dimensional, precise, quiet, sophisticated, not a medical organ. Metallic graphite inner structure with silver edges, restrained orange #d65732 connectivity highlights, readable on BOTH pale gray and dark charcoal backgrounds. Centered square composition, sculpture occupies about 78 percent of the frame with clean breathing room, no base or pedestal. Soft neutral studio lighting, clean crisp intricate surface, transparent internal gaps where possible, genuine transparent alpha background. NO background color, NO floor, NO cast shadow outside the object, NO fog or ambient cloud, NO purple or blue, NO glass dome, NO circuit-board square chip, NO sphere, NO surrounding orbital rings, NO text, NO logos, NO arrows, NO documents, NO UI, NO labels, NO watermark. This is a conceptual visualization of a company AI brain, not a claim about neuroscience.
```

编辑提示词：

```text
Edit this exact neural brain sculpture asset. Preserve its entire subject, detailed graphite and silver conductive neural filaments, subtle orange pulses, composition, scale, orientation, and silhouette. Remove the ENTIRE gray-and-white checkerboard background. The checkerboard in the input is painted RGB, not actual transparency; replace it with genuine alpha transparency. The output must be a PNG with an alpha channel and truly transparent pixels surrounding the brain. Do NOT draw a transparency grid or checkerboard or any background color. Keep just the clean isolated 3D brain sculpture. Do not add any text, labels, frame, base, floor, shadow, or visual effects.
```

## 当前结果

本地候选已完成实现与自查，待老板视觉验收；未提交、未合并、未推送、未部署，不代表正式产品能力或桌面版已发布。

- `npm test`：7 项普通测试、ESLint、生产构建通过；`npx tsc --noEmit` 与 `git diff --check` 通过。没有新增逐任务验证器。
- 最终桌面 Lighthouse：Performance 99 / Accessibility 100 / Best Practices 96 / SEO 100；LCP 0.9 s，CLS 0。手机压缩素材后的检查为 84 / 100 / 96 / 100，LCP 3.5 s，CLS 0；低速手机加载仍有优化空间，不把桌面分数泛化为全设备表现。
- Best Practices 扣分是既有本地账号中心 `127.0.0.1:5200/.well-known/openid-configuration` 连接被拒绝。本轮没有修改、启动该共享服务，不声明登录链路验收通过。账号标签与风险组的 ARIA 问题已经在最终桌面检查中归零。
- 1440 × 1000、390 × 844、320 × 740 实页检查：主页面无横向溢出；顶部介绍和下载入口可见；客服左右机制、秘书台内提醒、移动大脑上进下出的关系清楚。Personal 真实入口仍到达原页面。
- 大脑动画：知识包真实沿路径移动；暂停前后位置一致，继续后完整结束。协同动画先显示企业理解，再依次出现四模块；无无限循环或整页缩放。
- 客服时序实测：约 2.3 s 企业知识与用户意图已出现，回答仍隐藏；播放结束后两段自然回答完整可见。秘书台先进入 3 份资料，再出现 3 项风险与右侧上下文，计数终值 3。
- `prefers-reduced-motion`、手机和无 JavaScript：无动态初始化，风险、回答、模块与示例终值完整可读；数值为 10 / 56 / 128 / 94.6 / 33.4 / 3。明暗主题、大脑背景融合及暂停重播已检查。
- 下载弹窗可打开，Escape 关闭后焦点回到按钮；当前无下载地址、无伪下载链接，两平台下载项禁用。仍待正式安装包链接，不造包、不发布。页面已去除老板点名的三组冗余文案。
- 证据目录：`/tmp/xeliti-r4-visual.OKhnqH/`，含首屏、客服、秘书台、企业大脑、手机/窄屏/深色/无脚本截图及 Lighthouse JSON。最终预览 `http://127.0.0.1:3011/?revision=r4-verified`。
- 交付前复核官网主线仍 clean，HEAD `3ce74ef830545d6a7ce329831659158715f8f8fa`。本轮修改限本记录的 13 条路径与追加的账号按钮朗读标签；R1–R3 原有候选、素材和其他任务未覆盖。
