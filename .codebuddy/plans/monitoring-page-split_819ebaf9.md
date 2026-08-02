---
name: monitoring-page-split
overview: 将 yutu-geo 的 AI收录监测页面拆分为监测任务列表页和监测详情页，解决一个页面混合任务管理和监测结果的架构问题。
todos:
  - id: extract-shared-module
    content: 创建 src/lib/monitoring-utils.tsx，从 monitoring/page.tsx 中提取共享类型定义（MonitoringData/MonitorTask/BviLevel/TrendPoint 等）、常量（ALL_PLATFORMS/TONE/ALERT_TONE/SOURCE_COLORS）、工具函数（sourceAuthorityLabel/buildAttribution）、辅助组件（SentimentStat/MetricCard）
    status: completed
  - id: rewrite-task-list-page
    content: 重写 src/app/dashboard/monitoring/page.tsx 为任务列表页，使用 GET /api/geo/monitoring?list=1 获取纯任务列表，表格展示，支持新建和删除任务，每行「查看详情」跳转 detail 页
    status: completed
    dependencies:
      - extract-shared-module
  - id: create-detail-page
    content: 创建 src/app/dashboard/monitoring/detail/page.tsx 监测详情页，从 monitoring-utils 导入共享类型和组件，从 URL searchParams 读取 keyword/platforms/competitors，调用 GET /api/geo/monitoring 获取并展示完整监测结果
    status: completed
    dependencies:
      - extract-shared-module
  - id: verify-and-commit
    content: 验证 TypeScript 编译通过，确认侧边栏菜单和预警一键优化跳转不受影响，提交 git
    status: completed
    dependencies:
      - rewrite-task-list-page
      - create-detail-page
---

## 用户需求

将 yutu-geo 的 AI收录监测页面（`/dashboard/monitoring/page.tsx`，883 行，单文件混合了「任务管理」和「监测结果详情」两个职责）拆分为两层路由结构：

1. `/dashboard/monitoring` → 监测任务列表页，作为页面主体，负责任务的创建、查看、删除管理
2. `/dashboard/monitoring/detail?keyword=xxx&platforms=xxx&competitors=xxx` → 监测详情页，从任务列表点击「查看详情」进入，展示 BVI 指数、平台明细、信源权威性分析、竞品 SOV 对标、情感 NLP、舆情归因、动态预警等完整监测结果

侧边栏菜单保持不变，仍指向 `/dashboard/monitoring`。

## 核心功能

### 监测任务列表页

- 标准数据表格展示所有监测任务（关键词、平台数、竞品、状态、最后检测时间）
- 顶部「新建监测任务」按钮弹出创建表单（关键词 + 平台选择 + 竞品配置）
- 每行操作：查看详情（跳详情页）、删除（二次确认）
- 调用 `GET /api/geo/monitoring?list=1` 获取纯任务列表，秒级响应

### 监测详情页

- 搬迁当前页面主区域的全部监测结果展示，按原样保留
- URL 参数 `keyword/platforms/competitors` 驱动数据加载
- 顶部「← 返回任务列表」导航按钮
- free plan 守卫（付费功能，未付费跳会员页）

## 技术栈

- 前端框架：Next.js App Router + TypeScript + React 19
- UI 组件库：shadcn/ui (Radix UI) + Tailwind CSS
- 图标：Lucide React
- 情感分析：`@/lib/sentiment` (analyzeBatch)
- 鉴权：`@/lib/auth` (useAuth)

## 实现方案

### 代码组织策略

从当前 883 行 `page.tsx` 中拆出三类代码：

| 代码类别 | 来源位置（行号） | 目标位置 |
| --- | --- | --- |
| 类型定义 + 工具函数 | 第1-215行（imports/常量/type/样式/functions） | `src/lib/monitoring-utils.tsx` [NEW] |
| 任务 CRUD 逻辑 | 第232-304行（state/tasks/load/createTask/deleteTask） | `page.tsx` [REWRITE] |
| 监测结果展示 | 第362-832行（全部 JSX）+ 第306-343行（数据计算逻辑+品牌提及+sentiment） | `detail/page.tsx` [NEW] |
| 辅助组件 | 第835-882行（SentimentStat, MetricCard） | `monitoring-utils.tsx` [NEW] |


### 数据流

```
任务列表页：GET /api/geo/monitoring?user_id=x&list=1 → { tasks } → 表格渲染
详情页：GET /api/geo/monitoring?user_id=x&keyword=y&platforms=z → { current } → 监测结果渲染
```

### 路由设计

```
/dashboard/monitoring          → page.tsx [REWRITE] 任务列表
/dashboard/monitoring/detail   → detail/page.tsx [NEW] 监测详情（useSearchParams 读取 keyword/platforms/competitors）
```

## 实现注意事项

### 后端无需修改

后端 `lakeli-app-xc/src/app/api/geo/monitoring/route.ts` 第358-389行已实现 `list=1` 模式：当 `searchParams.get("list") === "1"` 时，直接查询 `geo.monitoring_tasks` 表返回纯任务列表，不触发 LLM 探针，不构造监测数据，保证秒回。当前前端未使用该参数，拆分后任务列表页改用此模式即可。

### 防退化

- 详情页保留 free plan 守卫（plan === "free" 展示升级引导，与当前一致）
- 详情页保留所有归因/权威性计算的纯前端逻辑（buildAttribution / sourceAuthorityLabel / analyzeBatch），LLM 不可达时本地保底
- 任务列表页不需要 plan 守卫（用户需看到自己的任务，即使暂时无法查看详情）

### 兼容性

- 侧边栏菜单无需修改（href 仍为 `/dashboard/monitoring`）
- 预警中的「一键优化」跳转 `/dashboard/optimizer` 保持不变
- 不引入新的 npm 依赖