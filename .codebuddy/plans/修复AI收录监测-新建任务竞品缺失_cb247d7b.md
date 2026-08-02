---
name: 修复AI收录监测-新建任务竞品缺失
overview: 修复"AI收录监测"新建任务表单无法录入竞品的问题：新增竞品多输入、平台至少选1个校验，并尊重套餐竞品数量上限，使大屏动态竞品按钮能真正联动。
todos:
  - id: confirm-auth-exposure
    content: 确认 auth.tsx 中 canMaxCompetitors 经 useAuth 的暴露方式，必要时补充透出
    status: completed
  - id: add-competitor-state
    content: 在 monitoring/page.tsx 新增竞品 state 与套餐上限读取，替换写死 competitors
    status: completed
    dependencies:
      - confirm-auth-exposure
  - id: build-competitor-ui
    content: 在新建表单新增竞品标签输入区块，含 free 版提示与上限控制
    status: completed
    dependencies:
      - add-competitor-state
  - id: add-platform-validation
    content: 为 createTask 增加平台非空校验，禁用创建按钮条件补充
    status: completed
    dependencies:
      - add-competitor-state
  - id: typecheck-commit
    content: 执行 tsc 类型检查并提交改动到本地仓库
    status: completed
    dependencies:
      - build-competitor-ui
      - add-platform-validation
---

## 用户需求

用户指出「AI 收录监测」页面的新建监测任务功能不完善，核心问题是新建表单无法录入竞品，导致竞品字段永远为空，进而使此前已实现的「实时大屏动态展示主品牌+竞品按钮」在新建任务场景下失效。用户已确认按建议修改。

## 产品概述

在 AI 收录监测的新建任务表单中补全「竞品」录入能力，并加入平台必选校验与套餐竞品上限控制，使新建任务可携带真实竞品数据，与列表竞品列、实时大屏竞品按钮形成完整闭环。

## 核心功能

- 新建表单新增「竞品」多关键词输入：支持输入后回车或逗号分隔批量添加，标签可单独删除，展示为可移除的标签组。
- 平台选择校验：至少勾选 1 个 AI 平台才允许创建，否则禁用创建按钮并给出提示。
- 套餐竞品上限控制：依据用户套餐（free/basic/pro）读取竞品上限（0/3/5），免费版隐藏竞品输入区并提示升级，超出上限时禁止继续添加并提示。
- createTask 提交体从写死的 `competitors: []` 改为读取真实竞品数组。

## 技术栈

- 框架：Next.js 16 (App Router) + React 19 + TypeScript 5
- UI：shadcn/ui (Radix UI) + Tailwind CSS 4（项目既有，沿用 Card/Input/Button/Badge）
- 组件类型：客户端组件（"use client"），无新增依赖

## 实现方案

### 策略

在现有 `monitoring/page.tsx` 内联新建表单中扩展竞品输入区块，复用已有的平台多选交互模式（标签式切换），并通过 `useAuth` 暴露的权限字段 `canMaxCompetitors` 控制竞品上限。提交逻辑改为携带真实 `competitors` 数组，并对 `platforms` 做非空校验。

### 关键技术决策

1. **竞品输入复用标签模式**：沿用页面已有的 platform 按钮选中态样式（`bg-geo-blue text-white border-geo-blue` / 未选态），保证视觉一致，避免引入新组件。竞品以 `string[]` 状态维护，输入区用受控 `Input` + 回车/逗号解析追加。
2. **套餐上限来源**：`auth.tsx` 中 `canMaxCompetitors` 已定义（pro=5/basic=3/free=0）。需确认 `useAuth` 返回值结构（权限对象是否直接挂在 user 或独立 `permissions` 字段），在 `monitoring/page.tsx` 中按 `plan` 推导或直接读取权限字段。free 版上限为 0，直接隐藏竞品区块并展示「升级套餐以启用竞品对比」提示。
3. **平台必选校验**：`createTask` 前置判断 `platforms.length === 0` 则 return 并提示；创建按钮 `disabled` 条件追加 `platforms.length === 0`。
4. **竞品追加上限**：追加时判断 `competitors.length >= maxComp`，超上限忽略并轻提示（可用页面已有 `text-geo-slate-400` 提示文案，不引入 toast 依赖）。

### 性能与可靠性

- 纯前端受控组件，无额外请求；竞品数组规模极小（≤5），无性能问题。
- 提交失败保持 `creating` 状态正确复位（`finally` 已覆盖），新增平台空校验不破坏既有错误捕获。

## 实现要点（防回归）

- 不改动 `detail/page.tsx` 与 `bigscreen/page.tsx`（竞品展示链路已通），仅补全数据源。
- `openBigscreen` / `openDetail` 已正确拼接 `competitors`，无需改动。
- 沿用既有 `Card/CardHeader/CardContent` 内联结构，不强行改为 Dialog。
- 改动后执行 `npx tsc --noEmit` 确认类型通过，并按工作区规则 `git add -A && git commit` 提交到本地仓库（yutu-geo 项目）。

## 架构设计

本次为单文件内增强，不涉及架构变更。数据流：表单 state（keyword/platforms/competitors）→ createTask POST /api/geo/monitoring → loadTasks 刷新列表 → 列表竞品列展示 → 跳转大屏/详情携带 competitors。

## 目录结构

```
yutu-geo/src/app/dashboard/monitoring/
└── page.tsx   # [MODIFY] AI 收录监测页。新增竞品 string[] state 与输入态 compInput；表单 JSX 增加竞品标签输入区块（含套餐上限判断与 free 版提示）；createTask 改为读取真实 competitors 并对 platforms 空值校验；创建按钮 disabled 条件追加平台非空。
yutu-geo/src/lib/auth.tsx   # [确认/可选微调] 确认 useAuth 暴露 canMaxCompetitors 的方式；如未直接暴露需补充透出，供 monitoring 页读取套餐竞品上限。
```

## 关键代码结构

```ts
// monitoring/page.tsx 新增 state（示意）
const [compInput, setCompInput] = useState("");
const [competitors, setCompetitors] = useState<string[]>([]);
const maxComp = useAuth() /* 权限 */.canMaxCompetitors ?? 0;

// 竞品追加（回车/逗号）
function addCompetitor(raw: string) {
  const items = raw.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
  setCompetitors((prev) => {
    const next = [...prev];
    for (const it of items) if (!next.includes(it) && next.length < maxComp) next.push(it);
    return next;
  });
  setCompInput("");
}
// createTask body 改为 competitors（不再写死 []），并前置 platforms 非空校验
```