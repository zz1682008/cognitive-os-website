# XELITI 官网

XELITI 官网第九版（2026-09-07 改版）。沿用灰白、深色文字与橙色品牌语言，主线只讲三件事：企业大脑、推演、智能客服，第一期主打的财务与法务各占一屏。每一屏用会动的界面演示说话，文字只留一句标题。设计稿见 `doc/design/website-redesign-2026-09-07/`（在 Root 仓库）；官网表达不代表相关后台能力已交付。

首页顺序：首屏点阵拼出 XELITI（鼠标推开、点按炸开）→ 企业大脑（公司的资料、账、制度、目标从核里长出来）+ 秘书台窗口 → 推演（未来的风险与别人的经验提前搬到眼前）→ 财务（发票吸进对话框，凭证与报表长出来）→ 法务（一道光扫过合同，风险条款原地泛红并附建议）→ 智能客服（升级前后两部手机）→ 品牌收尾。

产品菜单只有三项：XELITI Business（企业端）、智能客服、XELITI Personal（个人端）。

底部与二级页由 `app/lib/site-content.ts` 单一数据源驱动，共 15 个页面：帮助中心、使用文档、接入文档、更新日志、服务状态、关于、新闻、加入我们、联系我们、申请试用、桌面版下载、安全与数据边界、隐私政策、服务条款、Cookie 说明。这份数据将来由管理端维护，改一处全站生效；当前是默认稿，试用报价、详细地址、备案号处标注「待填」。

所有演示使用硬编码示例数据，无真实企业数据或模型调用。演示进入视野各自播放一次，可点击重播；`prefers-reduced-motion` 下直接呈现完整结果。

仅修改公开展示；保留现有统一账号入口与 OIDC 协议，不新增认证、支付、后台能力或桌面安装包。个人产品入口 `/personal/` 保持原样。

## 环境要求

- Node.js `>=22.13.0`

## 静态构建与本地预览

本候选只面向已确认的测试站点 `https://twww.linzhaozhao.com`。构建前必须显式提供三个公开输入；缺失、无效或其他目标会报错，不回退到生产或 localhost。复用已安装依赖；首次安装使用 `npm ci`，不升级依赖。发布构建前先通过既有 Root S3 gate，命令与交付步骤见 [静态部署说明](docs/static-deployment.md)。

```bash
export NEXT_PUBLIC_SITE_URL=https://twww.linzhaozhao.com
export PLATFORM_ACCOUNT_CENTER_ISSUER=https://tqy.linzhaozhao.com
export WEBSITE_CANONICAL_ORIGIN=https://twww.linzhaozhao.com
npm run build
# 仅供本机检查静态文件；上线使用 nginx。
python3 -m http.server 3012 --bind 127.0.0.1 --directory dist/client
```

此简易本地文件服务可查看 `/`、`/personal/` 和 `/auth/callback.html`，不包含 nginx 的 extensionless callback / RSC 路由映射，不能代替部署配置或真实测试域名登录验收。本机来源也不会变成已注册的测试域名回调。开发模式可在相同公开输入下使用 `npm run dev`。

Vinext 原生导出页面与 RSC；现有 Vite 构建通过 `emitFile` 复用 robots/sitemap 的 GET 响应，Personal 沿用 `public/personal/index.html`。只交付 `dist/client`，`dist/server` 是本机构建中间结果，不能上传或公开。nginx 路由见 [twww 配置](deploy/nginx-twww-static.conf)。无需官网常驻 Node/Worker，也不调用 Sites 发布。

页面和 RSC 固定使用上述站点与 issuer。`WEBSITE_CANONICAL_ORIGIN` 是构建一致性约束；现有浏览器 OIDC 仍通过 `window.location.origin` 生成 callback 和登出回跳，协议及存储逻辑不变。nginx 运行时设置环境变量不会改变构件，变更目标必须重新确认并构建。

## 项目结构

- `app/page.tsx`：首页内容与语义结构
- `app/[slug]/page.tsx`：由 `site-content.ts` 渲染的 15 个二级页
- `app/lib/site-content.ts`：底部导航、二级页正文、联系方式与备案信息的单一数据源（管理端维护面）
- `app/components/site-header.tsx` / `site-footer.tsx`：全站头尾
- `app/components/hero-dots.tsx`：首屏点阵 XELITI，指针推开与爆炸冲击波
- `app/components/enterprise-brain.tsx`：企业大脑的核与往外生长的资料流
- `app/components/foresight.tsx`：推演路径与提前冒出的风险节点
- `app/components/finance-scene.tsx` / `legal-scene.tsx` / `service-scene.tsx` / `secretary-window.tsx`：四段界面演示
- `app/components/motion.tsx`：滚动进场、演示播放与重播的公共边界
- `app/components/platform-download.tsx`：复用现有版本配置的桌面下载入口
- `app/globals.css`：视觉系统与响应式布局
- `app/layout.tsx`：中文页面元数据与字体设置
- `public/favicon.svg`：站点图标
- `public/og-business-r5.webp`：当前抽象信号首页实际渲染的分享图
- 历史脑图、概念图和旧分享图保留，不再用于当前首页
- `.openai/hosting.json`：保留 Sites 托管配置；当前没有数据库或存储绑定

## 质量检查

- `npm run lint`：静态代码检查
- `npm run build`：完整静态构建，使用上述公开输入
- `npm test`：通过现有 Node test 入口运行协议、站点内容与静态配置/资产生成测试，再执行 lint 和静态构建
- `npx tsc --noEmit`、`git diff --check`：类型及补丁检查
- 浏览器：电脑／手机／窄屏、亮色／深色、减少动态效果、无脚本后备、指针形变与页面级暂停、所有章节无需点击、导航与图片加载

旧版首页组件与 `scripts/verify-xeliti-brand.mjs` 保留为历史来源；后者约束旧版固定文案，不作为本次新设计的验收入口，不新增逐任务验证工具。

本候选完成构建适配不代表已合并、独立复核或上线。桌面/手机布局、滚动和指针动画、工作台播放/暂停/重播、导航、账号跳转由统筹对精确构件做浏览器 QA；已知手机 LCP 边界保留，本次不做性能或设计改动。

隔离工作树与分支：`codex/website-v1-redesign-20260905`。老板确认 R8 后进入 Git 封板，线上部署另行核验并记录，不能由 Git 标签推断已上线。本轮客服过程设计与自查见 [第八版记录](docs/website-service-r8.md)；[第七版自然语言办公](docs/website-natural-work-r7.md)、[第五版](docs/website-signal-r5.md)、[第四版](docs/website-ai-narrative-r4.md)、[第三版](docs/website-result-motion-r3.md) 与 [更早记录](docs/website-v1-redesign.md) 保留历史。财务与法务各有两轮预设对话，发送按钮只重放本轮示例；客服把理解与核对过程嵌入 AI 对话，取消独立的中间文件区，支持自动播放及重播。它是高层产品处理示意，不是模型内部思维实录或实际接入能力验证。报表下载文件含示例标识，与页面算例一致，不是正式企业报表。
