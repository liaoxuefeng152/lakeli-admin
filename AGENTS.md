# 拉克力后台管理系统 - AGENTS.md

> 本文档由 AI 维护，反映代码真实状态。如发现与代码不符，请直接修改本文件。

## 项目概览

拉克力后台管理系统是公司全产品一体化统一管理中台，采用「统一底座 + 业务模块化插件」架构。当前已集成以下业务模块：

- **龙掌柜 AI 助手**（`lzg`）：AI 对话、会话、技能、运行环境配置、知识空间、商品/店铺/素材/收藏、配额。
- **拉克力管理后台**（`admin`）：账号权限、活动日志、计费、操作日志、**模型配置（平台级全局 LLM 管理中心）**。
- **域途 GEO SaaS**（`geo`）：GEO 诊断、文案生成、关键词、AI 监测、行业模板、报告。
- **智推 AI 客服**（`ai-service`）：意向关键词、配额、企微会话存档、反馈统计。
- **智能外呼**（`outbound-call`）：外呼任务、号码、黑名单、话术、通话记录、报表、阿里云配置。
- **跨境外贸知识引擎**（`knowledge-engine`）：租户、账号、GEO 内容、治理项、导入任务、知识缺口、QA 日志、报告。（已作为知识库中台统一底座，`ke.knowledge_entries` 收编了原 `knowledge_base` 表，龙掌柜 RAG 通过租户隔离共享同一知识底座）
- **拉客力数据中台**（`dp`）：统一数据底座与能力复用层。L0 事实表（`dp.fact_*`）、L1 主数据（`dp.dim_*` / `map_customer_identity`）、L2 统一服务层（`/api/dp/*`）、L3 指标平台（配置驱动）/ 客户 360 / 标签分群、L4 治理层。详见 `PRD-拉客力数据中台.md`。

> 注：**Agent 管理插件（`agent/*`）已从代码中删除**（页面、菜单、路由均已移除），本文件不再描述该插件。相关 PRD 文档仍在 `拉克力agent管理/` 目录，但暂未实现。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **包管理**: pnpm 9+

## 构建与运行

```bash
# 安装依赖
pnpm install

# 开发环境（前端，默认 http://localhost:3000）
pnpm run dev

# 构建
pnpm run build

# 生产启动
pnpm run start

# 类型检查
pnpm ts-check

# Lint
pnpm lint
```

### 依赖的后端服务

前端本身**不含任何 API 路由**（`src/app/api` 不存在）。所有数据请求通过 `next.config.ts` 的 `rewrites` 代理转发：

```
前端 /api/*  --(rewrite)-->  http://localhost:5002/api/*  （lakeli-app-xc 后端）
```

因此**必须同时运行后端 `lakeli-app-xc`**（端口 5002），真实接口才可用。后端地址由 `NEXT_PUBLIC_API_URL` 控制（默认 `http://localhost:5002`）。

## 目录结构

