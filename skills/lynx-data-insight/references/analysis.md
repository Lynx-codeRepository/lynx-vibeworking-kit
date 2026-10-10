# 数据工作方法

先确认输入是不是同一个时间范围、数据口径和业务对象。真实未发生、没有记录、无法读取分别表达；重复行只报告数量，未经确认不删除。数值列必须由用户/字段定义明确指定。

## 可选本地检查

Python 3.10+。CSV 使用标准库；Excel .xlsx 需安装 scripts/requirements.txt 中固定 openpyxl 3.1.5。优先使用 WorkBuddy 已有表格能力。

```sh
python3 scripts/data_quality.py 原始.csv --numeric spend --numeric leads --output quality.json
python3 scripts/data_quality.py 原始.xlsx --sheet Sheet1 --numeric amount --output quality.json
```

在技能根目录执行。先核对当前路径，输出路径必须不存在。编码默认 utf-8-sig；GB18030 可显式 `--encoding gb18030`。数值拒绝逗号分组、百分号、货币符号与非有限值，避免暗中猜单位；须明确转换方法后另做分析。零保留为零；空字符串/空单元格为缺失，文本「NA」不是默认空值。

Excel 公式只读保存的缓存数值，报告公式数量；无缓存的公式保持缺失并警告，存在缓存也不能保证最新。需要在可信表格应用重算保存后复查；脚本不执行公式/宏，不修改文件。

报告包含源文件 SHA256、工作表、行数、重复数、逐列缺失、选定数值列的有效/缺失/非法数值、Decimal 总和/均值/极值。没有自动异常阈值、没有可视化结论、没有因果判断。原文件不上传；报告默认不包含原始行或客户文本。

人工抽查：源数据至少一行、关键总和/分母、过滤与去重逻辑、期间、单位、公式缓存和极端值。大表内存限制以实际运行环境为准，失败需说明。

高级图表探索可由维护者配置 [Data Formulator](https://github.com/microsoft/data-formulator)。它需要额外环境/模型设置，未在本 Kit 中集成；使用外部模型前核对数据范围与现有授权。
