---
name: "lynx-diagram-design"
display_name: "灵熙图表与方案可视化"
display_name_en: "Lingxi diagram and business visualization"
description: "为客户方案、汇报PPT和运营报告制作流程图、泳道图、客户旅程、时间线、组织图、竞争矩阵及数据图表，或重绘已有图示时使用。输出可修改的HTML与内嵌SVG；使用已有工具导出图片。"
description_zh: "为客户方案、汇报PPT和运营报告制作流程图、泳道图、客户旅程、时间线、组织图、竞争矩阵及数据图表，或重绘已有图示时使用。输出可修改的HTML与内嵌SVG；使用已有工具导出图片。"
description_en: "Create business diagrams and charts for client proposals, reports and presentations using existing WorkBuddy file and preview tools."
version: "0.4.0"
author: "灵熙智能 / Lynx-codeRepository; methods by Cathryn Lavery"
---

# 用图把方案和数据讲清楚

使用场景是品牌资产管理、内容运营、GEO、媒介与客户服务。原始关系、数字、范围与时间来自用户材料；未知项标为待确认，不把版式示例当公司事实。只做文字改稿或表格已足够表达时，直接使用相应形式。

## 从用户的工作开始

读附件和目标，确定汇报对象、要解释的问题、图中必须保留的内容及落地位置。用于PPT默认16:9、中文、可投屏阅读；用于报告默认正文宽度。客户有已确认模板/VI就沿用；没有品牌材料时说明采用中性演示风格并直接推进，不声称它是正式公司VI，不要求员工配置风格档案。

在 [图表选择](references/business-types.md) 选布局，只读本次相关的类型参考；行为、状态、瓶颈或治理含义复杂时，再读 [语义模式](references/semantic-patterns.md)。先说明选择与必要的简化，材料清楚时直接绘制，缺失且会改变结论的信息才询问。

## 绘制与交付

- 按 [办公绘图与检查](references/office-workflow.md) 组织内容；长图拆为总览与细节，保留省略记录。
- 使用 [浅色模板](assets/template.html)、[深色模板](assets/template-dark.html) 或 [报告模板](assets/template-full.html) 生成单个HTML文件，CSS与SVG内嵌。模板使用本机字体，不依赖在线字体下载。用户有已核实配色时替换相应语义颜色。
- 按 [连接线与基本元素](references/primitives-core.md)、[密度与版式](references/layout-budget.md) 检查线条、文字、边界、图例和留白。普通图默认不超过9节点/12连线，特殊类型遵循其预算；不能为凑版式删除关键关系。
- 保留SVG中的原生文字和图形、标题与说明、唯一ID。PNG是图片；HTML/SVG可修改源内容，但不承诺放进PPT后每个元素都成为原生形状。
- 使用WorkBuddy当前可用预览/截图/文件工具查看成果，再修复中文换行、溢出、箭头和投屏可读性。需要图片时，用已有渲染能力导出PNG，并交HTML源文件；需要SVG时同时保留CSS、字体回退和引用的defs。能力缺失时说明未完成的导出/视觉验收，不编造图片或检查结果。

## 本包执行边界

上游类型与基础参考保留详细方法，按需读取。本中文入口决定WorkBuddy执行方式：不运行上游安装、Python检查或导出脚本，不改全局技能与风格配置；不要求员工安装依赖或填写API Key。默认静态图，动画与高级格式自动导入不在本包范围。旧图有可读文本/截图时依据材料重绘，说明合并或丢弃内容；文件解析不可用时请求可读内容，不声称已经解析。

交付图文件、图的用途、输入来源、必要的简化与待确认项。许可与改编范围见 [来源记录](THIRD_PARTY_NOTICES.md)；固定源文件校验见 [upstream-manifest.json](upstream-manifest.json)。