```
src/
├── app/
│   ├── (auth)/login/           # 登录页（当前为前端模拟，未接真实鉴权）
│   ├── (dashboard)/            # 管理后台路由组
│   │   ├── dashboard/          # 工作台首页（统一概览：/api/dashboard + /api/admin/analytics + /api/outbound/dashboard 全模块汇总）
│   │   ├── accounts/           # 账号权限管理（真实接口）
│   │   ├── customers/          # 全域客户档案（真实接口）
│   │   ├── leads/              # 全域线索管理（真实接口）
│   │   ├── orders/             # 订单计费中心（真实接口：billing_records / subscriptions）
│   │   ├── platform/          # 平台管理
│   │   │   └── models/          # 模型配置（全局 LLM 管理中心，所有智能体统一调用）
│   │   ├── knowledge/          # 知识空间（归属龙掌柜 AI 助手，底层为 ke.knowledge_entries 表龙掌柜租户）
│   │   ├── wecom/              # 企微配置中心
│   │   ├── analytics/          # （已删除：与工作台定位重复，全域图表已并入 /dashboard）
│   │   ├── operation-log/      # 操作日志（真实接口）
│   │   ├── geo/                # 域途 GEO SaaS 插件（真实接口：/api/geo/admin-records）
│   │   │   ├── diagnostics/    # GEO诊断记录（真实：geo.admin_diagnosis）
│   │   │   ├── copy/           # 文案生成记录（真实：geo.admin_copywriting）
│   │   │   ├── keywords/       # 关键词挖掘（真实：geo.admin_keywords）
│   │   │   ├── monitor/        # AI监测数据（真实：geo.admin_monitoring / _trend）
│   │   │   └── templates/      # 行业模板管理（真实：geo.admin_templates）
│   │   ├── ai-service/         # 智推 AI 客服插件
│   │   │   ├── keywords/       # 意向关键词配置
│   │   │   ├── quota/          # AI配额设置
│   │   │   ├── wecom-archive/  # 企微会话存档
│   │   │   └── feedback/       # 用户反馈统计（已接入 F1.2 真实情感 NLP：src/lib/sentiment.ts 词典式分析，正向/负向/中性分布 + 逐条标签）
│   │   ├── lib/sentiment.ts     # 真实中文情感 NLP 模块（F1.2）：正向/负向词 + 否定词 + 程度副词加权，纯前端可复现
│   │   ├── outbound-call/      # 智能外呼插件
│   │   │   ├── page.tsx        # 外呼工作台（插件首页）
│   │   │   ├── tasks/          # 外呼任务管理
│   │   │   ├── numbers/        # 客户号码管理
│   │   │   ├── blacklist/      # 黑名单管理
│   │   │   ├── scripts/        # AI话术场景管理
│   │   │   ├── records/        # 通话记录与复盘
│   │   │   ├── reports/        # 数据报表中心
│   │   │   └── config/         # 阿里云接口配置
│   │   ├── lzg/                # 龙掌柜 AI 助手（独立品牌模块）
│   │   │   ├── dashboard/      # 概览仪表盘
│   │   │   ├── sessions/       # 会话记录（真实接口）
│   │   │   ├── skills/         # 技能管理（真实接口：/api/skills GET/PATCH）
│   │   │   ├── env-config/     # 运行环境配置（沙盒、浏览器自动化）
│   │   │   ├── assets/         # 素材（真实接口）
│   │   │   ├── products/       # 商品（真实接口）
│   │   │   ├── shops/          # 店铺（真实接口）
│   │   │   └── quota/          # 配额（真实接口：/api/admin/plans GET/PUT）
│   │   ├── knowledge-engine/   # 跨境外贸知识引擎（对外 SaaS 产品）
│   │   │   ├── page.tsx        # 产品概览（真实接口：/api/knowledge-engine stats/tenants）
│   │   │   ├── logs/           # 日志统计中心（真实接口：/api/knowledge-engine import-logs / geo-logs / qa-logs）
│   │   │   └── permissions/     # 系统权限管理（真实接口：/api/knowledge-engine tenants / accounts）
│   │   └── dp/                 # 拉客力数据中台（统一数据底座，独立顶级模块）
│   │       ├── metrics/        # 指标平台（L3，配置驱动）
│   │       ├── customer-360/    # 客户 360（L1，跨模块身份归并）
│   │       ├── tags/            # 标签分群（L3.3）
│   │       └── governance/      # 治理看板（L4）
│   └── layout.tsx              # 根布局
├── components/
│   ├── layout/                 # 布局组件
│   │   ├── sidebar.tsx         # 侧边菜单栏
│   │   └── top-nav.tsx         # 顶部导航栏
│   └── ui/                     # shadcn/ui 组件库
├── lib/
│   ├── mock-data.ts            # Mock 假数据（41KB，52 个导出）
│   ├── utils.ts                # 工具函数
│   ├── services/admin-api.ts   # 真实接口服务层（BASE='/api/admin'，经代理到后端）
│   ├── services/data-platform-api.ts # 数据中台服务层（BASE='/api/dp'，统一取数）
└── hooks/                      # 自定义 Hooks
```

## 数据层：真实接口 vs Mock（重要）

当前页面数据来源**分裂为两套**，这是已知技术债：

