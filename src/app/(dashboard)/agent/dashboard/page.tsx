'use client';

import { useState } from 'react';
import { MessageSquare, Zap, Users, TrendingUp } from 'lucide-react';
import { agents } from '@/lib/mock-data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const chatVolumeData = [
  { date: '07-04', 跨境电商顾问: 180, 工业设备专家: 95, 本地门店助手: 130 },
  { date: '07-05', 跨境电商顾问: 165, 工业设备专家: 88, 本地门店助手: 120 },
  { date: '07-06', 跨境电商顾问: 200, 工业设备专家: 102, 本地门店助手: 145 },
  { date: '07-07', 跨境电商顾问: 150, 工业设备专家: 78, 本地门店助手: 110 },
  { date: '07-08', 跨境电商顾问: 220, 工业设备专家: 115, 本地门店助手: 155 },
  { date: '07-09', 跨境电商顾问: 175, 工业设备专家: 92, 本地门店助手: 128 },
  { date: '07-10', 跨境电商顾问: 195, 工业设备专家: 108, 本地门店助手: 140 },
];

const tokenConsumption = [
  { name: '跨境电商顾问', value: 850000, color: '#FF7D00' },
  { name: '本地门店助手', value: 580000, color: '#FFB366' },
  { name: '工业设备专家', value: 420000, color: '#FFD699' },
  { name: '黄精外贸顾问', value: 310000, color: '#FFE5CC' },
  { name: '科创企业助手', value: 85000, color: '#FFF2E5' },
];

const leadProduction = [
  { agent: '跨境电商顾问', leads: 45, rate: 3.6 },
  { agent: '本地门店助手', leads: 38, rate: 4.1 },
  { agent: '工业设备专家', leads: 22, rate: 3.2 },
  { agent: '黄精外贸顾问', leads: 15, rate: 3.3 },
  { agent: '科创企业助手', leads: 5, rate: 4.2 },
];

const COLORS = ['#FF7D00', '#FFB366', '#FFD699', '#FFE5CC', '#FFF2E5'];

export default function AgentDashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const totalChats = agents.reduce((sum, a) => sum + a.totalChats, 0);
  const totalTokens = agents.reduce((sum, a) => sum + a.tokenUsed, 0);
  const totalLeads = agents.reduce((sum, a) => sum + a.leadCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent专项数据看板</h1>
          <p className="text-sm text-gray-500 mt-1">各智能体对话量、线索产出、Token消耗排行</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', 'custom'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                timeRange === range
                  ? 'bg-[#FF7D00] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {range === '7d' ? '近7天' : range === '30d' ? '近30天' : '自定义'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF7D00]/10">
              <MessageSquare className="h-5 w-5 text-[#FF7D00]" />
            </div>
            <div>
              <div className="text-sm text-gray-500">总对话量</div>
              <div className="text-xl font-bold text-gray-900">{totalChats.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Token总消耗</div>
              <div className="text-xl font-bold text-gray-900">{(totalTokens / 1000000).toFixed(2)}M</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">线索总产出</div>
              <div className="text-xl font-bold text-gray-900">{totalLeads}</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">平均留资率</div>
              <div className="text-xl font-bold text-gray-900">3.7%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Chat Volume Trend */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">各智能体对话量趋势</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chatVolumeData}>
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
                <Bar dataKey="跨境电商顾问" fill="#FF7D00" radius={[2, 2, 0, 0]} />
                <Bar dataKey="工业设备专家" fill="#FFB366" radius={[2, 2, 0, 0]} />
                <Bar dataKey="本地门店助手" fill="#FFD699" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token Consumption Pie */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Token消耗分布</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenConsumption}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {tokenConsumption.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${(value / 1000).toFixed(0)}K Token`, '']}
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

      {/* Lead Production Table */}
      <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">线索产出排行</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-left text-xs font-medium text-gray-500">排名</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500">智能体</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500">线索数</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500">留资率</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500">占比</th>
            </tr>
          </thead>
          <tbody>
            {leadProduction
              .sort((a, b) => b.leads - a.leads)
              .map((item, index) => (
                <tr key={item.agent} className="border-b border-gray-50">
                  <td className="py-3">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-[#FF7D00] text-white' :
                      index === 1 ? 'bg-[#FFB366] text-white' :
                      index === 2 ? 'bg-[#FFD699] text-gray-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 text-sm font-medium text-gray-900">{item.agent}</td>
                  <td className="py-3 text-sm text-gray-700">{item.leads}</td>
                  <td className="py-3 text-sm text-gray-700">{item.rate}%</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-gray-100 w-24">
                        <div
                          className="h-2 rounded-full bg-[#FF7D00]"
                          style={{ width: `${(item.leads / leadProduction[0].leads) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {((item.leads / totalLeads) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
