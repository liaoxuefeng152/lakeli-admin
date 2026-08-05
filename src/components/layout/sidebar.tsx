'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Target,
  CreditCard,
  Database,
  MessageSquare,
  ScrollText,
  Globe,
  Bot,
  Brain,
  Network,
  Phone,
  ChevronDown,
  Menu,
  X,
  BarChart3,
  Stethoscope,
  FileText,
  KeyRound,
  Radar,
  LayoutTemplate,
  Gauge,
  Archive,
  ThumbsUp,
  ClipboardList,
  Hash,
  Ban,
  FileCode,
  Mic,
  TrendingUp,
  Settings,
  Zap,
  SlidersHorizontal,
  BookOpen,
  ImageIcon,
  Package,
  Store,
  Eye,
  Search,
  Lock,
  PieChart,
  UserRoundCheck,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { useAuth, ADMIN_ROLE, OPERATOR_ROLE, SALES_ROLE } from '@/lib/auth';

interface MenuItem {
  key: string;
  label: string;
  path?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

const menuGroups: MenuItem[] = [
  {
    key: 'platform',
    label: '平台管理',
    icon: LayoutDashboard,
    children: [
      { key: 'dashboard', label: '工作台', path: '/dashboard', icon: LayoutDashboard },
      { key: 'accounts', label: '账号权限', path: '/accounts', icon: Users, },
      { key: 'customers', label: '全域客户档案', path: '/customers', icon: Building2 },
      { key: 'leads', label: '全域线索管理', path: '/leads', icon: Target },
      { key: 'orders', label: '订单计费中心', path: '/orders', icon: CreditCard, },
      { key: 'wecom', label: '企微配置中心', path: '/wecom', icon: MessageSquare, },
      { key: 'platform-models', label: '模型配置', path: '/platform/models', icon: Brain },
      { key: 'operation-log', label: '操作日志', path: '/operation-log', icon: ScrollText, },
    ],
  },
  {
    key: 'geo',
    label: '域途 GEO SaaS',
    icon: Globe,
    path: '/geo',
    children: [
      { key: 'geo-assistant', label: '域途AI助手', path: '/geo/assistant', icon: Bot },
      { key: 'geo-overview', label: 'GEO 概览', path: '/geo', icon: BarChart3 },
      { key: 'geo-diagnostics', label: 'GEO诊断记录', path: '/geo/diagnostics', icon: Stethoscope },
      { key: 'geo-copy', label: '文案生成记录', path: '/geo/copy', icon: FileText },
      { key: 'geo-keywords', label: '关键词挖掘', path: '/geo/keywords', icon: KeyRound },
      { key: 'geo-monitor', label: 'AI监测数据', path: '/geo/monitor', icon: Radar },
      { key: 'geo-templates', label: '行业模板', path: '/geo/templates', icon: LayoutTemplate },
      { key: 'geo-toolkit', label: 'GEO工具箱', path: '/geo/toolkit', icon: FileCode },
      { key: 'geo-agency', label: '代理商客户BVI', path: '/geo/agency', icon: Building2 },
      { key: 'geo-agent', label: '代理商后台', path: '/geo/agent', icon: Users },
    ],
  },
  {
    key: 'ai-service',
    label: '智推 AI 客服',
    icon: MessageSquare,
    path: '/ai-service',
    children: [
      { key: 'ai-chats', label: '全量对话记录', path: '/ai-service', icon: MessageSquare },
      { key: 'ai-keywords', label: '意向关键词', path: '/ai-service/keywords', icon: Target },
      { key: 'ai-quota', label: 'AI配额设置', path: '/ai-service/quota', icon: Gauge },
      { key: 'ai-wecom-archive', label: '企微会话存档', path: '/ai-service/wecom-archive', icon: Archive },
      { key: 'ai-feedback', label: '用户反馈统计', path: '/ai-service/feedback', icon: ThumbsUp },
    ],
  },
  {
    key: 'outbound-call',
    label: '智能外呼',
    icon: Phone,
    path: '/outbound-call',
    children: [
      { key: 'oc-overview', label: '外呼工作台', path: '/outbound-call', icon: Phone },
      { key: 'oc-tasks', label: '外呼任务', path: '/outbound-call/tasks', icon: ClipboardList },
      { key: 'oc-numbers', label: '客户号码', path: '/outbound-call/numbers', icon: Hash },
      { key: 'oc-blacklist', label: '黑名单', path: '/outbound-call/blacklist', icon: Ban },
      { key: 'oc-scripts', label: 'AI话术场景', path: '/outbound-call/scripts', icon: FileCode },
      { key: 'oc-records', label: '通话记录', path: '/outbound-call/records', icon: Mic },
      { key: 'oc-reports', label: '数据报表', path: '/outbound-call/reports', icon: TrendingUp },
      { key: 'oc-config', label: '阿里云配置', path: '/outbound-call/config', icon: Settings },
    ],
  },
  {
    key: 'lzg',
    label: '龙掌柜 AI 助手',
    icon: Bot,
    path: '/lzg/dashboard',
    children: [
      { key: 'lzg-dashboard', label: '概览仪表盘', path: '/lzg/dashboard', icon: LayoutDashboard },
      { key: 'lzg-sessions', label: '会话记录', path: '/lzg/sessions', icon: MessageSquare },
      { key: 'lzg-skills', label: '技能管理', path: '/lzg/skills', icon: Zap },
      { key: 'lzg-env-config', label: '运行环境配置', path: '/lzg/env-config', icon: SlidersHorizontal },
      { key: 'knowledge', label: '知识空间', path: '/knowledge', icon: BookOpen },
      { key: 'lzg-assets', label: '素材管理', path: '/lzg/assets', icon: ImageIcon },
      { key: 'lzg-products', label: '商品管理', path: '/lzg/products', icon: Package },
      { key: 'lzg-shops', label: '店铺管理', path: '/lzg/shops', icon: Store },
      { key: 'lzg-quota', label: '配额管理', path: '/lzg/quota', icon: PieChart },
    ],
  },
  {
    key: 'knowledge-engine',
    label: '跨境外贸知识引擎',
    icon: Network,
    path: '/knowledge-engine',
    children: [
      { key: 'ke-overview', label: '产品概览', path: '/knowledge-engine', icon: Eye },
      { key: 'ke-logs', label: '日志统计中心', path: '/knowledge-engine/logs', icon: Search },
      { key: 'ke-permissions', label: '系统权限管理', path: '/knowledge-engine/permissions', icon: Lock },
    ],
  },
  {
    key: 'dp',
    label: '数据平台',
    icon: Database,
    path: '/dp/metrics',
    children: [
      { key: 'dp-metrics', label: '指标平台', path: '/dp/metrics', icon: TrendingUp },
      { key: 'dp-customer360', label: '客户360', path: '/dp/customer-360', icon: UserRoundCheck },
      { key: 'dp-tags', label: '标签分群', path: '/dp/tags', icon: Tag },
      { key: 'dp-governance', label: '治理看板', path: '/dp/governance', icon: ShieldCheck },
    ],
  },
];

// 角色 → 可见菜单（key 不在表中 = 所有已登录角色可见）
// 角色层级：admin(超管) > operator(运营) > sales(销售) > user(普通)
const ROLE_ACCESS: Record<string, string[]> = {
  // 仅超管
  accounts: [ADMIN_ROLE],
  wecom: [ADMIN_ROLE],
  'operation-log': [ADMIN_ROLE],
  // 超管 + 运营（+销售可见计费）
  orders: [ADMIN_ROLE, OPERATOR_ROLE, SALES_ROLE],
  knowledge: [ADMIN_ROLE, OPERATOR_ROLE],
  // GEO 模块
  geo: [ADMIN_ROLE, OPERATOR_ROLE],
  'geo-assistant': [ADMIN_ROLE, OPERATOR_ROLE],
  'geo-overview': [ADMIN_ROLE, OPERATOR_ROLE],
  'geo-diagnostics': [ADMIN_ROLE, OPERATOR_ROLE],
  'geo-copy': [ADMIN_ROLE, OPERATOR_ROLE],
  'geo-keywords': [ADMIN_ROLE, OPERATOR_ROLE],
  'geo-monitor': [ADMIN_ROLE, OPERATOR_ROLE],
  'geo-templates': [ADMIN_ROLE, OPERATOR_ROLE],
  'geo-toolkit': [ADMIN_ROLE, OPERATOR_ROLE],
  'geo-agency': [ADMIN_ROLE, OPERATOR_ROLE],
  'geo-agent': [ADMIN_ROLE, OPERATOR_ROLE],
  // 智推 AI 客服（配置类）
  'ai-keywords': [ADMIN_ROLE, OPERATOR_ROLE],
  'ai-quota': [ADMIN_ROLE, OPERATOR_ROLE],
  'ai-wecom-archive': [ADMIN_ROLE, OPERATOR_ROLE],
  'ai-feedback': [ADMIN_ROLE, OPERATOR_ROLE],
  // 智能外呼
  'outbound-call': [ADMIN_ROLE, OPERATOR_ROLE, SALES_ROLE],
  'oc-overview': [ADMIN_ROLE, OPERATOR_ROLE, SALES_ROLE],
  'oc-tasks': [ADMIN_ROLE, OPERATOR_ROLE, SALES_ROLE],
  'oc-numbers': [ADMIN_ROLE, OPERATOR_ROLE, SALES_ROLE],
  'oc-blacklist': [ADMIN_ROLE, OPERATOR_ROLE, SALES_ROLE],
  'oc-scripts': [ADMIN_ROLE, OPERATOR_ROLE, SALES_ROLE],
  'oc-records': [ADMIN_ROLE, OPERATOR_ROLE, SALES_ROLE],
  'oc-reports': [ADMIN_ROLE, OPERATOR_ROLE, SALES_ROLE],
  'oc-config': [ADMIN_ROLE, OPERATOR_ROLE],
  // 龙掌柜 AI 助手
  lzg: [ADMIN_ROLE, OPERATOR_ROLE],
  'lzg-dashboard': [ADMIN_ROLE, OPERATOR_ROLE],
  'lzg-sessions': [ADMIN_ROLE, OPERATOR_ROLE],
  'lzg-skills': [ADMIN_ROLE, OPERATOR_ROLE],
  'platform-models': [ADMIN_ROLE, OPERATOR_ROLE],
  'lzg-env-config': [ADMIN_ROLE, OPERATOR_ROLE],
  'lzg-assets': [ADMIN_ROLE, OPERATOR_ROLE],
  'lzg-products': [ADMIN_ROLE, OPERATOR_ROLE],
  'lzg-shops': [ADMIN_ROLE, OPERATOR_ROLE],
  'lzg-quota': [ADMIN_ROLE, OPERATOR_ROLE],
  // 跨境外贸知识引擎
  'knowledge-engine': [ADMIN_ROLE, OPERATOR_ROLE],
  'ke-overview': [ADMIN_ROLE, OPERATOR_ROLE],
  'ke-logs': [ADMIN_ROLE, OPERATOR_ROLE],
  'ke-permissions': [ADMIN_ROLE, OPERATOR_ROLE],
  // 数据平台（拉客力数据中台 dp）
  'dp': [ADMIN_ROLE, OPERATOR_ROLE],
  'dp-metrics': [ADMIN_ROLE, OPERATOR_ROLE],
  'dp-customer360': [ADMIN_ROLE, OPERATOR_ROLE],
  'dp-tags': [ADMIN_ROLE, OPERATOR_ROLE],
  'dp-governance': [ADMIN_ROLE, OPERATOR_ROLE],
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

const canSee = (item: MenuItem) => {
  const allowed = ROLE_ACCESS[item.key];
  return !allowed || allowed.includes(user?.role ?? '');
};

  useEffect(() => {
    const initialOpen: string[] = [];
    for (const group of menuGroups) {
      if (group.children?.some((child) => child.path && pathname.startsWith(child.path))) {
        initialOpen.push(group.key);
      }
    }
    setOpenKeys(initialOpen);
  }, [pathname]);

  const onToggle = (key: string) => {
    setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const renderMenuItem = (item: MenuItem, level = 0): React.ReactNode => {
    if (!canSee(item)) return null;
    const hasChildren = item.children && item.children.length > 0;
    if (hasChildren) {
      const visibleChildren = item.children!.filter(canSee);
      if (visibleChildren.length === 0) return null;
      const isOpen = openKeys.includes(item.key);
      return (
        <div key={item.key}>
          <button
            onClick={() => onToggle(item.key)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isOpen ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
            {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
            {!collapsed && <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
          </button>
          {isOpen && !collapsed && (
            <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
              {visibleChildren.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }
    const isActive = pathname === item.path;
    return (
      <Link
        key={item.key}
        href={item.path || '#'}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
        } ${level > 0 ? 'pl-6' : ''}`}
      >
        {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {!collapsed && (
        <div className="flex h-16 items-center gap-2 px-5">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="text-lg font-bold text-gray-900">拉克力</span>
        </div>
      )}
      {collapsed && <div className="flex h-16 items-center justify-center">
        <div className="h-8 w-8 rounded-lg bg-primary" />
      </div>}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {menuGroups.map((group) => {
          if (!canSee(group)) return null;
          const visibleChildren = (group.children || []).filter(canSee);
          if (group.children && visibleChildren.length === 0) return null;
          if (collapsed) {
            return (
              <div key={group.key} className="group relative py-1">
                <button className="flex w-full items-center justify-center rounded-lg py-2.5 text-gray-600 hover:bg-gray-100">
                  {group.icon && <group.icon className="h-5 w-5" />}
                </button>
                <div className="invisible absolute left-full top-0 z-50 ml-2 hidden w-52 rounded-lg border border-gray-200 bg-white p-2 shadow-lg group-hover:visible group-hover:block">
                  <div className="mb-1 px-2 py-1 text-xs font-semibold text-gray-400">{group.label}</div>
                  {visibleChildren.map((child) => (
                    <Link
                      key={child.key}
                      href={child.path || '#'}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm ${
                        pathname === child.path ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          }
          return <div key={group.key} className="space-y-1">{renderMenuItem(group)}</div>;
        })}
      </nav>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button onClick={() => setMobileOpen(true)} className="rounded-lg bg-primary p-2 text-white">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 text-gray-400">
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-60'
        }`}
      >
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-20 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow md:flex"
        >
          {collapsed ? <Menu className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
