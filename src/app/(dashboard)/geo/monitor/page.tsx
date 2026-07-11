'use client';

import { Globe, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const monitorData = [
  { date: '07-04', google: 3200, bing: 1800, perplexity: 1200 },
  { date: '07-05', google: 3800, bing: 2100, perplexity: 1500 },
  { date: '07-06', google: 2900, bing: 1600, perplexity: 1100 },
  { date: '07-07', google: 4500, bing: 2800, perplexity: 2000 },
  { date: '07-08', google: 4100, bing: 2500, perplexity: 1800 },
  { date: '07-09', google: 3600, bing: 2200, perplexity: 1400 },
  { date: '07-10', google: 4800, bing: 3000, perplexity: 2200 },
];

const platformStats = [
  { name: 'Google AI (SGE)', exposures: '18,200', change: '+22%', color: '#0F52BA' },
  { name: 'Bing Copilot', exposures: '11,500', change: '+18%', color: '#1677FF' },
  { name: 'Perplexity', exposures: '8,400', change: '+35%', color: '#00B42A' },
  { name: 'ChatGPT Search', exposures: '5,200', change: '+15%', color: '#FF7D00' },
];

export default function GeoMonitorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">AI监测数据查看</h1>
        <p className="text-sm text-gray-500 mt-1">监测客户在各AI搜索引擎中的曝光数据</p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-4 gap-4">
        {platformStats.map((p) => (
          <div key={p.name} className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4" style={{ color: p.color }} />
              <span className="text-sm text-gray-600">{p.name}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: p.color }}>{p.exposures}</div>
            <div className="text-xs text-[#00B42A] mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {p.change} vs 上周
            </div>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">各平台曝光趋势</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8C97A9' }} />
              <YAxis tick={{ fontSize: 12, fill: '#8C97A9' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="google" name="Google AI" stroke="#0F52BA" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="bing" name="Bing Copilot" stroke="#1677FF" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="perplexity" name="Perplexity" stroke="#00B42A" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
