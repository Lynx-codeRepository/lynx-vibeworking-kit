# 工具与环境

## 员工日常

WorkBuddy 技能列表中导入并启用五个 ZIP，交附件和自然语言目标。无需 npm、Git 或服务部署。附件读取、联网、演示等能力以公司当前 WorkBuddy 账号实际可用工具为准，AI 开始任务时核对。

## 维护者工具

完整仓库的 CLI 需要 Node.js 22+。工具本身无第三方运行依赖。以下命令由 AI 或维护者执行：

```sh
node bin/lynx-kit.mjs catalog
node bin/lynx-kit.mjs init --directory /已存在父目录/任务 --type proposal-ppt --name 客户方案 --goal 制作品牌内容运营方案
node bin/lynx-kit.mjs attach --directory /现有资料目录 --type client-research --name 客户研究 --goal 核对公开业务和潜在需求
node bin/lynx-kit.mjs check --directory /任务目录
```

默认 `--tool workbuddy`；维护者可选 `codex`、`cursor` 或 `all`。`init` 只接受新目录/空目录，`attach` 保留现有文件。已有同名 Kit/技能/规则则停下，不覆盖。`--dry-run` 先看文件清单。

## 可选脚本

- 数据检查：Python 3.10+；CSV 只用标准库，Excel 另装该技能的 `scripts/requirements.txt`。不是要求员工安装，AI 先核对运行环境。
- PPT：Node 22+，在该技能 `scripts` 目录运行 `npm ci --ignore-scripts`，使用固定 PptxGenJS 4.0.1。先采用 WorkBuddy 现成 PPT 能力；本脚本用于明确可编辑文件的后备生成。
- MarkItDown/pdfplumber/OCR 和高级联网研究：按 [资源目录](github-resources.md) 由维护者接入。未配置不冒充已运行。

不自动安装全局软件，不绕过操作系统安全提示，不把客户附件上传到未经确认的外部服务。外部服务账号、费用和数据范围由现有公司配置或本次用户授权确定。

Codex 维护适配会将 WorkBuddy 扩展字段移入 metadata，保留技能正文、引用和脚本。原始上传 ZIP 保留 WorkBuddy 官方顶层格式。
