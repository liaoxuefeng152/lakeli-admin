'use client';

import { useState } from 'react';
import { MessageSquare, Zap, Users, Bot, Download } from 'lucide-react';
import { agents } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

// Line chart data - 30 day conversation & lead trend
const trendData = [
  { date: '06-11', 对话量: 320, 线索: 12 },
  { date: '06-14', 对话量: 380, 线索: 15 },
  { date: '06-17', 对话量: 350, 线索: 11 },
  { date: '06-20', 对话量: 420, 线索: 18 },
  { date: '06-23', 对话量: 390, 线索: 14 },
  { date: '06-26', 对话量: 450, 线索: 20 },
  { date: '06-29', 对话量: 410, 线索: 16 },
  { date: '07-02', 对话量: 480, 线索: 22 },
  { date: '07-05', 对话量: 520, 线索: 25 },
  { date: '07-08', 对话量: 490, 线索: 21 },
  { date: '07-10', 对话量: 550, 线索: 28 },
];

// Pie chart data - industry conversation share
const industryShare = [
  { name: '通用GEO', value: 1370, color: '#FF7D00' },
  { name: '本地商家', value: 920, color: '#FFB366' },
  { name: '工业机械', value: 680, color: '#FFD699' },
  { name: '黄精跨境', value: 450, color: '#FFE5CC' },
];

// Bar chart data - token consumption ranking
const tokenRanking = [
  { name: '跨境电商顾问', token: 850, full: 850000 },
  { name: '本地门店助手', token: 580, full: 580000 },
  { name: '工业设备专家', token: 420, full: 420000 },
  { name: '黄精外贸顾问', token: 310, full: 310000 },
  { name: '科创企业助手', token: 85, full: 85000 },
];

const COLORS = ['#FF7D00', '#FFB366', '#FFD699', '#FFE5CC'];

export default function AgentDashboardPage() {
  const [timeRange, setTimeRange] = useState('today');

  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const todayChats = 550;
  const todayLeads = 28;
  const todayTokens = 2240000;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent专项数据看板</h1>
          <p className="text-sm text-gray-500 mt-1">各智能体对话量、线索产出、Token消耗排行</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">今日</SelectItem>
              <SelectItem value="7d">近7天</SelectItem>
              <SelectItem value="30d">近30天</SelectItem>
              <SelectItem value="custom">自定义区间</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出全量数据报表
          </Button>
        </div>
      </div>

      {/* 4 Orange Indicator Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF7D00]/10">
              <Bot className="h-5 w-5 text-[#FF7D00]" />
            </div>
            <div>
              <div className="text-sm text-gray-500">总上架Agent数量</div>
              <div className="text-xl font-bold text-gray-900">{activeAgents}</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF7D00]/10">
              <MessageSquare className="h-5 w-5 text-[#FF7D00]" />
            </div>
            <div>
              <div className="text-sm text-gray-500">今日总对话量</div>
              <div className="text-xl font-bold text-gray-900">{todayChats.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF7D00]/10">
              <Users className="h-5 w-5 text-[#FF7D00]" />
            </div>
            <div>
              <div className="text-sm text-gray-500">今日新增有效线索</div>
              <div className="text-xl font-bold text-gray-900">{todayLeads}</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF7D00]/10">
              <Zap className="h-5 w-5 text-[#FF7D00]" />
            </div>
            <div>
              <div className="text-sm text-gray-500">当日总Token消耗</div>
              <div className="text-xl font-bold text-gray-900">{(todayTokens / 1000000).toFixed(2)}M</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Line Chart + Pie Chart */}
      <div className="grid grid-cols-2 gap-4">
        {/* Line Chart: 30-day trend */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">近30日对话&线索增长趋势</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8C97A9' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#8C97A9' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#8C97A9' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="对话量" stroke="#FF7D00" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line yAxisId="right" type="monotone" dataKey="线索" stroke="#00B42A" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Industry share */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">各行业Agent对话占比</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {industryShare.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString()} 次对话`, '']}
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart: Token consumption ranking */}
      <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">各Agent Token消耗排行</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tokenRanking} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#8C97A9' }} tickFormatter={(v) => `${v}K`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#333' }} width={120} />
              <Tooltip
                formatter={(value: number) => [`${value}K Token`, '']}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="token" radius={[0, 4, 4, 0]}>
                {tokenRanking.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#FF7D00' : index === 1 ? '#FFB366' : '#FFD699'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
