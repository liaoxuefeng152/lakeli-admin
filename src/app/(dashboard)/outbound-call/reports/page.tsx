'use client';

import { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

const dailyData = [
  { date: '07-04', calls: 320, connected: 198, leads: 12 },
  { date: '07-05', calls: 450, connected: 287, leads: 18 },
  { date: '07-06', calls: 380, connected: 234, leads: 15 },
  { date: '07-07', calls: 510, connected: 312, leads: 22 },
  { date: '07-08', calls: 420, connected: 268, leads: 16 },
  { date: '07-09', calls: 390, connected: 245, leads: 14 },
  { date: '07-10', calls: 480, connected: 305, leads: 20 },
];

const scriptCompareData = [
  { name: '黄精保健品推销', total: 680, connected: 412, leads: 58, rate: 14.1 },
  { name: 'GEO服务推广', total: 320, connected: 198, leads: 35, rate: 17.7 },
  { name: '客户回访', total: 150, connected: 112, leads: 28, rate: 25.0 },
  { name: '本地商家推销', total: 280, connected: 168, leads: 31, rate: 18.5 },
];

const invalidData = [
  { name: '空号', value: 45, color: '#8C97A9' },
  { name: '停机', value: 23, color: '#BFBFBF' },
  { name: '拒接', value: 156, color: '#F53F3F' },
  { name: '无人接听', value: 89, color: '#FF7D00' },
];

const intentDistData = [
  { name: 'S-高意向', value: 45, color: '#1677FF' },
  { name: 'A-观望', value: 78, color: '#FF7D00' },
  { name: 'B-无意向', value: 156, color: '#8C97A9' },
  { name: 'C/D-无效', value: 89, color: '#F53F3F' },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('近7天');

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#333]">数据报表中心</h1>
          <p className="mt-1 text-sm text-[#999]">推销业务数据统计、效果复盘、数据导出</p>
        </div>
        <div className="flex items-center gap-2">
          {['今日', '近7天', '近30天', '自定义'].map((t) => (
            <button key={t} onClick={() => setTimeRange(t)} className={`rounded-md px-3 py-1.5 text-xs transition-colors ${timeRange === t ? 'bg-[#1677FF] text-white' : 'bg-white text-[#666] hover:bg-gray-50'}`}>
              {t}
            </button>
          ))}
          <button className="ml-2 flex items-center gap-1.5 rounded-md bg-[#1677FF] px-4 py-2 text-sm text-white hover:bg-[#4096FF]">
            <Download className="h-4 w-4" /> 导出报表
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs text-[#999]">外呼总量</p>
          <p className="mt-1 text-2xl font-semibold text-[#333]">2,550</p>
          <p className="mt-1 text-xs text-green-500">较上周 +12.3%</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs text-[#999]">接通率</p>
          <p className="mt-1 text-2xl font-semibold text-[#333]">63.2%</p>
          <p className="mt-1 text-xs text-green-500">较上周 +2.1%</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs text-[#999]">意向转化率</p>
          <p className="mt-1 text-2xl font-semibold text-[#333]">18.5%</p>
          <p className="mt-1 text-xs text-red-500">较上周 -1.2%</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs text-[#999]">有效线索数</p>
          <p className="mt-1 text-2xl font-semibold text-[#333]">157</p>
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
                {intentDistData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
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
                {invalidData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
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
            {scriptCompareData.map((item, i) => (
              <tr key={i} className="border-b border-gray-50 text-sm hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#333]">{item.name}</td>
                <td className="px-4 py-3 text-center text-[#666]">{item.total}</td>
                <td className="px-4 py-3 text-center text-[#666]">{item.connected}</td>
                <td className="px-4 py-3 text-center font-medium text-[#FF7D00]">{item.leads}</td>
                <td className="px-4 py-3 text-center text-[#1677FF]">{item.rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
