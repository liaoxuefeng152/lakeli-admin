'use client';

import { useState, useEffect } from 'react';
import {
  Phone, PhoneCall, PhoneIncoming, TrendingUp, Users, Play,
  Calendar, Loader2,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { fetchOutboundDashboard, type OutboundTask, type OutboundDashboardData } from '@/lib/services/admin-api';
import { BviVisibilityCard } from '@/components/bvi-visibility-card';

const statusColors: Record<string, string> = {
  '待执行': 'bg-gray-100 text-gray-600',
  '执行中': 'bg-blue-50 text-blue-600',
  '已暂停': 'bg-yellow-50 text-yellow-600',
  '已完成': 'bg-gray-800 text-white',
  '已终止': 'bg-gray-300 text-gray-600',
  '异常失败': 'bg-red-50 text-red-600',
};

const intentColorMap: Record<string, string> = {
  'S-高意向': '#1677FF', 'A-观望': '#FF7D00', 'B-无意向': '#8C97A9', 'C-无效号码': '#F53F3F', 'D-拒接': '#F53F3F',
};

export default function OutboundCallDashboard() {
  const [timeRange, setTimeRange] = useState('今日');
  const [data, setData] = useState<OutboundDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await fetchOutboundDashboard();
        setData(d);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = data?.stats;
  const trendData = data?.trend || [];
  const intentData = (data?.intentData || []).map((d) => ({ name: d.name, value: d.value, color: intentColorMap[d.name] || '#8C97A9' }));
  const recentTasks: OutboundTask[] = data?.recentTasks || [];

  const totalCalls = stats?.totalCalls ?? 0;
  const connectedCalls = stats?.connectedCalls ?? 0;
  const connectRate = stats?.connectRate ?? 0;
  const leadCount = stats?.leadCount ?? 0;
  const leadRate = stats?.leadRate ?? 0;
  const activeTasks = stats?.activeTasks ?? 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#333]">外呼工作台</h1>
          <p className="mt-1 text-sm text-[#999]">智能推销外呼业务数据总览</p>
        </div>
        <div className="flex items-center gap-2">
          {['今日', '昨日', '近7天', '近30天'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                timeRange === t ? 'bg-primary text-white' : 'bg-white text-[#666] hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="mb-4 text-sm text-gray-400 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />加载中...</div>}
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-[#999]">累计外呼总量</p>
              <p className="text-2xl font-semibold text-[#333]">{totalCalls.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <PhoneCall className="h-5 w-5 text-[#00B42A]" />
            </div>
            <div>
              <p className="text-xs text-[#999]">接通量 & 接通率</p>
              <p className="text-2xl font-semibold text-[#333]">{connectedCalls} <span className="text-sm font-normal text-[#00B42A]">{connectRate}%</span></p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <Users className="h-5 w-5 text-[#FF7D00]" />
            </div>
            <div>
              <p className="text-xs text-[#999]">有效意向客户 & 意向率</p>
              <p className="text-2xl font-semibold text-[#333]">{leadCount} <span className="text-sm font-normal text-[#FF7D00]">{leadRate}%</span></p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <PhoneIncoming className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-[#999]">进行中任务数</p>
              <p className="text-2xl font-semibold text-[#333]">{activeTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* F5.8 外呼工作台嵌入客户品牌 AI 可见度（BVI） */}
      <BviVisibilityCard title="客户 AI 可见度 (BVI)" defaultBrand="拉克力智能外呼" />

      {/* Charts */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-lg bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#333]">外呼趋势</h3>
            <TrendingUp className="h-4 w-4 text-[#999]" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="calls" name="拨打量" stroke="#1677FF" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="connected" name="接通量" stroke="#00B42A" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-medium text-[#333]">客户意向分布</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={intentData} cx="50%" cy="45%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {intentData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#333]">最近外呼任务</h3>
          <a href="/outbound-call/tasks" className="text-xs text-primary hover:underline">查看全部</a>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-[#999]">
              <th className="pb-3 text-left font-medium">任务名称</th>
              <th className="pb-3 text-left font-medium">话术场景</th>
              <th className="pb-3 text-center font-medium">总号码</th>
              <th className="pb-3 text-center font-medium">已拨打</th>
              <th className="pb-3 text-center font-medium">接通</th>
              <th className="pb-3 text-center font-medium">意向</th>
              <th className="pb-3 text-center font-medium">状态</th>
              <th className="pb-3 text-left font-medium">创建时间</th>
            </tr>
          </thead>
          <tbody>
            {recentTasks.map((task) => (
              <tr key={task.id} className="border-b border-gray-50 text-sm hover:bg-gray-50">
                <td className="py-3 font-medium text-[#333]">{task.name}</td>
                <td className="py-3 text-[#666]">{task.scriptSceneName}</td>
                <td className="py-3 text-center text-[#666]">{task.totalNumbers}</td>
                <td className="py-3 text-center text-[#666]">{task.calledCount}</td>
                <td className="py-3 text-center text-[#666]">{task.connectedCount}</td>
                <td className="py-3 text-center text-[#666]">{task.leadCount}</td>
                <td className="py-3 text-center">
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs ${statusColors[task.status] || 'bg-gray-100 text-gray-600'}`}>
                    {task.status === '执行中' && <Play className="h-3 w-3" />}
                    {task.status}
                  </span>
                </td>
                <td className="py-3 text-[#999]">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {task.createdAt.split(' ')[0]}
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
