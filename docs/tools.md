# 员工能力与维护工具

## 员工日常

上传按任务选择的WorkBuddy技能ZIP，交资料和目标。技能包无安装脚本、运行依赖、API Key或外部账号要求。它们使用当前账号的搜索、文件读取与Office能力；AI按实际工具完成任务并说明缺口。

## 维护者工具

CLI使用Node.js22+标准库，默认WorkBuddy入口，支持Codex/Cursor维护适配。任务安装不覆盖旧文件，拒绝路径越界和符号链接。示例：

```sh
node bin/lynx-kit.mjs catalog
node bin/lynx-kit.mjs init --directory /真实父目录/任务 --type content-plan --name 内容计划 --goal 制作品牌月计划
node bin/lynx-kit.mjs check --directory /任务目录
```

完整包保留本地CSV/Excel检查与PPT生成器，它们不进入员工ZIP：

- `skills/lynx-data-insight/scripts/data_quality.py`：Python3.10+，CSV用标准库，XLSX用固定openpyxl3.1.5；只做质量统计，不决定业务指标。
- `skills/lynx-proposal-ppt/scripts/build_deck.mjs`：Node22+，在脚本目录准备固定npm依赖，使用PptxGenJS4.0.1生成可编辑文本/表格/图表。
- 原工具项目的历史选择依据见 [后备工具资料](maintenance-resources.md)，实际使用前重新核对环境、账号和数据范围。

Codex维护适配将WorkBuddy扩展元数据移入metadata；员工上传包保留WorkBuddy官方顶层字段。
