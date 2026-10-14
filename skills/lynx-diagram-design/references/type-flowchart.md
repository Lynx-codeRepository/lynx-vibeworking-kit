> WorkBuddy 改编说明：本文件保留上游图表方法。具体执行以包根目录 SKILL.md 为准；上游脚本、命令、档案写入、字体下载和配置流程不是员工前置条件。

# Flowchart

**Best for:** decision logic, algorithms, user-facing branching flows ("Should I…?"), onboarding routing, support-triage trees.

## Layout conventions
- Shape carries type, not color:
  - **Oval** (`rx=20`) — start / end
  - **Rectangle** (`rx=6`) — step / action
  - **Diamond** — decision (≤3 exits)
  - **Small filled ink dot** (`r=4`) — merge point where branches rejoin
- Flow runs top→down. From a diamond, conventional exits: Yes to the right, No below — but label every outgoing arrow regardless.
- Use coral on the happy path *or* on the single most consequential decision — never on every decision.
- If two arrows must cross, use a small arc jump on one so the crossing is readable.

## Anti-patterns
- Using fill color to signal node type (shape does that).
- Decision diamond with 4+ exits — refactor into nested diamonds.
- Unlabeled decision branches.

## Examples
- `assets/example-flowchart.html` — minimal light
- `assets/example-flowchart-dark.html` — minimal dark
- `assets/example-flowchart-full.html` — full editorial
