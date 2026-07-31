# 拉客力数据中台 - 产品需求文档（PRD）

> 版本：v1.0 | 日期：2026-07-25 | 状态：待评审
> 关联文档：PRD-后台管理系统.md、AGENTS.md（架构现状）

---

## 1. 产品概述

### 1.1 背景

拉克力管理后台当前已集成 6 大业务模块：龙掌柜 AI 助手（`lzg`）、拉克力管理后台（`admin`）、域途 GEO SaaS（`geo`）、智推 AI 客服（`ai-service`）、智能外呼（`outbound-call`）、拉客力数据中台（原「跨境外贸知识引擎」，`knowledge-engine`）。但各模块**数据彼此孤立**：

- 每个业务模块独占一套数据库 schema：`admin.*` / `lzg.*` / `geo.*` / `outbound.*` / `ai_service.*` / `ke.*`；
- 所谓"全域汇总"仅有 `/api/admin/analytics` 一个**硬编码 SQL 聚合接口**，手工 JOIN 了 `admin` 与 `ke` 两个 schema（见 `lakeli-app-xc/src/app/api/admin/analytics/route.ts`）；
- 前端 `admin-api.ts`（97 个导出）把全模块请求混在一个文件里，各页面直连各自的 `/api/xxx`，无统一契约；
- 知识库 `knowledge_base`（龙掌柜 RAG 实时源）与知识引擎 `ke_*` 系列表**互不相通**，同一份"知识"在中台里存在两套。

这导致：加一个跨模块指标要改三处（后端 SQL + 接口 + 前端）；客户在龙掌柜 / 外呼 / GEO 中被识别为不同实体，无法统一画像；知识资产无法跨模块复用。

### 1.2 产品定位

**拉客力数据中台**是拉克力全产品一体化中台的"数据底座 + 能力复用层"。它不替代任何业务模块，而是把各模块的数据**汇聚、规范化、服务化**，向所有模块和统一工作台提供统一的数据能力：

- **统一指标**：指标一次定义、处处可用，消灭硬编码 SQL；
- **统一主数据**：一个客户 / 一个租户 / 一条知识，在全平台是同一实体；
- **统一服务**：所有前端经单一入口 `/api/dp/*` 取数，而非直连业务接口；
- **统一治理**：数据标准、质量、血缘、权限集中管控。

> 命名说明：原「跨境外贸知识引擎」已统一改名为「拉客力数据中台」（前端 Phase 0 已完成），本 PRD 将其从"多租户监控页"升级为真正的"数据中台"。

### 1.3 目标用户

| 角色 | 权限范围 | 核心场景 |
|------|---------|---------|
| 超级管理员 | 全部权限 | 数据中台全局配置、治理看板、权限分配 |
| 数据运营（运营） | 指标定义、看板、治理 | 定义指标、搭建全域看板、监控数据质量 |
| 业务模块负责人 | 本模块数据接入、消费 | 把本模块数据接入中台、消费统一能力 |
| 系统（各模块服务） | 服务间调用 | 经 `/api/dp/*` 读写统一数据 |

### 1.4 与现状对比

| 维度 | 现状（无中台） | 目标（数据中台） |
|------|----------------|------------------|
| 取数方式 | 每模块直连 `/api/xxx` + 硬编码 SQL | 统一 `/api/dp/*` + 配置驱动指标 |
| 客户实体 | 各模块各自识别，互不相通 | 统一 `customer_id` 跨模块打通 |
| 知识资产 | `knowledge_base` 与 `ke_*` 双轨 | 统一知识库，中台自用作为"内部空间"租户 |
| 新增指标成本 | 改 SQL + 接口 + 前端（3 处） | 在 `dp_metric_definitions` 加一行配置 |
| 数据质量 | 仅 `ke_governance_items` 雏形 | 全中台质量 / 血缘 / 标准监控 |

---

## 2. 总体架构

数据中台采用 **L0–L4 五层架构**，自上而下逐层依赖：

```
┌─ L4 治理层 (Governance)
│   数据标准 · 数据质量 · 血缘 · 权限（基于 ke_governance_items 扩展）
│
├─ L3 共享能力 (Capabilities)
│   指标平台 · 客户360(CDP) · 知识中台 · 标签分群 · 报告中心
│
├─ L2 统一服务层 (Unified Service)
│   单一入口 /api/dp/* ：指标查询 / 实体查询 / 维度查询 / 知识读写
│
├─ L1 主数据 & 统一维度 (MDM & Conformed Dimensions)
│   租户 · 客户 · 时间 · 模块/渠道 · 商品/店铺（统一主键 + 映射）
│
└─ L0 数据底座 (Data Foundation)
    各模块 OLTP → CDC/定时 ETL → 统一数仓（dp schema）+ 规范模型
```

