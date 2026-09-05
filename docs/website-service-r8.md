# 官网 R8：从模板匹配到理解后回答

## Goal / Constraints / Done when

- 老板明确纠正 R7 客服：中间的企业文件夹让人看不懂，应表现升级及思考处理过程，回复结果不是主角。只修这一个官网场景，其他章节不动。
- Design Read：企业 AI 官网的保品牌定向重构。沿用灰白/石墨、品牌橙、现有无衬线字体及手机模型；左侧保留短而机械的模板流程，右侧加大 AI 对话中理解层的视觉权重，诉求提取、资料核对、交付安排逐步在同一手机里形成。`DESIGN_VARIANCE=8 / MOTION_INTENSITY=8 / VISUAL_DENSITY=2`。营销叙事使用前端设计技能，用户明确要动态过程，复用原生 UI/GSAP，不以新位图替代动画，不使用写实脑图。
- Audit：R7 的问题是两个手机与中间文件成了三个平权展区，最终停帧又被回复主导；资料来源和 AI 的因果关系不够明确。取消第三栏，把依据放进 AI 对话内，在结果出现后也保留可读的处理脉络。保留标题、锚点、导航、品牌、主题、账号、SEO 和其余页面。
- L0 §3/4/6/13：仅 Website 公开展示及有界客户端状态。合成订单/流程/库存是营销算例，不是实际企业事实；流程是高层产品处理示意，不是实测模型内部思维。没有新 API、模型调用、数据读写、知识/事实/身份权威或专业执行能力，不触发产品 PRD/架构契约变化。
- Intake：`TASK-6BBA0E7A52D3 / SINGLE_TASK / ordinary_change / LIGHTWEIGHT / autonomous`，contract/dispatch ready，branch required，风险为空。老板本轮明确修订作为 AGREED 与开始确认；`1-3x / ONE_PASS`，当天单轮本地候选，停于老板视觉检查，不自行进入下一版。
- 隔离：官网 main clean，HEAD `3ce74ef830545d6a7ce329831659158715f8f8fa`；复用 `codex/website-v1-redesign-20260905`，保留 R1–R7 未提交候选。`inspect --entry-mode new-task` 无 blocker，Root 的 CARD-1618/CARD-646 只作冲突输入，路径、锁、进程均不碰。仅复用自己的 3011 预览；不合并、推送、部署、不写台账。Sites 路线仍受老板已记录否决约束。
- 预计且仅 5 条路径：`app/components/xeliti-product-stories.tsx`（客服组件）、`app/components/xeliti-motion.tsx`（客服时间线）、`app/globals.css`（客服样式）、`README.md`、本记录。原文件局部备份 `/tmp/xeliti-r8-before.hT6x9Z/`；回退仅针对本轮差异，不用 git reset/restore 覆盖累积候选。
- Done when：不存在独立的中间文件区；真实滚动能看见传统模板回复后 AI 还在提取诉求、核对资料、形成安排，完成后过程仍在、回复只收尾。暂停/恢复、离屏、桌面亮暗色、手机、减少动态效果和无脚本均不丢内容。复用普通 9 项测试、lint/build/TypeScript，加直接浏览器路径与 Lighthouse，不新增专用验收工具。低风险自查，不称独立复核；若出现范围/风险漂移则保留现场、重新 intake。

## 结果

本地候选已更新，待老板视觉验收；不是正式客服能力交付。改动仅为预定 5 条路径：客服 JSX、客服样式、客服时间线和复用重放控制、README、本记录。用 R7 局部备份比对确认产品组件其余章节没有改动；未增加依赖、图像、模块、脚本、API 或数据写者。

- 第三栏企业文件夹已移除。两侧从“停在关键词”到“多一层理解”，AI 手机内的诉求、依据、业务安排成为主要内容，简短回复在最后出现。标题与 `#customer-service` 保持不变。
- 实际滚动自动开始，无需点击：捕获传统回复 `opacity=1`，AI 诉求理解 `1`，资料、安排、回复均 `0` 的画面。随后真实重放也捕获三份资料均 `1`、安排及回复仍 `0` 的中间状态，最后四层全部可见；不是只检查最后一帧。所有资料节点均在 `.ai-phone` 内，无 `.service-exploration`。
- 重播按钮真实点击通过；暂停后两张完整视口截图逐字节相同，恢复后流程继续完成。滚到场景完全离屏后，理解层、资料、安排、回复及 31 根信号条的 opacity/transform 在两次观测间一致，回到视野继续播放。
- 实际看图：1440 px 桌面亮色/深色、390 px 手机深色、320 px 窄屏亮色。无横向溢出；窄屏按传统手机、升级方向、AI 手机自然阅读，资料不再独立夹在二者之间。
- `prefers-reduced-motion: reduce` 下动画场景数为 0，理解、资料、安排和回复均可见，重播禁用。关闭 JavaScript 后重新加载，仍完整显示这些内容，无动画和 canvas 就绪标记。测试后恢复脚本、系统主题及默认视口。
- `npm test` 9/9、lint 无警告、生产构建、`npx tsc --noEmit`、`git diff --check` 均通过。没有为了展示动画新增测试工具或伪造模型测试。
- 本次源码 Lighthouse：桌面 Performance 97 / Accessibility 100 / Best Practices 96 / SEO 100，LCP 0.8 s、TBT 110 ms、CLS 0；移动 85 / 100 / 96 / 100，LCP 3.4 s、TBT 70 ms、CLS 0。首屏是保留范围，移动 LCP 仍未到 2.5 s，不宣称全页性能门槛已通过；不以此次客服修订扩展首屏优化。
- 图像与 Lighthouse 临时证据 `/tmp/xeliti-r8-visual.ElwgX3/`：`01-understand.png`、`02-check-sources.png`、`03-dark-complete.png`、`04-mobile-320.png` 和桌面/移动 JSON。保留 R7 原证据，不将 R8 改写为历史 R7 已通过视觉验收。
- 官网 main 结束检查仍 clean；账号中心 5200 的既有不可达问题不在本轮处理范围。无提交、合并、推送、部署、台账或其他任务变更。自查不冒充独立复核，停在老板查看本地候选。

本地预览：`http://127.0.0.1:3011/?revision=r8-deliverable#customer-service`。
