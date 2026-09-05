# 官网 R6：企业文件夹中的两轮财务对话

## Goal / Constraints / Done when

老板明确要求：保留工作台外观，先发一句话录入凭证并生成凭证，再发一句话生成资产负债表和利润表、可下载；财务工作台属于企业文件夹。本轮只校正官网这一段，不实现正式产品能力。

- Design Read：面向企业负责人的官网定向修订，保留灰白/石墨/品牌橙、字体和工作台窗口，以两幅连续工作台和滚动消息叙事解释操作顺序。`DESIGN_VARIANCE=8 / MOTION_INTENSITY=8 / VISUAL_DENSITY=2`。设计技能仅用于营销叙事；内嵌工作台复用现有原生产品预览，不生成新截图替代互动。
- 审视 R5：原来一次请求并排显示凭证、泛称财务报表和利润表，不能表达两轮对话；侧栏把财务与企业文件夹并列。替换该段为先凭证后两张指定报表；其他章节和首屏不改。
- 两个画面均为左侧企业文件夹层级、中间对话框、右侧生成结果。进入可视范围后自动发送预设示例、展示结果，不需要点击切换。发送控件可重放本轮预设消息；不接受真实企业数据。手机、减少动态效果、无脚本时直接平铺完整内容。
- 数字为固定合成示例，凭证借贷平衡，报表与既有本月收支算例一致。两张报表的下载使用官网本地生成的示例 CSV，文件明确标示示例；不连接公司系统、不记账、不申报、不调用模型。
- L0 §3/4/6/13：只扩展 Website 公开呈现与客户端有界交互，不越过财务专业执行层、事实/知识/身份权威。无新服务、公共 API、持久存储、依赖或发布动作。
- 当前官网 main clean，HEAD `3ce74ef830545d6a7ce329831659158715f8f8fa`。复用官网独立候选 `codex/website-v1-redesign-20260905`；保留历史未提交素材及其他人的改动。`inspect --entry-mode new-task` 无 blocker，其他任务只作冲突输入。只使用自己的 3011 预览。
- Intake `TASK-91B38C78CB5A / SINGLE_TASK / ordinary_change / LIGHTWEIGHT / autonomous`，contract/dispatch ready，无风险触发。明确老板请求即本轮边界确认；价值 `1-3x / ONE_PASS`，当天一轮交付，停于本地视觉验收，不开 CARD、不派子任务、不写进度台账。
- 预计 8 条路径：`app/components/xeliti-product-stories.tsx`、`app/components/xeliti-motion.tsx`、`app/globals.css`、`app/lib/website-demo.mjs`、`app/lib/website-demo.d.mts`、`test/website-demo.test.mjs`、`README.md`、本记录。
- 验证：复用普通测试、构建、TypeScript、真实滚动/发送/下载/暂停/响应式路径和 Lighthouse；不新增专用验证脚本。低风险自实施、自查，不声称独立复核。失败保留静态内容，回退只针对本轮官网差异；未通过则保留候选说明问题。

## 当前结果

本轮财务示例数据与普通测试已开始制作，尚未交付。老板随后追加法务两轮、客服探索过程与点阵企业大脑，原 R6 范围在扩大前停止并重新 intake，后续统一由 R7 记录承接；本记录不作为完成或验收结论。