| 数据层 | 文件 | 使用页面 | 现状 |
|--------|------|----------|------|
| 真实接口 | `src/lib/services/admin-api.ts` | accounts、knowledge、operation-log、lzg/*、dashboard(部分)、ai-service/*、outbound-call/* | 经代理打到 `lakeli-app-xc:5002`，需后端运行 |
| 数据中台 | `src/lib/services/data-platform-api.ts` | dp/metrics、customer-360、tags、governance | 经代理打到 `lakeli-app-xc:5002` 的 `/api/dp/*` |
| Mock 假数据 | `src/lib/mock-data.ts` | （已清空：ai-service/outbound 均已切真实接口） | 直接前端硬编码，无需后端 |

**原则（待落地）**：演示时可用 mock，但生产应统一走 `admin-api`。页面中仍在使用的 mock 数据均已标注「演示数据」横幅，导出按钮已全部接线 CSV 下载。

## 设计规范

### 色彩体系
- **主色**: #1677FF (拉克力蓝)
- **GEO插件**: #0F52BA (深蓝)
- **AI客服插件**: #00B42A (绿色)
- **智能外呼插件**: #1677FF (蓝色，与系统主色一致)
- **危险色**: #F53F39
- **警告色**: #FF7D00
- **成功色**: #00B42A

> 注：**「主题色随模块切换」尚未实现**，目前主色全局硬编码为 `#1677FF`。这是已知待办。

### 字体
- 中文: PingFang SC / Microsoft YaHei
- 英文: Inter

## 品牌一致性（已定稿：插件化架构）

平台外壳（登录页、顶栏、统一工作台 `/dashboard`）统一使用「拉克力后台管理系统」。各业务模块在自身页面保留独立产品品牌：

- 龙掌柜 AI 助手（`lzg/*`，含其 `lzg/dashboard` 标题「龙掌柜数据看板」）
- 跨境外贸知识引擎（`knowledge-engine/*`）
- 域途 GEO SaaS（`geo/*`）
- 智推 AI 客服（`ai-service/*`）
- 智能外呼（`outbound-call/*`）
- 拉客力数据中台（`dp/*`，内部统一数据底座，页面主题为青色 #13C2C2；指标/客户360/标签/治理均为全域能力，并非知识引擎子功能）

统一工作台 `/dashboard` 标题已改为「拉克力管理后台 · 概览仪表盘」，不再误用「龙掌柜」品牌。

## 路由说明

| 路径 | 页面 | 数据来源 |
|------|------|----------|
| `/login` | 登录页 | 真实鉴权（POST /api/auth/login，返回含 role 的用户）；后端不可用时降级为演示账号 admin@lakeli.com/admin123 |
| `/dashboard` | 工作台（统一概览） | 真实接口（/api/dashboard 龙掌柜 + /api/admin/analytics 全域 + /api/outbound/dashboard 外呼） |
| `/accounts` | 账号管理 | 真实接口（超管可见） |
| `/customers` | 客户档案 | 真实接口（/api/admin/customers） |
| `/leads` | 线索管理 | 真实接口（/api/admin/leads） |
| `/orders` | 订单计费中心 | 真实接口（/api/admin/billing：billing_records / subscriptions） |
| `/knowledge` | 知识空间（龙掌柜） | 真实接口（/api/admin/knowledge → ke.knowledge_entries，龙掌柜租户） |
| `/wecom` | 企微配置 | 演示页，未接后端（保存仅存本地，不真正下发企微） |
| `/platform/models` | 模型配置（全局 LLM 管理中心） | 真实接口（/api/admin/models CRUD，DB 表 `ai_models` 含 api_key/api_base_url/provider） |
| `/analytics` | （已删除，合并入 `/dashboard`） | — |
| `/operation-log` | 操作日志 | 真实接口 |
| `/geo/*` | GEO 插件 | 总览页为 mock；诊断/文案/关键词走真实接口（/api/geo/admin-records） |
| `/ai-service/*` | AI 客服插件 | 真实接口（/api/ai-service：records 多类型 / quota-config） |
| `/outbound-call/*` | 智能外呼插件 | 真实接口（/api/outbound：records / dashboard / reports / config / blacklist） |
| `/lzg/*` | 龙掌柜 AI 助手 | 真实接口(部分) + mock |
| `/knowledge-engine` | 产品概览 | 真实接口（/api/knowledge-engine：stats / tenants） |
| `/dp/metrics` | 指标平台（数据中台 L3） | 真实接口（/api/dp/metrics + definitions，配置驱动） |
| `/dp/customer-360` | 客户 360（数据中台 L1） | 真实接口（/api/dp/entities/customer/[id]） |
| `/dp/tags` | 标签分群（数据中台 L3.3） | 真实接口（/api/dp/tags + segments） |
| `/dp/governance` | 治理看板（数据中台 L4） | 真实接口（/api/dp/governance） |
| `/knowledge-engine/logs` | 日志统计中心 | 真实接口（/api/knowledge-engine：import-logs / geo-logs / qa-logs） |
| `/knowledge-engine/permissions` | 系统权限管理 | 真实接口（/api/knowledge-engine：tenants / accounts） |

## 角色权限（已落地）

鉴权链路：`src/lib/auth.tsx`（AuthProvider + useAuth）封装登录/登出与会话持久化（localStorage）。`(dashboard)/layout.tsx` 为路由守卫，未登录跳转 `/login`。

侧边栏按 `ROLE_ACCESS` 矩阵（key → 允许角色，缺省=全部已登录角色）过滤菜单（`src/components/layout/sidebar.tsx`）。角色层级：**admin(超级管理员) > operator(运营) > sales(销售) > user(普通用户)**。

| 角色 | 可见模块 |
|------|----------|
| 超级管理员（admin） | 全部 |
| 运营（operator） | 工作台（概览）、客户档案、线索、订单、知识库、GEO(全)、AI客服(配置)、外呼(全)、龙掌柜(全)、跨境外贸知识引擎(全)；不含账号/企微/操作日志 |
| 销售（sales） | 工作台、客户档案、线索、订单、外呼(全，不含阿里云配置) |
| 普通用户（user） | 工作台、客户档案、线索、AI客服（仅「全量对话记录」） |

> 注：后端 `/api/auth/login` 走 `lzg.users` 表（role 枚举 admin/operator/sales/user）。演示 seed（`lakeli-app-xc/scripts/seed-admin-user.sql`）已写入 `admin@lakeli.com / admin123`（超管）、`operator@lakeli.com / operator123`（运营）、`sales@lakeli.com / sales123`（销售）三条带密码账号；后端不可用时前端降级到同款演示账号。

## 主题色随模块切换（已落地）

`globals.css` 通过 `@theme inline` 将 `--color-primary: var(--primary)` 映射为 Tailwind 的 `bg-primary / text-primary / border-primary` 等 token；`src/components/layout/module-theme.tsx` 的 `ModuleTheme` 按当前路由前缀设置 `--primary` 等 CSS 变量（已在 `Providers` 挂载）。所有组件统一改用 `bg-primary` 等主题 token（已批量替换原硬编码 `bg-[#1677FF]`），主色随模块自动切换：

| 模块 | 主色 |
|------|------|
| 知识引擎 / 工作台 / 龙掌柜 / 外呼 | `#1677FF`（拉克力蓝） |
| 域途 GEO SaaS | `#0F52BA`（深蓝） |
| 智推 AI 客服 | `#00B42A`（绿） |

## 注意事项

- 前端为纯演示/管理界面，数据依赖后端 `lakeli-app-xc` 或本地 mock。
- 所有页面采用插件化架构；「登录鉴权」「角色权限」「主题色随模块切换」均已完成前端落地（后端就绪后即为真实鉴权/真实数据）。
- **模型配置已提升为平台级全局管理**：`/platform/models` 是唯一的 LLM 模型配置入口，所有智能体（龙掌柜、GEO、智推、外呼等）统一通过 `/api/public/models` 拉取模型列表；后端的 `engine.ts` 按模型从 `ai_models` 表动态获取 `api_key` / `api_base_url` / `provider`，不再硬编码于 `.env` 或代码中。各前端项目的 `BUILTIN_MODELS` 已削减为最小 fallback（仅「自动」模式）。
- 表格统一支持筛选、排序、批量操作；高危操作（删除/禁用）需二次确认。
- 导出按钮均已接线 `exportToCsv`；「忘记密码」点击给出演示提示；外呼「播放/下载录音」已接线 `recordingUrl`（无则提示待后端提供）。
- **等保三级合规（NF6）**：域途 GEO SaaS 的等保三级合规设计见 `docs/等保三级-域途GEO SaaS合规设计.md`，含控制项映射、已落地措施、NF6-1~NF6-8 整改清单与测评推进路线（密钥托管、双因子、敏感字段加密、审计归集等）。
