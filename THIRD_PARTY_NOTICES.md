# 第三方来源与改编

v0.4.0选用四组开源技能方法，固定提交、具体路径与文件修改日见 [resources.json](resources.json)。每个改编技能内含相应完整许可和变更说明。

- [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)：Apache-2.0。改编客户研究、客户方案、竞争判断、数据探索/验证/图表和客户会议交付流程；移除原平台产物、强制CRM/数据仓库/连接器前提，使用WorkBuddy已有工具与用户附件。
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)：MIT，Copyright(c)2025 Corey Haines。改编客户研究、竞品画像、内容策略、营销计划与GEO事实检查；加入中文公司场景、证据与不承诺效果要求，不携带付费营销API或发布工具。
- [blader/humanizer](https://github.com/blader/humanizer)：MIT，Copyright(c)2025 Siqi Chen。改编文字编辑与事实保留方法，针对中文客户方案、报告和品牌文字；不增加事实或更改承诺。

- [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)：MIT，Copyright(c)2025 Cathryn Lavery。保留静态图表类型、基础排版方法和3份模板；新增中文WorkBuddy办公入口与检查流程，模板改用系统字体，未打包上游脚本、平台插件、动画或图标。完整许可与逐文件来源保留在 [图表技能](skills/lynx-diagram-design/THIRD_PARTY_NOTICES.md)。

这些是灵熙智能改编的WorkBuddy办公版，不是上游原包或官方WorkBuddy发行版。公司新增内容遵循各技能LICENSE.txt；上游权利和许可保留。未执行上游安装脚本或复制专有Office技能。

维护者代码另使用PptxGenJS4.0.1与可选openpyxl3.1.5（MIT），不进入员工技能ZIP；依赖安装后的原许可需保留。原工具选择记录见 [维护资料](docs/maintenance-resources.md)。
