# AI 工具接入

Kit 使用项目内文件，不要求修改个人全局配置。AI 工具需要能读取文件；安装与实施需要相应执行能力和项目权限。下方只说明已核对的文件机制，不保证不同版本/受管环境都已启用。

| 工具 | 本包生成入口 | 如何确认 |
| --- | --- | --- |
| Codex | AGENTS.md（没有同名文件时）、.agents/skills 的三个技能 | 在目标项目的新会话要求 AI 说明已读取规则；必要时显式读取 .lynx-kit/guidance.md 与 SKILL.md |
| Claude Code | CLAUDE.md（没有同名文件时）、.claude/skills 的三个技能 | 查看工具当前上下文/技能列表；已存在的 CLAUDE.md 会保留，启动时显式读取 Kit 入口 |
| Cursor | .cursor/rules/lynx-kit.mdc，alwaysApply 为 true | 查看项目规则状态，并要求 AI 读取 Kit 任务说明 |

技能在 Kit 源码 `skills` 下集中维护，安装时复制到选定工具目录。工具自动发现不等于一定加载或遵循，遇到未发现就显式读取文件或按工具文档开启新会话。无需把技能安装到用户全局目录。

目前已核对格式与本地生成，尚未组织真实员工在三个工具中完成端到端试用。工具是否登录、具备浏览器/Office/媒体能力或受到企业策略限制，要在具体环境验证。

核对依据（2026-10-08）：[Codex 技能](https://learn.chatgpt.com/docs/build-skills)、[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、[Claude 项目规则](https://code.claude.com/docs/en/memory)、[Claude 技能](https://code.claude.com/docs/en/skills)、[Cursor 规则](https://cursor.com/docs/rules)。官方规则变更时更新本文件与安装器，不静默修改员工配置。