**关键原则**：业务模块（龙掌柜 / 外呼 / GEO / AI客服）继续写各自的 OLTP 库，中台通过 CDC 或定时 ETL **同步**数据进 `dp` 命名空间，模块本身不感知中台存在（解耦）。

---

## 3. 核心能力模块

### 3.1 L0 数据底座（统一数仓）

**目标**：建立 `dp` 命名空间（可独立库或 schema），包含规范的**事实表**与**维度表**。

| 组成部分 | 说明 |
|----------|------|
| 同步管道 | 对各模块表建立 CDC（优先）或定时 ETL 任务，写入 `dp.fact_*` / `dp.dim_*` |
| 维度表 | `dp.dim_tenant`（租户）、`dp.dim_customer`（客户主数据）、`dp.dim_time`、`dp.dim_module`、`dp.dim_product_shop` |
| 事实表 | `dp.fact_revenue`（营收）、`dp.fact_chat`（会话）、`dp.fact_lead`（线索）、`dp.fact_call`（外呼）、`dp.fact_knowledge`（知识操作）等 |
| 调度/监控 | 同步任务状态、延迟、失败告警 |

**验收**：任一模块的写入，能在约定延迟内（首期 T+1，后续近实时）反映到 `dp` 对应表。

### 3.2 L1 主数据 & 统一维度（最关键）

**目标**：解决"同一实体多处识别"问题，这是数据中台的灵魂。

| 主数据 | 现状 | 中台做法 |
|--------|------|----------|
| 租户 | `ke.ke_tenants` 仅覆盖知识引擎 | 升级为全平台 `dp.dim_tenant`，各模块租户统一映射 |
| 客户 | `admin.customers` 唯一，但龙掌柜/外呼/GEO 无关联 | 建立 `dp.dim_customer`，用 `customer_id` + 跨模块映射表打通身份 |
| 商品/店铺 | `lzg.products` / `lzg.shops` | 映射进 `dp.dim_product_shop` |
| 时间/模块 | 各接口自行处理 | 统一 `dp.dim_time` / `dp.dim_module` 维度 |

**客户主数据设计（P0）**：
- `dp.dim_customer(customer_id PK, source_system, source_id, unified_profile_json, created_at)`；
- `dp.map_customer_identity(source_system, source_id → customer_id)` 维护跨模块身份映射；
- 对外提供"客户 360"视图：聚合该客户在龙掌柜、外呼、GEO、线索中的全部痕迹。

### 3.3 L2 统一服务层（单一入口）

