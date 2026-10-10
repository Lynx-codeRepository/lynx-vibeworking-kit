---
name: "lynx-proposal-ppt"
display_name: "灵熙方案与 PPT"
display_name_en: "Lingxi proposals and presentations"
description: "制作客户方案、汇报 PPT、培训演示或逐页文案时使用。按灵熙业务价值组织内容，生成可编辑文件、讲稿和来源记录，并检查数字和页面。"
description_zh: "制作客户方案、汇报 PPT、培训演示或逐页文案时使用。按灵熙业务价值组织内容，生成可编辑文件、讲稿和来源记录，并检查数字和页面。"
description_en: "Create company proposals and editable PowerPoint presentations with business storytelling, speaker notes and evidence checks."
version: "0.2.0"
author: "灵熙智能 / Lynx-codeRepository"
---

# 做员工能讲、客户能理解的方案

先读 [方案与页面方法](references/presentation.md)。公司名称用灵熙智能，以已确认服务和资料为准。

1. 核对汇报对象、要促成的决策、主题、时长/页数、材料和品牌模板。只询问影响范围或事实的关键缺口。
2. 先形成一句话结论与结构：客户问题 → 目标与价值 → 工作流程 → 分阶段交付 → 成效评价 → 范围/资源/下一步。技术选型只有帮助读者决策时展开。
3. 输出 [逐页文案](templates/slide-outline.md)：每页结论标题、正文、证据、图示、讲稿。文案未批准时先审文案；已明确授权整套制作时直接完成。不要每页都问确认。
4. 生成原生可编辑 .pptx；优先使用当前 WorkBuddy 演示工具和公司模板。工具缺失时使用 [PptxGenJS 后备工具](references/presentation.md) 与 [deck.json 示例](templates/deck.json)。员工不需写代码。图片可嵌入，但标题、正文、表格、图表不应全变成一张截图。
5. 对数字、客户案例、报价、效果和排期逐一核对材料；没有确认的数据不能补成承诺。客户版少堆技术术语，末页致谢；研究来源、风险/限制可放讲稿与附表。
6. 逐页打开/渲染检查文字溢出、中文字体、图表单位、讲稿与数字一致；抽查可编辑性。无法视觉检查时明确写未验证，不能把 XML 结构测试说成排版通过。
7. 交付 .pptx、逐页文案/讲稿、来源清单、实际检查和待确认项。若只完成文案，明确是文案；不以 HTML/PDF 或图片大纲冒充 PPT。
