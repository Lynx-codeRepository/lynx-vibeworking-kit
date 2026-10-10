# GitHub 资源目录

检查日期 **2026-10-10**。核对 10 个项目，推荐其中 8 个。先用已接入的办公技能，其余按材料/工具缺口配置，不让员工自己部署服务。

本目录的「已接入」表示本 Kit 含对应方法/调用脚本，并非已经在所有员工 WorkBuddy 账号安装成功。「按需调用/管理员配置」只提供接入路径。完整固定提交、账号与数据处理边界见 [resources.json](../resources.json)。

| GitHub 项目 | 适合的工作 | 当前入口 | 许可证 |
|---|---|---|---|
| [gitbrent/PptxGenJS](https://github.com/gitbrent/PptxGenJS) | 方案/PPT | 已接入 | MIT |
| [microsoft/markitdown](https://github.com/microsoft/markitdown) | 附件预处理 | 按需调用 | MIT |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | 客户/竞品调研 | 已接入 | MIT |
| [tavily-ai/skills](https://github.com/tavily-ai/skills) | 联网搜索/深度研究 | 管理员配置 | MIT |
| [assafelovic/gpt-researcher](https://github.com/assafelovic/gpt-researcher) | 多来源深度研究 | 管理员配置 | Apache-2.0 |
| [microsoft/data-formulator](https://github.com/microsoft/data-formulator) | 数据可视化探索 | 管理员配置 | MIT |
| [jsvine/pdfplumber](https://github.com/jsvine/pdfplumber) | PDF 表格提取 | 按需调用 | MIT |
| [PaddlePaddle/PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) | 扫描/图片识别 | 管理员配置 | Apache-2.0 |
| [yinqd3/workbuddy-skills](https://github.com/yinqd3/workbuddy-skills) | PPT 技能候选 | 未选用 | MIT |
| [langchain-ai/open_deep_research](https://github.com/langchain-ai/open_deep_research) | 深度研究候选 | 未选用 | MIT |

## gitbrent/PptxGenJS · 已接入

自编生成器使用 PptxGenJS 4.0.1，原生文本/表格/图表与讲稿。

**员工怎么用：** WorkBuddy 现成 PPT 能力优先；没有时 AI/维护者安装技能内固定依赖并运行 build_deck.mjs。

**依赖与账号：** Node 22+ 与本地 npm 依赖，无单独模型账号。

**数据流向：** 本地生成不上传客户资料；npm 安装会下载依赖。

**限制/筛选依据：** 不保留任意品牌模板；需逐页视觉检查，脚本未替代专业排版。

检查时归档：否；上游最近推送 2025-11-28；[固定源码快照](https://github.com/gitbrent/PptxGenJS/tree/3c9ec1b687c174952166f6a34b5e87ebf69fa469)。


## microsoft/markitdown · 按需调用

Office/PDF 转 Markdown，适合先提取资料，不能生成 PPT。

**员工怎么用：** 员工直接交附件；现成读取失败时维护者配置转换工具。

**依赖与账号：** Python 与按格式选择的依赖；纯本地转换无模型账号，AI 图片描述等路径另配账号。

**数据流向：** 本地转换路径可离线；选择外部 AI 描述时会发送相应内容。

**限制/筛选依据：** 布局会丢失；扫描件与复杂图表需 OCR 或人工复核。未在本 Kit 安装。

检查时归档：否；上游最近推送 2026-10-04；[固定源码快照](https://github.com/microsoft/markitdown/tree/4cc9fa17653d695d64fb9eee5b33d4de55ff84e8)。


## coreyhaines31/marketingskills · 已接入

改编 customer-research / competitor-profiling 方法，提供中文来源与访谈流程。

**员工怎么用：** 上传 lynx-research 技能，直接说客户/行业/数据问题。

**依赖与账号：** 改编方法无需额外账号；检索使用当前 WorkBuddy 能力。

**数据流向：** 方法本身无网络请求；联网工具的数据范围另核对。

**限制/筛选依据：** 上游部分为 SaaS 场景；去除固定激励/PMF 阈值与原平台路径，保留 MIT 许可。

检查时归档：否；上游最近推送 2026-10-08；[固定源码快照](https://github.com/coreyhaines31/marketingskills/tree/1efedbc5148b54b2f0f6c6c9fe0be62e151c7fff)。


## tavily-ai/skills · 管理员配置

可选搜索/提取/研究技能，作为 WorkBuddy 现有搜索的增强。

**员工怎么用：** 现有搜索不足时由维护者接入；不让员工自动执行网页安装脚本。

**依赖与账号：** 搜索/提取目前有免密限额模式；research/map/crawl 要认证。额外 CLI/服务额度按账号核对。

**数据流向：** 查询和相关内容会发到外部搜索服务。

**限制/筛选依据：** 不是全部免费免配置；未在本 Kit 安装或验证服务，费用/额度不作承诺。

检查时归档：否；上游最近推送 2026-09-04；[固定源码快照](https://github.com/tavily-ai/skills/tree/778122e5f9c680f541eeceda5a5b36405eb7980c)。


## assafelovic/gpt-researcher · 管理员配置

独立研究服务，可汇集网页/本地材料并生成引用报告。

**员工怎么用：** 维护者部署并提供受控入口后使用，非员工默认安装。

**依赖与账号：** Python 3.12+、模型/搜索配置；典型示例需要 OpenAI/Tavily 账号，可按上游支持替换。

**数据流向：** 模型/搜索服务可能接收问题、摘记和文件内容，按部署核对。

**限制/筛选依据：** 部署与调用成本需实测；自动引用仍需核对原文。未部署验证。

检查时归档：否；上游最近推送 2026-10-01；[固定源码快照](https://github.com/assafelovic/gpt-researcher/tree/0957c301ed06c2a5857b834358c7227c739041d4)。


## microsoft/data-formulator · 管理员配置

交互数据探索与 AI 辅助图表，支持多种表格材料。

**员工怎么用：** 维护者先配置环境/模型，员工在准备好的界面上传已授权数据。

**依赖与账号：** Python/Web 服务及模型配置，服务用法以当前版本核对。

**数据流向：** 模型路径可能发送数据摘记/表格；本地界面不等于所有数据本地处理。

**限制/筛选依据：** 未集成 WorkBuddy，未运行试用；不绕过预览安装包的系统安全提示。

检查时归档：否；上游最近推送 2026-10-08；[固定源码快照](https://github.com/microsoft/data-formulator/tree/5477f0e236426dc8f74a498ec400414fba7fbc0f)。


## jsvine/pdfplumber · 按需调用

本地 PDF 文字/表格提取，适合机器生成的文档。

**员工怎么用：** PDF 读取失败时由 AI/维护者配置并复核提取结果。

**依赖与账号：** Python 及 pdfplumber 依赖，无外部模型账号。

**数据流向：** 正常本地提取不上传。

**限制/筛选依据：** 不是 OCR，扫描页不可靠它恢复文字；复杂表格须抽查。未安装在本 Kit。

检查时归档：否；上游最近推送 2026-08-06；[固定源码快照](https://github.com/jsvine/pdfplumber/tree/4c64b92d5caccd71c645e98e0fabb0c4dba7ff45)。


## PaddlePaddle/PaddleOCR · 管理员配置

中文扫描件与图片 OCR/结构识别。

**员工怎么用：** 维护者准备模型和环境后，AI 将无法读的资料转为可核对文本。

**依赖与账号：** Python、Paddle 相关环境及模型下载；具体运行资源按模型核对。

**数据流向：** 本地模型可本地处理；若用云接口另核对发送内容。

**限制/筛选依据：** 比普通文字提取部署重，关键数字/单位必须核对原页；未在本 Kit 部署。

检查时归档：否；上游最近推送 2026-09-16；[固定源码快照](https://github.com/PaddlePaddle/PaddleOCR/tree/dab3fe35379033fdcb2d0e9572fac0b36c9a9ebf)。


## yinqd3/workbuddy-skills · 未选用

调查了其 pptx-generator 技能，但不作为可上传成品。

**员工怎么用：** 改用上游 PptxGenJS 和公司生成器。

**依赖与账号：** 上游示例有环境/版本假设。

**数据流向：** 未运行。

**限制/筛选依据：** 固定提交中 SKILL 引用 references/ 文件，而仓库实际文件平铺，引用缺失；不能直接保证新员工可用。

检查时归档：否；上游最近推送 2026-06-03；[固定源码快照](https://github.com/yinqd3/workbuddy-skills/tree/aa9a86a96aef605bc87285b51ffb34b2e51f7aff)。


## langchain-ai/open_deep_research · 未选用

LangGraph 深度研究实现。

**员工怎么用：** 不作为默认资源。

**依赖与账号：** 服务部署/模型配置较重。

**数据流向：** 可能使用外部模型/搜索。

**限制/筛选依据：** 检查时 archived=true；选用仍维护的候选作为可配置方案。

检查时归档：是；上游最近推送 2026-08-10；[固定源码快照](https://github.com/langchain-ai/open_deep_research/tree/1b7d2e80db9faa586165c60e09096dbbfd483a64)。


## 接入优先顺序

1. 先导入五个公司技能，使用 WorkBuddy 自带能力。
2. 附件无法读取再配置 MarkItDown/PDF/OCR。
3. 生成 PPT 需要后备工具时安装技能内固定依赖；不让员工编程。
4. 研究/可视化超出现有能力时，维护者决定是否接入外部服务并核对账号、数据范围和费用。

不按星数决定适用性；不自动下载执行陌生脚本；不把“项目存在”描述为已完成部署。客户材料可使用范围由现有授权和本次用户指令决定。
