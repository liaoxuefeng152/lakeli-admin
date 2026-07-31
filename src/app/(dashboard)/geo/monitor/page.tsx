'use client';

import { useEffect, useState } from 'react';
import { Globe, TrendingUp, Loader2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { fetchGeoRecords } from '@/lib/services/admin-api';

const PLATFORM_COLORS: Record<string, string> = {
  'Google AI (SGE)': '#0F52BA',
  'Bing Copilot': '#1677FF',
  'Perplexity': '#00B42A',
  'ChatGPT Search': '#FF7D00',
};

interface MonitorData {
  platformStats: { name: string; exposures: string; change: string }[];
  trend: { date: string; google: number; bing: number; perplexity: number }[];
}

export default function GeoMonitorPage() {
  const [data, setData] = useState<MonitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [res] = await fetchGeoRecords('monitoring');
      setData(res as MonitorData);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI监测数据查看</h1>
          <p className="text-sm text-gray-500 mt-1">监测客户在各AI搜索引擎中的曝光数据</p>
        </div>
        <button
          className="text-sm text-[#0F52BA] hover:underline disabled:opacity-50"
          onClick={load}
          disabled={loading}
        >刷新</button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}<button className="ml-2 underline" onClick={load}>重试</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" /><span className="ml-2">加载监测数据...</span>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-4 gap-4">
            {data.platformStats.map((p) => (
              <div key={p.name} className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4" style={{ color: PLATFORM_COLORS[p.name] || '#0F52BA' }} />
                  <span className="text-sm text-gray-600">{p.name}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: PLATFORM_COLORS[p.name] || '#0F52BA' }}>{p.exposures}</div>
                <div className="text-xs text-[#00B42A] mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {p.change} vs 上周
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">各平台曝光趋势</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trend}>
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
        </>
      ) : null}
    </div>
  );
}
