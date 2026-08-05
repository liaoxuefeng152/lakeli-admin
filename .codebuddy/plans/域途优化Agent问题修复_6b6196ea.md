---
name: 域途优化Agent问题修复
overview: 修复 GEO 优化 Agent 的两个真实 bug（驳回失效、PR/分发任务执行无产出），并增强错误反馈与执行内容生成。
todos:
  - id: add-reject-task
    content: 后端 optimizer-agent.ts 新增 rejectTask（置位 rejected）并统一 decideTask/rejectTask 的 DB 错误返回为 {ok:false,error,code:DB_ERROR}
    status: completed
  - id: enhance-execute
    content: 后端 optimizer-agent.ts 的 executeTask 对 pr 生成 pr_draft、对 distribution 生成 distribution_plan，复用 OpenAI 通道
    status: completed
    dependencies:
      - add-reject-task
  - id: fix-approve-route
    content: 后端 approve/route.ts 将 !approve 分支改为调用 rejectTask 并返回 {success:true,task}；DB 异常返回 DB_ERROR
    status: completed
    dependencies:
      - add-reject-task
  - id: frontend-show
    content: 前端 page.tsx done 卡片增加 pr_draft 与 distribution_plan 渲染
    status: completed
    dependencies:
      - enhance-execute
  - id: verify-commit
    content: 重启后端验证驳回与 PR/分发产出，按工作区规则对两个仓库 git add -A && git commit
    status: completed
    dependencies:
      - frontend-show
---

## 用户需求

用户要求检查并修复「域途优化 Agent」（GEO SaaS 的优化闭环）当前存在的问题。基于代码审计，发现三处真实缺陷需要修复：

## 核心问题

1. **驳回功能失效**：前端点「驳回」后状态不变、队列不刷新、无提示（静默失败）。
2. **PR / 分发类任务执行后无实质产出**：审批通过后只写占位 note，前端看不到生成的内容，用户体验为「已执行」却空空如也。
3. **decideTask 在数据库异常时返回 null**：导致前端无法获得明确错误信息。

## 功能内容

- 驳回按钮点击后，任务状态正确变为「已驳回」并刷新队列。
- PR / 分发类任务审批通过执行后，真实生成新闻稿 / 公关声明 / 具体分发计划，并在前端时间线中展示。
- 决策接口错误返回结构化 JSON，前端能给出明确提示。
- 所有改动保持「真实 Agent 闭环 + 人工审批门控」架构不变，复用既有 LLM 通道（getModelConfigFromDb + OpenAI）。

## 技术栈

- 后端：`lakeli-app-xc`（Next.js 16 App Router，端口 5002），TypeScript 5，OpenAI SDK，`pg` 直连
- 前端：`GEO AI 生成式引擎优化系统/yutu-geo`（Next.js，端口 3000），通过 rewrites 代理到后端
- 既有 LLM 通道：`getModelConfigFromDb()` 无 modelId 时读取平台 `is_default` 模型配置

## 实施方案

### 关键决策

1. **驳回失效修复**：在 `optimizer-agent.ts` 新增 `rejectTask(id)`，将 `optimization_tasks.status` 更新为 `rejected`、`decided_at=now()` 并返回 `{ok:true, task}`；`approve/route.ts` 的 `!approve` 分支改为调用 `rejectTask` 并返回 `{success:true, task}`。前端 `decideTask(id,false)` 已传 `execute:true` 但驳回不应执行，路由中对 `!approve` 不调 `executeTask`（保持现状正确），仅做状态置位。

- 理由：原 `decideTask(id,false)` 直接 `return {ok:false,error}` 且不做 DB 更新，是逻辑 bug；拆分出 reject 语义最清晰，且不影响 approve 主链路。

2. **PR / 分发产出增强**：`executeTask` 中对 `pr` 类型用 LLM 生成「新闻稿/公关声明」（写入 `result.pr_draft`），对 `distribution` 类型生成「具体分发计划：平台清单 + 排期 + 话术要点」（写入 `result.distribution_plan`）。`content` 类型维持现有 `content_generated`。三者均走同一 OpenAI 通道，prompt 按类型区分。

- 理由：与「真实执行落地」目标一致；避免空占位，提升闭环可信度。

3. **错误返回统一**：`decideTask`/`rejectTask` 在 DB 异常时返回 `{ok:false, error, code:"DB_ERROR"}` 而非 `null`；`approve/route.ts` 据此返回 `{success:false, code:"DB_ERROR", error}`。

- 理由：前端已对 `code==="DB_ERROR"` 分支做提示，统一后用户可见明确报错。

4. **前端展示**：`page.tsx` 的 done 任务卡片已有 `r?.content_generated` 渲染块，顺带增加 `r?.pr_draft` 与 `r?.distribution_plan` 的展示（复用同一 emerald 卡片样式），保持与现有代码一致。

## 实现注意

- 改动集中在后端两个文件 + 前端一个文件，不改动数据表结构（`pr_draft`/`distribution_plan` 存于已有 `result` JSONB 字段）。
- `rejectTask` 与 `decideTask` 共用 DB 更新模式，遵循现有 `recordDbFailure` 错误处理约定。
- LLM 调用沿用 `response_format` 默认文本（pr/distribution 生成自由文本即可，无需 JSON strict），与 `content` 分支一致。
- 性能：单任务执行一次 LLM 调用（≤120s timeout），不影响列表读取；与现有 `executeTask` 复杂度一致。

## 架构设计

```mermaid
flowchart TD
  A[前端 驳回按钮] -->|POST /approve {approve:false}| B[approve/route.ts]
  B -->|!approve| C[rejectTask id]
  C -->|UPDATE status=rejected| D[(optimization_tasks)]
  C -->|{ok:true,task}| B -->|{success:true}| A

  E[前端 审批通过] -->|POST /approve {approve:true,execute:true}| F[approve/route.ts]
  F --> G[decideTask id,true]
  F --> H[executeTask id]
  H -->|type=content| I1[LLM 生成 content_generated]
  H -->|type=pr| I2[LLM 生成 pr_draft]
  H -->|type=distribution| I3[LLM 生成 distribution_plan]
  I1 & I2 & I3 --> J[(result JSONB)]
```