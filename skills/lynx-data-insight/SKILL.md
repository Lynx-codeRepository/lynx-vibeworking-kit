---
name: "lynx-data-insight"
display_name: "灵熙数据洞察"
display_name_en: "Lingxi spreadsheet analysis"
description: "分析Excel或CSV中的内容、媒介、客户运营、GEO数据，或复核数据报告时使用。检查质量、统一指标、计算和制图，并提供可复算明细。"
description_zh: "分析Excel或CSV中的内容、媒介、客户运营、GEO数据，或复核数据报告时使用。检查质量、统一指标、计算和制图，并提供可复算明细。"
description_en: "Lingxi spreadsheet analysis using existing WorkBuddy tools and supplied files."
version: "0.4.0"
author: "灵熙智能 / Lynx-codeRepository"
---

# 从表格走到可复核判断

读 [数据分析与复核方法](references/analysis.md)。员工只需交附件和业务问题，读取、计算和制图由你使用当前 WorkBuddy 工具完成。来源见 [改编记录](THIRD_PARTY_NOTICES.md)。

1. 核对实际读到的文件、工作表、数据粒度、期间、单位和字段。先了解一行代表什么，再汇总。原始文件保持不变。
2. 检查缺失、重复、非法数值、异常范围、日期完整性与公式缓存。空值不等于零；没有明细就不能声称分析了全量数据。
3. 用 [指标字典](templates/metric-dictionary.csv) 明确分子、分母、去重键、筛选与清洗方法。点击率/转化率使用总分子除以总分母，避免直接平均各渠道百分比。
4. 围绕业务问题分析趋势、渠道/产品/人群差异，解释可支持的原因与仍需核实的假设。百分点与相对变化分别表达；AI引用、流量、真实转化分别统计。
5. 用当前表格/图表工具输出可编辑计算明细与清楚的图表，标注轴、单位、期间、样本；没有相应工具就如实交付分析草稿，不让员工安装 Python 或依赖。
6. 交付前复核至少一项关键计算、汇总与原表的对账、过滤/关联导致的重复或漏数、图表与正文是否一致。相关关系不能写成原因，预测不能写成实测。
7. 输出 [分析报告](templates/analysis-report.md)、明细表、图表和待确认项，报告指出对哪个业务决定有用。
