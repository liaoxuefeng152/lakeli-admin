# 龙掌柜 AI 助手 - 后台管理系统 PRD

> 版本：v1.0 | 日期：2026-07-22 | 状态：待开发

---

## 1. 产品概述

### 1.1 背景

龙掌柜 AI 助手当前已完成 ReAct Agent 引擎、14 个工具（选品、Listing优化、图片/视频生成、代码沙盒等）、火山引擎 LLM 对接。但所有配置依赖 `.env` 文件手动修改，用户、会话、数据管理只能通过数据库命令行操作，对运营人员和非技术用户极不友好。

### 1.2 产品定位

面向跨境电商运营人员的一站式管理后台，涵盖 **系统配置、用户管理、数据监控、知识库运营、资产管理、账单订阅** 六大模块。

### 1.3 目标用户

| 角色 | 权限范围 | 核心场景 |
|------|---------|---------|
| 超级管理员 | 全部权限 | 系统配置、用户管理、全局数据查看 |
| 运营管理员 | 业务管理 | 知识库管理、素材审核、数据分析 |
| 普通运营 | 数据查看 | 查看使用情况、生成的素材 |

---

## 2. 功能模块

### 2.1 系统配置中心

**痛点**：当前 API Key、模型参数全部写死在 `.env`，换模型需要命令行操作。

| 功能点 | 描述 | 优先级 |
|--------|------|--------|
| LLM 配置 | 管理 API Key、Base URL、默认模型、Temperature、Max Tokens | P0 |
| 多模型切换 | 支持添加多个模型厂商（火山引擎/OpenAI/DeepSeek），一键切换 | P0 |
| 技能/工具开关 | 按需启用/禁用 14 个工具（如关掉视频生成省钱） | P1 |
| 沙盒配置 | 调整超时时间、内存限制、Docker/Local 模式切换 | P1 |
| 浏览器自动化配置 | 并发数、Headless 模式开关 | P2 |
| 平台绑定 | Amazon/TikTok Shop/1688 等平台 API 凭证管理 | P2 |

### 2.2 用户与权限管理

**痛点**：当前只有一个写死的测试用户 `00000000-...-0001`，密码明文 `123456`。

| 功能点 | 描述 | 优先级 |
|--------|------|--------|
| 用户列表 | 分页查看、搜索（邮箱/名称）、状态筛选 | P0 |
| 创建/编辑用户 | 邮箱、密码、姓名、角色分配 | P0 |
| 角色管理 | 超级管理员 / 运营管理员 / 普通用户，自定义权限集 | P0 |
| 用户画像管理 | 编辑用户预设的平台、品类、市场（影响选品推荐） | P1 |
| 登录日志 | 查看用户登录历史、IP、设备 | P2 |
| 密码策略 | 强制密码强度、密码过期策略 | P2 |

### 2.3 会话与数据监控

**痛点**：无法知道用户用了什么功能、花了多少钱、效果如何。

| 功能点 | 描述 | 优先级 |
|--------|------|--------|
| 概览仪表盘 | 今日/本周/本月：对话数、Token 消耗、生成素材数 | P0 |
| 会话列表 | 按用户查看所有对话记录，支持关键词搜索 | P0 |
| 会话详情 | 查看完整对话记录、工具调用链路、耗时、Token 消耗 | P1 |
| Token 用量统计 | 按日/周/月/用户维度的 Token 消耗图表 | P1 |
| 技能使用统计 | 各技能（选品/作图/视频/Listing）调用次数排行 | P1 |
| 错误监控 | LLM 调用失败率、超时率、工具执行失败日志 | P2 |
| 导出报表 | 用量数据导出为 CSV/Excel | P2 |

### 2.4 知识库管理

**痛点**：数据库有 `knowledge_base` 表但无管理界面，无法导入产品文档、运营手册。

| 功能点 | 描述 | 优先级 |
|--------|------|--------|
| 知识条目列表 | 分页浏览、分类/标签筛选、关键词搜索 | P0 |
| 新增/编辑知识 | 富文本编辑器，支持上传附件、设置标签和分类 | P0 |
| 批量导入 | 支持 TXT/Markdown/PDF 文件上传自动入库 | P1 |
| 知识审核 | 草稿→审核→发布 工作流 | P1 (多角色场景) |
| RAG 效果评估 | 测试知识库召回准确率 | P2 |

### 2.5 资产管理

**痛点**：AI 生成的图片、视频散落在各次对话中，没有统一管理入口。

