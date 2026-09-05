# R8 静态测试交付

目标仅为 `https://twww.linzhaozhao.com`。R8 设计、动画、Personal 和现有 OIDC 客户端保持封板内容。此说明与 nginx 片段是候选交付材料；独立复核、主线整合、推送、浏览器 QA 和实际部署由统筹后续完成。

## 构建和检查

使用已安装的 Node/npm/Vinext 与锁定依赖。构建前，在 Root 协调仓执行现有 S3 gate，保留其输出；本阶段指定清单不得改写：

```bash
python3 scripts/verify-goal008-cross-repo-baseline-s3.py \
  --candidate-manifest tmp/website-r8-test-release-20260905-candidate.json \
  --require-tags --offline
```

上述清单是已提供的基线门禁输入，不代替最终源 SHA 的审查或发布身份。统筹在独立复核和整合后，须对最终主线发布清单再次运行同一 S3 gate，再构建、上传、切换或停止旧服务。

在干净 Website 候选中只提供以下公开输入，不读取私有 `.env`、服务环境或密钥：

```bash
export NEXT_PUBLIC_SITE_URL=https://twww.linzhaozhao.com
export PLATFORM_ACCOUNT_CENTER_ISSUER=https://tqy.linzhaozhao.com
export WEBSITE_CANONICAL_ORIGIN=https://twww.linzhaozhao.com
npm test
npx tsc --noEmit
git diff --check
```

`npm test` 已包含普通单元测试、lint 和 build，无需重复构建。Vite 在 prerender 前检查这三个公开输入，只接受确认值及可选结尾 `/`。缺失、无效、带路径/凭据/查询参数或未批准的来源均明确报错，错误不打印被拒绝的值。框架自身会加载环境文件，因此本次使用无 `.env*` 文件的候选和明确进程变量，不接入私有环境文件。页面/RSC 编译配置固定为校验后的公开值。

页面使用 Vinext 原生 `output: "export"`。Vite 的客户端构建插件通过 Rollup `emitFile` 复用现有 robots/sitemap GET 响应，以已验证的站点来源构造 Request。没有新增导出脚本、依赖、测试 runner 或身份实现。

五条公开路径必须有实际文件，不能只看 build 的退出码：

| 公开路径 | `dist/client` 内文件 |
| --- | --- |
| `/` | `index.html`，并保留 `index.rsc` |
| `/auth/callback` | `auth/callback.html`，并保留 `auth/callback.rsc` |
| `/personal/` | `personal/index.html`，与原 public 文件逐字节一致 |
| `/robots.txt` | `robots.txt`，Sitemap 指向测试来源 |
| `/sitemap.xml` | `sitemap.xml`，loc 指向测试来源 |

用普通文件列表、`cmp`、内容检查和 SHA-256 记录检查结果。检查首页与 callback HTML/RSC 的 issuer、分享图 URL 和 OIDC 实际请求目标。第三方 JS 中用于 URL 解析/非浏览器后备的 localhost 常量不是配置目的地，不因全局字符串计数修改 vendor 或 OIDC。

`WEBSITE_CANONICAL_ORIGIN` 约束构建来源一致性。现有 OIDC 的 redirect/silent redirect 为浏览器来源加 `/auth/callback`，登出返回浏览器来源 `/`，仍使用原 `xeliti-website` 客户端、PKCE 与浏览器存储。它不靠 nginx 环境变量重新配置；必须在真实 twww 来源验证登录跳转。

## 制品与 nginx

只将 `dist/client/` 内容按以下布局放入新的不可变发布目录：

```text
/opt/massos/website/releases/<reviewed-release>/dist/client/
/opt/massos/website/current -> releases/<reviewed-release>
```

不得上传整个 `dist`、`dist/server`、SSR/prerender 中间文件、源码、node_modules 或隐藏文件。保留完整客户端资产和 RSC，不手动裁剪动画。记录精确源 SHA、客户端文件清单/摘要与发布包 SHA-256，并将公网 bytes 与该构件比对。

