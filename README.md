# XELITI 官网

XELITI 官网首页第八版，老板已确认设计定稿，按 V1.0 官网宣传版封板。沿用灰白、深色文字与橙色品牌语言，先整体介绍「让 AI 真正懂你的企业」，再展示自然语言办公的过程和结果。设计封板不代表后台 V1.0 能力交付或网站已上线；Git 版本及发布边界见 [R8 封板记录](docs/website-v1-r8-seal.md)。

展示顺序：产品介绍、抽象神经信号与下载入口 → 目标推演、财务/法务风险及对应方案 → 企业文件夹 → 财务对话录入凭证，再对话生成两张报表 → 法务对话审阅合同，再拟定草案 → 从模板匹配升级为 AI 对话内部的诉求理解、公司资料核对、业务安排，回复仅作收尾 → 秘书工作台冲突提醒 → 点阵企业大脑、翻动资料和各工作结果的整体协同 → 大幅品牌收尾。推演为首个具体产品工作台；官网产品设计不代表相关后台能力已交付，不改变正式版本进度。

保留 B 端左导航、中间工作区、右上下文结构，使用硬编码示例数据演示结果变化。所有场景平铺，不用点选；电脑端进入视野后分别播放知识流动、结果落位、条款标记、理解后回应、风险上报，可暂停、重播，不固定或缩放整页。手机端、减少动态效果和无 JavaScript 模式直接呈现完整结果。真人感头像明确为虚构 AI 形象，无真实企业数据或模型调用。

首屏「下载桌面版」打开原生版本选择框，复用现有 `desktopReleaseConfig`。当前 macOS、Windows URL 均为空，明确告知未配置并禁用下载；接到正式链接后才会出现真实下载地址。

仅修改公开展示；保留现有统一账号入口与 OIDC 协议，不新增认证、支付、后台能力或桌面安装包。个人产品入口保持原样。

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

- `app/page.tsx`：官网内容与语义结构
- `app/components/xeliti-product-stories.tsx`：目标、财务、法务、客服、秘书台和协同图的示例展示
- `app/lib/website-demo.mjs`：同一组示例数据、借贷及报表演算和本地示例 CSV，供页面和普通单元测试使用；不接企业账务系统
- `app/components/xeliti-mobile-menu.tsx`：手机导航与键盘关闭
- `app/components/xeliti-motion.tsx`：GSAP 动画与完整清理边界
- `app/components/xeliti-neural-visual.tsx`：响应指针的原生信号波、抽象点阵脑和资料汇入流场；无脚本 SVG 后备
- `app/components/platform-download.tsx`：复用现有版本配置的桌面下载入口
- `app/globals.css`：视觉系统与响应式布局
- `app/layout.tsx`：中文页面元数据与字体设置
- `public/favicon.svg`：站点图标
- `public/xeliti-folder-v1.webp`：沿用的企业文件夹设计图，另有手机尺寸版本
- `public/xeliti-service-person-r3.webp`：虚构 AI 服务助手形象，另有手机尺寸版本
- `public/og-business-r5.webp`：当前抽象信号首页实际渲染的分享图
- 历史脑图、概念图和旧分享图保留，不再用于当前首页
- `.openai/hosting.json`：保留 Sites 托管配置；当前没有数据库或存储绑定

## 质量检查

- `npm run lint`：静态代码检查
- `npm run build`：完整静态构建，使用上述公开输入
- `npm test`：通过现有 Node test 入口运行协议、示例演算与静态配置/资产生成测试，再执行 lint 和静态构建
- `npx tsc --noEmit`、`git diff --check`：类型及补丁检查
- 浏览器：电脑／手机／窄屏、亮色／深色、减少动态效果、无脚本后备、指针形变与页面级暂停、所有章节无需点击、导航与图片加载

旧版首页组件与 `scripts/verify-xeliti-brand.mjs` 保留为历史来源；后者约束旧版固定文案，不作为本次新设计的验收入口，不新增逐任务验证工具。

本候选完成构建适配不代表已合并、独立复核或上线。桌面/手机布局、滚动和指针动画、工作台播放/暂停/重播、导航、账号跳转由统筹对精确构件做浏览器 QA；已知手机 LCP 边界保留，本次不做性能或设计改动。

隔离工作树与分支：`codex/website-v1-redesign-20260905`。老板确认 R8 后进入 Git 封板，线上部署另行核验并记录，不能由 Git 标签推断已上线。本轮客服过程设计与自查见 [第八版记录](docs/website-service-r8.md)；[第七版自然语言办公](docs/website-natural-work-r7.md)、[第五版](docs/website-signal-r5.md)、[第四版](docs/website-ai-narrative-r4.md)、[第三版](docs/website-result-motion-r3.md) 与 [更早记录](docs/website-v1-redesign.md) 保留历史。财务与法务各有两轮预设对话，发送按钮只重放本轮示例；客服把理解与核对过程嵌入 AI 对话，取消独立的中间文件区，支持自动播放及重播。它是高层产品处理示意，不是模型内部思维实录或实际接入能力验证。报表下载文件含示例标识，与页面算例一致，不是正式企业报表。
