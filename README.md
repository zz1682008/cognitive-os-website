# MASSOS 企业版官网

MASSOS 企业版一期官网。页面围绕“持续理解、料事于先、提前防错”展开，展示系统如何持续理解企业背景，在关键决策前梳理事实、风险、连锁影响和下一步。

一期只包含公开官网和本地演示数据，不包含 C 端、登录授权、支付、后台或真实桌面安装包。

## 环境要求

- Node.js `>=22.13.0`

## 本地预览

```bash
npm install
npx next dev --hostname 127.0.0.1 --port 3001
```

当前机器若运行 macOS 13.5 以下版本，Cloudflare `workerd` 无法启动，因此本地预览使用 Next.js 开发服务器；生产构建仍使用 `npm run build`。

正式部署时设置 `NEXT_PUBLIC_SITE_URL` 为网站完整来源地址，例如 `https://www.example.com`。只有设置正式地址后，页面才会输出 Open Graph 和 X 分享图的绝对 URL，避免在本地阶段写入虚假域名。

## 项目结构

- `app/page.tsx`：官网内容与语义结构
- `app/components/decision-chain-demo.tsx`：三项企业任务及节点联动演示
- `app/lib/demo-scenarios.ts`：演示场景与判断链数据
- `app/globals.css`：视觉系统与响应式布局
- `app/layout.tsx`：中文页面元数据与字体设置
- `public/favicon.svg`：站点图标
- `public/og.png`：MASSOS 社交分享图
- `.openai/hosting.json`：保留 Sites 托管配置；当前没有数据库或存储绑定

## 质量检查

- `npm run lint`：静态代码检查
- `npm run build`：完整生产构建
- `npm test`：依次执行以上两项

当前只做本地验收，未提交、未部署。
