# 验证范围

## 本版本要检查什么

- 十类办公任务、九个技能的元数据和文档链接完整。
- 任务记录生成不覆盖旧文件，不越界、不经过符号链接；默认 WorkBuddy 入口，不写全局设置。
- CSV/Excel 检查能发现重复、缺失、非法数值、公式缓存边界；计算保留明确口径。
- PPT 后备脚本生成包含原生文本、表格、图表和讲稿的真实 .pptx，拒绝覆盖和超出模板限制的输入。
- 单技能 ZIP 根目录有 SKILL.md，内部引用完整，员工包内无 scripts、运行依赖、node_modules、缓存或运行资料；维护完整包保留后备脚本；哈希可核对。

执行结果和环境见发布说明与 GitHub Actions。结构检查不能替代实测业务结果。

## 尚未覆盖

本地脚本与 ZIP 检查不证明真实员工已在 WorkBuddy 导入成功；也不证明所有账号具备同样的搜索/PPT 工具。真实客户研究、专业判断、现场 PPT 排版及业务效果尚需试用验收。

PPT 原生结构测试不等于视觉验收。员工/AI 须在 PowerPoint/WPS 或可用渲染器逐页查看正式客户文件，检查中文字体、换行、页码、图表标注、讲稿和模板。

CLI `check` 仅核对本地成果存在和证据记录格式；不会重新计算分析、浏览来源、读取每页 PPT 或认证真实性。不得用 `ready-local` 对外宣称客户验收已通过。

## 依赖核对

PPT 上游 4.0.1 的旧 image-size 依赖触发了当前公开漏洞报告，已用 overrides 固定到 2.0.3，并重新测试生成。说明见 [JXL/HEIF 修复](https://github.com/advisories/GHSA-5p2g-fcmc-qvqq) 和 [ICNS 修复](https://github.com/advisories/GHSA-w3rx-r6r6-pgpr)。本地 npm audit 未发现已报告漏洞；这不代表所有未来问题已排除。
