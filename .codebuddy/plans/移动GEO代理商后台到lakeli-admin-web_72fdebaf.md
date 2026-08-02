---
name: 移动GEO代理商后台到lakeli-admin-web
overview: 将 yutu-geo 的「代理商后台」两个页面（agency 客户BVI看板、agent 子账号/分成）整页搬入 lakeli-admin-web 的「域途 GEO SaaS」菜单下，作为两个独立入口，修复 GEO 专属样式类名与内部路由依赖。
todos:
  - id: add-sidebar-menu
    content: 在 sidebar.tsx 的 GEO 菜单组新增 agency/agent 子项并配置角色权限
    status: completed
  - id: copy-agency-page
    content: 复制并适配 agency 页面到 geo/agency，替换 geo-* 样式、移除大屏跳转
    status: completed
    dependencies:
      - add-sidebar-menu
  - id: copy-agent-page
    content: 复制并适配 agent 页面到 geo/agent，替换 geo-* 样式、移除 plan 门控
    status: completed
    dependencies:
      - add-sidebar-menu
  - id: verify-and-commit
    content: 运行 ts-check 与 lint，启动验证后提交本地 git
    status: completed
    dependencies:
      - copy-agency-page
      - copy-agent-page
---

## 用户需求

将域途 GEO SaaS 系统中的两个「代理商后台」页面（客户 BVI 看板 agency、子账号/分成管理 agent）以「整页搬代码」方式迁移到 lakeli-admin-web 的「域途 GEO SaaS」侧边栏菜单组下，作为统一后台 GEO 插件的两个独立入口，保留两个独立页面不合并。

## 产品概述

在拉克力统一后台的「域途 GEO SaaS」菜单下新增「代理商客户 BVI」与「代理商后台」两个子页面，复用 GEO 系统既有的代理商管理能力（客户 BVI 健康度看板、子账号与分成管理），使代理商相关功能在统一后台中可访问，不再仅散落在 GEO 独立控制台。

## 核心功能

- 代理商客户 BVI 看板：并行拉取多个客户的 BVI 指数、等级、趋势 sparkline、AI 推荐率/首位率/平台数、动态预警，点击进入实时大屏（本次移除大屏跳转按钮，仅保留卡片）。
- 代理商后台（子账号/分成）：展示子账号列表、活跃数、累计佣金、邀请码复制，支持开通子账号（POST），展示收益明细表。
- 侧边栏「域途 GEO SaaS」菜单组新增两个子菜单项，按 GEO 模块既有角色权限（超管+运营）可见。

## 技术栈

- 目标项目：Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 4 + shadcn/ui (Radix)
- 数据接口：`/api/geo/monitoring`、`/api/geo/agent`（经 lakeli next.config.ts rewrites 代理到 `lakeli-app-xc:5002/api/*`，与现有 GEO 菜单页 `/api/geo/admin-records` 同路由前缀，无需改代理配置）
- 图表：recharts（源页面已用，lakeli 已依赖）

## 实现方案

### 总体策略

将 `yutu-geo` 的 `agency/page.tsx` 与 `agent/page.tsx` 两个组件代码复制至 `lakeli-admin-web/src/app/(dashboard)/geo/` 下的 `agency/`、`agent/` 路由目录；在 `sidebar.tsx` 注册两个子菜单；对复制后的代码做「去 GEO 专属样式 + 去 GEO 内部路由/门控」适配，使其符合 lakeli 主题 token 与权限体系。源项目文件保留不删。

### 关键技术决策

1. **路由放置**：直接复用 lakeli 已有的 `(dashboard)/geo/` 路由组（含 diagnostics/copy/keywords/monitor/templates），与现有 GEO 页面保持一致的目录约定与布局守卫，无需新建路由组。
2. **样式适配**：源页面使用 `geo-*` 专属 Tailwind token（bg-geo-blue / text-geo-slate-900 / bg-geo-blue-lighter 等），lakeli 的 globals.css 未定义这些 token，必须替换为 lakeli 等价类（bg-primary/text-primary、text-gray-900/500/400、bg-gray-50、bg-blue-50），recharts 内联 style 的十六进制色值保留不动。
3. **权限适配**：agent 页原用 `user.plan !== 'pro'` 做会员门控，lakeli 超管体系无 plan 字段，移除该门控与 `/dashboard/membership` 跳转，仅保留登录态（路由守卫已统一处理）；agency 页 `router.push('/dashboard/bigscreen')` 为 GEO 内部路由，本次移除该按钮仅保留卡片。
4. **接口连通性**：后端 `lakeli-app-xc:5002` 已暴露 `/api/geo/*`（现有 GEO 菜单页可运行证明），`/api/geo/monitoring` 与 `/api/geo/agent` 为 GEO 系统已运行接口，lakeli 代理可直接命中。两个 fetch 均已有 try/catch 静默降级，后端若未注册对应路由则页面显示空态/加载中，不阻断渲染。

### 性能与可靠性

- agency 页 `Promise.all` 并行拉取 6 个客户 BVI + 60s 轮询间隔，与源实现一致，无额外开销；复制时注意保持 `setInterval` 在 `useEffect` 清理函数中 `clearInterval` 防内存泄漏。
- agent 页创建子账号 POST 后乐观更新本地列表，保留源逻辑。
- 两个页面均为客户端组件（`'use client'`），与 lakeli GEO 现有页一致。

## 实现注意事项

- 复制后务必全局替换 `geo-*` 类名，避免 lakeli 下样式缺失（grep 确认无残留）。
- 复制后检查 import 路径：`@/components/ui/card`、`@/components/ui/button`、`@/components/ui/input`、`@/components/ui/badge`、`@/lib/auth` 在 lakeli 均存在，直接复用；recharts 与 lucide-react 均已安装。
- agent 页移除 `useAuth` 的 `plan` 用途后，若 `user` 不再被引用则同步移除 import 以避免 lint 报错。
- 改动完成后按工作区规则 `git add -A && git commit` 提交本地仓库。

## 架构设计

本任务为既有架构下的页面新增，不引入新模式：

- 侧边栏菜单数据驱动（`menuGroups` + `ROLE_ACCESS`），新增两项即完成入口注册。
- 页面组件位于 `(dashboard)/geo/` 路由组，自动继承 dashboard 布局守卫与模块主题（GEO 主色 #0F52BA）。
- 数据流向：页面 fetch `/api/geo/*` → 经 next.config rewrites → `lakeli-app-xc:5002` → 返回 JSON → 组件 setState 渲染。

## 目录结构

```
lakeli-admin-web/
├── src/
│   ├── app/(dashboard)/geo/
│   │   ├── agency/
│   │   │   └── page.tsx        # [NEW] 代理商客户 BVI 看板。复制自 yutu-geo agency/page.tsx，替换 geo-* 样式为 lakeli token，移除大屏跳转按钮，保留并行拉取与轮询。
│   │   └── agent/
│   │       └── page.tsx        # [NEW] 代理商后台（子账号/分成）。复制自 yutu-geo agent/page.tsx，替换 geo-* 样式，移除 plan 门控与 membership 跳转，保留子账号列表/创建/收益明细。
│   └── components/layout/
│       └── sidebar.tsx         # [MODIFY] 在 geo 菜单组 children 新增 geo-agency(/geo/agency)、geo-agent(/geo/agent) 两项；ROLE_ACCESS 新增两 key 赋 [ADMIN_ROLE, OPERATOR_ROLE]；复用已 import 的 Building2、Users 图标。
```