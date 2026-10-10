---
name: "lynx-data-insight"
display_name: "灵熙数据洞察"
display_name_en: "Lingxi data insight"
description: "分析 CSV/Excel 运营、媒介、内容、客户或 GEO 数据时使用。先检查数据质量和指标口径，再计算、制图和输出可复核明细，适合零基础员工。"
description_zh: "分析 CSV/Excel 运营、媒介、内容、客户或 GEO 数据时使用。先检查数据质量和指标口径，再计算、制图和输出可复核明细，适合零基础员工。"
description_en: "Analyze CSV or Excel office data with quality checks, explicit metrics, reproducible calculations and clear limitations."
version: "0.2.0"
author: "灵熙智能 / Lynx-codeRepository"
---

# 先核对数据，再给结论

读取 [分析方法与工具](references/analysis.md)。员工只需给原始附件和决策问题，计算步骤由你执行。

1. 核对文件、工作表、字段、时间、单位、样本与授权范围。原文件不改。没读到附件就明确说未读到。
2. 用已有表格工具做质量检查；需要本地检查时运行 [data_quality.py](scripts/data_quality.py)，按 [脚本用法](references/analysis.md) 选择列。检查缺失、重复、非法数值、公式缓存及异常范围，保存报告。脚本只做质量统计，不自动决定业务指标或改数据。
3. 使用 [指标字典](templates/metric-dictionary.csv)，明确分子、分母、去重键、时间、单位与业务解释。不要自动把空值变成零，把日期、编号当数值或把币种混用。Excel 公式缓存是否最新不能靠文件读取证明。
4. 确认计算范围和清洗方法后再分析。每个关键结论关联复核明细或可复算公式；百分比说明分母，变动幅度区分百分点和相对变化。AI 引用/提及、流量、真实转化分别计算。
5. 图表服务于比较/趋势，轴、单位、期间、样本清楚。只有两点数据不描述长期规律；相关不等于因果，不把预测当实测。
6. 输出可编辑分析报告、计算明细表、图表和 [检查/局限](templates/analysis-report.md)。按至少一项关键计算独立复核，不以脚本通过代替业务分析正确。

示例 CSV 使用虚构渠道及金额，仅用于演练。XLSX 读取需可选依赖；CSV 无额外 Python 包。缺少能力时交中间检查与方法说明，不宣称已经完成分析。
