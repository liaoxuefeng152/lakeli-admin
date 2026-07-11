'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  BookOpen,
  MessageSquare,
  BarChart3,
  Globe,
  Bot,
  ChevronLeft,
  ChevronRight,
  Building2,
  Cpu,
  Settings,
  ScrollText,
  Phone,
} from 'lucide-react';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  children?: { key: string; label: string; path: string }[];
}

const platformMenus: MenuItem[] = [
  { key: 'dashboard', label: '工作台', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'accounts', label: '账号权限管理', icon: UserCog, path: '/accounts' },
  { key: 'customers', label: '客户档案中心', icon: Users, path: '/customers' },
  { key: 'leads', label: '线索管理池', icon: FileText, path: '/leads' },
  { key: 'orders', label: '订单&计费中心', icon: Building2, path: '/orders' },
  { key: 'knowledge', label: '知识库管理', icon: BookOpen, path: '/knowledge' },
  { key: 'wecom', label: '企微配置中心', icon: MessageSquare, path: '/wecom' },
  { key: 'analytics', label: '数据总看板', icon: BarChart3, path: '/analytics' },
  { key: 'system-config', label: '系统基础配置', icon: Settings, path: '/system-config' },
  { key: 'operation-log', label: '操作日志', icon: ScrollText, path: '/operation-log' },
];

const geoMenus: MenuItem[] = [
  {
    key: 'geo',
    label: '域途GEO SaaS',
    icon: Globe,
    path: '/geo',
    children: [
      { key: 'geo-overview', label: '客户GEO数据总览', path: '/geo' },
      { key: 'geo-diagnostics', label: 'GEO诊断记录', path: '/geo/diagnostics' },
      { key: 'geo-copy', label: '文案生成记录', path: '/geo/copy' },
      { key: 'geo-keywords', label: '关键词挖掘记录', path: '/geo/keywords' },
      { key: 'geo-monitor', label: 'AI监测数据', path: '/geo/monitor' },
      { key: 'geo-templates', label: '行业模板管理', path: '/geo/templates' },
    ],
  },
];

const aiMenus: MenuItem[] = [
  {
    key: 'ai-service',
    label: '智推AI客服',
    icon: Bot,
    path: '/ai-service',
    children: [
      { key: 'ai-chats', label: '全量AI对话记录', path: '/ai-service' },
      { key: 'ai-keywords', label: '意向关键词配置', path: '/ai-service/keywords' },
      { key: 'ai-quota', label: 'AI助手配额设置', path: '/ai-service/quota' },
      { key: 'ai-wecom-archive', label: '企微会话存档', path: '/ai-service/wecom-archive' },
      { key: 'ai-feedback', label: '用户反馈统计', path: '/ai-service/feedback' },
    ],
  },
];

const agentMenus: MenuItem[] = [
  {
    key: 'agent',
    label: '统一Agent智能体管理',
    icon: Cpu,
    path: '/agent',
    children: [
      { key: 'agent-repo', label: 'Agent资源仓库', path: '/agent' },
      { key: 'agent-chats', label: '全平台对话记录查询', path: '/agent/chats' },
      { key: 'agent-sandbox', label: 'Agent测试沙盒', path: '/agent/sandbox' },
      { key: 'agent-migration', label: '扣子资产批量迁移工具', path: '/agent/migration' },
      { key: 'agent-scheduling', label: 'AI调度与配额管控', path: '/agent/scheduling' },
      { key: 'agent-dashboard', label: 'Agent专项数据看板', path: '/agent/dashboard' },
    ],
  },
];

const outboundCallMenus: MenuItem[] = [
  {
    key: 'outbound-call',
    label: '智能推销外呼',
    icon: Phone,
    path: '/outbound-call',
    children: [
      { key: 'oc-dashboard', label: '外呼工作台', path: '/outbound-call' },
      { key: 'oc-tasks', label: '外呼任务管理', path: '/outbound-call/tasks' },
      { key: 'oc-numbers', label: '客户号码管理', path: '/outbound-call/numbers' },
      { key: 'oc-blacklist', label: '黑名单管理', path: '/outbound-call/blacklist' },
      { key: 'oc-scripts', label: 'AI话术场景管理', path: '/outbound-call/scripts' },
      { key: 'oc-records', label: '通话记录与复盘', path: '/outbound-call/records' },
      { key: 'oc-reports', label: '数据报表中心', path: '/outbound-call/reports' },
      { key: 'oc-config', label: '阿里云接口配置', path: '/outbound-call/config' },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['geo', 'ai-service', 'agent', 'outbound-call']);
  const pathname = usePathname();

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.children) {
      const isExpanded = expandedGroups.includes(item.key);
      return (
        <div key={item.key}>
          <button
            onClick={() => toggleGroup(item.key)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-white/65 hover:bg-white/8 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.label}</span>}
            </div>
            {!collapsed && (
              <ChevronRight
                className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            )}
          </button>
          {isExpanded &&
            !collapsed &&
            item.children.map((child) => (
              <Link
                key={child.key}
                href={child.path}
                className={`flex items-center gap-3 py-2 pl-11 pr-4 text-sm transition-colors ${
                  isActive(child.path)
                    ? 'bg-[#1677FF] text-white'
                    : 'text-white/50 hover:bg-white/8 hover:text-white'
                }`}
              >
                {child.label}
              </Link>
            ))}
        </div>
      );
    }

    return (
      <Link
        key={item.key}
        href={item.path}
        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
          isActive(item.path)
            ? 'bg-[#1677FF] text-white'
            : 'text-white/65 hover:bg-white/8 hover:text-white'
        }`}
      >
        <item.icon className="h-4 w-4" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`flex flex-col bg-[#001529] transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
      style={{ minHeight: 'calc(100vh - 56px)' }}
    >
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden py-2">
        {/* Platform Common */}
        {!collapsed && (
          <div className="px-4 py-2 text-[11px] font-medium tracking-wider text-white/30 uppercase">
            中台公共能力
          </div>
        )}
        {platformMenus.map(renderMenuItem)}

        {/* Divider */}
        <div className="mx-4 my-2 border-t border-white/10" />

        {/* Business Plugins */}
        {!collapsed && (
          <div className="px-4 py-2 text-[11px] font-medium tracking-wider text-white/30 uppercase">
            业务插件
          </div>
        )}
        {geoMenus.map(renderMenuItem)}
        {aiMenus.map(renderMenuItem)}
        {agentMenus.map(renderMenuItem)}
        {outboundCallMenus.map(renderMenuItem)}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center border-t border-white/10 py-3 text-white/45 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
