> WorkBuddy 改编说明：本文件保留上游图表方法。具体执行以包根目录 SKILL.md 为准；上游脚本、命令、档案写入、字体下载和配置流程不是员工前置条件。

# ER / Data Model

**Best for:** conceptual and logical data models, API resource relationships, domain models — anything where the story is *entities and cardinality*.

**Not for the physical schema.** ER is entity-level: relationship lines join *boxes* and carry cardinality at each end. When the point is real tables with SQL types, constraint chips, indexes, and foreign keys that anchor **column to column**, use [`type-db-schema.md`](type-db-schema.md) instead.

## Layout conventions
- Each entity is a two-section box:
  - **Header**: type tag (`ENTITY`) + entity name in the `node-name` role.
  - **Body**: field list in the `sublabel` role, one per line. PK prefixed with `#`, FK prefixed with `→`.
- Relationships: lines between entities with cardinality at each end:
  - `1`, `N`, `0..1`, `1..*` in the `arrow-label` role, 8px, placed 10–12px from the entity edge.
  - Optional relationship label ("has", "belongs to") centered on the line.
- Group related entities close; lay out so most relationships are straight lines, not tangles.
- Coral on the aggregate root or central entity of the model.

## Anti-patterns
- Drawing an arrow for every FK on a model with dozens — lay out by cluster instead.
- Inconsistent cardinality notation between ends of the same relationship.
- Fields padded to equal-height boxes — natural height by content is fine.

## Examples
- `assets/example-er.html` — minimal light
- `assets/example-er-dark.html` — minimal dark
- `assets/example-er-full.html` — full editorial
