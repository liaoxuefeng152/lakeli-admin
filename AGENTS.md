# 拉克力后台管理系统 - AGENTS.md

## 项目概览

拉克力后台管理系统是公司全产品一体化统一管理中台，采用「统一底座 + 业务模块化插件」架构。一期集成域途GEO SaaS和智推AI客服Agent两大业务插件。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React

## 构建与运行

```bash
# 安装依赖
pnpm install

# 开发环境
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

## 目录结构

```
src/
├── app/
│   ├── (auth)/login/           # 登录页
│   ├── (dashboard)/            # 管理后台路由组
│   │   ├── dashboard/          # 工作台首页
│   │   ├── accounts/           # 账号权限管理
│   │   ├── customers/          # 全域客户档案
│   │   ├── leads/              # 全域线索管理
│   │   ├── orders/             # 订单计费中心
│   │   ├── knowledge/          # 知识库管理
│   │   ├── wecom/              # 企微配置中心
│   │   ├── analytics/          # 全域数据看板
│   │   ├── system-config/      # 系统基础配置
│   │   ├── operation-log/      # 操作日志
│   │   ├── geo/                # 域途GEO SaaS插件
│   │   │   ├── diagnostics/    # GEO诊断记录
│   │   │   ├── copy/           # 文案生成记录
│   │   │   ├── keywords/       # 关键词挖掘
│   │   │   ├── monitor/        # AI监测数据
│   │   │   └── templates/      # 行业模板管理
│   │   └── ai-service/         # 智推AI客服插件
│   │       ├── keywords/       # 意向关键词配置
│   │       ├── quota/          # AI配额设置
│   │       ├── wecom-archive/  # 企微会话存档
│   │       └── feedback/       # 用户反馈统计
│   │   └── agent/              # Agent智能体管理插件
│   │       ├── page.tsx        # Agent资源仓库（插件首页）
│   │       ├── chats/          # 全平台对话记录查询
│   │       ├── sandbox/        # Agent测试沙盒
│   │       ├── migration/      # 扣子资产批量迁移工具
│   │       ├── scheduling/     # AI调度与配额管控
│   │       └── dashboard/      # Agent专项数据看板
│   │   └── outbound-call/      # 智能推销外呼插件
│   │       ├── page.tsx        # 外呼工作台（插件首页）
│   │       ├── tasks/          # 外呼任务管理
│   │       ├── numbers/        # 客户号码管理
│   │       ├── blacklist/      # 黑名单管理
│   │       ├── scripts/        # AI话术场景管理
│   │       ├── records/        # 通话记录与复盘
│   │       ├── reports/        # 数据报表中心
│   │       └── config/         # 阿里云接口配置
│   └── layout.tsx              # 根布局
├── components/
│   ├── layout/                 # 布局组件
│   │   ├── sidebar.tsx         # 侧边菜单栏
│   │   └── top-nav.tsx         # 顶部导航栏
│   └── ui/                     # shadcn/ui 组件库
├── lib/
│   ├── mock-data.ts            # Mock数据
│   └── utils.ts                # 工具函数
└── hooks/                      # 自定义Hooks
```

## 设计规范

### 色彩体系
- **主色**: #1677FF (拉克力蓝)
- **GEO插件**: #0F52BA (深蓝)
- **AI客服插件**: #00B42A (绿色)
- **Agent管理插件**: #FF7D00 (橙色)
- **智能外呼插件**: #1677FF (蓝色，与系统主色一致)
- **危险色**: #F53F39
- **警告色**: #FF7D00
- **成功色**: #00B42A

### 字体
- 中文: PingFang SC / Microsoft YaHei
- 英文: Inter

## 路由说明

| 路径 | 页面 | 说明 |
|------|------|------|
| `/login` | 登录页 | 系统登录入口 |
| `/dashboard` | 工作台 | 数据总览+插件入口 |
| `/accounts` | 账号管理 | 超管可见 |
| `/customers` | 客户档案 | 360度全景视图 |
| `/leads` | 线索管理 | 全域线索池 |
| `/orders` | 订单中心 | 订单+套餐配置 |
| `/knowledge` | 知识库 | 三大分类管理 |
| `/wecom` | 企微配置 | 全局企微设置 |
| `/analytics` | 数据看板 | 全域数据图表 |
| `/system-config` | 系统配置 | 全局参数设置 |
| `/operation-log` | 操作日志 | 全平台操作留痕 |
| `/geo/*` | GEO插件 | 域途GEO管理 |
| `/ai-service/*` | AI客服插件 | 智推AI管理 |
| `/agent/*` | Agent管理插件 | 智能体管理 |
| `/agent` | Agent资源仓库 | 插件首页，表格布局管理Agent |
| `/outbound-call/*` | 智能外呼插件 | 推销外呼管理 |
| `/outbound-call` | 外呼工作台 | 外呼数据总览+图表 |
| `/outbound-call/tasks` | 外呼任务管理 | 任务创建/启停/监控 |
| `/outbound-call/numbers` | 客户号码管理 | 号码导入/筛选/批量操作 |
| `/outbound-call/blacklist` | 黑名单管理 | 合规管控/防骚扰 |
| `/outbound-call/scripts` | AI话术场景 | 阿里云话术脚本绑定 |
| `/outbound-call/records` | 通话记录复盘 | 录音播放/对话转写 |
| `/outbound-call/reports` | 数据报表中心 | 统计分析/导出 |
| `/outbound-call/config` | 阿里云接口配置 | AccessKey/回调/检测 |
| `/agent/chats` | 全平台对话记录查询 | 多条件筛选+对话快照 |
| `/agent/sandbox` | Agent测试沙盒 | 运营测试智能体问答效果 |
| `/agent/migration` | 扣子资产批量迁移 | 文件上传+导入日志 |
| `/agent/scheduling` | AI调度与配额管控 | 多模型路由+限流配置 |
| `/agent/dashboard` | Agent专项数据看板 | 图表+指标+导出 |

## 角色权限

| 角色 | 可见模块 |
|------|----------|
| 超级管理员 | 全部 |
| 运营 | 隐藏账号管理、财务流水 |
| 销售/客服 | 仅客户档案、线索、AI对话 |

## 注意事项

- 当前为前端演示版本，使用 Mock 数据
- 所有页面采用插件化架构，主题色随模块切换
- 表格统一支持筛选、排序、批量操作
- 高危操作（删除/禁用）需二次确认
