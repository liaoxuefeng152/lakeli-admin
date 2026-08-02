---
name: geo-keywords-to-copywriting
overview: 打通 GEO 关键词挖掘与 AI 文案生成的连接：关键词页增加"去生成文案"按钮跳转到文案页，文案页增加「生成文案」Tab（含关键词输入表单 + API 调用），支持 URL 参数自动预填关键词，形成"挖掘关键词 → 选择关键词 → 生成文案"的完整闭环。
todos:
  - id: add-copy-api
    content: 在 admin-api.ts 中新增 generateGeoCopywriting API 函数和 GenerateCopyParams 类型
    status: completed
  - id: restructure-copy-page
    content: 改造 geo/copy/page.tsx：增加 Tabs（生成文案 + 生成记录），实现生成表单、URL 参数预填、结果展示
    status: completed
    dependencies:
      - add-copy-api
  - id: add-keywords-action
    content: 改造 geo/keywords/page.tsx：表格增加操作列和去生成文案按钮，携带 keyword/customer 跳转
    status: completed
  - id: commit-changes
    content: 提交所有改动到本地 git 仓库
    status: completed
    dependencies:
      - add-copy-api
      - restructure-copy-page
      - add-keywords-action
---

## 用户需求

GEO 智能关键词挖掘完成后，关键词无法送入 AI 文案生成模块进行文案生成，两个模块完全孤立。需要打通关键词挖掘到文案生成的链路。

## 产品概述

在管理后台 GEO 插件中，建立「关键词挖掘」→「AI文案生成」的完整工作流：运营人员在关键词挖掘页查看高价值关键词后，可一键跳转到文案生成页，自动带入关键词和客户信息，填写文案参数后生成 GEO 优化文案。

## 核心功能

- **关键词页增加操作入口**：每行关键词记录新增「去生成文案」按钮，点击后携带关键词和客户名跳转到文案页
- **文案页增加生成能力**：用 Tabs 拆分为「生成文案」和「生成记录」两个视图。生成记录保留现有查询表格；生成文案提供表单（关键词、客户、文案类型、语言、目标字数）和生成按钮，支持从 URL 参数预填关键词和客户
- **API 层新增生成接口**：新增 `generateGeoCopywriting` 函数调用 `POST /api/geo/copywriting/generate`
- **生成结果展示**：生成完成后在文案页内展示结果文本，支持复制

## 技术栈

- 前端框架：Next.js 16 (App Router) + React 19 + TypeScript 5
- UI 组件：shadcn/ui (Radix UI Tabs + Select + Button + Textarea + Input)
- 通知：sonner (toast)
- 路由：next/navigation (useRouter, useSearchParams)
- API 层：`src/lib/services/admin-api.ts` 中的 `fetchJSON` 封装

## 实现方案

### 整体策略

遵循现有项目架构：API 层统一放在 `admin-api.ts`，页面使用 `'use client'` 组件 + hooks 模式。复用已有的 shadcn/ui Tabs/Select/Button/Textarea 组件，保持与 customers/orders 等页面一致的交互风格。

### 数据流

```
关键词页点击「去生成文案」
  → useRouter.push('/geo/copy?keyword=XXX&customer=YYY')
    → 文案页 useSearchParams() 读取 keyword/customer
      → 预填到表单
        → 用户选择文案类型/语言/字数
          → 点击生成 → POST /api/geo/copywriting/generate
            → 展示结果
```

### 关键决策

1. **导航方式**：使用 URL 参数传递（而非路由状态或 localStorage），因为 URL 参数可书签、可分享、刷新不丢失，且符合 Next.js App Router 最佳实践
2. **生成结果展示**：内联展示在表单下方（非弹窗），方便用户反复生成和对比
3. **生成记录刷新**：生成成功后自动切换到「生成记录」tab 并刷新列表

## 实现细节

### 文件改动清单

```
src/
├── lib/services/
│   └── admin-api.ts                    # [MODIFY] 新增 generateGeoCopywriting 函数
├── app/(dashboard)/geo/
│   ├── copy/
│   │   └── page.tsx                    # [MODIFY] 改造为 Tabs + 生成表单 + 结果展示
│   └── keywords/
│       └── page.tsx                    # [MODIFY] 表格增加操作列 + 去生成文案按钮
```

### admin-api.ts 新增内容

新增类型 `GenerateCopyParams`（keyword、customer、copyType、language、wordCount）和函数 `generateGeoCopywriting`，调用 `POST /api/geo/copywriting/generate`，返回 `{ content: string }`。

### copy/page.tsx 改造要点

- 导入 Tabs/TabsContent/TabsList/TabsTrigger、Select 系列、Textarea、toast
- 使用 `useSearchParams()` 读取 `keyword` 和 `customer` 参数
- 使用 `useState` 管理表单状态（keyword、customer、copyType、language、wordCount、generating、result）
- 「生成记录」tab 内保留原有表格逻辑不变
- 「生成文案」tab 内布局：上方表单区（关键词 + 客户 + 类型 + 语言 + 字数），下方生成按钮 + 结果展示区（支持复制）
- 生成成功后 toast 提示并刷新记录列表

### keywords/page.tsx 改造要点

- 导入 `useRouter` from `next/navigation`、`PenLine` 图标
- 表头新增 `<th>操作</th>`（10 列 → 11 列）
- 每行新增操作单元格，内含「去生成文案」Button（variant="outline"，size="sm"），点击跳转 `/geo/copy?keyword=${r.keyword}&customer=${r.customer}`
- loading/empty 状态的 `colSpan` 同步更新为 11