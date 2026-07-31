'use client';

import { useState, useEffect } from 'react';
import { Download, Calendar, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { fetchOutboundReports, type OutboundReportData } from '@/lib/services/admin-api';
import { exportToCsv } from '@/lib/utils';

const invalidColorMap: Record<string, string> = {
  '空号': '#8C97A9', '停机': '#BFBFBF', '拒接': '#F53F3F', '无人接听': '#FF7D00',
};
const intentColorMap: Record<string, string> = {
  'S-高意向': '#1677FF', 'A-观望': '#FF7D00', 'B-无意向': '#8C97A9', 'C-无效号码': '#F53F3F', 'D-拒接': '#F53F3F',
};

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('近7天');
  const [data, setData] = useState<OutboundReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await fetchOutboundReports();
        setData(d);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const dailyData = data?.dailyData || [];
  const scriptCompareData = data?.scriptCompareData || [];
  const invalidData = (data?.invalidData || []).map((d) => ({ name: d.name, value: d.value, color: invalidColorMap[d.name] || '#8C97A9' }));
  const intentDistData = (data?.intentDistData || []).map((d) => ({ name: d.name, value: d.value, color: intentColorMap[d.name] || '#8C97A9' }));
  const summary = data?.summary;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#333]">数据报表中心</h1>
          <p className="mt-1 text-sm text-[#999]">推销业务数据统计、效果复盘、数据导出</p>
        </div>
        <div className="flex items-center gap-2">
          {['今日', '近7天', '近30天', '自定义'].map((t) => (
            <button key={t} onClick={() => setTimeRange(t)} className={`rounded-md px-3 py-1.5 text-xs transition-colors ${timeRange === t ? 'bg-primary text-white' : 'bg-white text-[#666] hover:bg-gray-50'}`}>
              {t}
            </button>
          ))}
          <button onClick={() => exportToCsv('外呼报表_话术场景对比.csv', ['话术场景', '外呼总量', '接通数', '线索数', '意向转化率'], scriptCompareData.map((d) => [d.name, d.total, d.connected, d.leads, `${d.rate}%`]))} className="ml-2 flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-[#4096FF]">
            <Download className="h-4 w-4" /> 导出报表
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs text-[#999]">外呼总量</p>
          <p className="mt-1 text-2xl font-semibold text-[#333]">{summary?.totalCalls?.toLocaleString()}</p>
          <p className="mt-1 text-xs text-green-500">较上周 +12.3%</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs text-[#999]">接通率</p>
          <p className="mt-1 text-2xl font-semibold text-[#333]">{summary?.connectRate}%</p>
          <p className="mt-1 text-xs text-green-500">较上周 +2.1%</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs text-[#999]">意向转化率</p>
          <p className="mt-1 text-2xl font-semibold text-[#333]">{summary?.leadRate}%</p>
          <p className="mt-1 text-xs text-red-500">较上周 -1.2%</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs text-[#999]">有效线索数</p>
          <p className="mt-1 text-2xl font-semibold text-[#333]">{summary?.leadCount?.toLocaleString()}</p>
          <p className="mt-1 text-xs text-green-500">较上周 +8.7%</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-lg bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-medium text-[#333]">外呼趋势</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="calls" name="拨打量" stroke="#1677FF" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="connected" name="接通量" stroke="#00B42A" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="leads" name="线索数" stroke="#FF7D00" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-medium text-[#333]">意向分布</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={intentDistData} cx="50%" cy="45%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {intentDistData.map((entry, index: number) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-medium text-[#333]">各话术场景转化效果</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scriptCompareData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="leads" name="线索数" fill="#1677FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rate" name="转化率%" fill="#FF7D00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-medium text-[#333]">无效呼叫类型统计</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={invalidData} cx="50%" cy="45%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                {invalidData.map((entry, index: number) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Script Compare Table */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-medium text-[#333]">话术场景效果对比</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-[#999]">
              <th className="px-4 py-3 text-left font-medium">话术场景</th>
              <th className="px-4 py-3 text-center font-medium">外呼总量</th>
              <th className="px-4 py-3 text-center font-medium">接通数</th>
              <th className="px-4 py-3 text-center font-medium">线索数</th>
              <th className="px-4 py-3 text-center font-medium">意向转化率</th>
            </tr>
          </thead>
          <tbody>
            {scriptCompareData.map((item, i: number) => (
              <tr key={i} className="border-b border-gray-50 text-sm hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#333]">{item.name}</td>
                <td className="px-4 py-3 text-center text-[#666]">{item.total}</td>
                <td className="px-4 py-3 text-center text-[#666]">{item.connected}</td>
                <td className="px-4 py-3 text-center font-medium text-[#FF7D00]">{item.leads}</td>
                <td className="px-4 py-3 text-center text-primary">{item.rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
