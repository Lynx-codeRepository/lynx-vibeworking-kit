# 灵熙智能 WorkBuddy 工作 Kit 维护约定

先读 README.md、START-HERE.md、catalog.json、resources.json 和 docs/architecture.md。本包面向业务、运营与研发新人完成办公任务：方案/PPT、客户/行业/数据调研、数据分析、报告。当前用户指令优先。

- 员工入口是 WorkBuddy 技能 ZIP 和自然语言指令，不要求员工学习 Git、CLI 或开发。
- 公司对外名称是灵熙智能。基线来自 skills/lynx-delivery/references/company.md；历史材料不是操作授权。
- 安装器不覆盖旧文件，不改全局配置，不自动安装依赖，不读取凭据，不执行客户项目代码。
- CLI 使用 Node.js 22+ 标准库；可选 PPT/Excel 工具依赖分别放在各技能脚本目录，固定版本并实际测试。
- 工作包不能捏造来源、访谈、客户需求、价格、效果或已完成文件。check 仅核对证据记录与文件存在。
- 技能为独立 ZIP，SKILL.md 在根目录，必须包含 WorkBuddy 官方要求的说明、版本、作者元数据；内部引用完整。
- 提交前执行 npm run check。修改生成、计算或路径逻辑时补有意义的回归测试；文案仅检查链接与结构。
- 不提交真实客户资料、密钥、认证文件、个人记忆、依赖目录。第三方改编保留许可与来源。
- 除非用户明确要求并行 Agent，不自动创建子 Agent。
