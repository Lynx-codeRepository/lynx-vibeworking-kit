# 灵熙智能 WorkBuddy 工作 Kit

给业务、运营和研发新人共用的办公任务包。用一句话说明目标，交给 WorkBuddy 完成**客户方案与 PPT、客户/行业调研、公开数据调研、内部表格分析和汇报材料**。

**员工从 [开始使用](START-HERE.md) 进入。无需学习 Git、命令行或代码开发。**

## 下载与导入

在 [v0.2.0 下载页](https://github.com/Lynx-codeRepository/lynx-vibecoding-kit/releases/tag/v0.2.0) 下载 5 个 `workbuddy-*.zip`。在 WorkBuddy 的「专家·技能·连接器 → 技能 → 添加技能 → 上传技能」逐个上传。每个 ZIP 都是独立的技能包，`SKILL.md` 位于包根目录。

| 技能包 | 员工会得到什么 |
|---|---|
| lynx-delivery | 把一句话需求转为明确任务，选择工作流程，组织交付 |
| lynx-proposal-ppt | 客户方案、汇报大纲、可编辑 PPT、讲稿与页面检查 |
| lynx-research | 客户/竞品/行业调研、带来源和日期的证据表 |
| lynx-data-insight | CSV/Excel 质量检查、指标口径、分析和图表 |
| lynx-professional-output | 调研报告、项目方案、会议行动项、周报/月报 |

也可下载 `lynx-workbuddy-office-kit-v0.2.0.zip`，解压后交给 WorkBuddy 读取 `START-HERE.md`。完整仓库用于维护者管理模板和工具，不直接作为一个技能上传。

## 三句话开始工作

- **做方案：**「使用灵熙方案与 PPT 技能，依据附件为客户制作品牌内容运营方案。先给我汇报对象、核心观点和逐页文案，确认后生成可编辑 PPT、讲稿和来源表。」
- **调研客户：**「使用灵熙调研技能，调研【客户/品牌】的公开业务、产品、内容渠道和潜在需求。结论注明来源、日期及可信程度；不确定的写成待验证问题，给我首次沟通提纲。」
- **分析数据：**「使用灵熙数据洞察技能，分析附件中的运营表格。先检查字段、时间、单位、缺失和重复，再按确认的指标计算，输出分析报告、可复核明细及图表。」

完整示例见 [直接复制的任务指令](docs/examples.md)。

## 适合公司的哪些工作

围绕灵熙智能的品牌资产管理、内容运营、GEO/AI 搜索可见度、媒介分发和客户服务工作。Kit 帮员工解释业务问题、搜集证据、设计方案并交付材料；这些领域是方案的业务场景。不会把某个客户的预算、架构或效果承诺当成公司的通用规定。

GEO 报告分别记录 AI 引用/提及、站点访问和真实转化；不能用一个指标代替另一个。客户案例、价格、效果和资源承诺只使用已核实且获准对外的材料。

## GitHub 资源经过哪些筛选

已核对 **10 个项目，推荐 8 个**，按任务、许可证、依赖、账号要求和维护状态整理。详见 [GitHub 资源目录](docs/github-resources.md) 与 [可读机器清单](resources.json)。

首批已接入：PptxGenJS 的可编辑 PPT 生成脚本、根据 marketingskills 改编的中文客户/竞品调研方法、本地 CSV/Excel 数据检查脚本。MarkItDown、pdfplumber、PaddleOCR 是按材料类型选用的提取工具。Tavily、GPT Researcher、Data Formulator 作为需要配置时的增强资源，由维护者接入。

**有下载链接不等于已在 WorkBuddy 中集成。** 目录逐项标明「已接入 / 按需调用 / 管理员配置 / 未选用」。员工优先使用 WorkBuddy 已有的文件、搜索和演示能力；没有对应能力时，AI 解释缺口并给出可审阅的中间成果，不能把大纲称为已经完成的 PPT。

## 验证与维护

[结构与工具验证](docs/verification.md) · [维护方法](docs/maintenance.md) · [工作方式](docs/architecture.md) · [工具说明](docs/tools.md) · [来源与许可](docs/sources.md)

本版本已做本地自动化检查，真实员工的 WorkBuddy 导入、客户材料产出和现场 PPT 视觉验收仍需试用记录。`check` 命令只核对成果文件与证据记录结构。

仓库地址保留 `lynx-vibecoding-kit`，当前产品名称与使用路径已改为 WorkBuddy 工作 Kit。
