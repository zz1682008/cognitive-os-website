# 官网第三版：结果变化，而非截图缩放

## 当前局部合同

- Intake：`TASK-B47C9A253231`，`ordinary_change / LIGHTWEIGHT / autonomous`；2026-09-05 老板本轮明确要求即开始授权。
- 单一结果：官网通过连续可见、自动播放且可暂停的产品演示，讲清目标推演、财务/法务结果、自然客服、秘书台风险和企业大脑协同。
- 新的老板方向覆盖上一版展示优先级：推演提升为首屏主线，不再放成 V1.2 页尾小字；这只改变营销呈现，不宣布后台能力已交付，不改 GOAL 进度或产品权限。
- 设计解读：面向企业负责人和财法人员的产品官网，保留灰白橙品牌，以 Apple 风格的干净舞台和有明确因果的结果动效呈现。`DESIGN_VARIANCE=7 / MOTION_INTENSITY=6 / VISUAL_DENSITY=4`。沿用原生 CSS、React、现有 GSAP，不引入新依赖。
- 审视结论：退役四次相同 pin + scale 截图；保留既有账号、URL、品牌文字、导航、Personal 页面。财务用结果依次落位，法务用文档展开与标记，秘书台用资料入场后提醒出现。真人感客服头像明确为 AI 生成形象，不冒充员工、客户或真实视频通话。
- B 端参考沿用上一版已核实的左导航、中间工作区、右上下文结构。可变化的内容改为页面内的原生演示组件：只对硬编码示例数据作确定性演算，无自由输入、无文件读取、无上传、无外发、无模型/API 调用或持久状态。组件不是 Business 的财法执行引擎。
- 企业大脑图是老板指定的产品协同示意，不是新后端服务或新的事实/知识权威。L0 §3/4/6/13 继续约束 Website 仅公开呈现。
- 风险：低。无业务数据、权限、认证、后台、共享写者或部署变化。独立复核不要求，理由为可逆的公开页面和纯示例动画；自查不称独审。
- 范围：同一独立 Website 工作树及其自有 3011 预览，仍在 `codex/website-v1-redesign-20260905`。已核实主线 clean，HEAD `3ce74ef830545d6a7ce329831659158715f8f8fa`。新任务 inspect 允许准入，其他 Root/Kernel/Gateway 活跃任务仅作冲突输入，不接管。
- 本轮预期路径：`app/page.tsx`、`app/globals.css`、`app/layout.tsx`、`app/components/xeliti-motion.tsx`、`app/components/xeliti-product-stories.tsx`、`app/lib/website-demo.mjs`、`app/lib/website-demo.d.mts`、`test/website-demo.test.mjs`、`public/xeliti-service-person-r3.webp`、`public/xeliti-service-person-r3-mobile.webp`、`public/og-business-r3.webp`、`README.md`、本记录。旧版素材与演示组件保留历史，但不再由当前首页导入。
- 验收：真实浏览器至少观察每种演示的开始、中间和最终状态；财务三种结果、法务条款/建议、秘书台冲突、首屏风险/方案完整；暂停/重播有效；减少动态效果和无 JavaScript 时全部内容静态可见；电脑/手机/窄屏、明暗主题无溢出，链接可用。
- 普通测试：原 `npm test` 加同一 Node 测试入口内的示例演算测试，真实页面检查，Lighthouse。无专用验证脚本、截图脚本或验收工具。
- 停止条件：交付本地可查看候选，等老板看视觉；不合并、不推送、不部署、不发布、不写共享项目台账。旧安装包准备状态不变。

本轮页面检查补充：手机菜单的“秘书台与目标”旧标签需要随首屏优先级同步为“目标推演”“秘书台”两个准确入口。因此范围包含 `app/components/xeliti-mobile-menu.tsx` 的公开导航文案；不改变其交互、账号或权限。

## 当前交付状态

已完成本地候选实现和页面自查，等待老板视觉验收。未提交、未合并、未推送、未部署或发布；不代表 B 端能力上线。

### 素材与生成方式

- 实际模式：内置 imagegen，新图生成；无参考图编辑、无 CLI 或 API 回退。生成一张虚构的中国女性 AI 服务助手肖像；由页面负责明确标注 AI 形象，未制作假员工、假证言或假视频通话。
- 保留原图：`/Users/zhaozhao/.codex/generated_images/01a07041-9eb9-7fc1-a36e-80697adcc4d3/exec-cdfec87d-4cc7-41a7-a4f0-8d2c8f75c0fe.png`。
- 页面输出：`public/xeliti-service-person-r3.webp`，960 × 1200，78,024 字节；`public/xeliti-service-person-r3-mobile.webp`，540 × 675，25,544 字节。只缩小并编码为 WebP，原图保留。
- 分享图：`public/og-business-r3.webp`，1320 × 704，50,928 字节。来源是当前首页实际渲染的首屏，不是生成的假界面；原始截图 `/tmp/xeliti-r3-visual.8oZ3K0/hero.png`。元数据尺寸已同步。
- 其余变化由原生页面组件完成；两张响应式图片用原生 picture 与懒加载，不加载不必要的客户端图片运行时。没有新增包或配置。