| 功能点 | 描述 | 优先级 |
|--------|------|--------|
| 素材列表 | 按类型（图片/视频）、日期、生成方式筛选 | P1 |
| 素材预览 | 缩略图网格展示，点击查看大图/播放视频 | P1 |
| 素材下载 | 支持单选/批量下载 | P1 |
| 商品库管理 | Vendor 商品（1688 选品结果）查看、收藏、导出 | P2 |
| Listing 记录 | 查看所有优化记录，对比优化前后效果 | P2 |

### 2.6 账单与订阅

**痛点**：数据库已有 `subscriptions` 和 `bills` 表，无前端界面。

| 功能点 | 描述 | 优先级 |
|--------|------|--------|
| 套餐管理 | 免费版/专业版/企业版的用量配额配置 | P1 |
| 用户订阅 | 为用户分配/变更套餐、设置有效期 | P1 |
| 账单记录 | 查看所有账单，按用户/状态/时间筛选 | P2 |
| 用量预警 | 用户 Token 接近配额时自动提醒 | P2 |

---

## 3. 技术方案

### 3.1 架构

```
前端（Next.js App Router）
├── /dashboard/admin/*       后台管理页面
│   ├── /dashboard/admin/overview     概览仪表盘
│   ├── /dashboard/admin/settings     系统配置
│   ├── /dashboard/admin/users        用户管理
│   ├── /dashboard/admin/sessions     会话监控
│   ├── /dashboard/admin/knowledge    知识库
│   ├── /dashboard/admin/assets       资产管理
│   └── /dashboard/admin/billing      账单订阅
│
后端（API Routes）
├── /api/admin/config         系统配置 CRUD
├── /api/admin/users          用户管理 CRUD
├── /api/admin/sessions       会话数据查询
├── /api/admin/analytics      统计数据聚合
├── /api/admin/knowledge      知识库 CRUD
├── /api/admin/assets         资产管理 CRUD
└── /api/admin/billing        账单管理
```

### 3.2 数据库新增表

```sql
-- 系统配置表（替代 .env）
CREATE TABLE IF NOT EXISTS system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(200) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string','number','boolean','json')),
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    label VARCHAR(200),
    description TEXT,
    encrypted BOOLEAN DEFAULT false,  -- API Key 类敏感配置加密存储
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户操作日志
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(100),
    detail JSONB,
    ip VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at);
```

### 3.3 安全措施

| 措施 | 说明 |
|------|------|
| 中间件鉴权 | 所有 `/api/admin/*` 和 `/dashboard/admin/*` 校验管理员角色 |
| 敏感配置加密 | API Key 类配置用 AES-256-GCM 加密后存储 |
| 操作日志 | 所有增删改操作记录到 `activity_logs` |
| CSRF 防护 | Next.js 内置 CSRF Token |
| 请求频率限制 | 登录、配置修改等敏感操作限制频率 |

---

## 4. UI/UX 设计要点

### 4.1 布局

- 左侧垂直导航栏（侧边栏），与现有的 Chat 侧边栏共用框架
- 顶部面包屑 + 用户头像/退出
- 主体区域：卡片式布局，信息密度适中

### 4.2 关键页面风格

| 页面 | 风格 |
|------|------|
| 概览仪表盘 | 4 个统计卡片 + 折线图（Token 消耗趋势）+ 柱状图（技能使用排行） |
| 用户列表 | 标准数据表格 + 搜索/筛选工具栏 + 右侧滑动抽屉编辑 |
| 系统配置 | 分组 Tab 页 + 表单卡片，敏感字段显示为 `****`，点击可编辑 |
| 知识库 | 两栏布局：左侧分类树 + 右侧文章列表/编辑器 |
| 资产中心 | 瀑布流网格，支持右键菜单操作 |

---

## 5. 开发计划

| 阶段 | 内容 | 预计工期 |
|------|------|---------|
| **Phase 1** | 系统配置中心 + 概览仪表盘 + 用户管理（P0 全部） | 3-4 天 |
| **Phase 2** | 知识库管理 + 会话监控 + Token 统计（P1 核心） | 2-3 天 |
| **Phase 3** | 资产管理 + 账单订阅 + 错误监控（P1 剩余 + P2） | 2-3 天 |
| **Total** | | **7-10 天** |

---

## 6. 验收标准

- [ ] 管理员可通过后台界面切换 LLM 模型，无需修改 `.env`
- [ ] 管理员可创建/编辑/禁用用户，分配角色
- [ ] 概览页面实时展示今日对话数、Token 消耗、活跃用户数
- [ ] 知识库支持富文本编辑、分类标签管理
- [ ] 敏感配置（API Key）加密存储，不在前端明文传输
- [ ] 所有管理员操作有日志可追溯
