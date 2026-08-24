# XELITI 官网

XELITI 通用认知平台官网。首页说明 Product、Agent Harness、Cognitive Kernel、State / Memory 与 AI-Gateway 的分层关系，并将 Business 呈现为第一个复杂参考产品。

当前只包含公开官网和本地展示内容，不包含登录授权、支付、后台或真实桌面安装包。

## 环境要求

- Node.js `>=22.13.0`

## 本地预览

```bash
npm install
npm run build
npm run start -- --hostname 127.0.0.1 --port 3011
```

本地验收使用生产预览，首页位于 `/`，Personal 静态页位于 `/personal/`。开发模式仍可使用 `npm run dev`；若当前机器的 Cloudflare `workerd` 无法启动，以上生产预览命令不依赖开发模式即可完成两条真实路径的检查。

正式部署时设置 `NEXT_PUBLIC_SITE_URL` 为网站完整来源地址，例如 `https://www.example.com`。只有设置正式地址后，页面才会输出 Open Graph 和 X 分享图的绝对 URL，避免在本地阶段写入虚假域名。

当官网位于反向代理之后并接入统一登录时，还必须设置
`WEBSITE_CANONICAL_ORIGIN` 为浏览器使用的 HTTPS 来源地址。OIDC 回调、登出回跳和
Secure Cookie 都以这个受控来源为准，不采信外部请求头拼接认证地址。

## 项目结构

- `app/page.tsx`：官网内容与语义结构
- `app/components/xeliti-platform-story.tsx`：平台层级故事
- `app/components/xeliti-motion.tsx`：GSAP 动画与完整清理边界
- `app/globals.css`：视觉系统与响应式布局
- `app/layout.tsx`：中文页面元数据与字体设置
- `public/favicon.svg`：站点图标
- `public/og.png`：XELITI 社交分享图
- `.openai/hosting.json`：保留 Sites 托管配置；当前没有数据库或存储绑定

## 质量检查

- `npm run lint`：静态代码检查
- `npm run build`：完整生产构建
- `npm test`：依次执行以上两项
- `node scripts/verify-xeliti-brand.mjs`：品牌、动画依赖和清理边界守卫

当前只做本地验收，未提交、未部署。