实际提交的完整肖像提示词：

```text
Use case: photorealistic-natural. Asset type: portrait for XELITI Business AI service-assistant demonstration on a business website. Create a photorealistic portrait of a fictional Chinese woman around 32 years old, warm intelligent attentive expression, making natural eye contact as if listening thoughtfully during a conversation, a gentle authentic half-smile with subtly parted lips, not an exaggerated sales smile. Contemporary charcoal soft tailored overshirt over an off-white crewneck, dark shoulder-length hair casually tucked behind one ear, minimal natural makeup, realistic skin pores and texture. Waist-up seated framing, hands naturally relaxed near bottom edge, NOT pointing or waving. Portrait 4:5, subject centered, softly lit almost-white cool-gray modern office background with restrained diffuse daylight, no identifiable office and no company logos. Premium calm editorial photography, natural 50mm lens perspective, neutral colors matching cool gray #f4f6f7 and charcoal. No headset, no microphone, no laptop, no text, no UI, no illustration, no robot, no neon, no glamour retouching. This is a fictional AI-presenter visualization, not a real staff member or testimonial. The website will label it as an AI-generated service-assistant image.
```

### 已执行检查

- `npm test`：7/7 普通单元测试通过；lint 和生产构建通过。现有四项账号协议测试未改。`npx tsc --noEmit`、`git diff --check` 通过。
- 使用 Chrome 对当前 3011 生产预览自查；不是独立复核或老板验收。电脑 1689 × 860、1280 × 900；手机 390 × 844、320 × 740。上述视口无横向溢出；窄屏所有场景保持连续阅读，自动选用手机图片。
- 五种演示均观察了开始、中间与结束：目标先显两条风险再显方案；财务中途为凭证/报表已出现、利润表未出现，最终为 128 / 94.6 / 33.4 万元；法务第二条高亮展开时建议尚未出现；客服逐句出现；秘书台逐条提示，最终三项问题。重播有效；暂停后多次读取保持同一状态，继续播放后完成。
- 滚动触发改为工作区大部分进入视野后开始；按短视口调整阈值。离开视野、后台页暂停；不钉住页面、不拦截滚轮、不缩放整个工作台、不循环播放。完整示例均由服务端输出。
- 实测 reduced-motion 动态切换后清理全部动画，五个场景均无 motion 状态、隐藏结果为 0，数字恢复为 10 / 56 / 128 / 94.6 / 33.4 / 3；关闭脚本重新加载后结果亦全部可见。手机不加载场景动效。
- 亮色和深色分别查看，真实画面中核对财务/法务、肖像对话、资料冲突、协同图与大标识。协同图带方向箭头，并将三类工作结果回连企业资料；没有新增企业事实写者。
- 手机菜单可打开，Escape 关闭且焦点回到菜单；Personal 入口进入原个人页，返回企业页有效。账号入口和 OIDC 实现保持原样；没有尝试登录或修改共享账号服务。
- 检查修复了首屏标题层级跳跃、品牌标识缺少图片角色两处可访问性问题。Lighthouse 最终结果另记于下。
- 主线重新核实仍 clean，HEAD `3ce74ef830545d6a7ce329831659158715f8f8fa`；所有制作留在独立官网工作树，其他并行任务未改动。

### 性能与仍保留的边界

- 最终移动 Lighthouse：Performance 88 / Accessibility 100 / Best Practices 96 / SEO 100；FCP 3.1 秒、LCP 3.1 秒、TBT 50 毫秒、CLS 0。报告 `/tmp/xeliti-r3-visual.8oZ3K0/lighthouse-mobile-delivery.json`。这是本机模拟移动网络的实验结果，不是正式线上性能承诺；性能仍有提升空间。
- 最终桌面 Lighthouse：Performance 99 / Accessibility 100 / Best Practices 96 / SEO 100；FCP、LCP 均 0.7 秒，TBT 0 毫秒，CLS 0。报告 `/tmp/xeliti-r3-visual.8oZ3K0/lighthouse-desktop-delivery.json`。
- 相比首次 R3 检查，移除了当前首页未使用的约 44 KB 客户端图片运行时；最终网络记录不存在 `/assets/image-` 请求。没有改动共享认证或框架配置来追求分数。
- Best Practices 扣分源是原账号发现地址 `http://127.0.0.1:5200/.well-known/openid-configuration` 在本次本机检查中连接被拒；保留该共享服务，不启动、不重配。登录按钮原有可访问名称提示亦未越界改动。该告警不说明官网登录链路已验收通过。