**目标**：所有前端与模块经 `/api/dp/*` 取数，替代直连业务接口。

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/dp/metrics` | GET | 指标查询：`?name=monthly_revenue&filters=tenant_id:xxx&period=2026Q2` |
| `/api/dp/entities/customer/:id` | GET | 客户 360 视图 |
| `/api/dp/dimensions/:name` | GET | 维度枚举（行业、套餐、模块等） |
| `/api/dp/knowledge` | GET/POST/PUT/DELETE | 知识中台读写（见 3.4） |
| `/api/dp/governance` | GET | 治理指标（质量 / 血缘 / 标准） |

前端需新增 `src/lib/services/data-platform-api.ts`，各模块页面从直连 `/api/xxx` 迁移到本服务（分阶段，详见第 6 章）。

### 3.4 L3 共享能力

#### 3.4.1 指标平台（Metrics Platform）—— 最高杠杆

把 `/api/admin/analytics` 的硬编码 SQL **升级为配置驱动**：

- 新增表 `dp.dp_metric_definitions(name, sql_template, dimensions, owner_module, status)`；
- `GET /api/dp/metrics?name=xxx` 由引擎读取模板、注入过滤条件后执行；
- **新增指标 = 加一行配置，零改码**。

首期纳入指标（复用既有 analytics 逻辑）：
- `monthly_revenue`（月度营收，源 `admin.billing_records`）
- `industry_distribution` / `plan_distribution`（客户行业 / 套餐分布）
- `lead_conversion`（线索转化，源 `admin.leads`）
- `ke_import_trend` / `ke_tenant_growth`（知识引擎趋势，源 `ke.*`）
- 后续新增龙掌柜活跃、外呼通话量等。

#### 3.4.2 知识中台（Knowledge Platform）—— 收编既有双轨

将"中台自有知识库"与"知识引擎"合并为统一知识库：

- `knowledge_base`（龙掌柜 RAG 实时源）迁进统一知识表，作为 **"中台内部空间"租户**（`vector_space='lakeli-internal'`）；
- 龙掌柜 RAG 检索（`lakeli-app-xc/src/lib/agent/knowledge.ts`）改指统一库按空间过滤，行为不变；
- 前端 `/knowledge`（中台知识空间）的增删改查并入知识引擎视图，原独立页面择机下线（即此前 Phase 1–3）。

#### 3.4.3 标签分群（Tagging & Segmentation）

- `dp.dim_tag` + `dp.fact_entity_tag` 维护客户 / 租户标签；
- 支持规则分群（如"近 30 天无会话的活跃客户"），供各模块精准触达。

#### 3.4.4 报告中心（Reporting）

- 基于统一指标 + 维度，生成可订阅 / 可导出的全域报告；
- 复用既有 `exportToCsv` 能力。

### 3.5 L4 治理层

- 将 `ke.ke_governance_items`（实体完整率）扩展为全中台数据质量监控；
- 增加**血缘**视图：指标 → 源表 → 同步管道可追溯；
- 数据标准：统一字段命名、枚举值（行业 / 套餐 / 状态）字典。

---

## 4. 数据模型（首期关键表）

| 表 | 层级 | 作用 |
|----|------|------|
| `dp.dp_metric_definitions` | L3 | 指标定义（配置驱动） |
| `dp.dim_tenant` | L1 | 全平台租户主数据 |
| `dp.dim_customer` | L1 | 客户主数据 |
| `dp.map_customer_identity` | L1 | 跨模块客户身份映射 |
| `dp.dim_time` / `dp.dim_module` | L1 | 通用维度 |
| `dp.fact_revenue` / `fact_lead` / `fact_call` / `fact_chat` | L0 | 规范事实表 |
| `dp.dim_tag` / `dp.fact_entity_tag` | L3 | 标签分群 |
| `dp.dp_governance` | L4 | 治理指标 |

---

## 5. 前端改造（配套）

1. 新增 `src/lib/services/data-platform-api.ts`（统一服务层客户端）；
2. 工作台 `/dashboard` 图表从硬编码 `/api/admin/analytics` 切换到 `/api/dp/metrics`；
3. 各模块页面分批从直连 `/api/xxx` 迁移到 `/api/dp/*`（见路线图）；
4. 「拉客力数据中台」菜单下新增：指标平台、客户 360、标签分群、治理看板子项；
5. 既有 `knowledge-engine-api.ts` 与 `admin-api.ts` 中"全域 / 指标"相关方法逐步收敛进 `data-platform-api.ts`。

---

## 6. 实施路线图

| 阶段 | 名称 | 范围 | 优先级 | 风险 |
|------|------|------|--------|------|
| **Phase A** | 指标服务化 | 建 `dp` 模块 + `dp_metric_definitions` + `/api/dp/metrics`，工作台图表切换 | P0 | 低（不改表结构） |
| **Phase B** | 客户 360 / 主数据 | `dp.dim_customer` + 身份映射 + `/api/dp/entities/customer` | P0 | 中（需跨模块身份规则） |
| **Phase C** | 知识中台收编 | `knowledge_base` 迁入统一库，龙掌柜 RAG 改指 | P1 | 中（影响龙掌柜回答，需回归） |
| **Phase D** | 统一服务入口 | 前端 `data-platform-api.ts`，各模块迁移取数 | P1 | 中 |
| **Phase E** | 治理层 | 质量 / 血缘 / 标准看板 | P2 | 低 |

**建议首发 Phase A**：直接解决"加指标改三处"痛点，不动表结构、可回退，并为后续所有能力立起统一取数方式。

---

## 7. 风险与依赖

| 风险 | 说明 | 缓解 |
|------|------|------|
| 数据延迟 | ETL 非实时导致看板滞后 | 首期 T+1，关键指标后续上 CDC |
| 客户身份歧义 | 跨模块无共同键，映射困难 | Phase B 先定义映射规则 + 人工校准 |
| 龙掌柜回归 | 知识收编可能改变 RAG 结果 | Phase C 灰度 + 召回率对比测试 |
| 范围蔓延 | 中台易贪大 | 严格按 Phase 推进，每个 Phase 可独立交付 |

---

## 8. 成功指标

- 新增一个全域指标的平均工时：从 ~3 处改动 → 1 行配置（目标下降 80%）；
- 跨模块客户身份打通率：首期 ≥ 70%；
- 前端直连业务接口比例：从 100% → 目标 ≤ 30%（核心看板走 `/api/dp/*`）；
- 知识资产复用：龙掌柜与知识引擎共用同一知识源（0 双轨）。

---

## 9. 待确认事项

1. `dp` 命名空间落地形态：独立数据库 vs 独立 schema（建议独立 schema，运维简单）；
2. 同步方式首期：CDC（如 Debezium）vs 定时 ETL（建议首期定时 ETL，成本低）；
3. 龙掌柜 RAG 迁移是否随 Phase C 一次性切换，还是长期双写灰度；
4. 「拉客力数据中台」对外是否仍保留独立 SaaS 品牌（内部已改名，对外待定）；
5. Agent 管理插件（`拉克力agent管理/`，当前未实现）后续是否也作为中台的一个能力接入。
