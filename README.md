# 拉克力后台管理系统 (lakeli-admin-web)

公司全产品一体化统一管理中台的前端管理界面。采用「统一底座 + 业务模块化插件」架构，当前集成：龙掌柜 AI 助手、拉克力后台管理、域途 GEO SaaS、智推 AI 客服、智能外呼、跨境外贸知识引擎 六大模块。

> 本项目为**纯前端**，所有真实数据来自独立的后端服务 [`lakeli-app-xc`](../../lakeli-app-xc)（端口 5002）。前端通过 `next.config.ts` 的 rewrite 代理将 `/api/*` 转发到后端。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **核心**: React 19 + TypeScript 5
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS v4
- **图表**: Recharts
- **图标**: Lucide React
- **包管理**: pnpm 9+

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动后端（必需）

真实数据依赖后端 `lakeli-app-xc`。在另一个终端启动它（默认 5002 端口）：

```bash
cd ../lakeli-app-xc
docker compose -f docker-compose.dev.yml up -d db   # 先起数据库
pnpm run dev                                         # 启动后端 API
```

### 3. 启动前端

```bash
pnpm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5002` | 后端地址，前端 `/api/*` 代理目标 |

## 项目结构

```
src/
├── app/
│   ├── (auth)/login/        # 登录页（前端模拟，未接真实鉴权）
│   ├── (dashboard)/         # 管理后台路由组（见 AGENTS.md 完整路由表）
│   │   ├── dashboard/        # 工作台
│   │   ├── accounts/         # 账号权限（真实接口）
│   │   ├── knowledge/        # 知识库（真实接口）
│   │   ├── lzg/              # 龙掌柜 AI 助手
│   │   ├── geo/              # 域途 GEO 插件
│   │   ├── ai-service/       # 智推 AI 客服插件
│   │   ├── outbound-call/    # 智能外呼插件
│   │   ├── knowledge-engine/ # 跨境外贸知识引擎
│   │   └── ...               # customers / leads / orders / analytics 等
│   └── layout.tsx
├── components/layout/        # sidebar.tsx / top-nav.tsx
├── lib/
│   ├── services/admin-api.ts # 真实接口服务层（BASE='/api/admin'）
│   ├── mock-data.ts          # Mock 假数据
│   └── utils.ts
└── hooks/
```

## 数据层说明（重要）

页面数据来源分两套，详见 `AGENTS.md`：

- **真实接口**：`src/lib/services/admin-api.ts`，请求 `/api/admin/*`，由 rewrite 代理到后端 `lakeli-app-xc`。
- **Mock 假数据**：`src/lib/mock-data.ts`，前端硬编码，无需后端。

> 演示时 mock 可用；生产环境应统一走 `admin-api`。`outbound-call/*` 等页面的「导出」等按钮部分仅有 UI、无真实 `onClick`。

## 已知待办（按优先级）

| 优先级 | 事项 | 说明 |
|--------|------|------|
| P0 | 统一数据层 | 明确 mock 仅作 fallback，自有后端的页面稳定接 `admin-api` |
| P0 | 登录鉴权 + 角色权限 | 当前登录硬编码 `admin/admin123`，无 token/会话；角色未约束菜单 |
| P1 | 后端补接口 | `customers`/`leads`/`orders` 等页面后端暂无对应接口 |
| P2 | 主题色随模块切换 | 设计稿要求 GEO 深蓝/AI 绿/Agent 橙，当前全局硬编码 `#1677FF` |
| P2 | 清理占位按钮 | 「导出」「忘记密码」等按钮无响应 |

## 构建与部署

```bash
pnpm run build   # 生产构建
pnpm run start   # 生产启动
pnpm ts-check    # 类型检查
pnpm lint        # Lint
```
