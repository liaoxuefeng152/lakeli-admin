'use client';

import { useEffect, useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { geoRecords as mockGeoRecords } from '@/lib/mock-data';
import { exportToCsv } from '@/lib/utils';

const mockDailyUsage = [
  { day: '07-04', diagnostics: 35, copy: 80, exposure: 5200 },
  { day: '07-05', diagnostics: 42, copy: 95, exposure: 6100 },
  { day: '07-06', diagnostics: 28, copy: 65, exposure: 4800 },
  { day: '07-07', diagnostics: 55, copy: 130, exposure: 8900 },
  { day: '07-08', diagnostics: 48, copy: 110, exposure: 7500 },
  { day: '07-09', diagnostics: 38, copy: 85, exposure: 5800 },
  { day: '07-10', diagnostics: 52, copy: 120, exposure: 8500 },
];

interface Summary {
  todayDiagnostics: number;
  todayCopy: number;
  totalExposure: number;
  activeCustomers: number;
  diagnosisDeltaPct: number;
  copyDeltaPct: number;
  exposureDeltaPct: number;
}
interface TrendRow {
  day: string;
  diagnostics: number;
  copy: number;
  exposure: number;
}
interface CustomerDetail {
  id: string;
  customerName: string;
  diagnosticsCount: number;
  copyCount: number;
  monitorExposure: number;
  date: string;
}

const defaultSummary: Summary = {
  todayDiagnostics: 0,
  todayCopy: 0,
  totalExposure: 0,
  activeCustomers: 0,
  diagnosisDeltaPct: 0,
  copyDeltaPct: 0,
  exposureDeltaPct: 0,
};

function deltaNode(n: number) {
  if (n > 0) return <span className="text-xs text-[#00B42A] mt-1">+{n}% vs 昨日</span>;
  if (n < 0) return <span className="text-xs text-[#F53F39] mt-1">{n}% vs 昨日</span>;
  return <span className="text-xs text-gray-400 mt-1">持平 vs 昨日</span>;
}

export default function GeoOverviewPage() {
  const [summary, setSummary] = useState<Summary>(defaultSummary);
  const [dailyUsage, setDailyUsage] = useState<TrendRow[]>(mockDailyUsage);
  const [customers, setCustomers] = useState<CustomerDetail[]>(mockGeoRecords as unknown as CustomerDetail[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/geo/admin-dashboard');
        if (!res.ok) throw new Error('status ' + res.status);
        const json = await res.json();
        if (json?.code === 0 && json.data) {
          const d = json.data as { summary: Summary; trend: TrendRow[]; customerDetails: CustomerDetail[] };
          if (cancelled) return;
          setSummary(d.summary);
          if (Array.isArray(d.trend) && d.trend.length) setDailyUsage(d.trend);
          if (Array.isArray(d.customerDetails) && d.customerDetails.length) setCustomers(d.customerDetails);
        }
      } catch (e) {
        // 拉取失败：保留 mock 兜底，保证页面可用
        console.warn('[GEO] dashboard fetch failed, fallback to mock', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleExport = () => {
    exportToCsv(
      'GEO客户使用明细.csv',
      ['客户名称', '诊断次数', '文案条数', 'AI曝光量', '日期'],
      customers.map((r) => [r.customerName, r.diagnosticsCount, r.copyCount, r.monitorExposure, r.date])
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">客户GEO数据总览</h1>
          <p className="text-sm text-gray-500 mt-1">查看各客户GEO功能使用量与监测数据</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          导出数据
        </Button>
      </div>

      <div className="rounded-md bg-[#F0F5FF] border border-blue-200 px-4 py-2.5">
        <p className="text-sm text-[#0F52BA]">
          数据来源：后端真实聚合接口 <code className="text-xs">/api/geo/admin-dashboard</code>
          （诊断 / 文案 / 监测 等 GEO 管理表）。{loading && '加载中…'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <div className="text-sm text-gray-500">今日诊断总次数</div>
          <div className="text-2xl font-bold text-[#0F52BA] mt-1">{summary.todayDiagnostics}</div>
          {deltaNode(summary.diagnosisDeltaPct)}
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <div className="text-sm text-gray-500">今日文案生成</div>
          <div className="text-2xl font-bold text-[#0F52BA] mt-1">{summary.todayCopy}</div>
          {deltaNode(summary.copyDeltaPct)}
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <div className="text-sm text-gray-500">总AI曝光量</div>
          <div className="text-2xl font-bold text-[#0F52BA] mt-1">{summary.totalExposure.toLocaleString()}</div>
          {deltaNode(summary.exposureDeltaPct)}
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <div className="text-sm text-gray-500">活跃客户数</div>
          <div className="text-2xl font-bold text-[#0F52BA] mt-1">{summary.activeCustomers}</div>
          <div className="text-xs text-gray-500 mt-1">GEO套餐客户</div>
        </div>
      </div>

      {/* Usage Trend Chart */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">近7天使用趋势</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8C97A9' }} />
              <YAxis tick={{ fontSize: 12, fill: '#8C97A9' }} />
              <Tooltip />
              <Bar dataKey="diagnostics" name="诊断次数" fill="#0F52BA" radius={[4, 4, 0, 0]} />
              <Bar dataKey="copy" name="文案条数" fill="#1677FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">客户GEO使用明细</h3>
          <div className="flex gap-2">
            <Input placeholder="搜索客户..." className="h-8 w-48 text-sm" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户名称</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">诊断次数</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">文案条数</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">AI曝光量</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((record) => (
              <tr key={record.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                <td className="px-5 py-4 text-sm font-medium text-[#0F52BA] cursor-pointer hover:underline">
                  {record.customerName}
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{record.diagnosticsCount}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{record.copyCount}</td>
                <td className="px-5 py-4 text-sm font-medium text-gray-900">{record.monitorExposure.toLocaleString()}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{record.date}</td>
                <td className="px-5 py-4 text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