将 [`deploy/nginx-twww-static.conf`](../deploy/nginx-twww-static.conf) 的指令应用于**现有 twww HTTPS server 内部**，替换该 server 的旧 Website proxy location。它不是新虚拟主机或完整 nginx 主配置。保留原 listen、server_name、TLS、证书续期 ACME 专用路由及其他域名；先检查原块中是否有冲突的 location、root、缓存或 error_page 指令，消除的仅限本次替换的 twww 指令。

该片段将 callback（含尾斜杠）映射到 `auth/callback.html`，保留查询参数；Personal 无尾斜杠重定向至 `/personal/`。`/.rsc` 映射 `index.rsc`，其他 `.rsc` 使用 `text/x-component`。未知路径返回 404，不能把账号/API 请求兜底成首页。隐藏路径、server、dist、node_modules 与 `__vinext` 路径拒绝访问；`/.rsc` 是精确匹配例外。禁止目录浏览，默认不缓存可变入口。

仅在前置审查与 S3 通过后，由统筹创建新目录、校验制品、原子切换 Website current，并执行 `nginx -t`；成功才 reload nginx。静态路径验证通过后，只停止现有 `massos-website.service`（systemctl 简写 `massos-website`）。不改写/删除这个 unit，不触碰相邻服务或站点。若主机策略需要调整开机状态，另行记录原值并在回滚恢复。

必须检查 `/`、带查询参数的 `/auth/callback`、`/personal/`、robots、sitemap、`/.rsc`、`/auth/callback.rsc` 的状态、Content-Type 和 bytes；同时验证未知路径、隐藏路径和 server 路径为 404。真实浏览器检查桌面/手机布局、滚动/指针、播放/暂停/重播、导航及账号入口重定向，观察请求目标和新运行错误。已知手机 LCP 限制保留，本次未承诺性能修复。

## 已知前态与回滚

统筹 2026-09-05 只读预检记录的前态（部署前仍须核对是否漂移）：

- Website current：`/opt/massos/website/releases/card561-20260825-3ce74ef-r2`。
- 既有 unit：`massos-website.service`，原 Website Node 端口 `127.0.0.1:4000`。
- 原 `massos-goal007.conf` 的 twww `location /` 代理 `http://127.0.0.1:4000`。

切换前保存精确 twww stanza、所属配置文件路径及摘要、current 目标、unit 原状态与 unit 文件摘要；不要读取/记录服务环境和凭据。若共享配置文件含相邻域名，记录相邻块摘要以证明未变。前态不匹配即停止切换，由统筹处理冲突。

失败时保留两个发布目录。先确认 current 和 twww 配置仍是本次激活记录的版本，避免覆盖他人后续更改；确认旧发布目录和原 unit 可用，再执行以下**仅 Website** 恢复步骤：

1. 原子恢复 current。以下 Linux 命令的临时链接名必须事先确认不存在：

   ```bash
   sudo ln -s /opt/massos/website/releases/card561-20260825-3ce74ef-r2 /opt/massos/website/current.card647-rollback
   sudo mv -Tf /opt/massos/website/current.card647-rollback /opt/massos/website/current
   sudo systemctl start massos-website
   ```

2. 验证原 Website 在 `http://127.0.0.1:4000/` 正常响应。若失败，保留证据并停止，不影响其他服务。
3. 只恢复保存的 twww proxy stanza，移除本次 twww 静态指令，保持其他域名逐字节不变。不要用整个旧共享配置文件覆盖相邻更改。
4. 运行 `sudo nginx -t`，通过后才执行 `sudo systemctl reload nginx`。失败时修正或撤销本次 twww 配置编辑，不能带错 reload。
5. 核对 current 精确指向旧版本、unit 恢复原状态，并按旧版行为检查公网首页、callback 和 Personal。记录失败原因、恢复后的公网证据与两个版本身份，不删除旧构件或历史记录。

这些是统筹后续执行步骤，本候选编写和本地检查没有执行 SSH、服务器写入、上线切换或回滚。
