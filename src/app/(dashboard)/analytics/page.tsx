'use client';

import { useState } from 'react';
import { Download, Users, DollarSign, MessageSquare, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { monthlyRevenue, industryDistribution, planDistribution } from '@/lib/mock-data';

const COLORS = ['#1677FF', '#0F52BA', '#00B42A', '#FF7D00', '#F53F3F', '#8C97A9'];

const chatStats = [
  { month: '1月', total: 1200, autoResolved: 960, humanIntervention: 240 },
  { month: '2月', total: 1450, autoResolved: 1160, humanIntervention: 290 },
  { month: '3月', total: 1680, autoResolved: 1344, humanIntervention: 336 },
  { month: '4月', total: 1520, autoResolved: 1216, humanIntervention: 304 },
  { month: '5月', total: 1890, autoResolved: 1512, humanIntervention: 378 },
  { month: '6月', total: 2100, autoResolved: 1680, humanIntervention: 420 },
  { month: '7月', total: 2350, autoResolved: 1880, humanIntervention: 470 },
];

const leadStats = [
  { month: '1月', leads: 28, converted: 8 },
  { month: '2月', leads: 35, converted: 12 },
  { month: '3月', leads: 42, converted: 15 },
  { month: '4月', leads: 38, converted: 11 },
  { month: '5月', leads: 55, converted: 20 },
  { month: '6月', leads: 48, converted: 18 },
  { month: '7月', leads: 52, converted: 16 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const topCards = [
    { label: '总付费客户', value: '156', icon: Users, color: '#1677FF', bg: '#E6F4FF', change: '+12%' },
    { label: '当月新增客户', value: '23', icon: TrendingUp, color: '#00B42A', bg: '#E8FFEA', change: '+8%' },
    { label: '月度总营收', value: '¥128.6万', icon: DollarSign, color: '#FF7D00', bg: '#FFF7E6', change: '+15%' },
    { label: 'AI对话总量', value: '2,350', icon: MessageSquare, color: '#0F52BA', bg: '#E6F0FF', change: '+22%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">全域数据总看板</h1>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">今日</SelectItem>
              <SelectItem value="7d">近7天</SelectItem>
              <SelectItem value="30d">近30天</SelectItem>
              <SelectItem value="custom">自定义</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出全报表
          </Button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {topCards.map((card) => (
          <div key={card.label} className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: card.bg }}>
                <card.icon className="h-5 w-5" style={{ color: card.color }} />
              </div>
              <span className="text-xs font-medium text-[#00B42A] bg-[#E8FFEA] px-2 py-0.5 rounded-full">
                {card.change}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Monthly Revenue */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">月度营收趋势</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8C97A9' }} />
                <YAxis tick={{ fontSize: 12, fill: '#8C97A9' }} tickFormatter={(v: number) => `${v / 10000}万`} />
                <Tooltip formatter={(value: number) => [`¥${value.toLocaleString()}`, '营收']} />
                <Line type="monotone" dataKey="revenue" stroke="#1677FF" strokeWidth={2.5} dot={{ r: 4 }} fill="#1677FF" fillOpacity={0.1} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Chat Stats */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">AI对话统计</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chatStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8C97A9' }} />
                <YAxis tick={{ fontSize: 12, fill: '#8C97A9' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="autoResolved" name="AI自动解决" fill="#1677FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="humanIntervention" name="人工介入" fill="#FF7D00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-3 gap-4">
        {/* Industry Distribution */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">客户行业分布</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {industryDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">套餐成交占比</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {planDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Stats */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">有效线索数量</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8C97A9' }} />
                <YAxis tick={{ fontSize: 12, fill: '#8C97A9' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="leads" name="总线索" fill="#00B42A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="converted" name="已转化" fill="#1677FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
