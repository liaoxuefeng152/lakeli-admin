'use client';

import {
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
  Globe,
  Bot,
  ArrowRight,
  TrendingUp,
  Clock,
  UserPlus,
  ThumbsDown,
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { dashboardStats, weeklyTrend } from '@/lib/mock-data';

export default function DashboardPage() {
  const statsCards = [
    {
      label: '今日新增客户',
      value: dashboardStats.todayNewCustomers,
      icon: UserPlus,
      color: '#1677FF',
      bgColor: '#E6F4FF',
    },
    {
      label: '待跟进线索',
      value: dashboardStats.pendingLeads,
      icon: FileText,
      color: '#FF7D00',
      bgColor: '#FFF7E6',
    },
    {
      label: '7天营收',
      value: `¥${(dashboardStats.weeklyRevenue / 10000).toFixed(1)}万`,
      icon: DollarSign,
      color: '#00B42A',
      bgColor: '#E8FFEA',
    },
    {
      label: '即将到期客户',
      value: dashboardStats.expiringCustomers,
      icon: AlertTriangle,
      color: '#F53F3F',
      bgColor: '#FFECE8',
    },
  ];

  const todoItems = [
    {
      label: '待分配线索',
      count: dashboardStats.pendingLeadAssignment,
      icon: Users,
      color: '#1677FF',
      link: '/leads',
    },
    {
      label: '7天内到期客户',
      count: dashboardStats.expiringIn7Days,
      icon: Clock,
      color: '#F53F3F',
      link: '/customers',
    },
    {
      label: '未处理AI差评',
      count: dashboardStats.unresolvedBadReviews,
      icon: ThumbsDown,
      color: '#FF7D00',
      link: '/ai-service/feedback',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">工作台</h1>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm border border-gray-100"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: card.bgColor }}
            >
              <card.icon className="h-6 w-6" style={{ color: card.color }} />
            </div>
            <div>
              <div className="text-sm text-gray-500">{card.label}</div>
              <div className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Plugin Entry Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/geo"
          className="group flex items-center gap-5 rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:border-[#0F52BA]/30 hover:shadow-md transition-all"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0F52BA]/10">
            <Globe className="h-7 w-7 text-[#0F52BA]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900">域途GEO SaaS</h3>
            <p className="text-sm text-gray-500 mt-1">GEO智能诊断、文案生成、AI监测数据管理</p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-[#0F52BA] transition-colors" />
        </Link>

        <Link
          href="/ai-service"
          className="group flex items-center gap-5 rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:border-[#00B42A]/30 hover:shadow-md transition-all"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#00B42A]/10">
            <Bot className="h-7 w-7 text-[#00B42A]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900">智推AI客服Agent</h3>
            <p className="text-sm text-gray-500 mt-1">AI对话记录、意向关键词、企微会话管理</p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-[#00B42A] transition-colors" />
        </Link>
      </div>

      {/* Bottom Section: Todo + Trend */}
      <div className="grid grid-cols-3 gap-4">
        {/* Todo List */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#FF7D00]" />
            待办事项
          </h3>
          <div className="space-y-3">
            {todoItems.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" style={{ color: item.color }} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: item.color }}>
                    {item.count}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trend Chart */}
        <div className="col-span-2 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#1677FF]" />
            近7天趋势
          </h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8C97A9' }} />
                <YAxis tick={{ fontSize: 12, fill: '#8C97A9' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="newCustomers"
                  name="新增客户"
                  stroke="#1677FF"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="newLeads"
                  name="新增线索"
                  stroke="#00B42A"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
